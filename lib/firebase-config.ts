/**
 * Firebase Configuration
 * Expo Go compatible - uses JS SDK web config
 */

export const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || 'AIzaSyBDZDpouCgKW02c1ukypOUnrH5loBSvIIM',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'thechaknastore.firebaseapp.com',
  projectId: process.env.FIREBASE_PROJECT_ID || 'thechaknastore',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'thechaknastore.firebasestorage.app',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '274624443566',
  appId: process.env.FIREBASE_APP_ID || '1:274624443566:web:9ee8fa8bd5c4f49de1293f',
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || 'G-ETKGMJNLB0',
};

// Config validation relaxed for Expo Go (appId used instead of webAppId)
const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'appId'];
const valid = requiredKeys.every(key => {
  const value = firebaseConfig[key as keyof typeof firebaseConfig];
  return value && typeof value === 'string' && value.length > 0;
});

console.log(valid ? '✅ Firebase config OK' : '⚠️ Firebase config partial');

export default firebaseConfig;
