/**
 * Chakna Cart Screen
 * View cart items, totals, checkout
 */

import { View, Text, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useCart } from '@/lib/cart-context';
import { CartItem, Product } from '@/shared/types';

const mockProducts: Product[] = [
    {
        id: '1',
        name: 'Masala Peanuts',
        price: 49,
        imageUrl: '',
        category: 'snacks',
        available: true,
        vendorId: 'vendor1',
        createdAt: new Date().toISOString(),
        description: '',
    },
    {
        id: '2',
        name: 'Veg Samosa (2 pcs)',
        price: 35,
        imageUrl: '',
        category: 'starters',
        available: true,
        vendorId: 'vendor1',
        createdAt: new Date().toISOString(),
        description: '',
    },
    // add more as needed
];

export default function CartScreen() {
    const router = useRouter();
    const { state, updateQuantity, removeItem, clearCart } = useCart();
    const { items, totals } = state;

    const renderItem = ({ item }: { item: CartItem }) => {
        const product = mockProducts.find(p => p.id === item.productId) || { name: 'Unknown', price: 0 };
        return (
            <View className="bg-surface p-4 rounded-2xl mb-4 border border-border flex-row items-center">
                <View className="w-20 h-20 bg-primary/10 rounded-xl items-center justify-center mr-4">
                    <Text className="text-3xl">🍿</Text>
                </View>
                <View className="flex-1">
                    <Text className="font-bold text-lg">{product.name}</Text>
                    <Text className="text-muted">₹{product.price} x {item.quantity}</Text>
                </View>
                <View className="flex-row items-center">
                    <TouchableOpacity onPress={() => updateQuantity(item.productId, item.quantity - 1)} className="p-2">
                        <Text className="text-xl">-</Text>
                    </TouchableOpacity>
                    <Text className="mx-4 font-bold text-lg">{item.quantity}</Text>
                    <TouchableOpacity onPress={() => updateQuantity(item.productId, item.quantity + 1)} className="p-2">
                        <Text className="text-xl">+</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => removeItem(item.productId)} className="ml-4 p-2">
                        <Text className="text-red-500 text-2xl">×</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const handleCheckout = () => {
        // TODO: Razorpay/payment gateway
        alert(`Checkout: ₹${totals.total.toFixed(2)}\nTODO: Integrate payment & createOrder`);
    };

    if (items.length === 0) {
        return (
            <ScreenContainer className="flex-1 bg-background items-center justify-center p-8">
                <Text className="text-6xl mb-4">🛒</Text>
                <Text className="text-2xl font-bold text-foreground mb-2">Your cart is empty</Text>
                <Text className="text-muted text-center mb-8">Add items from the store to get started</Text>
                <TouchableOpacity
                    className="bg-primary py-4 px-8 rounded-2xl"
                    onPress={() => router.back()}
                >
                    <Text className="text-background font-bold text-lg">Shop Now</Text>
                </TouchableOpacity>
            </ScreenContainer>
        );
    }

    return (
        <ScreenContainer className="flex-1 bg-background">
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-4 py-6">
                <Text className="text-2xl font-bold text-foreground mb-6">My Cart ({items.length} items)</Text>

                <FlatList
                    data={items}
                    renderItem={renderItem}
                    scrollEnabled={false}
                    keyExtractor={(item, index) => item.productId + index}
                />

                {/* Totals */}
                <View className="bg-surface rounded-2xl p-6 mt-6 border border-border">
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-foreground">Subtotal:</Text>
                        <Text className="font-bold">₹{totals.subtotal.toFixed(2)}</Text>
                    </View>
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-foreground">Tax:</Text>
                        <Text className="font-bold">₹{totals.tax.toFixed(2)}</Text>
                    </View>
                    <View className="flex-row justify-between mb-4">
                        <Text className="text-foreground">Delivery:</Text>
                        <Text className="font-bold">₹{totals.delivery.toFixed(2)}</Text>
                    </View>
                    <View className="flex-row justify-between pt-2 border-t border-border">
                        <Text className="text-xl font-bold">Total:</Text>
                        <Text className="text-2xl font-bold text-primary">₹{totals.total.toFixed(2)}</Text>
                    </View>
                </View>

                <TouchableOpacity
                    className="bg-primary py-4 rounded-2xl items-center mt-6 mb-8"
                    onPress={handleCheckout}
                >
                    <Text className="text-2xl font-bold text-background">Proceed to Pay ₹{totals.total.toFixed(2)}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="border border-border py-3 rounded-xl items-center mb-4"
                    onPress={clearCart}
                >
                    <Text className="text-foreground font-semibold">Clear Cart</Text>
                </TouchableOpacity>
            </ScrollView>
        </ScreenContainer>
    );
}

