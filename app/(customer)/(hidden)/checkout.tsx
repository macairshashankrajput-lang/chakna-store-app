/**
 * Checkout Screen
 * Cart summary + payment flow with real order creation
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useCart } from '@/lib/cart-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase-service';

export default function CheckoutScreen() {
    const { state, clearCart } = useCart();
    const { state: authState } = useAuth();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayment = async () => {
        if (!authState.user?.id) {
            Alert.alert('Error', 'Please log in to place an order.');
            return;
        }
        if (state.items.length === 0) return;

        setIsProcessing(true);
        try {
            const vendorId = state.items[0].product.vendorId || null;

            // Step 1: Create the order record
            const { data: newOrder, error: orderError } = await supabase
                .from('orders')
                .insert({
                    user_id: authState.user.id,
                    vendor_id: vendorId,
                    type: 'chakna',
                    total_price: Math.round(state.totals.total),
                    status: 'pending',
                    payment_status: 'pending',
                })
                .select()
                .single();

            if (orderError) throw orderError;

            // Step 2: For each cart item, try to find the real menu ID from DB
            // If not found (string IDs like CHK001), store with menu_id = null and use notes
            const orderItems = await Promise.all(
                state.items.map(async (item) => {
                    // Try to find the menu item by name in the DB to get numeric ID
                    const { data: menuRow } = await supabase
                        .from('menu')
                        .select('id')
                        .eq('name', item.product.name)
                        .maybeSingle();

                    return {
                        order_id: newOrder.id,
                        menu_id: menuRow?.id ?? null,        // null if not found in DB
                        quantity: item.quantity,
                        price: item.product.price,
                        notes: menuRow ? null : item.product.name, // store name if no DB match
                    };
                })
            );

            // Step 3: Insert order items (allow null menu_id for fallback)
            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems);

            if (itemsError) {
                // If notes column doesn't exist, retry without it
                const minimalItems = orderItems.map(({ notes, ...rest }) => rest);
                const { error: retryError } = await supabase.from('order_items').insert(minimalItems);
                if (retryError) throw retryError;
            }

            clearCart();
            Alert.alert(
                '🎉 Order Placed!',
                `Order #${newOrder.id} placed for ₹${Math.round(state.totals.total)}. We'll start preparing it shortly!`,
                [{ text: 'Track Order', onPress: () => router.push(`/(customer)/order/${newOrder.id}`) }]
            );
        } catch (error: any) {
            console.error('Order creation failed:', error);
            Alert.alert('Order Failed', error.message || 'Unable to place order. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ScreenContainer className="flex-1 bg-background">
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
                <View className="px-4 py-6">
                    {/* Header */}
                    <View className="flex-row items-center mb-6">
                        <TouchableOpacity onPress={() => router.back()} className="mr-3">
                            <Text className="text-2xl">←</Text>
                        </TouchableOpacity>
                        <Text className="text-3xl font-bold text-foreground">Checkout</Text>
                    </View>

                    {/* Cart Items Summary */}
                    {state.items.length > 0 ? (
                        <View className="bg-surface rounded-2xl p-5 mb-5 border border-border">
                            <Text className="text-lg font-bold text-foreground mb-4">
                                Order Summary ({state.items.length} item{state.items.length > 1 ? 's' : ''})
                            </Text>
                            {state.items.map((item) => (
                                <View
                                    key={item.product.id}
                                    className="flex-row justify-between items-center py-2 border-b border-border"
                                >
                                    <View className="flex-1 mr-3">
                                        <Text className="text-foreground font-semibold">{item.product.name}</Text>
                                        <Text className="text-muted text-xs">Qty: {item.quantity}</Text>
                                    </View>
                                    <Text className="font-bold text-foreground">
                                        ₹{(item.product.price * item.quantity).toFixed(0)}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View className="items-center py-10">
                            <Text className="text-muted">Your cart is empty</Text>
                        </View>
                    )}

                    {/* Delivery Address */}
                    <View className="bg-surface rounded-2xl p-5 mb-5 border border-border">
                        <Text className="text-sm font-bold text-muted uppercase tracking-wider mb-2">
                            📍 Delivery Address
                        </Text>
                        <Text className="text-foreground">
                            {authState.user?.deliveryLocation?.address || 'No address saved — using default delivery location'}
                        </Text>
                    </View>

                    {/* Price Breakdown */}
                    <View className="bg-surface rounded-2xl p-5 mb-6 border border-border">
                        <Text className="text-lg font-bold text-foreground mb-4">Price Breakdown</Text>
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-muted">Subtotal</Text>
                            <Text className="text-foreground">₹{state.totals.subtotal.toFixed(0)}</Text>
                        </View>
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-muted">Tax (5%)</Text>
                            <Text className="text-foreground">₹{state.totals.tax.toFixed(0)}</Text>
                        </View>
                        <View className="flex-row justify-between mb-4">
                            <Text className="text-muted">Delivery</Text>
                            <Text className="text-foreground">₹{state.totals.delivery.toFixed(0)}</Text>
                        </View>
                        <View className="flex-row justify-between pt-3 border-t border-border">
                            <Text className="text-xl font-bold text-foreground">Total</Text>
                            <Text className="text-2xl font-bold text-primary">₹{state.totals.total.toFixed(0)}</Text>
                        </View>
                    </View>

                    {/* Payment Button */}
                    <TouchableOpacity
                        className="bg-primary rounded-2xl py-5 items-center shadow-lg mb-4"
                        onPress={handlePayment}
                        disabled={isProcessing || state.items.length === 0}
                        style={{ opacity: (isProcessing || state.items.length === 0) ? 0.6 : 1 }}
                        accessibilityRole="button"
                        accessibilityLabel="Confirm and pay"
                    >
                        {isProcessing ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white font-bold text-xl">
                                Confirm & Pay ₹{state.totals.total.toFixed(0)}
                            </Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="border border-border rounded-xl py-4 items-center"
                        onPress={() => router.back()}
                    >
                        <Text className="text-foreground font-semibold">Edit Cart</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </ScreenContainer>
    );
}
