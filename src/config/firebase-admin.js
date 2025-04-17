import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAWLnDpD1otTrSR328LuvNXVYbZprMD8tQ",
  authDomain: "pakwan-6cdcc.firebaseapp.com",
  projectId: "pakwan-6cdcc",
  storageBucket: "pakwan-6cdcc.firebasestorage.app",
  messagingSenderId: "447583274524",
  appId: "1:447583274524:web:88344f1233906e0c1281d9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db }; 