import { Player } from "../people/playerModel";

export interface LeagueStandings {
    season: string,
    easternConference: string,
    westernConference: string,
    topSeed: string
    pointsLeader: Player
    createdAt: Date,
    updatedAt: Date
}