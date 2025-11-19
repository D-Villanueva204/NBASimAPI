import { Player } from "../people/playerModel";
import { Team } from "../teamModel";
import { Shot } from "./shotModel";

export interface Possession {
    currentTeam: Team,
    shooter: Player,
    defender: Player,
    shot: Shot,
    rebound: Player
}