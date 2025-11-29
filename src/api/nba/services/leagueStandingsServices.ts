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
    updateDocument
} from "../repositories/firestoreRepositories";

import { LeagueStandings } from "../models/standingsSim/leagueStandingsModel";
import * as conferenceService from "./conferenceService";


const COLLECTION: string = "conferences";
const dateNow = new Date();

export const createNewStandings = async (): Promise<LeagueStandings> => {
    try {
        const season: string = `${dateNow.getFullYear}-${(Number(dateNow.getFullYear) + 1)}`;
        const newStandings: Partial<LeagueStandings> = {
            season: season,
            createdAt: dateNow,
            updatedAt: dateNow
        };

        const updatedConferences = await conferenceService.updateConferences();

        newStandings.easternConference = updatedConferences.easternConference;
        newStandings.westernConference = updatedConferences.westernConference;
        newStandings.topSeed = updatedConferences.topSeed;

        await createDocument<Team>(COLLECTION, newStandings);

        return structuredClone({ ...newStandings } as LeagueStandings);

    } catch (error: unknown) {
        throw error;
    }


};



export const updateStandings = async (
    season: string
): Promise<LeagueStandings> => {
    try {

        const standings = await getStandingsById(season);
        const updatedConferences = await conferenceService.updateConferences();

        const updatedStandings: LeagueStandings = {
            ...standings,
            westernConference: updatedConferences.westernConference,
            easternConference: updatedConferences.easternConference,
            topSeed: updatedConferences.topSeed,
            updatedAt: new Date()
        };

        await updateDocument<LeagueStandings>(COLLECTION, season, updatedStandings);
        return structuredClone(updatedStandings);

    } catch (error: unknown) {
        throw error;
    }
};



export const getStandingsById = async (season: string): Promise<LeagueStandings> => {

    try {
        const doc: DocumentSnapshot | null = await getDocumentById(
            COLLECTION,
            season
        );

        if (!doc) {
            throw new Error(`No season with id ${season} found.`);
        }

        const data: DocumentData | undefined = doc.data();
        const standings: LeagueStandings = {
            season: doc.id,
            ...data
        } as LeagueStandings;

        return structuredClone(standings);

    }
    catch (error: unknown) {
        throw error;
    }

};

export const getStandings = async (): Promise<LeagueStandings[]> => {

    try {
        const snapshot: QuerySnapshot = await getDocuments(COLLECTION);
        const standings: LeagueStandings[] = snapshot.docs.map(doc => {
            const data: DocumentData = doc.data();
            return {
                season: doc.id,
                ...data,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
            } as LeagueStandings;
        });

        if (standings.length == 0) {
            throw new Error("No standings found");
        }

        return standings;
    } catch (error: unknown) {
        throw error;
    }
};
