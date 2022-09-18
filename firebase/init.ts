// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import * as firestore from "firebase/firestore";
import * as firestorage from "firebase/storage";
import * as auth from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB5WrcuBKX2xw_JuXMY5nZ_-zpHECqlJ7I",
    authDomain: "auto-compartido-uteq.firebaseapp.com",
    projectId: "auto-compartido-uteq",
    storageBucket: "auto-compartido-uteq.appspot.com",
    messagingSenderId: "355650151825",
    appId: "1:355650151825:web:eccef35ed59aeb1c946630"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;