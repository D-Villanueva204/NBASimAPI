/**
 * Player model.
 * 
 */
export interface Player {
    id: string,
    status: boolean,
    name: string,
    position: Position,
    currentTeam: string | null,
    possession: number,
    three: number,
    layup: number,
    defense: number,
    createdAt: Date;
    updatedAt: Date;
};

/**
 * Enum for Player Position.
 * 
 */
export enum Position {
    PointGuard = "PG",   
    ShootingGuard = "SG",
    SmallForward = "SF",  
    PowerForward = "PF",  
    Centre = "C"        
}