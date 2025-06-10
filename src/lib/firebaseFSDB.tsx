import { initializeApp } from "firebase/app";
import { 
    getFirestore, 
    collection,
    doc,
    getDoc,
    addDoc,
    Timestamp
} from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DB_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function handleSubmit(message : string, trackData : any){
    const postcardRef = collection(db, 'postcards');
    const newDoc = await addDoc(postcardRef, {
        message,
        track : trackData,
        createdAt : Timestamp.now(),
    });
    return newDoc.id;
}
export async function getPostcard(id : string){
    const docRef = doc(db, 'postcards', id)
    const docSnap = await getDoc(docRef);
    if(!docSnap.exists()) return null;
    return docSnap.data();
}