import { Match, archivedMatch } from "../models/matchSim/matchModel";
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
    getDocumentsByFieldValues
} from "../repositories/firestoreRepositories";
import * as teamService from "../services/teamService"


const COLLECTION: string = "matches";

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

        const matchId: string = await createDocument<Match>(COLLECTION, newMatch);

        return structuredClone({ id: matchId, ...newMatch } as Match);

    } catch (error: unknown) {
        throw error;
    }

}