import { getDatabase, ref, set, get, child } from 'firebase/database';
import { getFirestore, doc, setDoc, collection, writeBatch, getDocs, query } from 'firebase/firestore';
import menuData from '../data/menuSeedData.json';

// Function to import data to Firebase Realtime Database
export const importToRealtimeDatabase = async () => {
  try {
    const database = getDatabase();
    await set(ref(database, 'menu'), menuData.menu);
    console.log('Menu data successfully imported to Realtime Database');
    return true;
  } catch (error) {
    console.error('Error importing menu data to Realtime Database:', error);
    throw error;
  }
};

// Function to import data to Firestore with complete menu
export const importToFirestore = async () => {
  try {
    const db = getFirestore();
    const batch = writeBatch(db);

    // Create a reference to the menu collection
    const menuRef = collection(db, 'menu');

    // First, let's add the menu metadata
    const menuMetadataRef = doc(menuRef, 'metadata');
    batch.set(menuMetadataRef, {
      lastUpdated: new Date().toISOString(),
      totalCategories: Object.keys(menuData.menu.categories).length
    });

    // Add categories as separate documents
    Object.entries(menuData.menu.categories).forEach(([categoryName, categoryData]) => {
      const categoryRef = doc(menuRef, categoryName.toLowerCase().replace(/[^a-z0-9]/g, '_'));
      
      // Format the category data
      const formattedCategory = {
        name: categoryName.replace(/_/g, ' '),
        orderIndex: categoryData.orderIndex,
        items: categoryData.items.map(item => ({
          ...item,
          price: Number(item.price), // Ensure price is a number
          orderIndex: Number(item.orderIndex), // Ensure orderIndex is a number
          id: item.id || `${categoryName.toLowerCase()}_${item.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}` // Ensure unique IDs
        }))
      };

      batch.set(categoryRef, formattedCategory);
    });

    // Commit the batch
    await batch.commit();
    console.log('Menu data successfully imported to Firestore');
    return true;
  } catch (error) {
    console.error('Error importing menu data to Firestore:', error);
    throw error;
  }
};

// Function to import data to both databases
export const importToAllDatabases = async () => {
  try {
    await Promise.all([
      importToRealtimeDatabase(),
      importToFirestore()
    ]);
    console.log('Menu data successfully imported to all databases');
    return true;
  } catch (error) {
    console.error('Error importing menu data:', error);
    throw error;
  }
};

// Helper function to validate menu data structure
export const validateMenuData = () => {
  try {
    if (!menuData.menu || !menuData.menu.categories) {
      throw new Error('Invalid menu data structure: missing menu or categories');
    }

    Object.entries(menuData.menu.categories).forEach(([categoryName, categoryData]) => {
      if (!Array.isArray(categoryData.items)) {
        throw new Error(`Invalid category structure for ${categoryName}: items is not an array`);
      }

      if (typeof categoryData.orderIndex !== 'number') {
        throw new Error(`Invalid category structure for ${categoryName}: missing or invalid orderIndex`);
      }

      categoryData.items.forEach((item, index) => {
        if (!item.id || !item.name || typeof item.price !== 'number') {
          throw new Error(`Invalid item structure in ${categoryName} at index ${index}`);
        }
      });
    });

    return true;
  } catch (error) {
    console.error('Menu data validation failed:', error);
    throw error;
  }
};

// Example usage function
export const initializeMenuData = async (databaseType = 'both') => {
  try {
    // First validate the data
    validateMenuData();

    // Then import based on specified database type
    switch (databaseType.toLowerCase()) {
      case 'realtime':
        await importToRealtimeDatabase();
        break;
      case 'firestore':
        await importToFirestore();
        break;
      case 'both':
        await importToAllDatabases();
        break;
      default:
        throw new Error('Invalid database type specified');
    }

    return true;
  } catch (error) {
    console.error('Failed to initialize menu data:', error);
    throw error;
  }
};

// Function to fetch data from Realtime Database
export const fetchFromRealtimeDatabase = async () => {
  try {
    const database = getDatabase();
    const menuRef = ref(database, 'menu');
    const snapshot = await get(menuRef);
    
    if (snapshot.exists()) {
      console.log('Data from Realtime Database:', snapshot.val());
      return snapshot.val();
    } else {
      console.log('No data available in Realtime Database');
      return null;
    }
  } catch (error) {
    console.error('Error fetching from Realtime Database:', error);
    throw error;
  }
};

// Function to fetch data from Firestore
export const fetchFromFirestore = async () => {
  try {
    const db = getFirestore();
    const menuRef = collection(db, 'menu');
    const querySnapshot = await getDocs(menuRef);
    
    const data = {};
    querySnapshot.forEach((doc) => {
      data[doc.id] = doc.data();
    });

    console.log('Data from Firestore:', data);
    return data;
  } catch (error) {
    console.error('Error fetching from Firestore:', error);
    throw error;
  }
};

// Function to verify data in both databases
export const verifyDatabaseData = async () => {
  try {
    const results = {
      realtimeDB: {
        status: 'pending',
        data: null,
        error: null
      },
      firestore: {
        status: 'pending',
        data: null,
        error: null
      }
    };

    // Fetch from Realtime Database
    try {
      results.realtimeDB.data = await fetchFromRealtimeDatabase();
      results.realtimeDB.status = 'success';
    } catch (error) {
      results.realtimeDB.status = 'error';
      results.realtimeDB.error = error.message;
    }

    // Fetch from Firestore
    try {
      results.firestore.data = await fetchFromFirestore();
      results.firestore.status = 'success';
    } catch (error) {
      results.firestore.status = 'error';
      results.firestore.error = error.message;
    }

    // Compare with original data
    const verification = {
      realtimeDB: {
        hasData: results.realtimeDB.data !== null,
        matchesOriginal: JSON.stringify(results.realtimeDB.data?.categories) === 
                        JSON.stringify(menuData.menu.categories)
      },
      firestore: {
        hasData: Object.keys(results.firestore.data || {}).length > 0,
        // Note: Firestore data structure is slightly different due to category-based documents
        categoriesMatch: Object.keys(results.firestore.data || {}).length === 
                        Object.keys(menuData.menu.categories).length
      }
    };

    console.log('Database Verification Results:', {
      results,
      verification
    });

    return {
      results,
      verification
    };
  } catch (error) {
    console.error('Error verifying database data:', error);
    throw error;
  }
};

// Function to verify Firestore data specifically
export const verifyFirestoreData = async () => {
  try {
    const db = getFirestore();
    const menuRef = collection(db, 'menu');
    const querySnapshot = await getDocs(menuRef);
    
    const firestoreData = {};
    querySnapshot.forEach((doc) => {
      firestoreData[doc.id] = doc.data();
    });

    // Verify all categories exist
    const expectedCategories = Object.keys(menuData.menu.categories).map(
      name => name.toLowerCase().replace(/[^a-z0-9]/g, '_')
    );
    
    const actualCategories = Object.keys(firestoreData).filter(key => key !== 'metadata');
    
    const verification = {
      categoriesMatch: expectedCategories.every(cat => actualCategories.includes(cat)),
      totalCategories: actualCategories.length,
      expectedCategories: expectedCategories.length,
      missingCategories: expectedCategories.filter(cat => !actualCategories.includes(cat)),
      itemCounts: {}
    };

    // Check item counts in each category
    actualCategories.forEach(category => {
      if (firestoreData[category] && firestoreData[category].items) {
        verification.itemCounts[category] = firestoreData[category].items.length;
      }
    });

    return {
      verification,
      data: firestoreData
    };
  } catch (error) {
    console.error('Error verifying Firestore data:', error);
    throw error;
  }
};

// Example usage function to test the data import and verification
export const testDatabaseSetup = async () => {
  try {
    console.log('1. Starting database initialization...');
    await initializeMenuData('both');
    console.log('2. Database initialization completed.');
    
    console.log('3. Starting data verification...');
    const verificationResults = await verifyDatabaseData();
    console.log('4. Data verification completed.');
    
    return verificationResults;
  } catch (error) {
    console.error('Database setup test failed:', error);
    throw error;
  }
}; 