import { Shot } from "./shotModel";

export interface Possessions {
    id: string,
    events: Possession[];
}

export interface Possession {
    currentTeam: string,
    shooter: {
        playerId: string,
        name: string
    },
    defender: {
        playerId: string,
        name: string
    },
    shot: Shot,
    rebound: {
        playerId: string,
        name: string
    },
    assist: {
        playerId: string,
        name: string
    }
}