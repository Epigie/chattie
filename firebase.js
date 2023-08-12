import { initializeApp } from 'firebase/app'
import { getAuth, signOut } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
//import 'firebase/auth'
//import 'firebase/firestore'

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

const firebaseConfig = {
  apiKey: 'AIzaSyAm03Vnv8LQBjmqDJQnQ8sJai_KLty65eg',
  authDomain: 'chattie-aaf25.firebaseapp.com',
  projectId: 'chattie-aaf25',
  storageBucket: 'chattie-aaf25.appspot.com',
  messagingSenderId: '709246388251',
  appId: '1:709246388251:web:4a7fc46cdbd25a46dcd0be'
}
// initialize our firebase app
const app = initializeApp(firebaseConfig)
// initialize auth and db
const auth = getAuth()
const db = getFirestore()
const storage = getStorage()
// conect to our firestore databse collection

export { auth, db, storage, signOut }
