// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBcjrFb_B8_Zv9gxzladDZ8U0gNGgRErLQ",
  authDomain: "workcore-7c50a.firebaseapp.com",
  projectId: "workcore-7c50a",
  storageBucket: "workcore-7c50a.appspot.com",
  messagingSenderId: "538872245583",
  appId: "1:538872245583:web:d299422812aa6deea1e93a",
  measurementId: "G-Y05T292DJ5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

export {app, database};