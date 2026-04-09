/**
 * Firebase Firestore Service
 * Organized collections and real-time data management
 */

import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  onSnapshot,
  QueryConstraint,
} from 'firebase/firestore';

// Firebase configuration from your credentials
const firebaseConfig = {
  apiKey: 'AIzaSyDummyKey', // Replace with actual key
  authDomain: 'thechaknastore.firebaseapp.com',
  projectId: 'thechaknastore',
  storageBucket: 'thechaknastore.firebasestorage.app',
  messagingSenderId: '274624443566',
  appId: '1:274624443566:web:9ee8fa8bd5c4f49de1293f',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ============================================================================
// COLLECTION TYPES
// ============================================================================

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  available: boolean;
  createdAt: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  items: { itemId: string; name: string; quantity: number; price: number }[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  deliveryAddress: string;
  orderDate: string;
  deliveryDate?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  referralCode?: string;
  createdAt: string;
  totalOrders: number;
  totalSpent: number;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  businessType: 'chakna' | 'catering' | 'tiffin';
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
}

export interface CateringRequest {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  eventName: string;
  eventDate: string;
  guestCount: number;
  budget: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  submittedDate: string;
}

export interface TiffinSubscription {
  id: string;
  customerId: string;
  planType: 'breakfast' | 'lunch' | 'breakfast+lunch' | 'premium';
  menuItems: string[];
  startDate: string;
  endDate?: string;
  status: 'active' | 'paused' | 'cancelled';
  createdAt: string;
}

// ============================================================================
// MENU ITEMS OPERATIONS
// ============================================================================

export const menuService = {
  // Add new menu item
  addMenuItem: async (item: Omit<MenuItem, 'id' | 'createdAt'>) => {
    const docRef = await addDoc(collection(db, 'menu_items'), {
      ...item,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  },

  // Get all menu items
  getAllMenuItems: async () => {
    const querySnapshot = await getDocs(collection(db, 'menu_items'));
    return querySnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as MenuItem));
  },

  // Get menu items by category
  getMenuByCategory: async (category: string) => {
    const q = query(collection(db, 'menu_items'), where('category', '==', category));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as MenuItem));
  },

  // Real-time menu listener
  subscribeToMenu: (callback: (items: MenuItem[]) => void) => {
    return onSnapshot(collection(db, 'menu_items'), (snapshot: any) => {
      const items = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as MenuItem));
      callback(items);
    });
  },

  // Update menu item
  updateMenuItem: async (id: string, updates: Partial<MenuItem>) => {
    await updateDoc(doc(db, 'menu_items', id), updates);
  },

  // Delete menu item
  deleteMenuItem: async (id: string) => {
    await deleteDoc(doc(db, 'menu_items', id));
  },
};

// ============================================================================
// ORDERS OPERATIONS
// ============================================================================

export const orderService = {
  // Create new order
  createOrder: async (order: Omit<Order, 'id'>) => {
    const docRef = await addDoc(collection(db, 'orders'), order);
    return docRef.id;
  },

  // Get customer orders
  getCustomerOrders: async (customerId: string) => {
    const q = query(collection(db, 'orders'), where('customerId', '==', customerId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Order));
  },

  // Get all orders (admin)
  getAllOrders: async () => {
    const querySnapshot = await getDocs(collection(db, 'orders'));
    return querySnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Order));
  },

  // Real-time orders listener
  subscribeToOrders: (customerId: string, callback: (orders: Order[]) => void) => {
    const q = query(collection(db, 'orders'), where('customerId', '==', customerId));
    return onSnapshot(q, (snapshot: any) => {
      const orders = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Order));
      callback(orders);
    });
  },

  // Update order status
  updateOrderStatus: async (orderId: string, status: Order['status']) => {
    await updateDoc(doc(db, 'orders', orderId), { status });
  },

  // Delete order
  deleteOrder: async (orderId: string) => {
    await deleteDoc(doc(db, 'orders', orderId));
  },
};

// ============================================================================
// CUSTOMERS OPERATIONS
// ============================================================================

export const customerService = {
  // Create customer profile
  createCustomer: async (customer: Omit<Customer, 'id' | 'createdAt' | 'totalOrders' | 'totalSpent'>) => {
    const docRef = await addDoc(collection(db, 'customers'), {
      ...customer,
      createdAt: new Date().toISOString(),
      totalOrders: 0,
      totalSpent: 0,
    });
    return docRef.id;
  },

  // Get customer by email
  getCustomerByEmail: async (email: string) => {
    const q = query(collection(db, 'customers'), where('email', '==', email));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.length > 0 ? ({ id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as Customer) : null;
  },

  // Update customer profile
  updateCustomer: async (customerId: string, updates: Partial<Customer>) => {
    await updateDoc(doc(db, 'customers', customerId), updates);
  },
};

// ============================================================================
// CATERING REQUESTS OPERATIONS
// ============================================================================

export const cateringService = {
  // Create catering request
  createRequest: async (request: Omit<CateringRequest, 'id'>) => {
    const docRef = await addDoc(collection(db, 'catering_requests'), request);
    return docRef.id;
  },

  // Get all catering requests (admin)
  getAllRequests: async () => {
    const querySnapshot = await getDocs(collection(db, 'catering_requests'));
    return querySnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as CateringRequest));
  },

  // Get customer catering requests
  getCustomerRequests: async (customerId: string) => {
    const q = query(collection(db, 'catering_requests'), where('customerId', '==', customerId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as CateringRequest));
  },

  // Update request status
  updateRequestStatus: async (requestId: string, status: CateringRequest['status']) => {
    await updateDoc(doc(db, 'catering_requests', requestId), { status });
  },
};

// ============================================================================
// TIFFIN SUBSCRIPTIONS OPERATIONS
// ============================================================================

export const tiffinService = {
  // Create subscription
  createSubscription: async (subscription: Omit<TiffinSubscription, 'id'>) => {
    const docRef = await addDoc(collection(db, 'tiffin_subscriptions'), subscription);
    return docRef.id;
  },

  // Get customer subscriptions
  getCustomerSubscriptions: async (customerId: string) => {
    const q = query(collection(db, 'tiffin_subscriptions'), where('customerId', '==', customerId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as TiffinSubscription));
  },

  // Update subscription status
  updateSubscriptionStatus: async (subscriptionId: string, status: TiffinSubscription['status']) => {
    await updateDoc(doc(db, 'tiffin_subscriptions', subscriptionId), { status });
  },
};

// ============================================================================
// VENDORS OPERATIONS
// ============================================================================

export const vendorService = {
  // Create vendor
  createVendor: async (vendor: Omit<Vendor, 'id' | 'createdAt'>) => {
    const docRef = await addDoc(collection(db, 'vendors'), {
      ...vendor,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  },

  // Get all vendors
  getAllVendors: async () => {
    const querySnapshot = await getDocs(collection(db, 'vendors'));
   return querySnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Customer));  },

  // Get active vendors
  getActiveVendors: async () => {
    const q = query(collection(db, 'vendors'), where('status', '==', 'active'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Vendor));
  },

  // Update vendor status
  updateVendorStatus: async (vendorId: string, status: Vendor['status']) => {
    await updateDoc(doc(db, 'vendors', vendorId), { status });
  },
};

export default db;
