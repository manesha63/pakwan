import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { firebaseConfig } from '../config/firebase';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const cleanupMenuData = async () => {
  try {
    console.log('Starting cleanup of menu data...');
    
    // Get all documents in the menu_categories collection
    const querySnapshot = await getDocs(collection(db, 'menu_categories'));
    
    // Delete each document
    const deletePromises = querySnapshot.docs.map(async (doc) => {
      await deleteDoc(doc.ref);
      console.log(`Deleted category: ${doc.id}`);
    });
    
    await Promise.all(deletePromises);
    console.log('Cleanup completed successfully!');
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
};

// Run the cleanup
cleanupMenuData(); 