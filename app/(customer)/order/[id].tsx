import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useCart, type Product } from '@/lib/cart-context';

interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
}

interface OrderDetail {
    id: string;
    number: string;
    status: 'Delivered' | 'Out for delivery' | 'Preparing';
    date: string;
    total: number;
    subtotal: number;
    tax: number;
    deliveryFee: number;
    paymentMethod: string;
    deliveryAddress: string;
    vendor: string;
    items: OrderItem[];
    note: string;
}

const orderHistory: OrderDetail[] = [
    {
        id: '1',
        number: '#ORD-123',
        status: 'Delivered',
        date: '2024-10-20',
        subtotal: 380,
        tax: 19,
        deliveryFee: 50,
        total: 449,
        paymentMethod: 'Credit Card',
        deliveryAddress: '123 Biryani Street, City Center',
        vendor: 'Chakna Central',
        note: 'Leave at the doorstep. Call on arrival.',
        items: [
            { id: 'a', name: 'Butter Chicken', quantity: 1, price: 250 },
            { id: 'b', name: 'Garlic Naan', quantity: 2, price: 60 },
            { id: 'c', name: 'Jeera Rice', quantity: 1, price: 70 },
        ],
    },
    {
        id: '2',
        number: '#ORD-122',
        status: 'Out for delivery',
        date: '2024-10-19',
        subtotal: 280,
        tax: 14,
        deliveryFee: 50,
        total: 344,
        paymentMethod: 'UPI',
        deliveryAddress: 'Flat 4B, Sunrise Apartments',
        vendor: 'Street Food Hub',
        note: 'Please call when you arrive.',
        items: [
            { id: 'd', name: 'Pav Bhaji', quantity: 1, price: 180 },
            { id: 'e', name: 'Masala Soda', quantity: 2, price: 50 },
        ],
    },
    {
        id: '3',
        number: '#ORD-121',
        status: 'Preparing',
        date: '2024-10-18',
        subtotal: 520,
        tax: 26,
        deliveryFee: 50,
        total: 596,
        paymentMethod: 'Wallet',
        deliveryAddress: '230 Market Lane',
        vendor: 'Chakna Central',
        note: 'Extra spicy, please.',
        items: [
            { id: 'f', name: 'Paneer Tikka', quantity: 2, price: 220 },
            { id: 'g', name: 'Mint Chutney', quantity: 1, price: 20 },
        ],
    },
];

export default function OrderDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { addItem } = useCart();
    const order = orderHistory.find((item) => item.id === id);

    const handleOrderAgain = () => {
        if (!order) {
            return;
        }

        order.items.forEach((item) => {
            const product: Product = {
                id: item.id,
                name: item.name,
                description: 'Reordered item from your previous order',
                price: item.price,
                category: 'Reorder',
                available: true,
                vendorId: 'chakna-store',
                createdAt: new Date().toISOString(),
            };
            addItem(product, item.quantity);
        });

        router.push('/cart');
    };

    if (!order) {
        return (
            <ScreenContainer className="flex-1 bg-background items-center justify-center px-4">
                <Text className="text-2xl font-bold text-foreground mb-3">Order not found</Text>
                <Text className="text-muted text-center mb-6">This order may no longer be available or the link is invalid.</Text>
                <TouchableOpacity className="bg-primary rounded-3xl py-4 px-6" onPress={() => router.push('/orders')}>
                    <Text className="text-background font-bold">Back to Orders</Text>
                </TouchableOpacity>
            </ScreenContainer>
        );
    }

    return (
        <ScreenContainer className="flex-1 bg-background">
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
                <View className="px-4 py-6">
                    <View className="flex-row items-center justify-between mb-6">
                        <TouchableOpacity onPress={() => router.back()}>
                            <Text className="text-2xl">←</Text>
                        </TouchableOpacity>
                        <Text className="text-xl font-bold text-foreground">Order Details</Text>
                        <View className="w-10" />
                    </View>

                    <View className="bg-surface rounded-3xl border border-border p-5 mb-6">
                        <Text className="text-2xl font-bold text-foreground mb-2">{order.number}</Text>
                        <Text className="text-sm text-muted mb-4">Placed on {order.date}</Text>
                        <View className="bg-primary/10 rounded-3xl p-4 mb-4">
                            <Text className="text-primary font-semibold mb-1">{order.status}</Text>
                            <Text className="text-sm text-muted">Your order is currently {order.status.toLowerCase()}.</Text>
                        </View>

                        <View className="mb-4">
                            <Text className="text-base font-semibold text-foreground mb-2">Vendor</Text>
                            <Text className="text-foreground">{order.vendor}</Text>
                        </View>

                        <View className="mb-4">
                            <Text className="text-base font-semibold text-foreground mb-2">Delivery Address</Text>
                            <Text className="text-foreground">{order.deliveryAddress}</Text>
                        </View>

                        <View>
                            <Text className="text-base font-semibold text-foreground mb-3">Order items</Text>
                            {order.items.map((item) => (
                                <View key={item.id} className="flex-row justify-between items-center py-3 border-b border-border last:border-b-0">
                                    <View className="flex-1 pr-3">
                                        <Text className="text-foreground font-semibold">{item.name}</Text>
                                        <Text className="text-muted text-sm">Qty {item.quantity}</Text>
                                    </View>
                                    <Text className="font-bold">₹{item.price * item.quantity}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View className="bg-surface rounded-3xl border border-border p-5 mb-6">
                        <Text className="text-base font-semibold text-foreground mb-3">Payment</Text>
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-muted">Subtotal</Text>
                            <Text>₹{order.subtotal.toFixed(0)}</Text>
                        </View>
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-muted">Tax</Text>
                            <Text>₹{order.tax.toFixed(0)}</Text>
                        </View>
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-muted">Delivery fee</Text>
                            <Text>₹{order.deliveryFee.toFixed(0)}</Text>
                        </View>
                        <View className="flex-row justify-between pt-3 border-t border-border mt-3">
                            <Text className="font-semibold text-foreground">Total paid</Text>
                            <Text className="font-semibold text-primary">₹{order.total.toFixed(0)}</Text>
                        </View>
                        <View className="mt-4">
                            <Text className="text-muted text-sm">Paid with {order.paymentMethod}</Text>
                        </View>
                    </View>

                    <View className="bg-surface rounded-3xl border border-border p-5 mb-6">
                        <Text className="text-base font-semibold text-foreground mb-3">Order Notes</Text>
                        <Text className="text-muted">{order.note}</Text>
                    </View>

                    <TouchableOpacity
                        className="bg-primary rounded-3xl py-4 items-center mb-4"
                        onPress={handleOrderAgain}
                    >
                        <Text className="text-background font-bold">Order Again</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="border border-border rounded-3xl py-4 items-center"
                        onPress={() => router.push('/orders')}
                    >
                        <Text className="text-foreground font-semibold">Back to Orders</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </ScreenContainer>
    );
}
