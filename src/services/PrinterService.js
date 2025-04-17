import { db } from '../config/firebase';
import { collection, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

class PrinterService {
  constructor() {
    this.printersRef = collection(db, 'printers');
  }

  // Save printer configuration for a location
  async savePrinterConfig(locationId, printerConfig) {
    try {
      const printerDoc = doc(this.printersRef, locationId);
      await setDoc(printerDoc, {
        ...printerConfig,
        updatedAt: new Date().toISOString(),
      });
      return true;
    } catch (error) {
      console.error('Error saving printer configuration:', error);
      throw error;
    }
  }

  // Get printer configuration for a location
  async getPrinterConfig(locationId) {
    try {
      const printerDoc = doc(this.printersRef, locationId);
      const snapshot = await getDoc(printerDoc);
      return snapshot.exists() ? snapshot.data() : null;
    } catch (error) {
      console.error('Error getting printer configuration:', error);
      throw error;
    }
  }

  // Update printer status
  async updatePrinterStatus(locationId, status) {
    try {
      const printerDoc = doc(this.printersRef, locationId);
      await updateDoc(printerDoc, {
        status,
        lastStatusUpdate: new Date().toISOString(),
      });
      return true;
    } catch (error) {
      console.error('Error updating printer status:', error);
      throw error;
    }
  }
}

export default new PrinterService(); 