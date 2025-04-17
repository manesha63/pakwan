// Mock in-memory database
const mockDb = {
  orders: new Map(),
  orderIdCounter: 1
};

class MockCollection {
  constructor(collectionName) {
    this.collectionName = collectionName;
  }

  async add(data) {
    const id = `mock-${Date.now()}`;
    mockDb[this.collectionName].set(id, data);
    return { id };
  }

  async doc(id) {
    return {
      id,
      async get() {
        const data = mockDb[this.collectionName].get(id);
        return {
          exists: !!data,
          data: () => data,
          id
        };
      },
      async update(data) {
        const existing = mockDb[this.collectionName].get(id);
        mockDb[this.collectionName].set(id, { ...existing, ...data });
        return true;
      }
    };
  }
}

export const db = {
  collection: (name) => new MockCollection(name)
};

console.log('Using mock database for testing'); 