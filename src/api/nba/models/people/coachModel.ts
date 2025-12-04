/**
 * Coach model.
 * 
 */
export interface Coach {
    id: string,
    name: string,
    currentTeam?: string,
    createdAt: Date;
    updatedAt: Date;
};