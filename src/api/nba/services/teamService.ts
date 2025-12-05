// Imports
import { Player, Position } from "../models/people/playerModel";
import { Team } from "../models/teamModel";
import {
    QuerySnapshot,
    DocumentData,
    DocumentSnapshot
} from "firebase-admin/firestore";
import {
    createDocument,
    getDocuments,
    getDocumentById,
    updateDocument
} from "../repositories/firestoreRepositories";
import * as playerService from "./playerService";
import { ConferenceType } from "../models/standingsSim/conferenceModel";
import { Coach } from "../models/people/coachModel";
import * as coachService from "./coachService";

const COLLECTION: string = "teams";
const dateNow = new Date();

/**
 * Service for createTeam. Creates a team based off of given name and conferenceType.
 * 
 * @param teamData must contain name, and conferenceType.
 * @returns new created Team.
 */
export const createTeam = async (teamData: {
    name: string,
    conference: ConferenceType
}): Promise<Team> => {
    try {

        const newTeam: Partial<Team> = {
            ...teamData,
            pointGuard: null,
            shootingGuard: null,
            smallForward: null,
            powerForward: null,
            centre: null,
            coach: null,
            record: {
                wins: 0,
                losses: 0
            },
            createdAt: dateNow,
            updatedAt: dateNow
        };

        const teamId: string = await createDocument<Team>(COLLECTION, newTeam);

        return structuredClone({ id: teamId, ...newTeam } as Team);

    } catch (error: unknown) {
        throw error;
    }

};

/**
 * Service for getTeams. Returns all teams in collection.
 * 
 * @returns all teams in collection.
 */
export const getTeams = async (): Promise<Team[]> => {
    try {
        const snapshot: QuerySnapshot = await getDocuments(COLLECTION);
        const teams: Team[] = snapshot.docs.map(doc => {
            const data: DocumentData = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
            } as Team;
        });

        if (teams.length == 0) {
            throw new Error("No teams found");
        }

        return teams;
    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Service for getTeamById. Returns team by given id.
 * 
 * @param teamId id to retrieve team by.
 * @returns team with given id.
 */
export const getTeamById = async (teamId: string): Promise<Team> => {

    try {
        const doc: DocumentSnapshot | null = await getDocumentById(
            COLLECTION,
            teamId
        );

        if (!doc) {
            throw new Error(`No team with id ${teamId} found.`);
        }

        const data: DocumentData | undefined = doc.data();
        const team: Team = {
            id: doc.id,
            ...data
        } as Team;

        return structuredClone(team);

    }
    catch (error: unknown) {
        throw error;
    }

};

/**
 * Service for updateTeamName. Updates specified team by id with 
 * given newName.
 * 
 * @param teamId the team to update.
 * @param newName the new name to change to.
 * @returns 
 */
export const updateTeamName = async (teamId: string, newName: string): Promise<Team> => {

    try {
        const team: Team = await getTeamById(teamId);

        const updatedTeam: Team = {
            ...team,
            updatedAt: new Date()
        };

        updatedTeam.name = newName;

        await updateDocument<Team>(COLLECTION, teamId, updatedTeam);
        return structuredClone(updatedTeam);

    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Service for updateRecord. Updates team record.
 * 
 * 
 * @param teamId the team to update.
 * @param win boolean, true if won, false if lost.
 * @returns updated team.
 */
export const updateRecord = async (teamId: string, win: boolean): Promise<Team> => {

    try {
        const team: Team = await getTeamById(teamId);

        const updatedTeam: Team = {
            ...team,
            updatedAt: new Date()
        };

        if (!updatedTeam.record) {
            updatedTeam.record = {
                wins: 0,
                losses: 0
            }
        }

        if (win) {
            updatedTeam.record.wins += 1;
        }
        else {
            updatedTeam.record.losses += 1;
        }


        await updateDocument<Team>(COLLECTION, teamId, updatedTeam);
        return structuredClone(updatedTeam);

    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Service for updatePlayer. Updates player into given position.
 * Warning, player must also be approved again by admin once updated.
 * 
 * 
 * @param teamId the team to update
 * @param playerId the player to add
 * @returns updated team
 */
export const updatePlayer = async (teamId: string, playerId: string): Promise<Team> => {
    try {

        // Retrieve team
        const team: Team = await getTeamById(teamId);

        // Retrieve player
        const updatedPlayer: Player = await playerService.getPlayerById(playerId);

        // Update player position.
        await playerService.updatePlayer(playerId, { currentTeam: teamId });

        const updatedTeam: Team = {
            ...team,
            updatedAt: new Date()
        };

        // Find player position, assign to team position.
        switch (updatedPlayer.position) {
            case Position.PointGuard:
                updatedTeam.pointGuard = updatedPlayer;
                break;

            case Position.ShootingGuard:
                updatedTeam.shootingGuard = updatedPlayer;
                break;

            case Position.SmallForward:
                updatedTeam.smallForward = updatedPlayer;
                break;

            case Position.PowerForward:
                updatedTeam.powerForward = updatedPlayer;
                break;

            case Position.Centre:
                updatedTeam.centre = updatedPlayer;
                break;
        }

        // Update team.
        await updateDocument<Team>(COLLECTION, teamId, updatedTeam);
        return structuredClone(updatedTeam);

    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Service for assignCoach. Assigns new coach to team.
 * 
 * @param teamId team id to assign new coach
 * @param coachId coach id to assign
 * @returns updated team
 */
export const assignCoach = async (teamId: string, coachId: string): Promise<Team> => {
    try {

        // Retrieve team
        const team: Team = await getTeamById(teamId);

        // This gets a coach.
        const updatedCoach: Coach = await coachService.getCoachById(coachId);
        // Update coach status
        await coachService.updateCoach(coachId, { currentTeam: team.id });

        const updatedTeam: Team = {
            ...team,
            updatedAt: new Date()
        };

        // Assign the coach.
        updatedTeam.coach = updatedCoach;

        // Update to firebase.
        await updateDocument<Team>(COLLECTION, teamId, updatedTeam);
        return structuredClone(updatedTeam);

    } catch (error: unknown) {
        throw error;
    }
};

export const deletePlayer = async (teamId: string, playerId: string): Promise<Team> => {
    try {

        // Get team
        const team: Team = await getTeamById(teamId);

        // This gets a player

        const removedPlayer: Player = await playerService.getPlayerById(playerId);

        const updatedTeam: Team = {
            ...team,
            updatedAt: new Date()
        };

        // Remove player
        switch (removedPlayer.position) {
            case Position.PointGuard:
                updatedTeam.pointGuard = null;
                break;

            case Position.ShootingGuard:
                updatedTeam.shootingGuard = null;
                break;

            case Position.SmallForward:
                updatedTeam.smallForward = null;
                break;

            case Position.PowerForward:
                updatedTeam.powerForward = null;
                break;

            case Position.Centre:
                updatedTeam.centre = null;
                break;
        }

        // Make updates
        await updateDocument<Team>(COLLECTION, teamId, updatedTeam);

        await playerService.updatePlayer(playerId, { currentTeam: null });

        return structuredClone(updatedTeam);


    } catch (error: unknown) {
        throw error;
    }

}