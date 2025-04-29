// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getStorage } from 'firebase/storage';


// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCQgLEks1IbrsUD6uzdouCkqRMElxawmVM",
    authDomain: "capstone-project-e8fcf.firebaseapp.com",
    projectId: "capstone-project-e8fcf",
    storageBucket: "capstone-project-e8fcf.firebasestorage.app",
    messagingSenderId: "985469167454",
    appId: "1:985469167454:web:7e9bc67f328b41a12bd1cf",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Set up Google provider
const googleProvider = new GoogleAuthProvider();
const storage = getStorage(app);

export { auth, googleProvider, signInWithPopup, storage };
