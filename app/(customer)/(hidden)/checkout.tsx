/**
 * Checkout Screen
 * Cart summary + payment stub
 */

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useCart } from '@/lib/cart-context';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function CheckoutScreen() {
    const { state, clearCart } = useCart();
    const router = useRouter();

    const handlePayment = () => {
        // Stub - simulate payment
        alert(`Payment successful for ₹${state.totals.total.toFixed(0)}! Order placed.`);
        clearCart();
        router.push('/orders');
    };

    return (
        <ScreenContainer className="flex-1 bg-background">
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-4 py-6">
                <Text className="text-3xl font-bold text-foreground mb-6">Checkout</Text>

                {/* Cart Items Summary */}
                {state.items.length > 0 ? (
                    <View className="bg-surface rounded-2xl p-4 mb-6 border border-border">
                        <Text className="text-lg font-bold mb-4">Order Summary ({state.items.length} items)</Text>
                        {state.items.map((item) => (
                            <View key={item.product.id} className="flex-row justify-between py-2 border-b border-border-last: border-transparent">
                                <Text className="text-foreground">{item.product.name}</Text>
                                <Text className="font-bold">₹{(item.product.price * item.quantity).toFixed(0)}</Text>
                            </View>
                        ))}
                    </View>
                ) : null}

                {/* Totals */}
                <View className="bg-surface rounded-2xl p-6 mb-6 border border-border">
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-lg">Subtotal</Text>
                        <Text>₹{state.totals.subtotal.toFixed(0)}</Text>
                    </View>
                    <View className="flex-row justify-between mb-2">
                        <Text>Tax (5%)</Text>
                        <Text>₹{state.totals.tax.toFixed(0)}</Text>
                    </View>
                    <View className="flex-row justify-between mb-4">
                        <Text className="font-bold text-lg">Delivery</Text>
                        <Text className="font-bold text-lg">₹50</Text>
                    </View>
                    <View className="flex-row justify-between pt-2 border-t border-border">
                        <Text className="text-2xl font-bold">Total</Text>
                        <Text className="text-2xl font-bold text-primary">₹{state.totals.total.toFixed(0)}</Text>
                    </View>
                </View>

                {/* Payment */}
                <TouchableOpacity
                    className="bg-primary rounded-2xl py-5 items-center shadow-2xl active:scale-95 mb-4"
                    onPress={handlePayment}
                    accessibilityRole="button"
                    accessibilityLabel="Pay now"
                >
                    <Text className="text-background font-bold text-xl">Pay ₹{state.totals.total.toFixed(0)} Now</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="border border-border rounded-xl py-4 items-center"
                    onPress={() => router.back()}
                >
                    <Text className="text-foreground font-semibold">Edit Cart</Text>
                </TouchableOpacity>
            </ScrollView>
        </ScreenContainer>
    );
}

