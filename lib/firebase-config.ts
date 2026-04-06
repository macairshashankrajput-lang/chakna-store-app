/**
 * Firebase Configuration
 * Initializes Firebase with environment variables
 */

export const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID || 'thechaknastore',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'thechaknastore.firebaseapp.com',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'thechaknastore.firebasestorage.app',
  webAppId: process.env.FIREBASE_WEB_APP_ID || '1:274624443566:web:9ee8fa8bd5c4f49de1293f',
  androidAppId: process.env.FIREBASE_ANDROID_APP_ID || '1:274624443566:android:f069333c17eb0568e1293f',
  iosAppId: process.env.FIREBASE_IOS_APP_ID || '1:274624443566:ios:14d5a7cb44f49aace1293f',
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
