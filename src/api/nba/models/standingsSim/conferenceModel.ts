import { Record } from "../teamModel"

/**
 * Used for holding Teams in a Conference with specific type.
 * 
 */
export interface Conference {
    conference: ConferenceType,
    topSeed?: TeamRecord,
    teams: TeamRecord[]
}
/**
 * Used for limiting type of Conference.
 * 
 */
export enum ConferenceType {
    westernConference = "WEST",
    easternConference = "EAST"
}

/**
 * Used to display Team in a smaller format with their
 * record.
 * 
 */
export interface TeamRecord {
    id: string,
    name: string,
    record: Record
}