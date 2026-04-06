/**
 * Firebase services for Firebase JS SDK (Expo Go compatible)
 * Uses modular v9+ SDK - works on web, iOS, Android (Expo Go)
 * For production native builds, switch back to @react-native-firebase/*
 */

import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { firebaseConfig } from './firebase-config';

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);  // Renamed from firestore to db (modular convention)

// Optional: Connect to local emulators in development
if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
    try {
        connectAuthEmulator(auth, 'http://localhost:9099');
        connectFirestoreEmulator(db, 'localhost', 8080);
        console.log('🔥 Connected to Firebase emulators');
    } catch (e) {
        console.log('ℹ️ Firebase emulators not running - using production');
    }
}

export * from './firebase-config';
