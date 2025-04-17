// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAWLnDpD1otTrSR328LuvNXVYbZprMD8tQ",
  authDomain: "pakwan-6cdcc.firebaseapp.com",
  projectId: "pakwan-6cdcc",
  storageBucket: "pakwan-6cdcc.firebasestorage.app",
  messagingSenderId: "447583274524",
  appId: "1:447583274524:web:88344f1233906e0c1281d9",
  measurementId: "G-N667Y2T8FM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

// Export the Firebase instances
export { app, analytics, db, auth };
export default { app, analytics, db, auth }; 