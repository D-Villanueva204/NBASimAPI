import { Player } from "../people/playerModel";
import { Shot } from "./shotModel";

export interface Possessions {
    id: string,
    events: Possession[];
}

export interface Possession {
    currentTeam: string,
    shooter: Player,
    defender: Player,
    shot: Shot,
    rebound: Player
}