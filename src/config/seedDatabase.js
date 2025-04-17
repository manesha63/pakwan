const { seedMenuData } = require('../utils/firestore.js');

// Run the seed function
seedMenuData()
  .then(() => {
    console.log('Database seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error seeding database:', error);
    process.exit(1);
  }); 