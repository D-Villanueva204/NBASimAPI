import { Conference, ConferenceType, TeamRecord } from "../models/standingsSim/conferenceModel";
import * as teamService from "./teamService";
import { Team } from "../models/teamModel";

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
            console.log(team.conference);
            console.log(ConferenceType.easternConference);
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

        console.log({
            easternConference: easternConference,
            westernConference: westernConference,
            topSeed: topSeed
        });

        return structuredClone({
            easternConference: easternConference,
            westernConference: westernConference,
            topSeed: topSeed
        });
    } catch (error: unknown) {
        throw error;
    }
};