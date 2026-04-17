import { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Image, TextInput, Switch } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useAuth } from '@/lib/auth-context';
import { menuService } from '@/lib/supabase-service';

export default function VendorMenuScreen() {
    const { state } = useAuth();
    const vendorId = state.user?.id;
    const [menuItems, setMenuItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchMenu = useCallback(async () => {
        if (!vendorId) return;
        try {
            const data = await menuService.getVendorMenu(vendorId);
            setMenuItems(data);
        } catch (error) {
            console.error('Failed to fetch menu:', error);
        } finally {
            setIsLoading(false);
        }
    }, [vendorId]);

    useEffect(() => {
        fetchMenu();
    }, [fetchMenu]);

    const handleToggleAvailability = async (itemId: string | number, currentStatus: boolean) => {
        try {
            await menuService.updateMenuItem(itemId, { available: !currentStatus });
            setMenuItems(items => items.map(item => item.id === itemId ? { ...item, available: !currentStatus } : item));
        } catch (error) {
            Alert.alert('Error', 'Failed to update item status');
        }
    };

    if (isLoading) {
        return (
            <ScreenContainer className="flex-1 items-center justify-center bg-background">
                <ActivityIndicator size="large" color="#E25C3D" />
            </ScreenContainer>
        );
    }

    return (
        <ScreenContainer className="flex-1 bg-background">
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
                <View className="px-4 py-6">
                    <View className="flex-row justify-between items-center mb-6">
                        <View>
                            <Text className="text-3xl font-bold text-foreground">Menu</Text>
                            <Text className="text-muted text-sm">Manage your shop items</Text>
                        </View>
                        <TouchableOpacity 
                            className="bg-primary px-4 py-2 rounded-lg"
                            onPress={() => Alert.alert('Add Item', 'Add item functionality coming soon')}
                        >
                            <Text className="text-white font-bold">+ Add Item</Text>
                        </TouchableOpacity>
                    </View>

                    {menuItems.length === 0 ? (
                        <View className="items-center py-20">
                            <Text className="text-6xl mb-4">🍲</Text>
                            <Text className="text-xl font-bold text-foreground mb-2">No items in menu</Text>
                            <Text className="text-muted text-center px-10">Add items to start selling on Chakna Store.</Text>
                        </View>
                    ) : (
                        menuItems.map(item => (
                            <View key={item.id} className="bg-surface rounded-2xl p-4 mb-4 border border-border flex-row gap-4">
                                <View className="w-20 h-20 bg-muted rounded-xl overflow-hidden">
                                    {item.image ? (
                                        <Image source={{ uri: item.image }} className="w-full h-full" />
                                    ) : (
                                        <View className="w-full h-full items-center justify-center bg-primary/10">
                                            <Text className="text-2xl">🍽️</Text>
                                        </View>
                                    )}
                                </View>
                                <View className="flex-1">
                                    <View className="flex-row justify-between items-start">
                                        <View className="flex-1">
                                            <Text className="text-lg font-bold text-foreground">{item.name}</Text>
                                            <Text className="text-sm text-primary font-bold">₹{item.price}</Text>
                                        </View>
                                        <Switch
                                            value={item.available}
                                            onValueChange={() => handleToggleAvailability(item.id, item.available)}
                                            trackColor={{ false: '#767577', true: '#E25C3D' }}
                                        />
                                    </View>
                                    <Text className="text-xs text-muted mt-1" numberOfLines={2}>{item.description}</Text>
                                </View>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>
        </ScreenContainer>
    );
}
