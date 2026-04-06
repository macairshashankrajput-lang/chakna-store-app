/**
 * Firebase Firestore utils for app data (products/orders etc.)
 * Client-side queries/mutations
 */

import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { Product, Order, Review, TiffinOrder, CateringRequest } from '@/shared/types';

export async function getProducts(): Promise<Product[]> {
    const snapshot = await getDocs(collection(db, 'products'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
}

export async function createProduct(product: Omit<Product, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'products'), product);
    return docRef.id;
}

export async function updateProduct(id: string, product: Partial<Product>) {
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, product);
}

export async function deleteProduct(id: string) {
    await deleteDoc(doc(db, 'products', id));
}

export async function getOrders(userId?: string): Promise<Order[]> {
    let q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    if (userId) {
        q = query(q, where('userId', '==', userId));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
}

export async function updateOrderStatus(id: string, status: Order['status']) {
    const docRef = doc(db, 'orders', id);
    await updateDoc(docRef, { status });
}

// Similar for reviews, tiffin, catering...

export async function getCateringRequests(): Promise<CateringRequest[]> {
    const snapshot = await getDocs(collection(db, 'catering_requests'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CateringRequest));
}

