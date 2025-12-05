import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getAuth, Auth } from "firebase-admin/auth";

// You'll need to replace this with your actual service account file name
import serviceAccount from "../capstone-project-75fdd-firebase-adminsdk-fbsvc-313c998d1b.json";

// initialize the Firebase app with our service account key
initializeApp({
    credential: cert(serviceAccount as ServiceAccount),
});

const auth: Auth = getAuth();

// get a reference to the firestore database
const db: Firestore = getFirestore();

db.settings({ ignoreUndefinedProperties: true });

export { auth, db };
