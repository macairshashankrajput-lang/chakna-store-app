/**
 * Chakna Menu Screen
 * Single-store menu with search, categories, and add-to-cart.
 */

import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useState, useEffect } from 'react';
import { menuService, type MenuItem } from '@/lib/supabase-service';
import { useCart } from '@/lib/cart-context';

export default function ChaknaStoreListingScreen() {
  const router = useRouter();
  const { state, addItem } = useCart();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe = () => { };

    const loadMenu = async () => {
      try {
        setLoading(true);
        const items = await menuService.getAllMenuItems();
        setMenuItems(items);
        unsubscribe = menuService.subscribeToMenu(setMenuItems);
      } catch (err) {
        console.error('Failed to load menu items', err);
        setError('Unable to load menu items right now.');
      } finally {
        setLoading(false);
      }
    };

    loadMenu();
    return () => unsubscribe();
  }, []);

  const categories = ['All', ...new Set(menuItems.map((item) => item.category))];

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const cartCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = (item: MenuItem) => {
    addItem({ ...item, vendorId: 'chakna-store' }, 1);
  };

  const handleViewDetails = (itemId: string) => {
    router.push(`./store/${itemId}`);
  };

  return (
    <ScreenContainer className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6">
          <View className="mb-6">
            <Text className="text-3xl font-bold text-foreground mb-2">Chakna Menu</Text>
            <Text className="text-sm text-muted">
              One kitchen, one menu — delivered by 12 local packing vendors across the city.
            </Text>
          </View>

          <View className="mb-4">
            <TextInput
              className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholder="Search menu items..."
              placeholderTextColor="#687076"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6 -mx-4 px-4">
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                className={`px-4 py-2 rounded-full mr-2 border ${selectedCategory === category
                  ? 'bg-primary border-primary'
                  : 'bg-surface border-border'
                  }`}
                onPress={() => setSelectedCategory(category)}
              >
                <Text className={`font-semibold text-sm ${selectedCategory === category ? 'text-background' : 'text-foreground'}`}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {error ? (
            <View className="bg-error/10 border border-error rounded-3xl p-4 mb-6">
              <Text className="text-error text-sm">{error}</Text>
            </View>
          ) : null}

          <View className="gap-4 mb-32">
            {filteredItems.map((item) => (
              <View key={item.id} className="bg-surface rounded-xl p-4 border border-border">
                <View className="flex-row items-start justify-between mb-3">
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-foreground mb-1">{item.name}</Text>
                    <Text className="text-sm text-muted mb-2">{item.description}</Text>
                    <Text className="text-lg font-bold text-primary">₹{item.price}</Text>
                  </View>
                </View>

                <View className="flex-row gap-3">
                  <TouchableOpacity
                    className="flex-1 bg-primary rounded-lg py-3 items-center"
                    onPress={() => handleAddToCart(item)}
                  >
                    <Text className="text-background font-bold">Add to Cart</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-1 bg-surface border border-border rounded-lg py-3 items-center"
                    onPress={() => handleViewDetails(item.id)}
                  >
                    <Text className="text-foreground font-semibold">View</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-20 left-0 right-0 bg-surface border-t border-border p-4">
        <TouchableOpacity
          className="bg-primary rounded-lg py-4 items-center"
          onPress={() => router.push('/cart')}
        >
          <Text className="text-background font-bold">View Cart{cartCount > 0 ? ` (${cartCount})` : ''}</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}
