import { Shot } from "./shotModel";

/**
 * Used for storing game events for a match.
 * 
 * 
 */
export interface Possessions {
    id: string,
    events: Possession[];
}

/**
 * Used for storing a game event.
 * 
 */
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