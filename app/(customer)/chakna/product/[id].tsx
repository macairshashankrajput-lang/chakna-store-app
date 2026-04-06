/**
 * Product Detail Screen
 */

import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { Product } from '@/shared/types';
import { useCart } from '@/lib/cart-context';


// TODO: trpc.products.getById(id)
const mockProducts: Product[] = [
    {
        id: '1',
        name: 'Masala Peanuts',
        description: 'Spicy roasted peanuts with traditional Indian masala flavoring. Perfect snack for movie nights or evening munchies.',
        price: 49,
        imageUrl: '',
        category: 'snacks',
        available: true,
        vendorId: 'vendor1',
        createdAt: new Date().toISOString(),
    },
    // ... other products
];

export default function ProductDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { addItem } = useCart();
    const product = mockProducts.find(p => p.id === (id as string)) || mockProducts[0];


    return (
        <ScreenContainer className="flex-1">
            <ScrollView className="flex-1">
                <View className="aspect-square bg-muted items-center justify-center rounded-b-2xl">
                    <Text className="text-8xl">🍿</Text>
                </View>
                <View className="px-4 py-6 space-y-4">
                    <View className="flex-row items-center justify-between">
                        <Text className="text-2xl font-bold">₹{mockProductDetail.price}</Text>
                        <View className="flex-row items-center gap-1">
                            <Text className="text-yellow-400">⭐</Text>
                            <Text>{mockProductDetail.rating}</Text>
                            <Text className="text-muted">({mockProductDetail.reviews} reviews)</Text>
                        </View>
                    </View>
                    <Text className="text-2xl font-bold">{mockProductDetail.name}</Text>
                    <Text className="text-muted leading-relaxed">{mockProductDetail.description}</Text>

                    <View>
                        <Text className="font-bold mb-2">Ingredients:</Text>
                        <View className="flex-row flex-wrap gap-2">
                            {mockProductDetail.ingredients.map((ing, index) => (
                                <View key={index} className="bg-primary/10 px-3 py-1 rounded-full">
                                    <Text className="text-primary font-semibold text-sm">{ing}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    <TouchableOpacity
                        className="bg-primary py-4 rounded-2xl items-center active:opacity-90"
                        onPress={() => addItem(product, 1)}
                    >
                        <Text className="text-2xl font-bold text-background">Add to Cart</Text>
                    </TouchableOpacity>


                    <TouchableOpacity
                        className="py-4 items-center border border-border rounded-2xl"
                        onPress={() => router.back()}
                    >
                        <Text className="font-semibold text-foreground">← Back to Store</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </ScreenContainer>
    );
}

