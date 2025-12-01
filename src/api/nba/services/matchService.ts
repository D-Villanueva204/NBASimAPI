import { Match, archivedMatch } from "../models/matchSim/matchModel";
import { Possession, Possessions } from "../models/matchSim/possessionModel";
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
import * as possessionsService from "../services/possessionsService"
import * as leagueStandingsService from "../services/leagueStandingsService";
import { Player } from "../models/people/playerModel";
import { Shot } from "../models/matchSim/shotModel";
import { BoxScore, Row } from "../models/matchSim/boxScoreModel";


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
            awayTeam: returnedAwayTeam.id,
            homeTeam: returnedHomeTeam.id,
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

        playedMatch.possessions = (await generatePossessions(playedMatch)).id;

        playedMatch.approved = false;
        playedMatch.played = true;

        await updateDocument<Match>(MATCHES_COLLECTION, matchId, playedMatch);

        return structuredClone(playedMatch);

    }
    catch (error: unknown) {
        throw error
    }

};

const generatePossessions = async (match: Match): Promise<Possessions> => {
    // Will be returned at the end
    const gameEvents: Possession[] = [];

    // Jumpball, random number I think.
    let homeTeam: Team = await teamService.getTeamById(match.homeTeam);
    let awayTeam: Team = await teamService.getTeamById(match.awayTeam);
    let teamOrder: Team[] = Math.random() < 0.5 ? [homeTeam, awayTeam] : [awayTeam, homeTeam];

    let currentTeam = teamOrder[0];

    for (let i = 0; i <= 110; i++) {

        let secondTeam: Team = (teamOrder.indexOf(currentTeam) === 0)
            ? teamOrder[1] : teamOrder[0];

        gameEvents.push(generatePossession(currentTeam, secondTeam));

        currentTeam = (teamOrder.indexOf(currentTeam) === 1)
            ? teamOrder[0] : teamOrder[1];
    }

    const newPossessions = await possessionsService.createPossessions(gameEvents);

    return newPossessions;

};

const generatePossession = (offense: Team, defense: Team): Possession => {

    let shooter;
    let defender;
    let rebounder;
    let assist;
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
            rebounder = defensePlayers[Math.floor(Math.random() * defensePlayers.length)];
            assist = null;
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
            assist = null;
        } else {
            assist = offensePlayers[Math.floor(Math.random() * offensePlayers.length)];
            rebounder = null;
        }
    }

    let newPossession: Possession;

    if (assist) {
        newPossession = {
            currentTeam: offense.id,
            shooter: {
                playerId: shooter!.id,
                name: shooter!.name

            },
            defender: {
                playerId: defender!.id,
                name: defender!.name
            },
            shot: shot,
            rebound: null,
            assist: {
                playerId: assist.id,
                name: assist!.name
            }
        };
        return newPossession;

    }
    else {
        newPossession = {
            currentTeam: offense.id,
            shooter: {
                playerId: shooter!.id,
                name: shooter!.name

            },
            defender: {
                playerId: defender!.id,
                name: defender!.name
            },
            shot: shot,
            rebound: {
                playerId: rebounder!.id,
                name: rebounder!.name
            },
            assist: null
        };

        return newPossession;
    }


}

export const reviewMatch = async (matchId: string, approved: boolean): Promise<Match | archivedMatch> => {

    try {
        const pendingMatch: Match = await getMatch(matchId);

        if (!pendingMatch) {
            throw new Error(`No match with id ${matchId} found.`);
        };

        if (approved) {

            const calculatedMatch = await calculateScore(pendingMatch);

            const approvedMatch: archivedMatch = {
                ...calculatedMatch,
                approved: approved

            }

            await teamService.updateRecord(approvedMatch.outcome.winner, true);

            if (approvedMatch.outcome.winner === approvedMatch.homeTeam) {
                await teamService.updateRecord(approvedMatch.awayTeam, false);
            }
            else {
                await teamService.updateRecord(approvedMatch.homeTeam, false);
            }

            await createDocument<archivedMatch>(ARCHIVED_MATCHES_COLLECTION, approvedMatch);

            await deleteDocument(MATCHES_COLLECTION, matchId);

            const season = (`${dateNow.getFullYear()}-${Number(dateNow.getFullYear()) + 1}`);
            await leagueStandingsService.updateStandings(season);

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

const calculateScore = async (match: Match): Promise<archivedMatch> => {
    let awayScore = 0;
    let homeScore = 0;
    let homeTeamRows = structuredClone(calculateRows(await teamService.getTeamById(match.homeTeam)));
    let awayTeamRows = structuredClone(calculateRows(await teamService.getTeamById(match.awayTeam)));
    let boxScore: BoxScore = { awayTeam: awayTeamRows, homeTeam: homeTeamRows };

    const gameEvents: Possession[] = (await possessionsService.getPossessions(match.possessions)).events;

    for (const gameEvent of gameEvents) {

        const offenseTeamRows: Row[] =
            (gameEvent.currentTeam == match.homeTeam) ? homeTeamRows : awayTeamRows;
        const defenseTeamRows: Row[] =
            (gameEvent.currentTeam == match.homeTeam) ? awayTeamRows : homeTeamRows;

        offenseTeamRows[findRowIndexForPlayer(offenseTeamRows, gameEvent.shooter.playerId)].points += gameEvent.shot;

        if (gameEvent.currentTeam == match.homeTeam) {
            homeScore += gameEvent.shot;
        }
        else {
            awayScore += gameEvent.shot;
        }

        if (gameEvent.shot === Shot.MISS) {
            defenseTeamRows[findRowIndexForPlayer(defenseTeamRows, gameEvent.rebound!.playerId)].rebounds += 1;
        }
        else {
            offenseTeamRows[findRowIndexForPlayer(offenseTeamRows, gameEvent.assist!.playerId)].assists += 1;
        }
    }

    const winningTeam: string = homeScore > awayScore
        ? match.homeTeam :
        match.awayTeam;
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
        boxScore: boxScore,
        finishedAt: dateNow
    }

    return newArchivedMatch;

};

const calculateRows = (team: Team): Row[] => {
    let players: Player[] = [team.pointGuard!, team.shootingGuard!, team.smallForward!, team.powerForward!, team.centre!];
    let rowArray: Row[] = [];

    for (let i = 0; i <= 4; i++) {
        let player = players[i];
        rowArray[i] = {
            playerId: player.id,
            playerName: player.name,
            points: 0,
            assists: 0,
            rebounds: 0
        }
    }

    return rowArray;
}

const findRowIndexForPlayer = (rows: Row[], playerId: string): number => {
    let index: number = -1;
    for (let row of rows) {
        if (row.playerId == playerId) {
            index = rows.indexOf(row);
            break;
        }
    }



    return index;

}