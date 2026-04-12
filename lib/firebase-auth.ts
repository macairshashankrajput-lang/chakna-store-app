/**
 * Firebase Authentication Helpers
 * Centralized Firebase Auth operations for the app
 */

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { firebaseConfig } from './firebase-config';
import { firebaseApp, db } from './firebase-service';

import type { UserRole, User } from './auth-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const auth = getAuth(firebaseApp);

// Firebase User to App User conversion
function firebaseUserToUser(firebaseUser: FirebaseUser, role: UserRole, phone?: string, referralCode?: string): User {
    return {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        name: firebaseUser.displayName || 'Customer',
        phone: phone || '',
        role,
        referralCode,
        createdAt: new Date().toISOString(),
    };
}

// Check if email is admin
async function isAdmin(email: string): Promise<boolean> {
    console.log('[FirebaseAuth] Checking admin for email:', email);
    const adminEmail = 'xyz@gmail.com';
    const isAdminUser = email === adminEmail;
    console.log('[FirebaseAuth] isAdmin result:', isAdminUser);
    return isAdminUser;
}

// Get or create user profile in Firestore
async function getOrCreateUserProfile(firebaseUser: FirebaseUser, role: UserRole, phone?: string, referralCode?: string): Promise<User> {
    const userRef = doc(db, 'users', firebaseUser.uid);

    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        const data = userSnap.data();
        return {
            id: firebaseUser.uid,
            ...data,
            role: (data as any).role as UserRole
        } as User;
    }

    // Create new profile
    const userData = firebaseUserToUser(firebaseUser, role, phone, referralCode);
    await setDoc(userRef, { ...userData, referralCode: referralCode || null });
    return userData;
}

// Sign up new customer
export async function signUpCustomer(email: string, password: string, name: string, phone: string, referralCode?: string): Promise<User> {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = await getOrCreateUserProfile(userCredential.user, 'customer', phone, referralCode);

        // Validate referral code (simple check)
        if (referralCode) {
            const referralsRef = collection(db, 'referrals');

            const q = query(referralsRef, where('code', '==', referralCode));
            const referralSnap = await getDocs(q);
            if (referralSnap.empty) {
                throw new Error('Invalid referral code');
            }
            // TODO: Apply discount logic
        }

        // Persist token/user
        const token = await userCredential.user.getIdToken();
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));

        return user;
    } catch (error: any) {
        console.error('Sign up error:', error);
        throw new Error(error.message || 'Sign up failed');
    }
}

// Sign in user
export async function signIn(email: string, password: string): Promise<User> {
    console.log('[FirebaseAuth] signIn called:', { email });
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('[FirebaseAuth] Firebase signIn success, user:', userCredential.user.uid);
        const isAdminUser = await isAdmin(email);
        const role: UserRole = isAdminUser ? 'admin' : 'customer';
        const user = await getOrCreateUserProfile(userCredential.user, role);
        console.log('[FirebaseAuth] Profile created, role:', role);

        // Persist token/user
        const token = await userCredential.user.getIdToken();
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));

        console.log('[FirebaseAuth] signIn success');
        return user;
    } catch (error: any) {
        console.error('Sign in error:', error);
        throw new Error(error.message || 'Sign in failed');
    }
}

// Sign out
export async function signOutUser(): Promise<void> {
    await signOut(auth);
    await AsyncStorage.multiRemove(['userToken', 'user']);
}

// Auth state listener (for context)
export function onAuthStateChangedListener(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
            const isAdminUser = await isAdmin(firebaseUser.email!);
            const role: UserRole = isAdminUser ? 'admin' : 'customer';
            const user = await getOrCreateUserProfile(firebaseUser, role);
            callback(user);
        } else {
            callback(null);
        }
    });
}

// Get current auth user
export async function getCurrentUser(): Promise<User | null> {
    const user = auth.currentUser;
    if (!user) return null;

    const isAdminUser = await isAdmin(user.email!);
    const role: UserRole = isAdminUser ? 'admin' : 'customer';
    return getOrCreateUserProfile(user, role);
}

