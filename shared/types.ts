/**
 * Unified type exports
 * Import shared types from this single entry point.
 */

export type * from "../drizzle/schema";
export * from "./_core/errors";

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
    available: boolean;
    vendorId: string;
    createdAt: string;
}

export interface CartItem {
    productId: string;
    quantity: number;
    price: number;
    addedAt: string;
}

export interface Order {
    id: string;
    items: CartItem[];
    total: number;
    status: 'pending' | 'confirmed' | 'preparing' | 'out-for-delivery' | 'delivered' | 'cancelled';
    deliveryAddress: string;
    paymentId?: string;
    userId: string;
    createdAt: string;
}
