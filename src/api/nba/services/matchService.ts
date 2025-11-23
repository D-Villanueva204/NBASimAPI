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
            status: false,
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
                status: approved

            }

            pendingMatch.status = approved;

            await updateDocument<archivedMatch>(ARCHIVED_MATCHES_COLLECTION, matchId, approvedMatch);

            await deleteDocument(MATCHES_COLLECTION, matchId);

            return structuredClone(approvedMatch);
        }
        else {
            const disapprovedMatch: Match = await getMatch(matchId);

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
        if (gameEvent.currentTeam == match.awayTeam) {
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
                team: match.homeTeam,
                score: homeScore
            },
            away: {
                team: match.awayTeam,
                score: awayScore
            }
        },
        finishedAt: dateNow

    }

    return newArchivedMatch;

};