import { Match, archivedMatch } from "../models/matchSim/matchModel";
import { Possession } from "../models/matchSim/possessionModel";
import { Team } from "../models/teamModel";
import {
    QuerySnapshot,
    DocumentData,
    DocumentSnapshot
} from "firebase-admin/firestore";
import {
    createDocument,
    getDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument
} from "../repositories/firestoreRepositories";
import * as teamService from "../services/teamService"
import { Player } from "../models/people/playerModel";
import { Shot } from "../models/matchSim/shotModel";


const MATCHES_COLLECTION: string = "matches";
const ARCHIVED_MATCHES_COLLECTION: string = "archived";

const dateNow = new Date();

export const setupMatch = async (matchData: {
    awayTeam: string,
    homeTeam: string
}): Promise<Match> => {
    try {

        const returnedAwayTeam = await teamService.getTeamById(matchData.awayTeam);
        const returnedHomeTeam = await teamService.getTeamById(matchData.homeTeam);

        const newMatch: Partial<Match> = {
            awayTeam: returnedAwayTeam,
            homeTeam: returnedHomeTeam,
            played: false,
            createdAt: dateNow
        };

        const matchId: string = await createDocument<Match>(MATCHES_COLLECTION, newMatch);

        return structuredClone({ id: matchId, ...newMatch } as Match);

    } catch (error: unknown) {
        throw error;
    }

};

export const getMatches = async (): Promise<Match[]> => {
    try {
        const snapshot: QuerySnapshot = await getDocuments(MATCHES_COLLECTION);
        const matches: Match[] = snapshot.docs.map(doc => {
            const data: DocumentData = doc.data();
            return {
                matchId: doc.id,
                ...data,
                createdAt: data.createdAt
            } as Match;
        });

        if (matches.length == 0) {
            throw new Error("No matches found");
        }

        return matches;
    } catch (error: unknown) {
        throw error;
    }

};

export const getGames = async (): Promise<archivedMatch[]> => {
    try {
        const snapshot: QuerySnapshot = await getDocuments(ARCHIVED_MATCHES_COLLECTION);
        const games: archivedMatch[] = snapshot.docs.map(doc => {
            const data: DocumentData = doc.data();
            return {
                matchId: doc.id,
                ...data,
                createdAt: data.createdAt,
                finishedAt: data.finishedAt
            } as archivedMatch;
        });

        if (games.length == 0) {
            throw new Error("No games found");
        }

        return games;
    } catch (error: unknown) {
        throw error;
    }

};

export const getMatch = async (matchId: string): Promise<Match> => {

    try {
        const doc: DocumentSnapshot | null = await getDocumentById(
            MATCHES_COLLECTION,
            matchId
        );

        if (!doc) {
            throw new Error(`No match with id ${matchId} found.`);
        }

        const data: DocumentData | undefined = doc.data();
        const match: Match = {
            matchId: doc.id,
            ...data
        } as Match;

        return structuredClone(match);

    }
    catch (error: unknown) {
        throw error;
    }

};

export const playMatch = async (matchId: string): Promise<Match> => {
    try {
        const playedMatch: Match = await getMatch(matchId);

        playedMatch.possessions = generatePossessions(playedMatch);

        playedMatch.approved = false;
        playedMatch.played = true;

        await updateDocument<Match>(MATCHES_COLLECTION, matchId, playedMatch);

        return structuredClone(playedMatch);

    }
    catch (error: unknown) {
        throw error
    }

};

const generatePossessions = (match: Match): Possession[] => {
    // Will be returned at the end
    const gameEvents: Possession[] = [];

    // Jumpball, random number I think.
    let currentTeam: Team = Math.random() < 0.5 ? match.homeTeam : match.awayTeam;;

    for (let i = 0; i <= 110; i++) {

        let secondTeam = (currentTeam.id === match.homeTeam.id) ? match.awayTeam : match.homeTeam;

        gameEvents.push(generatePossession(currentTeam, secondTeam));

        currentTeam = (currentTeam.id === match.homeTeam.id) ? match.awayTeam : match.homeTeam;
    }

    return gameEvents;

};

const generatePossession = (offense: Team, defense: Team): Possession => {

    let shooter;
    let defender;
    let rebounder;
    let shot: Shot = Shot.MISS;
    let shotProbability: number;

    // Who shoots 

    const offensePlayers: Player[] = [
        offense.pointGuard!,
        offense.shootingGuard!,
        offense.smallForward!,
        offense.powerForward!,
        offense.centre!];
    const defensePlayers: Player[] = [
        defense.pointGuard!,
        defense.shootingGuard!,
        defense.smallForward!,
        defense.powerForward!,
        defense.centre!];
    const possessionProbability: number[] = [
        offense.pointGuard!.possession,
        offense.shootingGuard!.possession,
        offense.smallForward!.possession,
        offense.powerForward!.possession,
        offense.centre!.possession];

    const totalSum: number = possessionProbability.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    let randomNum = Math.random() * totalSum;

    for (const player of offensePlayers) {
        randomNum -= player.possession;
        if (randomNum <= 0) {
            shooter = player;
            defender = defensePlayers[offensePlayers.indexOf(shooter)];
            break;
        }
    }

    // Generate which shot it will be.

    let oneToThree = Math.floor(Math.random() * 3) + 1;

    switch (oneToThree) {
        case 1:
            shot = Shot.MISS
            break;
        case 2:
            shot = Shot.LAYUP
            shotProbability = (shooter!.layup - (defender!.defense * 0.15));
            break;
        case 3:
            shot = Shot.THREE
            shotProbability = (shooter!.three - (defender!.defense * 0.25));
            break;
    };

    // Did the shooter make the shot?

    if (shot !== Shot.MISS) {
        const roll = Math.floor(Math.random() * 100);
        const madeBasket = (shotProbability! > roll) ? true : false;
        if (!madeBasket) {
            shot = Shot.MISS;
            rebounder = defensePlayers[Math.floor(Math.random() * defensePlayers.length)];
        }
        else {
            rebounder = offensePlayers[Math.floor(Math.random() * offensePlayers.length)];
        }

    }

    let newPossession: Possession = {
        currentTeam: offense,
        shooter: shooter!,
        defender: defender!,
        shot: shot,
        rebound: rebounder!
    };

    return newPossession;

}

export const reviewMatch = async (matchId: string, approved: boolean): Promise<Match | archivedMatch> => {

    try {
        const pendingMatch: Match = await getMatch(matchId);

        if (!pendingMatch) {
            throw new Error(`No match with id ${matchId} found.`);
        };

        if (approved) {

            const calculatedMatch = calculateScore(pendingMatch);

            const approvedMatch: archivedMatch = {
                ...calculatedMatch,
                approved: approved

            }

            pendingMatch.approved = approved;

            await createDocument<archivedMatch>(ARCHIVED_MATCHES_COLLECTION, approvedMatch);

            await deleteDocument(MATCHES_COLLECTION, matchId);

            return structuredClone(approvedMatch);
        }
        else {
            const disapprovedMatch: Match = await getMatch(matchId);

            disapprovedMatch.approved = approved;

            await updateDocument<Match>(MATCHES_COLLECTION, matchId, disapprovedMatch);

            return structuredClone(disapprovedMatch);

        };



    } catch (error: unknown) {
        throw error;
    }
};

const calculateScore = (match: Match): archivedMatch => {
    let awayScore = 0;
    let homeScore = 0;

    const gameEvents: Possession[] = match.possessions ?? [];
    for (const gameEvent of gameEvents) {
        if (gameEvent.currentTeam.id == match.awayTeam.id) {
            awayScore += gameEvent.shot;
        }
        else {
            homeScore += gameEvent.shot;
        }
    }

    const winningTeam: Team = homeScore > awayScore ? match.homeTeam : match.awayTeam;
    const newArchivedMatch: archivedMatch = {
        ...match,
        outcome: {
            winner: winningTeam,
            home: {
                score: homeScore
            },
            away: {
                score: awayScore
            }
        },
        finishedAt: dateNow

    }

    return newArchivedMatch;

};