/**
 * Vendor Orders Screen
 * Manage incoming orders with status updates
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { Order } from '@/shared/types';

type OrderStatus = Order['status'];

const mockOrders: Order[] = [
  {
    id: 'o1',
    userId: 'user1',
    items: [{ productId: '1', quantity: 2, price: 49, addedAt: '' }],
    total: 148,
    status: 'pending',
    deliveryAddress: '123 Main St',
    createdAt: '2024-01-20T12:00:00Z',
  },
  {
    id: 'o2',
    userId: 'user2',
    items: [{ productId: '2', quantity: 1, price: 35, addedAt: '' }],
    total: 35,
    status: 'cooking',
    deliveryAddress: '456 Oak Ave',
    createdAt: '2024-01-20T11:30:00Z',
  },
  {
    id: 'o3',
    userId: 'user3',
    items: [{ productId: '3', quantity: 3, price: 89, addedAt: '' }],
    total: 317,
    status: 'out-for-delivery',
    deliveryAddress: '789 Pine Rd',
    createdAt: '2024-01-20T09:15:00Z',
  },
  // TODO: tRPC.orders.list({vendorId: currentVendor})
];

const statusOptions: OrderStatus[] = ['pending', 'cooking', 'out-for-delivery', 'delivered', 'cancelled'];

export default function VendorOrdersScreen() {
  const [orders, setOrders] = useState(mockOrders);
  const [tempStatus, setTempStatus] = useState<Record<string, OrderStatus>>({});

  const updateStatus = (orderId: string, status: OrderStatus) => {
    setOrders(orders.map(order => order.id === orderId ? { ...order, status } : order));
    setTempStatus({ ...tempStatus, [orderId]: status });
    // TODO: tRPC.orders.updateStatus({orderId, status})
  };

  const renderStatusButton = (orderId: string, currentStatus: OrderStatus) => (
    <View className="flex-row gap-1">
      {statusOptions.map(status => (
        <TouchableOpacity
          key={status}
          className={`px-3 py-1 rounded-full ${currentStatus === status
              ? 'bg-primary'
              : 'bg-muted border border-border'
            }`}
          onPress={() => updateStatus(orderId, status)}
        >
          <Text className={`font-semibold text-sm ${currentStatus === status ? 'text-background' : 'text-foreground'
            }`}>
            {status.replace('-', ' ').toUpperCase()}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderOrder = ({ item }: { item: Order }) => (
    <View className="bg-surface rounded-2xl p-6 mb-6 border border-border">
      <View className="flex-row justify-between items-start mb-4">
        <Text className="text-xl font-bold text-foreground">Order #{item.id.slice(-4)}</Text>
        <View className={`px-4 py-2 rounded-full ${item.status === 'delivered' ? 'bg-green-100 border-green-200 text-green-800' :
            item.status === 'cancelled' ? 'bg-red-100 border-red-200 text-red-800' :
              'bg-yellow-100 border-yellow-200 text-yellow-800'
          }`}>
          <Text className="font-semibold capitalize">{item.status.replace('-', ' ')}</Text>
        </View>
      </View>

      <View className="mb-4">
        <Text className="text-muted mb-2">Items: {item.items.length}</Text>
        <Text className="text-primary font-bold mb-2">₹{item.total}</Text>
        <Text className="text-foreground mb-2">{item.deliveryAddress}</Text>
        <Text className="text-sm text-muted">Placed: {new Date(item.createdAt).toLocaleString()}</Text>
      </View>

      <Text className="text-foreground font-semibold mb-2">Update Status:</Text>
      {renderStatusButton(item.id, item.status)}

      <TouchableOpacity className="mt-4 bg-primary py-2 rounded-xl items-center">
        <Text className="text-background font-semibold">Share Order Details</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenContainer className="flex-1 bg-background">
      <ScrollView className="px-4 py-6" showsVerticalScrollIndicator={false}>
        <Text className="text-3xl font-bold text-foreground mb-6">Orders</Text>

        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={item => item.id}
          ListEmptyComponent={
            <View className="items-center py-20">
              <Text className="text-6xl mb-4">📦</Text>
              <Text className="text-2xl font-bold text-foreground mb-2">No Orders</Text>
              <Text className="text-muted text-center">Orders from customers will appear here</Text>
            </View>
          }
        />
      </ScrollView>
    </ScreenContainer>
  );
}

