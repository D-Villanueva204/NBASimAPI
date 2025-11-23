import { Player } from "../models/people/playerModel";
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
 * 
 * Creates a new Player and adds it to data.
 * 
 * @param PlayerData The data required to create a new Player,
 * @returns The new Player created.
 */
export const createPlayer = async (playerData: {
    name: string,
    currentTeam: string,
    position: string,
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
 * 
 * Returns all Player data including pending and non-pending. Meant for admin use.
 * 
 * @returns an array of Player data.
 * 
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
 * 
 * For later, if status is false, do not return.
 * 
 * @param playerId 
 * @returns 
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
            updatedAt: new Date()
        };

        if (playerData.name !== undefined) updatedPlayer.name = playerData.name;
        if (playerData.position !== undefined) updatedPlayer.position = playerData.position;
        if (playerData.currentTeam !== undefined) updatedPlayer.currentTeam = playerData.currentTeam;
        if (playerData.possession !== undefined) updatedPlayer.possession = playerData.possession;
        if (playerData.three !== undefined) updatedPlayer.three = playerData.three;
        if (playerData.layup !== undefined) updatedPlayer.layup = playerData.layup;
        if (playerData.defense !== undefined) updatedPlayer.defense = playerData.defense;

        updatedPlayer.status = false;

        await updateDocument<Player>(playerCollection, playerId, updatedPlayer);
        return structuredClone(updatedPlayer);

    } catch (error: unknown) {
        throw error;
    }
};
