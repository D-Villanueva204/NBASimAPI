import { Shot } from "./shotModel";

export interface Possessions {
    id: string,
    events: Possession[];
}

export interface Possession {
    shot: Shot,
    currentTeam: string,
    shooter: {
        playerId: string,
        name: string
    },
    defender: {
        playerId: string,
        name: string
    },
    rebound: {
        playerId: string,
        name: string
    } | null,
    assist: {
        playerId: string,
        name: string
    } | null
}