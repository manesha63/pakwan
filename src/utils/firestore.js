const { collection, getDocs, doc, setDoc } = require("firebase/firestore");
const { db } = require("../config/firebase.js");
const menuData = require("../config/menuSeedData.json");

// Function to seed the menu data to Firestore
const seedMenuData = async () => {
  try {
    const menuRef = collection(db, "menu");
    const categories = Object.keys(menuData.menu);

    for (const category of categories) {
      const categoryDoc = doc(menuRef, category);
      await setDoc(categoryDoc, menuData.menu[category]);
    }

    console.log("Menu data seeded successfully!");
  } catch (error) {
    console.error("Error seeding menu data:", error);
  }
};

// Function to fetch menu data from Firestore
const fetchMenuData = async () => {
  try {
    const menuRef = collection(db, "menu");
    const snapshot = await getDocs(menuRef);
    const menuData = {};
    
    snapshot.forEach((doc) => {
      menuData[doc.id] = doc.data();
    });

    return menuData;
  } catch (error) {
    console.error("Error fetching menu data:", error);
    return null;
  }
};

module.exports = {
  seedMenuData,
  fetchMenuData
}; 