/**
 * Tiffin Services Screen
 * Daily meal delivery subscription
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
  benefits: string[];
}

const tiffinPlans: TiffinPlan[] = [
  {
    id: '1',
    name: 'Breakfast Only',
    meals: '1 meal/day',
    price: 150,
    description: 'Fresh breakfast delivered daily',
    benefits: ['Breakfast included', 'Flexible pause', 'Quality assured'],
  },
  {
    id: '2',
    name: 'Lunch Only',
    meals: '1 meal/day',
    price: 200,
    description: 'Nutritious lunch delivered daily',
    benefits: ['Lunch included', 'Customizable menu', 'Home delivery'],
  },
  {
    id: '3',
    name: 'Breakfast + Lunch',
    meals: '2 meals/day',
    price: 320,
    description: 'Complete meal solution',
    benefits: ['Both meals included', 'Best value', 'Weekly menu'],
  },
  {
    id: '4',
    name: 'Premium Combo',
    meals: '3 meals/day',
    price: 450,
    description: 'All meals included',
    benefits: ['All 3 meals', 'Premium quality', 'Special diets'],
  },
];

export default function TiffinScreen() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    Alert.alert(
      'Subscription',
      'You selected a tiffin plan. Proceed to checkout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Proceed',
          onPress: () => {
            router.push('./checkout');
          },
        },
      ]
    );
  };

  return (
    <ScreenContainer className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6">
          {/* Header */}
          <View className="mb-6">
            <Text className="text-3xl font-bold text-foreground mb-2">Tiffin Services</Text>
            <Text className="text-muted text-sm">Daily meal delivery subscription</Text>
          </View>

          {/* Benefits */}
          <View className="bg-primary/10 rounded-xl p-4 mb-6 border border-primary">
            <Text className="font-bold text-foreground mb-2">Why choose our tiffin service?</Text>
            <View className="gap-1">
              <Text className="text-sm text-muted">✓ Fresh, home-cooked meals daily</Text>
              <Text className="text-sm text-muted">✓ Flexible pause and resume anytime</Text>
              <Text className="text-sm text-muted">✓ Customizable menu options</Text>
              <Text className="text-sm text-muted">✓ On-time delivery guaranteed</Text>
            </View>
          </View>

          {/* Plans */}
          <View className="gap-4 mb-6">
            {tiffinPlans.map(plan => (
              <View
                key={plan.id}
                className={`rounded-xl p-4 border-2 ${
                  selectedPlan === plan.id
                    ? 'bg-primary/10 border-primary'
                    : 'bg-surface border-border'
                }`}
              >
                {/* Plan Header */}
                <View className="flex-row items-start justify-between mb-3">
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-foreground mb-1">{plan.name}</Text>
                    <Text className="text-sm text-muted">{plan.meals}</Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-2xl font-bold text-primary">Rs {plan.price}</Text>
                    <Text className="text-xs text-muted">/month</Text>
                  </View>
                </View>

                {/* Description */}
                <Text className="text-sm text-muted mb-3">{plan.description}</Text>

                {/* Benefits */}
                <View className="gap-1 mb-4">
                  {plan.benefits.map((benefit, index) => (
                    <Text key={index} className="text-xs text-foreground">
                      • {benefit}
                    </Text>
                  ))}
                </View>

                {/* Select Button */}
                <TouchableOpacity
                  className={`rounded-lg py-3 items-center ${
                    selectedPlan === plan.id
                      ? 'bg-primary'
                      : 'bg-surface border border-border'
                  }`}
                  onPress={() => handleSelectPlan(plan.id)}
                >
                  <Text
                    className={`font-bold ${
                      selectedPlan === plan.id ? 'text-background' : 'text-foreground'
                    }`}
                  >
                    {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* How It Works */}
          <View className="bg-surface rounded-xl p-4 border border-border">
            <Text className="font-bold text-foreground mb-3">How It Works</Text>
            <View className="gap-2">
              <View className="flex-row gap-3">
                <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
                  <Text className="text-background text-xs font-bold">1</Text>
                </View>
                <Text className="text-sm text-muted flex-1">Select your preferred tiffin plan</Text>
              </View>
              <View className="flex-row gap-3">
                <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
                  <Text className="text-background text-xs font-bold">2</Text>
                </View>
                <Text className="text-sm text-muted flex-1">Choose your meal preferences</Text>
              </View>
              <View className="flex-row gap-3">
                <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
                  <Text className="text-background text-xs font-bold">3</Text>
                </View>
                <Text className="text-sm text-muted flex-1">Meals delivered to your doorstep</Text>
              </View>
              <View className="flex-row gap-3">
                <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
                  <Text className="text-background text-xs font-bold">4</Text>
                </View>
                <Text className="text-sm text-muted flex-1">Manage subscription anytime</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
