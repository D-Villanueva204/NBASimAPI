import { Player } from "../people/playerModel";
import { Shot } from "./shotModel";

export interface Possession {
    currentTeam: string,
    shooter: Player,
    defender: Player,
    shot: Shot,
    rebound: Player
}