import { getFirestore, collection, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { db } from '../config/firebase';

const ADMIN_EMAIL = 'admin@pakwan.com'; // Replace with your admin email
const ADMIN_PASSWORD = 'admin123'; // Replace with your admin password

async function testAdminFunctions() {
  console.log('Starting admin function tests...');
  
  try {
    // 1. Test Authentication
    console.log('\n1. Testing Authentication...');
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
    console.log('✓ Authentication successful');

    // 2. Test Database Access
    console.log('\n2. Testing Database Access...');
    const ordersRef = collection(db, 'orders');
    const ordersSnapshot = await getDocs(ordersRef);
    console.log(`✓ Successfully accessed orders collection (${ordersSnapshot.size} orders found)`);

    // 3. Test Location Data
    console.log('\n3. Testing Location Data...');
    const locationsRef = collection(db, 'locations');
    const locationsSnapshot = await getDocs(locationsRef);
    console.log(`✓ Successfully accessed locations collection (${locationsSnapshot.size} locations found)`);

    // 4. Test Menu Data
    console.log('\n4. Testing Menu Data...');
    const menuRef = collection(db, 'menu');
    const menuSnapshot = await getDocs(menuRef);
    console.log(`✓ Successfully accessed menu collection (${menuSnapshot.size} items found)`);

    // 5. Test User Management
    console.log('\n5. Testing User Management...');
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersRef);
    console.log(`✓ Successfully accessed users collection (${usersSnapshot.size} users found)`);

    // 6. Test Order Management
    console.log('\n6. Testing Order Management...');
    const testOrder = {
      customerName: 'Test Customer',
      items: [
        { name: 'Test Item', price: 10.99, quantity: 1 }
      ],
      total: 10.99,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Try to update an existing order (if any)
    if (ordersSnapshot.size > 0) {
      const firstOrder = ordersSnapshot.docs[0];
      await updateDoc(doc(db, 'orders', firstOrder.id), {
        status: 'tested'
      });
      console.log('✓ Successfully updated order status');
    }

    // 7. Test Menu Management
    console.log('\n7. Testing Menu Management...');
    if (menuSnapshot.size > 0) {
      const firstItem = menuSnapshot.docs[0];
      await updateDoc(doc(db, 'menu', firstItem.id), {
        isAvailable: true
      });
      console.log('✓ Successfully updated menu item availability');
    }

    // 8. Test Location Management
    console.log('\n8. Testing Location Management...');
    if (locationsSnapshot.size > 0) {
      const firstLocation = locationsSnapshot.docs[0];
      const locationData = firstLocation.data();
      await updateDoc(doc(db, 'locations', firstLocation.id), {
        hours: {
          ...locationData.hours,
          monday: { open: '10:00', close: '22:00' }
        }
      });
      console.log('✓ Successfully updated location hours');
    }

    // 9. Test Printer Status
    console.log('\n9. Testing Printer Status...');
    const printerStatusRef = doc(db, 'system', 'printer_status');
    const printerStatusDoc = await getDoc(printerStatusRef);
    if (printerStatusDoc.exists()) {
      console.log('✓ Printer status document exists');
    } else {
      console.log('! Printer status document not found');
    }

    // 10. Test Admin Permissions
    console.log('\n10. Testing Admin Permissions...');
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log(`✓ User role: ${userData.role}`);
      if (userData.locationId) {
        console.log(`✓ Location ID: ${userData.locationId}`);
      }
    }

    console.log('\nAll tests completed successfully!');
    return true;
  } catch (error) {
    console.error('Test failed:', error);
    return false;
  }
}

// Export the test function
export { testAdminFunctions };

// Run tests if this file is executed directly
if (require.main === module) {
  testAdminFunctions()
    .then(success => {
      if (success) {
        console.log('All admin functions are working correctly!');
      } else {
        console.log('Some admin functions failed. Check the logs above for details.');
      }
    })
    .catch(error => {
      console.error('Test execution failed:', error);
    });
} 