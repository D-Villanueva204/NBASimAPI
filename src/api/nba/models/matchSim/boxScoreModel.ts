/**
 * Used for structuring individual player stats for each team.
 * 
 */
export interface BoxScore {
    homeTeam: Row[],
    awayTeam: Row[]
};

/**
 * Used for displaying individual player stats.
 * 
 */
export interface Row {
    playerId: string,
    playerName: string,
    points: number,
    assists: number,
    rebounds: number
}