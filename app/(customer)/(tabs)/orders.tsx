/**
 * Customer Orders Screen
 * View order history and status
 */

import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';

interface Order {
  id: string;
  number: string;
  date: string;
  status: 'delivered' | 'pending' | 'preparing';
  total: number;
  items: number;
}

export default function OrdersScreen() {
  const router = useRouter();

  const mockOrders: Order[] = [
    {
      id: '1',
      number: '#ORD-123',
      date: '2024-10-20',
      status: 'delivered' as const,
      total: 450,
      items: 3,
    },
    {
      id: '2',
      number: '#ORD-122',
      date: '2024-10-19',
      status: 'pending' as const,
      total: 320,
      items: 2,
    },
    {
      id: '3',
      number: '#ORD-121',
      date: '2024-10-18',
      status: 'preparing' as const,
      total: 580,
      items: 4,
    },
  ];

  const statusColors = {
    delivered: 'bg-success/10 border-success text-success',
    pending: 'bg-warning/10 border-warning text-warning',
    preparing: 'bg-primary/10 border-primary text-primary',
  };

  const renderOrder = ({ item }: { item: Order }) => (
    <TouchableOpacity
      className="bg-surface rounded-2xl p-4 mb-4 border border-border active:opacity-90"
      onPress={() => router.push(`./order/${item.id}`)}
    >
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-lg font-bold text-foreground">{item.number}</Text>
        <Text className="text-primary font-bold text-xl">₹{item.total}</Text>
      </View>
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-muted text-sm">{item.date} • {item.items} items</Text>
        <View className={`px-3 py-1 rounded-full border ${statusColors[item.status]}`}>
          <Text className="text-xs font-semibold capitalize">{item.status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer className="flex-1 bg-background">
      <View className="px-4 py-6">
        <Text className="text-2xl font-bold text-foreground mb-6">Your Orders</Text>
        <FlatList
          data={mockOrders}
          renderItem={renderOrder}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ScreenContainer>
  );
}
