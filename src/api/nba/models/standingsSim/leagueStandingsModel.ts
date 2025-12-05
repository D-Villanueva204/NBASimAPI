import { Conference, TeamRecord } from "./conferenceModel"

/**
 * Used to display overall league standings in a season.
 * Contains Conference, and top overall team.
 * 
 */
export interface LeagueStandings {
    season: string,
    easternConference: Conference,
    westernConference: Conference,
    topSeed: TeamRecord,
    createdAt: Date,
    updatedAt: Date
}