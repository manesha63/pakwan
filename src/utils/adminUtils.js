import { getAuth, listUsers, deleteUser } from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export const deleteAllUsers = async () => {
  try {
    const auth = getAuth();
    const db = getFirestore();

    // Delete user profiles from Firestore
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    console.log('All user profiles deleted from Firestore');

    // Note: For Firebase Auth user deletion, you'll need to use Firebase Admin SDK
    // This needs to be done through a secure backend server
    // The following is just for documentation:
    // auth.listUsers().then((listUsersResult) => {
    //   listUsersResult.users.forEach((userRecord) => {
    //     auth.deleteUser(userRecord.uid);
    //   });
    // });

    return true;
  } catch (error) {
    console.error('Error deleting users:', error);
    throw error;
  }
}; 