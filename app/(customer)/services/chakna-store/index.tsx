/**
 * Chakna Store - Store Listing Screen
 * Browse and search food stores
 */

import { View, Text, TextInput, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useState } from 'react';

interface Store {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  deliveryTime: string;
  deliveryFee: string;
  distance: string;
  cuisine: string;
  isOpen: boolean;
}

const mockStores: Store[] = [
  {
    id: '1',
    name: 'Spicy Bites',
    rating: 4.5,
    reviews: 234,
    deliveryTime: '30-40 min',
    deliveryFee: 'Free',
    distance: '2.5 km',
    cuisine: 'Indian, Chinese',
    isOpen: true,
  },
  {
    id: '2',
    name: 'Fresh Eats',
    rating: 4.8,
    reviews: 456,
    deliveryTime: '25-35 min',
    deliveryFee: 'Rs 20',
    distance: '1.8 km',
    cuisine: 'Healthy, Vegan',
    isOpen: true,
  },
  {
    id: '3',
    name: 'Street Food Junction',
    rating: 4.2,
    reviews: 189,
    deliveryTime: '20-30 min',
    deliveryFee: 'Free',
    distance: '3.2 km',
    cuisine: 'Street Food, Snacks',
    isOpen: false,
  },
];

export default function ChaknaStoreListingScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const handleStorePress = (storeId: string) => {
    router.push(`./store/${storeId}`);
  };

  return (
    <ScreenContainer className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6">
          {/* Header */}
          <View className="mb-6">
            <Text className="text-3xl font-bold text-foreground mb-2">Chakna Store</Text>
            <Text className="text-muted text-sm">Order fresh snacks and food</Text>
          </View>

          {/* Search Bar */}
          <View className="mb-4">
            <TextInput
              className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholder="Search stores or dishes..."
              placeholderTextColor="#687076"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Filters */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-6 -mx-4 px-4"
          >
            {['All', 'Open Now', 'Free Delivery', 'Rating 4+'].map(filter => (
              <TouchableOpacity
                key={filter}
                className={`px-4 py-2 rounded-full mr-2 border ${
                  selectedFilter === filter.toLowerCase()
                    ? 'bg-primary border-primary'
                    : 'bg-surface border-border'
                }`}
                onPress={() => setSelectedFilter(filter.toLowerCase())}
              >
                <Text
                  className={`font-semibold text-sm ${
                    selectedFilter === filter.toLowerCase()
                      ? 'text-background'
                      : 'text-foreground'
                  }`}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Stores List */}
          <View className="gap-4">
            {mockStores.map(store => (
              <TouchableOpacity
                key={store.id}
                className="bg-surface rounded-2xl overflow-hidden border border-border active:opacity-70"
                onPress={() => handleStorePress(store.id)}
              >
                {/* Store Image Placeholder */}
                <View className="w-full h-40 bg-primary/10 items-center justify-center">
                  <Text className="text-5xl">🍱</Text>
                </View>

                {/* Store Info */}
                <View className="p-4">
                  <View className="flex-row items-start justify-between mb-2">
                    <View className="flex-1">
                      <Text className="text-lg font-bold text-foreground mb-1">
                        {store.name}
                      </Text>
                      <Text className="text-sm text-muted">{store.cuisine}</Text>
                    </View>
                    {!store.isOpen && (
                      <View className="bg-error/10 px-2 py-1 rounded">
                        <Text className="text-error text-xs font-semibold">Closed</Text>
                      </View>
                    )}
                  </View>

                  {/* Rating and Details */}
                  <View className="flex-row items-center gap-4 mb-3">
                    <View className="flex-row items-center gap-1">
                      <Text className="text-yellow-500 font-bold">★</Text>
                      <Text className="text-foreground font-semibold">{store.rating}</Text>
                      <Text className="text-muted text-sm">({store.reviews})</Text>
                    </View>
                    <Text className="text-muted text-sm">{store.distance}</Text>
                  </View>

                  {/* Delivery Info */}
                  <View className="flex-row items-center justify-between pt-3 border-t border-border">
                    <View className="flex-row items-center gap-4">
                      <View>
                        <Text className="text-muted text-xs">Delivery</Text>
                        <Text className="text-foreground font-semibold text-sm">
                          {store.deliveryTime}
                        </Text>
                      </View>
                      <View>
                        <Text className="text-muted text-xs">Fee</Text>
                        <Text className="text-foreground font-semibold text-sm">
                          {store.deliveryFee}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-primary font-bold">→</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
