// Mock Order model for testing
class Order {
  static async findById(id) {
    console.log('Mock: Finding order by ID:', id);
    return null;
  }

  static async findByIdAndUpdate(id, update) {
    console.log('Mock: Updating order:', id, update);
    return null;
  }
}

export { Order }; 