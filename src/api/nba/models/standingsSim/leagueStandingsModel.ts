import { Player } from "../people/playerModel";
import { Team } from "../teamModel";
import { Conference } from "./conferenceModel";

export interface LeagueStandings {
    season: string,
    easternConference: Conference,
    westernConference: Conference,
    topSeed: Team
    pointsLeader: Player
    createdAt: Date,
    updatedAt: Date
}