import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  onAuthStateChanged,
  deleteUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [adminLocation, setAdminLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();

  const checkEmailExists = async (email) => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking email:', error);
      throw error;
    }
  };

  const signup = async (email, password, role = 'customer', locationId = null) => {
    try {
      // Create the user in Firebase Auth first
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      try {
        // Create the user profile in Firestore
        const userDocRef = doc(db, 'users', userCredential.user.uid);
        await setDoc(userDocRef, {
          email,
          role,
          locationId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        // Update local state
        setUserRole(role);
        setAdminLocation(locationId);
        
        return userCredential;
      } catch (firestoreError) {
        // If Firestore creation fails, delete the auth user to maintain consistency
        await deleteUser(userCredential.user);
        throw new Error('Failed to create user profile: ' + firestoreError.message);
      }
    } catch (error) {
      console.error('Error in signup:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    return signOut(auth);
  };

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const updateUserProfile = async (userId, data) => {
    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, data, { merge: true });
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Get user profile from Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserRole(userData.role);
            setAdminLocation(userData.locationId);
            setCurrentUser({ ...user, ...userData });

            // Redirect based on role
            if (userData.role === 'locationAdmin') {
              navigate('/restaurant');
            } else if (userData.role === 'superAdmin') {
              navigate('/admin');
            }
          } else {
            setCurrentUser(user);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
        setUserRole(null);
        setAdminLocation(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [auth, db, navigate]);

  const value = {
    currentUser,
    userRole,
    adminLocation,
    signup,
    login,
    logout,
    resetPassword,
    updateUserProfile,
    isLocationAdmin: () => userRole === 'locationAdmin',
    isSuperAdmin: () => userRole === 'superAdmin'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 