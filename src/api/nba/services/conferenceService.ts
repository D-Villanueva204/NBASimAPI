// Imports
import { Conference, ConferenceType, TeamRecord } from "../models/standingsSim/conferenceModel";
import * as teamService from "./teamService";
import { Team } from "../models/teamModel";

/**
 * Service for updateConferences. Updates all Conference records based off of team records.
 * 
 * @returns non typed object. @easternConference and @westernConference type, and TeamRecord for top seed.
 */
export const updateConferences = async (): Promise<{
    easternConference: Conference,
    westernConference: Conference,
    topSeed: TeamRecord
}> => {
    try {
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

        const topSeed = (topEastSeedWins > topWestSeedWins) ? easternConference.topSeed! : westernConference.topSeed!;

        return structuredClone({
            easternConference: easternConference,
            westernConference: westernConference,
            topSeed: topSeed
        });
    } catch (error: unknown) {
        throw error;
    }
};