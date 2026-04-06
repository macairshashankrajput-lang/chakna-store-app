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

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'cooking' | 'out-for-delivery' | 'delivered' | 'cancelled';

export interface Order {
    id: string;
    items: CartItem[];
    total: number;
    status: OrderStatus;
    deliveryAddress: string;
    paymentId?: string;
    userId: string;
    vendorId?: string;
    createdAt: string;
}

export interface Review {
    id: string;
    userId: string;
    productId?: string;
    orderId?: string;
    rating: number; // 1-5
    comment?: string;
    createdAt: string;
}

export type TiffinStatus = 'pending' | 'cancelled' | 'delivered' | 'updated' | 'not-received';

export interface TiffinOrder {
    id: string;
    userId: string;
    vendorId: string;
    date: string; // YYYY-MM-DD
    menu: string; // JSON or string
    status: TiffinStatus;
    pointsUsed: number;
    notes?: string;
    createdAt: string;
}

export type CateringStatus = 'confirmed' | 'cancelled' | 'in-progress' | 'completed';

export type MenuType = 'veg' | 'non-veg' | 'both';

export interface CateringRequest {
    id: string;
    userId: string;
    eventDate: string;
    guestCount: number;
    menuType: MenuType | 'alcohol';
    notes?: string;
    status: CateringStatus;
    createdAt: string;
}

export interface UserLocation {
    latitude: number;
    longitude: number;
    address: string;
}

