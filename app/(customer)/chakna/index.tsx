/**
 * Chakna Store Menu
 * Firestore menu listing + cart
 */

import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ScreenContainer } from '@/components/screen-container';
import { useCart } from '@/lib/cart-context';

import { menuService, type MenuItem } from '@/lib/firebase-service';
import type { Product } from '@/lib/cart-context';


export default function ChaknaMenuScreen() {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { addItem } = useCart();

    useEffect(() => {
        const loadMenu = async () => {
            try {
                setLoading(true);
                const items = await menuService.getAllMenuItems();
                setMenuItems(items);
            } catch (err) {
                setError('Failed to load menu');
            } finally {
                setLoading(false);
            }
        };
        loadMenu();

        // Real-time
        const unsubscribe = menuService.subscribeToMenu(setMenuItems);
        return unsubscribe;
    }, []);

    if (loading) {
        return (
            <ScreenContainer className="flex-1 items-center justify-center bg-background">
                <ActivityIndicator size="large" color="#FF6B35" />
            </ScreenContainer>
        );
    }

    const renderItem = ({ item }: { item: MenuItem }) => (
        <TouchableOpacity
            className="bg-surface rounded-2xl p-4 mb-4 shadow-lg border border-border active:opacity-90"
            onPress={() => router.push(`product/${item.id}`)}
        >
            <View className="flex-row items-start gap-4">
                <View className="w-20 h-20 rounded-xl bg-primary/10 items-center justify-center">
                    <IconSymbol name="utensils" color="#FF6B35" size={24} />
                </View>
                <View className="flex-1">
                    <Text className="text-lg font-bold text-foreground mb-1">{item.name}</Text>
                    <Text className="text-sm text-muted mb-2">{item.description}</Text>
                    <Text className="text-xl font-bold text-primary">₹{item.price}</Text>
                </View>
                <TouchableOpacity
                    className="bg-primary rounded-xl px-4 py-2 active:bg-primary/90"
                    onPress={() => addItem({ ...item, vendorId: 'chakna-store' }, 1)}
                >
                    <Text className="text-background font-semibold">Add</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <ScreenContainer className="flex-1 bg-background">
            <View className="px-4 pt-6">
                <Text className="text-3xl font-bold text-foreground mb-4">Chakna Store 🍱</Text>
                <FlatList
                    data={menuItems}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </ScreenContainer>
    );
}

