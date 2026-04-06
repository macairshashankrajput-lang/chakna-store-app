/**
 * Chakna Store Product Listing
 * Browse and add chakna items to cart
 */

import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { Product } from '@/shared/types';
import { useColors } from '@/hooks/use-colors';

const mockProducts: Product[] = [
    {
        id: '1',
        name: 'Masala Peanuts',
        description: 'Spicy roasted peanuts with traditional Indian masala',
        price: 49,
        imageUrl: '',
        category: 'snacks',
        available: true,
        vendorId: 'vendor1',
        createdAt: new Date().toISOString(),
    },
    {
        id: '2',
        name: 'Veg Samosa (2 pcs)',
        description: 'Crispy samosas filled with spiced potatoes and peas',
        price: 35,
        imageUrl: '',
        category: 'starters',
        available: true,
        vendorId: 'vendor1',
        createdAt: new Date().toISOString(),
    },
    {
        id: '3',
        name: 'Chicken Pakora',
        description: 'Juicy chicken pieces marinated and fried to perfection',
        price: 89,
        imageUrl: '',
        category: 'non-veg',
        available: true,
        vendorId: 'vendor1',
        createdAt: new Date().toISOString(),
    },
    {
        id: '4',
        name: 'Paneer Tikka',
        description: 'Smoky marinated paneer cubes grilled with bell peppers',
        price: 119,
        imageUrl: '',
        category: 'vegetarian',
        available: true,
        vendorId: 'vendor1',
        createdAt: new Date().toISOString(),
    },
    {
        id: '5',
        name: 'Bhajiya Platter',
        description: 'Mix platter with onion, mirchi, potato bhajiyas',
        price: 65,
        imageUrl: '',
        category: 'snacks',
        available: true,
        vendorId: 'vendor1',
        createdAt: new Date().toISOString(),
    },
    {
        id: '6',
        name: 'Chilli Chicken Dry',
        description: 'Indo-Chinese style crispy chilli chicken',
        price: 129,
        imageUrl: '',
        category: 'non-veg',
        available: true,
        vendorId: 'vendor1',
        createdAt: new Date().toISOString(),
    },
];

const categories = ['All', 'Snacks', 'Starters', 'Non-Veg', 'Vegetarian'];

export default function ChaknaStoreScreen() {
    const router = useRouter();
    const colors = useColors();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const filteredProducts = mockProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || product.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory.toLowerCase();
        return matchesSearch && matchesCategory && product.available;
    });

    const renderProduct = ({ item }: { item: Product }) => (
        <TouchableOpacity
            className="flex-1 bg-surface rounded-2xl p-4 m-2 border border-border active:opacity-70"
            onPress={() => router.push({ pathname: '(customer)/chakna/product/[id]', params: { id: item.id } })}
        >
            <View className="aspect-square rounded-xl bg-primary/10 items-center justify-center mb-3 overflow-hidden">
                <Text className="text-5xl">🍿</Text>
            </View>
            <View>
                <Text className="font-bold text-lg text-foreground mb-1">{item.name}</Text>
                <Text className="text-muted text-sm mb-3">{item.description}</Text>
                <View className="flex-row items-center justify-between">
                    <Text className="text-xl font-bold text-primary">₹{item.price}</Text>
                    <TouchableOpacity className="bg-primary px-5 py-2 rounded-lg">
                        <Text className="text-background font-semibold text-sm">Add to Cart</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <ScreenContainer className="flex-1 bg-background">
            <View className="px-4 pt-4 pb-6">
                <Text className="text-2xl font-bold text-foreground mb-4">Chakna Store</Text>

                {/* Search */}
                <TextInput
                    className="bg-surface p-4 rounded-2xl mb-6 border border-border"
                    placeholder="Search chakna items..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />

                {/* Categories */}
                <FlatList
                    data={categories}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="mb-6"
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            className={`px-4 py-2 rounded-full mx-1 border ${selectedCategory === item ? 'bg-primary border-primary' : 'border-border'
                                }`}
                            onPress={() => setSelectedCategory(item)}
                        >
                            <Text className={`font-semibold ${selectedCategory === item ? 'text-background' : 'text-foreground'
                                }`}>
                                {item}
                            </Text>
                        </TouchableOpacity>
                    )}
                />

                {/* Products */}
                <FlatList
                    data={filteredProducts}
                    renderItem={renderProduct}
                    numColumns={2}
                    columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 20 }}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </ScreenContainer>
    );
}

