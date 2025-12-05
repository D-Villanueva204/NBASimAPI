// Imports
import { Player, Position } from "../models/people/playerModel";
import {
    QuerySnapshot,
    DocumentData,
    DocumentSnapshot
} from "firebase-admin/firestore";
import {
    createDocument,
    getDocuments,
    getDocumentById,
    updateDocument,
    getDocumentsByFieldValues
} from "../repositories/firestoreRepositories";

const playerCollection: string = "players";
const dateNow = new Date();

/**
 * Service for createPlayer
 * Creates a new Player and adds it to data.
 * 
 * @param PlayerData The data required to create a new Player,
 * @returns The new Player created.
 */
export const createPlayer = async (playerData: {
    name: string,
    currentTeam: string,
    position: Position,
    possession: number,
    three: number,
    layup: number,
    defense: number,
}): Promise<Player> => {
    try {

        const newPlayer: Partial<Player> = {
            ...playerData,
            status: false,
            createdAt: dateNow,
            updatedAt: dateNow
        };

        const PlayerId: string = await createDocument<Player>(playerCollection, newPlayer);

        return structuredClone({ id: PlayerId, ...newPlayer } as Player);

    } catch (error: unknown) {
        throw error;
    }

};

/**
 * Service for getAllPlayers
 * Returns all Player data including pending and non-pending. 
 * Meant for admin use.
 * 
 * @returns all players
 */
export const getAllPlayers = async (): Promise<Player[]> => {
    try {
        const snapshot: QuerySnapshot = await getDocuments(playerCollection);
        const players: Player[] = snapshot.docs.map(doc => {
            const data: DocumentData = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
            } as Player;
        });

        if (players.length == 0) {
            throw new Error("No players found");
        }

        return players;
    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Service for getPlayers. Meant for general use.
 * Retrieves all approved players
 * 
 * @returns approved players.
 */
export const getPlayers = async (): Promise<Player[]> => {
    try {
        const snapshot: QuerySnapshot = await getDocumentsByFieldValues(playerCollection,
            [{ fieldName: "status", fieldValue: true }]);
        const players: Player[] = snapshot.docs.map(doc => {
            const data: DocumentData = doc.data();
            return {
                id: doc.id,
                ...data
            } as Player;
        });

        if (players.length == 0) {
            throw new Error("No players found");
        }

        return players;

    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Service for getPendingPlayers. Meant for admin use.
 * Retrieves all pending players.
 * 
 * @returns all pending players.
 */
export const getPendingPlayers = async (): Promise<Player[]> => {
    try {
        const snapshot: QuerySnapshot = await getDocumentsByFieldValues(playerCollection,
            [{ fieldName: "status", fieldValue: false }]);
        const pendingPlayers: Player[] = snapshot.docs.map(doc => {
            const data: DocumentData = doc.data();
            return {
                id: doc.id,
                ...data
            } as Player;
        });


        if (pendingPlayers.length == 0) {
            throw new Error("No players found");
        }

        return pendingPlayers;

    } catch (error: unknown) {
        throw error;
    }
};


/**
 * Service for getPlayerById.
 * Returns specified player.
 * 
 * @param playerId player to retrieved id
 * @returns retrieved player
 */
export const getPlayerById = async (playerId: string): Promise<Player> => {
    try {
        const doc: DocumentSnapshot | null = await getDocumentById(
            playerCollection,
            playerId
        );

        if (!doc) {
            throw new Error(`No player with id ${playerId} found.`);
        }

        const data: DocumentData | undefined = doc.data();
        const player: Player = {
            id: doc.id,
            ...data
        } as Player;

        return structuredClone(player);

    }
    catch (error: unknown) {
        throw error;
    }

};

/**
 * Service for reviewPlayer. Meant for Admin Use.
 * Approves or disapproves player.
 * 
 * @param playerId player to review.
 * @param approved true if approved, false if denied.
 * @returns reviewed player.
 */
export const reviewPlayer = async (playerId: string, approved: boolean): Promise<Player> => {
    try {
        const pendingPlayer: Player = await getPlayerById(playerId);

        if (!pendingPlayer) {
            throw new Error(`No player with id ${playerId} found.`);
        };

        const approvedPlayer: Player = {
            ...pendingPlayer,
            status: approved,
            updatedAt: new Date()
        }

        pendingPlayer.status = approved;

        await updateDocument<Player>(playerCollection, playerId, approvedPlayer);

        return structuredClone(approvedPlayer);

    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Service for updatePlayer. Meant for admin or coach.
 * Updates player by playerData given.
 * Player must be approved by admin after changes made.
 * 
 * @param playerId the player to update
 * @param playerData values {name, position, currentTeam, possession, three, layup, and defense} all optional.
 * @returns updated player. Now pending.
 */
export const updatePlayer = async (
    playerId: string,
    playerData: Partial<Pick<Player,
        "name" |
        "position" |
        "currentTeam" |
        "possession" |
        "three" |
        "layup" |
        "defense"
    >>
): Promise<Player> => {
    try {
        const player: Player = await getPlayerById(playerId);

        if (!player) {
            throw new Error(`No player with id ${playerId} found.`);
        }

        const updatedPlayer: Player = {
            ...player,
            ...playerData,
            updatedAt: new Date()
        };

        updatedPlayer.status = false;

        await updateDocument<Player>(playerCollection, playerId, updatedPlayer);
        return structuredClone(updatedPlayer);

    } catch (error: unknown) {
        throw error;
    }
};
