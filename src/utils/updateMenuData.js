const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('../config/serviceAccountKey.json');
const menuData = require('../data/menuData.json');

// Initialize Firebase Admin
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

const cleanupMenuData = async () => {
  try {
    console.log('Starting cleanup of menu data...');
    
    // Get all documents in the menu_categories collection
    const querySnapshot = await db.collection('menu_categories').get();
    
    // Delete each document
    const deletePromises = querySnapshot.docs.map(async (doc) => {
      await doc.ref.delete();
      console.log(`Deleted category: ${doc.id}`);
    });
    
    await Promise.all(deletePromises);
    console.log('Cleanup completed successfully!');
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
};

const importMenuData = async () => {
  try {
    console.log('Starting menu data import...');
    
    // Import each category
    for (const category of menuData.menu_categories) {
      await db.collection('menu_categories').doc(category.id).set({
        id: category.id,
        name: category.name,
        items: category.items
      });
      console.log(`Imported category: ${category.name}`);
    }
    
    console.log('Menu data import completed successfully!');
  } catch (error) {
    console.error('Error importing menu data:', error);
  }
};

const updateMenuData = async () => {
  try {
    // First clean up existing data
    await cleanupMenuData();
    
    // Then import new data
    await importMenuData();
    
    console.log('Menu data update completed successfully!');
  } catch (error) {
    console.error('Error during menu data update:', error);
  }
};

// Run the update
updateMenuData(); 