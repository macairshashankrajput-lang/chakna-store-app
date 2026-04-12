/**
 * Firebase Configuration
 * Initializes Firebase with environment variables
 */

export const firebaseConfig = {
  apiKey: "AIzaSyBDZDpouCgKW02c1ukypOUnrH5loBSvIIM",
  authDomain: "thechaknastore.firebaseapp.com",
  databaseURL: "https://thechaknastore-default-rtdb.firebaseio.com",
  projectId: "thechaknastore",
  storageBucket: "thechaknastore.firebasestorage.app",
  messagingSenderId: "274624443566",
  appId: "1:274624443566:web:9ee8fa8bd5c4f49de1293f",
  measurementId: "G-ETKGMJNLB0"
};

/**
 * Validates Firebase configuration
 */
export function validateFirebaseConfig(): boolean {
  const requiredKeys = ['projectId', 'authDomain', 'storageBucket'];
  return requiredKeys.every(key => {
    const value = firebaseConfig[key as keyof typeof firebaseConfig];
    return value && typeof value === 'string' && value.length > 0;
  });
}

export default firebaseConfig;
