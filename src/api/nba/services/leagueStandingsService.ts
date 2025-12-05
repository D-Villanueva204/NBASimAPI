// Imports
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

const COLLECTION: string = "standings";
const dateNow = new Date();

/**
 * Service for createNewStandings.
 * Admin use only.
 * Creates a new set of standings.
 * If existing, return existing standings.
 * @returns new standings.
 */
export const createNewStandings = async (): Promise<LeagueStandings> => {
    try {
        const season: string = `${dateNow.getFullYear()}-${(Number(dateNow.getFullYear()) + 1)}`;
        // Checks if standings exist...
        let existing: LeagueStandings = await getStandingsBySeason(season);
        if (!existing) {
            // Creates new standings and returns.
            const newStandings: Partial<LeagueStandings> = {
                season: season,
                createdAt: dateNow,
                updatedAt: dateNow
            };

            const updatedConferences = await conferenceService.updateConferences();

            newStandings.easternConference = updatedConferences.easternConference;
            newStandings.westernConference = updatedConferences.westernConference;
            newStandings.topSeed = updatedConferences.topSeed;

            await createDocument<Team>(COLLECTION, newStandings, season);

            return structuredClone({ ...newStandings } as LeagueStandings);
        }
        else {
            // Returns existing standings if exist.
            return existing;
        }

    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Service for getStandingsBySeason.
 * Returns Standings based off of season.
 * General use.
 * 
 * @param season to retrieve standings
 * @returns retrieved Standings
 */
export const getStandingsBySeason = async (season: string): Promise<LeagueStandings> => {
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

/**
 * Service for getStandings.
 * General use. Returns all standings.
 * 
 * @returns all standings
 */
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

/**
 * Service for updateStandings
 * 
 * @param season season to retrieve Standings for
 * @returns retrieved standings
 */
export const updateStandings = async (
    season: string
): Promise<LeagueStandings> => {
    try {

        const standings = await getStandingsBySeason(season);
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