export interface Player {
    id: string,
    status: boolean,
    name: string,
    position: string,
    currentTeam?: string,
    possession: number,
    three: number,
    layup: number,
    defense: number,
    createdAt: Date;
    updatedAt: Date;
};