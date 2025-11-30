import { Record } from "../teamModel"

export interface Conference {
    conference: ConferenceType,
    topSeed?: TeamRecord,
    teams: TeamRecord[]
}
export enum ConferenceType {
    westernConference = "WEST",
    easternConference = "EAST"
}
export interface TeamRecord {
    id: string,
    name: string,
    record: Record
}