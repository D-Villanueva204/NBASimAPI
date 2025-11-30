import { Conference, TeamRecord } from "./conferenceModel"

export interface LeagueStandings {
    season: string,
    easternConference: Conference,
    westernConference: Conference,
    topSeed: TeamRecord,
    createdAt: Date,
    updatedAt: Date
}