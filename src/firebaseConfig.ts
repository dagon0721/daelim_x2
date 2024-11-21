// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; //인증 관련
import { Firestore, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDYAX73ZM6Wat9XV3if3n3xFd5a_6-JgMw",
  authDomain: "daelimx-5210b.firebaseapp.com",
  projectId: "daelimx-5210b",
  storageBucket: "daelimx-5210b.appspot.com",
  messagingSenderId: "654909605540",
  appId: "1:654909605540:web:661ba1bf64751ae1938831",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 1. 인증 Authentication with "app"
export const auth = getAuth(app);
// 2. DB fireStore with "app"
export const firestore = getFirestore(app);
