/**
 * Tiffin Services Screen
 * Daily meal delivery subscription with menu selection
 */

import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useState } from 'react';

interface TiffinPlan {
  id: string;
  name: string;
  meals: string;
  price: number;
  description: string;
}

interface MenuItem {
  id: string;
  name: string;
  icon: string;
}

const tiffinPlans: TiffinPlan[] = [
  { id: '1', name: 'Breakfast Only', meals: '1 meal/day', price: 150, description: 'Fresh breakfast daily' },
  { id: '2', name: 'Lunch Only', meals: '1 meal/day', price: 200, description: 'Nutritious lunch daily' },
  { id: '3', name: 'Breakfast + Lunch', meals: '2 meals/day', price: 320, description: 'Complete meal solution' },
  { id: '4', name: 'Premium Combo', meals: '3 meals/day', price: 450, description: 'All meals included' },
];

const menuItems: MenuItem[] = [
  { id: '1', name: 'Roti & Sabzi', icon: '🍛' },
  { id: '2', name: 'Rice & Dal', icon: '🍚' },
  { id: '3', name: 'Paneer Curry', icon: '🧀' },
  { id: '4', name: 'Chicken Curry', icon: '🍗' },
];

export default function TiffinScreen() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedMenuItems, setSelectedMenuItems] = useState<string[]>([]);

  const handleToggleMenu = (itemId: string) => {
    setSelectedMenuItems(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const handleSubscribe = () => {
    if (!selectedPlan) {
      Alert.alert('Error', 'Please select a plan');
      return;
    }
    if (selectedMenuItems.length === 0) {
      Alert.alert('Error', 'Please select at least one menu item');
      return;
    }
    Alert.alert('Success', 'Subscription added to cart. Proceed to checkout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Checkout', onPress: () => router.push('/(customer)/profile') },
    ]);
  };

  return (
    <ScreenContainer className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6">
          {/* Header */}
          <Text className="text-3xl font-bold text-foreground mb-2">Tiffin Services</Text>
          <Text className="text-muted text-sm mb-6">Daily meal delivery subscription</Text>

          {/* Select Plan */}
          <Text className="text-lg font-bold text-foreground mb-3">Select Plan</Text>
          <View className="gap-2 mb-6">
            {tiffinPlans.map(plan => (
              <TouchableOpacity
                key={plan.id}
                className={`rounded-lg p-4 border-2 ${
                  selectedPlan === plan.id ? 'bg-primary/10 border-primary' : 'bg-surface border-border'
                }`}
                onPress={() => setSelectedPlan(plan.id)}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-base font-bold text-foreground">{plan.name}</Text>
                    <Text className="text-sm text-muted">{plan.description}</Text>
                  </View>
                  <Text className="text-primary font-bold">₹{plan.price}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Select Menu */}
          <Text className="text-lg font-bold text-foreground mb-3">Select Menu Items</Text>
          <View className="gap-2 mb-6">
            {menuItems.map(item => (
              <TouchableOpacity
                key={item.id}
                className={`rounded-lg p-4 flex-row items-center gap-3 border-2 ${
                  selectedMenuItems.includes(item.id)
                    ? 'bg-primary/10 border-primary'
                    : 'bg-surface border-border'
                }`}
                onPress={() => handleToggleMenu(item.id)}
              >
                <Text className="text-2xl">{item.icon}</Text>
                <Text className="flex-1 text-foreground font-semibold">{item.name}</Text>
                <View
                  className={`w-5 h-5 rounded border-2 items-center justify-center ${
                    selectedMenuItems.includes(item.id) ? 'bg-primary border-primary' : 'border-border'
                  }`}
                >
                  {selectedMenuItems.includes(item.id) && <Text className="text-white text-xs">✓</Text>}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Subscribe Button */}
          <TouchableOpacity
            className="w-full bg-primary rounded-lg py-4 items-center mb-6"
            onPress={handleSubscribe}
          >
            <Text className="text-white font-bold text-base">Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
