/**
 * Store Detail Screen
 * Browse menu and add items to cart
 */

import { View, Text, ScrollView, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useState } from 'react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  vegetarian: boolean;
}

const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Samosa',
    description: 'Crispy fried pastry with spiced filling',
    price: 20,
    category: 'Snacks',
    vegetarian: true,
  },
  {
    id: '2',
    name: 'Pakora',
    description: 'Battered and fried vegetables',
    price: 30,
    category: 'Snacks',
    vegetarian: true,
  },
  {
    id: '3',
    name: 'Chicken Tikka',
    description: 'Marinated and grilled chicken pieces',
    price: 120,
    category: 'Appetizers',
    vegetarian: false,
  },
  {
    id: '4',
    name: 'Paneer Tikka',
    description: 'Marinated and grilled paneer',
    price: 100,
    category: 'Appetizers',
    vegetarian: true,
  },
];

export default function StoreDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<{ [key: string]: number }>({});

  const categories = ['All', ...new Set(mockMenuItems.map(item => item.category))];

  const filteredItems = mockMenuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (itemId: string) => {
    setCart(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[itemId] > 1) {
        newCart[itemId]--;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = Object.entries(cart).reduce((total, [itemId, qty]) => {
    const item = mockMenuItems.find(m => m.id === itemId);
    return total + (item?.price || 0) * qty;
  }, 0);

  return (
    <ScreenContainer className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6">
          {/* Header */}
          <View className="mb-6 flex-row items-center justify-between">
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-2xl">←</Text>
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-foreground flex-1 ml-4">Store Menu</Text>
            {cartCount > 0 && (
              <View className="bg-primary px-3 py-1 rounded-full">
                <Text className="text-background font-bold text-sm">{cartCount}</Text>
              </View>
            )}
          </View>

          {/* Search Bar */}
          <View className="mb-4">
            <TextInput
              className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholder="Search menu items..."
              placeholderTextColor="#687076"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Category Filter */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-6 -mx-4 px-4"
          >
            {categories.map(category => (
              <TouchableOpacity
                key={category}
                className={`px-4 py-2 rounded-full mr-2 border ${
                  selectedCategory === category
                    ? 'bg-primary border-primary'
                    : 'bg-surface border-border'
                }`}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  className={`font-semibold text-sm ${
                    selectedCategory === category ? 'text-background' : 'text-foreground'
                  }`}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Menu Items */}
          <View className="gap-4 mb-32">
            {filteredItems.map(item => (
              <View key={item.id} className="bg-surface rounded-xl p-4 border border-border">
                <View className="flex-row items-start justify-between mb-2">
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2 mb-1">
                      <Text className="text-lg font-bold text-foreground">{item.name}</Text>
                      {item.vegetarian && (
                        <View className="w-4 h-4 border border-success rounded-sm items-center justify-center">
                          <Text className="text-success text-xs">✓</Text>
                        </View>
                      )}
                    </View>
                    <Text className="text-sm text-muted mb-2">{item.description}</Text>
                    <Text className="text-lg font-bold text-primary">Rs {item.price}</Text>
                  </View>
                </View>

                {/* Add/Remove Buttons */}
                {cart[item.id] ? (
                  <View className="flex-row items-center gap-2 mt-3">
                    <TouchableOpacity
                      className="flex-1 bg-error/10 rounded-lg py-2 items-center"
                      onPress={() => handleRemoveFromCart(item.id)}
                    >
                      <Text className="text-error font-bold">−</Text>
                    </TouchableOpacity>
                    <View className="flex-1 bg-primary/10 rounded-lg py-2 items-center">
                      <Text className="text-foreground font-bold">{cart[item.id]}</Text>
                    </View>
                    <TouchableOpacity
                      className="flex-1 bg-primary rounded-lg py-2 items-center"
                      onPress={() => handleAddToCart(item.id)}
                    >
                      <Text className="text-background font-bold">+</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    className="bg-primary rounded-lg py-2 items-center mt-3"
                    onPress={() => handleAddToCart(item.id)}
                  >
                    <Text className="text-background font-bold">Add to Cart</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Cart Footer */}
      {cartCount > 0 && (
        <View className="absolute bottom-0 left-0 right-0 bg-surface border-t border-border p-4">
          <TouchableOpacity
            className="bg-primary rounded-lg py-4 items-center flex-row justify-between px-4"
            onPress={() => router.push('./checkout')}
          >
            <Text className="text-background font-bold">View Cart ({cartCount})</Text>
            <Text className="text-background font-bold">Rs {cartTotal}</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScreenContainer>
  );
}
