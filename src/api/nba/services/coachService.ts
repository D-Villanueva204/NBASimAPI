// Imports
import { Coach } from "../models/people/coachModel";
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

const COLLECTION: string = "coaches";
const dateNow = new Date();

/**
 * Service for creating a Coach. Stores to "coaches" collection.
 * 
 * @param coachData Required: name. currentTeam can be null.
 * @returns new Coach.
 */
export const createCoach = async (coachData: {
    name: string,
    currentTeam?: string
}): Promise<Coach> => {
    try {
        const newCoach: Partial<Coach> = {
            ...coachData,
            createdAt: dateNow,
            updatedAt: dateNow
        }

        const coachId: string = await createDocument<Coach>(COLLECTION, newCoach);

        return structuredClone({ id: coachId, ...newCoach } as Coach);

    }

    catch (error: unknown) {
        throw error;
    }
}

/**
 * Service for getCoaches. Returns all coaches from collection.
 * 
 * 
 * @returns all coaches in collection.
 */
export const getCoaches = async (): Promise<Coach[]> => {

    try {
        const snapshot: QuerySnapshot = await getDocuments(COLLECTION);
        const coaches: Coach[] = snapshot.docs.map(doc => {
            const data: DocumentData = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
            } as Coach;
        });

        if (coaches.length == 0) {
            throw new Error("No coaches found");
        }

        return coaches;
    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Service for getCoachById. Returns coach with given id.
 * 
 * @param coachId id to retrieve coach for.
 * @returns retrieved coach
 */
export const getCoachById = async (
    coachId: string
): Promise<Coach> => {
    try {

        const doc: DocumentSnapshot | null = await getDocumentById(
            COLLECTION,
            coachId
        );

        if (!doc) {
            throw new Error(`No coach with id ${coachId} found.`);
        }

        const data: DocumentData | undefined = doc.data();
        const coach: Coach = {
            id: doc.id,
            ...data
        } as Coach;


        return structuredClone(coach);

    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Service for updateCoach. Update coach with given id.
 * 
 * @param coachId id to update and retrieve coach for.
 * @returns updated coach
 */
export const updateCoach = async (
    coachId: string,
    coachData: Partial<Pick<Coach,
        "name" |
        "currentTeam"
    >>
): Promise<Coach> => {
    try {

        const coach = await getCoachById(coachId);

        const updatedCoach: Coach = {
            ...coach,
            ...coachData,
            updatedAt: new Date()
        };

        await updateDocument<Coach>(COLLECTION, coachId, updatedCoach);
        return structuredClone(updatedCoach);

    } catch (error: unknown) {
        throw error;
    }
};



