/**
 * Supabase Service
 * Unified Supabase database and storage access for the app.
 */

import { createClient, RealtimeChannel } from '@supabase/supabase-js';
import { menuItems as fallbackMenuItems } from './menu-data';
import { supabaseConfig, validateSupabaseConfig } from './supabase-config';

const SUPABASE_URL = supabaseConfig.url;
const SUPABASE_ANON_KEY = supabaseConfig.anonKey;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
});

export const storageBucketName = process.env.EXPO_PUBLIC_SUPABASE_STORAGE_BUCKET ?? 'chakna-storage';
export const db = supabase;

function handleError(error: any, defaultMessage = 'Supabase request failed') {
  if (error) {
    throw new Error(error.message ?? defaultMessage);
  }
}

function mapFallbackMenuItems() {
  return fallbackMenuItems.map((item) => ({
    id: item.id,
    name: item.name,
    category: item.category,
    price: item.price,
    description: item.description,
    image: '',
    available: item.available ?? true,
    createdAt: new Date().toISOString(),
  }));
}

function normalizeRows<T>(data: T[] | null): T[] {
  return data ?? [];
}

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
  referralCode?: string | null;
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

export interface Review {
  id: string;
  customerId: string;
  customerName: string;
  itemName: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

// ============================================================================
// MENU ITEMS OPERATIONS
// ============================================================================

type MenuSeedItem = Omit<MenuItem, 'id' | 'createdAt'> & { image?: string };

export const menuService = {
  addMenuItem: async (item: Omit<MenuItem, 'id' | 'createdAt'>) => {
    const { data, error } = await supabase
      .from('menu_items')
      .insert({
        ...item,
        available: item.available ?? true,
        createdAt: new Date().toISOString(),
      })
      .select()
      .single();
    handleError(error);
    return (data as MenuItem | null)?.id ?? '';
  },

  getAllMenuItems: async () => {
    try {
      const { data, error } = await supabase.from('menu_items').select('*');
      handleError(error);
      const items = normalizeRows(data as MenuItem[] | null);
      return items.length > 0 ? items : mapFallbackMenuItems();
    } catch (error) {
      console.error('[SupabaseService] getAllMenuItems failed:', error);
      return mapFallbackMenuItems();
    }
  },

  getMenuByCategory: async (category: string) => {
    try {
      const { data, error } = await supabase.from('menu_items').select('*').eq('category', category);
      handleError(error);
      const items = normalizeRows(data as MenuItem[] | null);
      return items.length > 0 ? items : mapFallbackMenuItems().filter((item) => item.category === category);
    } catch (error) {
      console.error('[SupabaseService] getMenuByCategory failed:', error);
      return mapFallbackMenuItems().filter((item) => item.category === category);
    }
  },

  subscribeToMenu: (callback: (items: MenuItem[]) => void) => {
    const channel: RealtimeChannel = supabase
      .channel('realtime-menu-items')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'menu_items' }, async () => {
        const items = await menuService.getAllMenuItems();
        callback(items);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  updateMenuItem: async (id: string, updates: Partial<MenuItem>) => {
    const { error } = await supabase.from('menu_items').update(updates).eq('id', id);
    handleError(error);
  },

  deleteMenuItem: async (id: string) => {
    const { error } = await supabase.from('menu_items').delete().eq('id', id);
    handleError(error);
  },

  getMenuItemById: async (id: string) => {
    const { data, error } = await supabase.from('menu_items').select('*').eq('id', id).maybeSingle();
    handleError(error);
    return data as MenuItem | null;
  },

  seedMenuFromJson: async (items: MenuSeedItem[]) => {
    const seedRows = items.map((item) => ({
      ...item,
      image: item.image ?? '',
      createdAt: new Date().toISOString(),
    }));

    const { error } = await supabase.from('menu_items').upsert(seedRows, { onConflict: 'id' });
    handleError(error);
  },
};

// ============================================================================
// ORDERS OPERATIONS
// ============================================================================

export const orderService = {
  createOrder: async (order: Omit<Order, 'id'>) => {
    const { data, error } = await supabase.from('orders').insert(order).select().single();
    handleError(error);
    return (data as Order | null)?.id ?? '';
  },

  getCustomerOrders: async (customerId: string) => {
    const { data, error } = await supabase.from('orders').select('*').eq('customerId', customerId);
    handleError(error);
    return normalizeRows(data as Order[] | null);
  },

  getAllOrders: async () => {
    const { data, error } = await supabase.from('orders').select('*');
    handleError(error);
    return normalizeRows(data as Order[] | null);
  },

  subscribeToOrders: (customerId: string, callback: (orders: Order[]) => void) => {
    const channel: RealtimeChannel = supabase
      .channel(`realtime-orders-${customerId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders', filter: `customerId=eq.${customerId}` },
        async () => {
          const items = await orderService.getCustomerOrders(customerId);
          callback(items);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  updateOrderStatus: async (orderId: string, status: Order['status']) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
    handleError(error);
  },

  deleteOrder: async (orderId: string) => {
    const { error } = await supabase.from('orders').delete().eq('id', orderId);
    handleError(error);
  },

  getOrderSummary: async () => {
    const orders = await orderService.getAllOrders();
    return {
      totalOrders: orders.length,
      totalRevenue: orders.reduce(
        (sum, order) => sum + (order.totalAmount ?? (order as any).total_price ?? 0),
        0,
      ),
    };
  },
};

// ============================================================================
// USER OPERATIONS
// ============================================================================

export const userService = {
  getCountByRole: async (role: string) => {
    const { count, error } = await supabase
      .from('users')
      .select('id', { count: 'exact', head: true })
      .eq('role', role);

    handleError(error);
    return count ?? 0;
  },

  getActiveVendorCount: async () => {
    return userService.getCountByRole('vendor');
  },

  getCustomerCount: async () => {
    return userService.getCountByRole('customer');
  },

  getAllUsers: async () => {
    const { data, error } = await supabase.from('users').select('*');
    handleError(error);
    return normalizeRows(data as any[] | null);
  },
};

// ============================================================================
// CUSTOMERS OPERATIONS
// ============================================================================

export const customerService = {
  createCustomer: async (customer: Omit<Customer, 'id' | 'createdAt' | 'totalOrders' | 'totalSpent'>) => {
    const { data, error } = await supabase
      .from('customers')
      .insert({
        ...customer,
        referralCode: customer.referralCode ?? null,
        createdAt: new Date().toISOString(),
        totalOrders: 0,
        totalSpent: 0,
      })
      .select()
      .single();
    handleError(error);
    return (data as Customer | null)?.id ?? '';
  },

  getAllCustomers: async () => {
    const { data, error } = await supabase.from('customers').select('*');
    handleError(error);
    return normalizeRows(data as Customer[] | null);
  },
};

// ============================================================================
// VENDOR OPERATIONS
// ============================================================================

export const vendorService = {
  getActiveVendors: async () => {
    const { data, error } = await supabase.from('vendors').select('*').eq('status', 'active');
    handleError(error);
    return normalizeRows(data as Vendor[] | null);
  },

  getAllVendors: async () => {
    const { data, error } = await supabase.from('vendors').select('*');
    handleError(error);
    return normalizeRows(data as Vendor[] | null);
  },

  updateVendorStatus: async (id: string, status: Vendor['status']) => {
    const { error } = await supabase.from('vendors').update({ status }).eq('id', id);
    handleError(error);
  },
};

// ============================================================================
// REVIEW OPERATIONS
// ============================================================================

export const reviewService = {
  getAllReviews: async () => {
    const { data, error } = await supabase.from('reviews').select('*');
    handleError(error);
    return normalizeRows(data as Review[] | null);
  },

  subscribeToReviews: (callback: (reviews: Review[]) => void) => {
    const channel: RealtimeChannel = supabase
      .channel('realtime-reviews')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, async () => {
        const reviews = await reviewService.getAllReviews();
        callback(reviews);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  updateReviewStatus: async (reviewId: string, status: Review['status']) => {
    const { error } = await supabase.from('reviews').update({ status }).eq('id', reviewId);
    handleError(error);
  },
};

export default db;
