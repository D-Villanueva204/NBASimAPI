// Imports
import { Possession, Possessions } from "../models/matchSim/possessionModel";
import {
    DocumentData,
    DocumentSnapshot
} from "firebase-admin/firestore";
import {
    createDocument,
    getDocumentById
} from "../repositories/firestoreRepositories";

const COLLECTION: string = "possessions";

/**
 * Service for createPossessions. Meant for internal use.
 * Compiles Possession objects into a Possessions object that can be
 * easily retrieved.
 * 
 * @param events gameEvents to compile
 * @returns new Possessions object.
 */
export const createPossessions = async (
    events: Possession[]
): Promise<Possessions> => {
    try {

        const gameEvent: Partial<Possessions> = {
            events: events
        };

        const teamId: string = await createDocument<Possessions>(COLLECTION, gameEvent);

        return structuredClone({ id: teamId, ...gameEvent } as Possessions);

    } catch (error: unknown) {
        throw error;
    }

};

/**
 * Service for getPossessions. Returns Possessions by id.
 * 
 * @param id id to retrieve Possessions
 * @returns retrieved Possessions
 */
export const getPossessions = async (id: string): Promise<Possessions> => {

    try {
        const doc: DocumentSnapshot | null = await getDocumentById(
            COLLECTION,
            id
        );

        if (!doc) {
            throw new Error(`No events with id ${id} found.`);
        }

        const data: DocumentData | undefined = doc.data();
        const events: Possessions = {
            id: doc.id,
            ...data
        } as Possessions;

        return structuredClone(events);

    }
    catch (error: unknown) {
        throw error;
    }

};