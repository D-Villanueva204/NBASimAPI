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

export const updateCoach = async (
    coachId: string,
    coachData: Partial<Pick<Coach,
        "name" |
        "currentTeam"
    >>
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

        const updatedCoach: Coach = {
            ...coach,
            updatedAt: new Date()
        };

        if (coachData.name !== undefined) updatedCoach.name = coachData.name;
        if (coachData.currentTeam !== undefined) updatedCoach.currentTeam = coachData.currentTeam;

        await updateDocument<Coach>(COLLECTION, coachId, updatedCoach);
        return structuredClone(updatedCoach);

    } catch (error: unknown) {
        throw error;
    }
};

