import admin from 'firebase-admin';

console.warn('Using mock database for testing');

// Export a mock db for testing
const db = {
  collection: () => ({
    add: async (data) => {
      console.log('Mock DB: Creating order with data:', JSON.stringify(data, null, 2));
      return { id: 'mock-' + Date.now() };
    },
    doc: (id) => ({
      get: async () => ({
        exists: true,
        data: () => ({
          id,
          customerName: "Test Customer",
          items: [],
          status: "pending",
          createdAt: new Date().toISOString()
        }),
      }),
      update: async (data) => {
        console.log('Mock DB: Updating order:', id, 'with data:', JSON.stringify(data, null, 2));
      },
    }),
  }),
  settings: () => {},
};

export { db, admin }; 