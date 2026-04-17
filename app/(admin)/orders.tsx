import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { AdminDataTable } from '@/components/ui/admin-data-table';
import { orderService, type Order } from '@/lib/supabase-service';

export default function AdminOrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders', error);
      Alert.alert('Error', 'Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    const unsubscribe = orderService.subscribeToOrders((newOrders) => {
      setOrders(newOrders);
    });
    return () => unsubscribe();
  }, []);

  const renderOrder = ({ item }: { item: Order }) => {
    const date = item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A';
    return (
      <View className="p-4 bg-surface rounded-3xl border border-border mb-3">
        <View className="flex-row justify-between items-start mb-2">
          <View>
            <Text className="font-bold text-foreground text-lg">Order #ORD-{item.id}</Text>
            <Text className="text-sm text-muted">{date}</Text>
          </View>
          <View className={`px-3 py-1 rounded-full ${getStatusColor(item.status)}`}>
            <Text className="text-[10px] font-bold uppercase">{item.status.replace(/_/g, ' ')}</Text>
          </View>
        </View>
        
        <View className="mb-3">
          <Text className="text-sm text-foreground"><Text className="font-bold">Total:</Text> ₹{item.totalPrice}</Text>
          <Text className="text-xs text-muted">Type: {item.type}</Text>
        </View>

        <TouchableOpacity 
          className="bg-primary/10 rounded-xl py-2 items-center"
          onPress={() => Alert.alert('Order Detail', `Viewing details for Order ${item.id}`)}
        >
          <Text className="text-primary font-bold text-xs">View Full Details</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-success/10 text-success';
      case 'cancelled': return 'bg-error/10 text-error';
      case 'pending': return 'bg-warning/10 text-warning';
      default: return 'bg-blue-500/10 text-blue-500';
    }
  };

  return (
    <ScreenContainer className="flex-1 bg-background">
      <AdminDataTable
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderOrder as any}
        filterOptions={[
          { label: 'All', value: 'all' },
          { label: 'Pending', value: 'pending' },
          { label: 'Delivered', value: 'delivered' },
          { label: 'Cancelled', value: 'cancelled' },
        ]}
        searchKeys={['id', 'status', 'type'] as any}
        loading={loading}
        onRefresh={loadOrders}
        emptyTitle="No Orders Found"
        emptyDescription="Orders placed by customers will appear here."
      />
    </ScreenContainer>
  );
}
