/**
 * Vendor Tiffin Management
 * Calendar view and status updates
 */

import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { TiffinOrder } from '@/shared/types';

const mockTiffinOrders: TiffinOrder[] = [
  {
    id: 't1',
    userId: 'user1',
    vendorId: 'vendor1',
    date: '2024-01-25',
    menu: 'Dal Rice, Veg Curry',
    status: 'pending',
    pointsUsed: 25,
    createdAt: '2024-01-20T10:00:00Z',
  },
  {
    id: 't2',
    userId: 'user2',
    vendorId: 'vendor1',
    date: '2024-01-25',
    menu: 'Roti Sabji',
    status: 'delivered',
    pointsUsed: 20,
    createdAt: '2024-01-19T15:00:00Z',
  },
  // TODO: tRPC.tiffinOrders.calendar()
];

const tiffinStatus = ['pending', 'cancelled', 'delivered', 'updated', 'not-received'];

export default function VendorTiffinScreen() {
  const renderDay = ({ item }: { item: TiffinOrder }) => (
    <View className="bg-surface p-6 rounded-2xl mb-4 border border-border">
      <View className="flex-row justify-between mb-3">
        <Text className="text-xl font-bold">{new Date(item.date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}</Text>
        <View className={`px-3 py-1 rounded-full ${item.status === 'delivered' ? 'bg-green-500' : 'bg-yellow-500'
          }`}>
          <Text className={`font-semibold ${item.status === 'delivered' ? 'text-white' : 'text-black'}`}>
            {item.status}
          </Text>
        </View>
      </View>
      <Text className="text-foreground mb-2">{item.menu}</Text>
      <Text className="text-muted mb-3">Points: {item.pointsUsed} | Customer: {item.userId.slice(-4)}</Text>
      <View className="flex-row gap-2">
        <TouchableOpacity className="flex-1 bg-primary py-2 rounded-xl">
          <Text className="text-background font-semibold text-center">Update Status</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 bg-blue-500 py-2 rounded-xl">
          <Text className="text-white font-semibold text-center">Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScreenContainer className="flex-1 bg-background">
      <ScrollView className="px-4 py-6">
        <Text className="text-3xl font-bold text-foreground mb-6">Tiffin Orders</Text>
        <Text className="text-muted mb-6">Manage daily tiffin deliveries</Text>

        <FlatList
          data={mockTiffinOrders}
          renderItem={renderDay}
          keyExtractor={item => item.id}
          ListEmptyComponent={
            <View className="items-center py-20">
              <Text className="text-5xl mb-4">📅</Text>
              <Text className="text-2xl font-bold text-foreground mb-2">No Tiffin Orders</Text>
              <Text className="text-muted text-center">Tiffin subscriptions will appear here</Text>
            </View>
          }
        />
      </ScrollView>
    </ScreenContainer>
  );
}

