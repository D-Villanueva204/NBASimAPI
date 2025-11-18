import { Player } from "../people/playerModel";
import { Team } from "../teamModel";
import { Possession } from "./possessionModel";


export interface Match {
    currentTeam: Team,
    shooter: Player,
    defender: Player,
    outcome: Possession,
    rebounder: Player
}