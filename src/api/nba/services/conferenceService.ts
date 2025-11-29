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
import * as teamService from "../services/teamService";
import { LeagueStandings } from "../models/standingsSim/leagueStandingsModel";
import { Conference, ConferenceType, TeamRecord } from "../models/standingsSim/conferenceModel";

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

        const updatedConferences = await updateConferences();

        newStandings.easternConference = updatedConferences.easternConference;
        newStandings.westernConference = updatedConferences.westernConference;
        newStandings.topSeed = updatedConferences.topSeed;

        await createDocument<Team>(COLLECTION, newStandings);

        return structuredClone({ ...newStandings } as LeagueStandings);

    } catch (error: unknown) {
        throw error;
    }


};

export const updateConferences = async (): Promise<{
    easternConference: Conference,
    westernConference: Conference, 
    topSeed: TeamRecord
}> => {
    const teams: Team[] = await teamService.getTeams();
    const westernConference: Conference = {
        conference: ConferenceType.westernConference,
        topSeed: undefined,
        teams: [],
    };
    const easternConference: Conference = {
        conference: ConferenceType.easternConference,
        topSeed: undefined,
        teams: []
    };

    let topEastSeedWins = 0;
    let topWestSeedWins = 0;

    for (const team of teams) {
        if (team.conference == ConferenceType.easternConference) {
            if (team.record.wins >= topEastSeedWins) {
                easternConference.topSeed = {
                    id: team.id,
                    name: team.name,
                    record: team.record
                }
                topEastSeedWins = team.record.wins;
            }
            easternConference.teams.push({ id: team.id, name: team.name, record: team.record });
        }
        if (team.conference == ConferenceType.westernConference) {
            if (team.record.wins >= topWestSeedWins) {
                westernConference.topSeed = {
                    id: team.id,
                    name: team.name,
                    record: team.record
                }
                topWestSeedWins = team.record.wins;
            }
            westernConference.teams.push({ id: team.id, name: team.name, record: team.record });
        }
    }

    const topSeed = (topEastSeedWins > topEastSeedWins) ? easternConference.topSeed! : westernConference.topSeed!;

    return structuredClone({
        easternConference: easternConference,
        westernConference: westernConference,
        topSeed: topSeed
    });
};

export const updateStandings = async (
    season: string
): Promise<LeagueStandings> => {
    try {

        const standings = await getStandingsById(season);
        const updatedConferences = await updateConferences();

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
