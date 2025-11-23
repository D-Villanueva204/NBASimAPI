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
import { Coach } from "../models/people/coachModel";
import * as playerService from "./playerService";

const COLLECTION: string = "teams";

const dateNow = new Date();

export const createTeam = async (teamData: {
    name: string,
    pointGuard: Player,
    shootingGuard: Player,
    smallForward: Player,
    powerForward: Player,
    centre: Player,
    coach: Coach
}): Promise<Team> => {
    try {

        const newTeam: Partial<Team> = {
            ...teamData,
            createdAt: dateNow,
            updatedAt: dateNow
        };

        const teamId: string = await createDocument<Team>(COLLECTION, newTeam);

        return structuredClone({ id: teamId, ...newTeam } as Team);

    } catch (error: unknown) {
        throw error;
    }

};

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

export const updateTeamName = async (teamId: string, newName: string): Promise<Team> => {

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

        const updatedTeam: Team = {
            ...team,
            name: newName,
            updatedAt: new Date()
        };

        await updateDocument<Team>(COLLECTION, teamId, updatedTeam);
        return structuredClone(updatedTeam);

    } catch (error: unknown) {
        throw error;
    }
};

export const updatePlayer = async (teamId: string, playerId: string): Promise<Team> => {

    try {
        // This gets a team
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

        //This gets a player

        const updatedPlayer: Player = await playerService.getPlayerById(playerId);

        const updatedTeam: Team = {
            ...team,
            updatedAt: new Date()
        };


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


        await updateDocument<Team>(COLLECTION, teamId, updatedTeam);
        return structuredClone(updatedTeam);

    } catch (error: unknown) {
        throw error;
    }
};

export const deletePlayer = async (teamId: string, playerId: string): Promise<Team> => {
    try {
        // This gets a team
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

        //This gets a player

        const removedPlayer: Player = await playerService.getPlayerById(playerId);

        const updatedTeam: Team = {
            ...team,
            updatedAt: new Date()
        };

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

        await updateDocument<Team>(COLLECTION, teamId, updatedTeam);

        await playerService.updatePlayer(playerId, {currentTeam: null});

        return structuredClone(updatedTeam);


    } catch (error: unknown) {
        throw error;
    }

}