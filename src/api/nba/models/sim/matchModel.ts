import { Player } from "../people/playerModel";
import { Team } from "../teamModel";


export interface Possession {
    currentTeam: Team,
    shooter: Player,
    defender: Player,
    outcome: Possession,
    rebounder: Player
}