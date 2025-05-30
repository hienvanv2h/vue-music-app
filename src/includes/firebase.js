import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore, collection } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyCFjEnLLrXvQ9ZqnMM_H0G0ure6il5pWvw",
  authDomain: "vuemusic-a2376.firebaseapp.com",
  projectId: "vuemusic-a2376",
  storageBucket: "vuemusic-a2376.firebasestorage.app",
  messagingSenderId: "667142110403",
  appId: "1:667142110403:web:6624c3810263a84f1a7676",
}

const app = initializeApp(firebaseConfig)

const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

const usersCollectionRef = collection(db, "users")
const songsCollectionRef = collection(db, "songs")
const commentsCollectionRef = collection(db, "comments")

export { auth, db, usersCollectionRef, songsCollectionRef, commentsCollectionRef, storage }
