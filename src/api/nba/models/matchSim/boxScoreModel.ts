export interface BoxScore {
    homeTeam: Row[],
    awayTeam: Row[]
};

export interface Row {
    playerId: string,
    playerName: string,
    points: number,
    assists: number,
    rebounds: number
}