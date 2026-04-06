/**
 * Customer Home Screen
 * Main entry point for customers with service selection
 */

import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useAuth } from '@/lib/auth-context';

interface ServiceCard {
  id: string;
  title: string;
  description: string;
  emoji: string;
  color: string;
}

const services: ServiceCard[] = [
  {
    id: 'chakna',
    title: 'Chakna Store',
    description: 'Order fresh snacks and food items',
    emoji: '🍱',
    color: 'bg-orange-100',
  },
  {
    id: 'catering',
    title: 'Catering',
    description: 'Plan your events with catering services',
    emoji: '🍽️',
    color: 'bg-blue-100',
  },
  {
    id: 'tiffin',
    title: 'Tiffin Service',
    description: 'Daily meal delivery subscription',
    emoji: '🥗',
    color: 'bg-green-100',
  },
];

export default function CustomerHomeScreen() {
  const router = useRouter();
  const { state } = useAuth();

  const handleServicePress = (serviceId: string) => {
    if (serviceId === 'chakna') {
      router.push('/(customer)/chakna');
    } else if (serviceId === 'catering') {
      // TODO: Navigate to catering
    } else if (serviceId === 'tiffin') {
      // TODO: Navigate to tiffin
    }
  };

  return (
    <ScreenContainer className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6">
          {/* Header */}
          <View className="mb-8">
            <Text className="text-3xl font-bold text-foreground mb-2">
              Hello, {state.user?.name?.split(' ')[0] || 'Guest'}! 👋
            </Text>
            <Text className="text-base text-muted">What would you like to order today?</Text>
          </View>

          {/* Location Card */}
          <View className="bg-primary/10 border border-primary rounded-lg px-4 py-3 mb-6 flex-row items-center gap-3">
            <Text className="text-2xl">📍</Text>
            <View className="flex-1">
              <Text className="text-xs text-muted">Delivery Location</Text>
              <Text className="text-sm font-semibold text-foreground">Current Location</Text>
            </View>
            <TouchableOpacity>
              <Text className="text-primary font-semibold text-sm">Change</Text>
            </TouchableOpacity>
          </View>

          {/* Service Cards */}
          <View className="gap-4 mb-8">
            {services.map(service => (
              <TouchableOpacity
                key={service.id}
                className="bg-surface rounded-2xl p-4 border border-border active:opacity-70"
                onPress={() => handleServicePress(service.id)}
              >
                <View className="flex-row items-start gap-4">
                  {/* Icon */}
                  <View className="w-16 h-16 rounded-xl bg-primary/10 items-center justify-center">
                    <Text className="text-3xl">{service.emoji}</Text>
                  </View>

                  {/* Content */}
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-foreground mb-1">
                      {service.title}
                    </Text>
                    <Text className="text-sm text-muted leading-relaxed">
                      {service.description}
                    </Text>
                  </View>

                  {/* Arrow */}
                  <Text className="text-2xl">→</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Quick Actions */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-foreground mb-3">Quick Actions</Text>
            <View className="flex-row gap-3">
              <TouchableOpacity className="flex-1 bg-surface rounded-lg py-3 px-4 items-center border border-border">
                <Text className="text-2xl mb-1">🔍</Text>
                <Text className="text-xs font-semibold text-foreground text-center">Search</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-surface rounded-lg py-3 px-4 items-center border border-border">
                <Text className="text-2xl mb-1">⭐</Text>
                <Text className="text-xs font-semibold text-foreground text-center">Favorites</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-surface rounded-lg py-3 px-4 items-center border border-border">
                <Text className="text-2xl mb-1">🎟️</Text>
                <Text className="text-xs font-semibold text-foreground text-center">Coupons</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Promotional Banner */}
          <View className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-4 overflow-hidden">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-white font-bold text-lg mb-1">Special Offer</Text>
                <Text className="text-white/90 text-sm">Get 20% off on your first order</Text>
              </View>
              <Text className="text-4xl">🎉</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

