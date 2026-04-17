/**
 * Vendor Orders Screen
 * Manage incoming orders and update status
 */

import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Share } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useAuth } from '@/lib/auth-context';
import { vendorOrderService } from '@/lib/vendor-order-service';
import { orderService } from '@/lib/supabase-service';
import { format } from 'date-fns';

export default function VendorOrdersScreen() {
  const { state } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!state.user?.id) return;
    const vendorId = state.user.id;

    const loadOrders = async () => {
      try {
        const data = await vendorOrderService.getVendorOrders(vendorId);
        setOrders(data);
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();

    const unsubscribe = vendorOrderService.subscribeToVendorOrders(vendorId, (newOrders) => {
      setOrders(newOrders);
    });

    return () => unsubscribe();
  }, [state.user?.id]);

  const handleShareOrder = async (order: any) => {
    try {
        const itemsList = order.order_items?.map((item: any) => 
            `${item.quantity}x ${item.menu?.name || 'Item'} (₹${item.price * item.quantity})`
        ).join('\n');

        const message = `Order #ORD-${order.id}\n` +
            `Customer: ${order.users?.name || 'Guest'}\n` +
            `Phone: ${order.users?.phone || 'N/A'}\n` +
            `Address: ${order.users?.delivery_location?.address || 'N/A'}\n\n` +
            `Items:\n${itemsList}\n\n` +
            `Total: ₹${order.totalPrice}`;

        await Share.share({ message });
    } catch (error) {
        Alert.alert('Error', 'Failed to share order details');
    }
  };

  const updateStatus = (orderId: string, currentStatus: string) => {
    const nextStatusOptions: any[] = [
        { text: 'Cancel Inquiry', style: 'cancel' }
    ];

    if (currentStatus === 'pending') {
        nextStatusOptions.push({ text: 'Accept & Start Cooking', onPress: () => setStatus(orderId, 'cooking') });
        nextStatusOptions.push({ text: 'Reject Order', style: 'destructive', onPress: () => setStatus(orderId, 'cancelled') });
    } else if (currentStatus === 'cooking') {
        nextStatusOptions.push({ text: 'Mark Out for Delivery', onPress: () => setStatus(orderId, 'out_for_delivery') });
    } else if (currentStatus === 'out_for_delivery') {
        nextStatusOptions.push({ text: 'Confirm Delivery', onPress: () => setStatus(orderId, 'delivered') });
    }

    if (nextStatusOptions.length > 1) {
        Alert.alert('Update Status', 'Select the next step for this order:', nextStatusOptions);
    } else {
        Alert.alert('Status Complete', 'This order is already ' + currentStatus.replace(/_/g, ' ') + '.');
    }
  };

  const setStatus = async (orderId: string, status: any) => {
    try {
        await orderService.updateOrderStatus(orderId, status);
        Alert.alert('Success', `Order status updated to ${status.replace(/_/g, ' ')}`);
    } catch (err) {
        Alert.alert('Error', 'Failed to update order status');
    }
  };

  const statusColors: Record<string, string> = {
    delivered: 'bg-green-500/10 border-green-500 text-green-500',
    pending: 'bg-orange-500/10 border-orange-500 text-orange-500',
    cooking: 'bg-blue-500/10 border-blue-500 text-blue-500',
    out_for_delivery: 'bg-purple-500/10 border-purple-500 text-purple-500',
    cancelled: 'bg-red-500/10 border-red-500 text-red-500',
  };

  if (isLoading && orders.length === 0) {
      return (
          <ScreenContainer className="flex-1 items-center justify-center bg-background">
              <ActivityIndicator size="large" color="#E25C3D" />
          </ScreenContainer>
      );
  }

  return (
    <ScreenContainer className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6">
          <Text className="text-3xl font-bold text-foreground mb-6">Vendor Dashboard</Text>
          
          {orders.length === 0 ? (
            <View className="flex-1 items-center justify-center py-20">
                <Text className="text-6xl mb-6">📦</Text>
                <Text className="text-xl font-bold text-foreground mb-2">No active orders</Text>
                <Text className="text-muted text-center px-10">When customers place orders, they will appear here in real-time.</Text>
            </View>
          ) : (
            orders.map(order => (
                <View key={order.id} className="bg-surface rounded-3xl p-6 border border-border mb-6 shadow-sm">
                    <View className="flex-row justify-between items-start mb-4">
                        <View>
                            <Text className="font-bold text-foreground text-xl">Order #ORD-{order.id}</Text>
                            <Text className="text-xs text-muted font-semibold uppercase tracking-widest mt-1">
                                {format(new Date(order.createdAt), 'MMM d, h:mm a')}
                            </Text>
                        </View>
                        <View className={`px-3 py-1 rounded-full border ${statusColors[order.status] || 'bg-muted/10 border-muted text-muted'}`}>
                            <Text className="text-[10px] font-bold uppercase">{order.status.replace(/_/g, ' ')}</Text>
                        </View>
                    </View>

                    <View className="bg-background/50 rounded-2xl p-4 mb-4 border border-border/50">
                        <View className="flex-row items-center justify-between mb-2">
                            <Text className="text-sm font-bold text-foreground">{order.users?.name || 'Guest Customer'}</Text>
                            <TouchableOpacity onPress={() => handleShareOrder(order)}>
                                <Text className="text-primary font-bold text-xs">Share Details 📤</Text>
                            </TouchableOpacity>
                        </View>
                        <Text className="text-xs text-muted mb-1">📞 {order.users?.phone || 'No phone provided'}</Text>
                        <Text className="text-xs text-muted" numberOfLines={2}>📍 {order.users?.delivery_location?.address || 'Standard Delivery'}</Text>
                    </View>

                    <View className="mb-4">
                        <Text className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Order Items</Text>
                        {order.order_items?.map((item: any, idx: number) => (
                            <View key={idx} className="flex-row justify-between py-1">
                                <Text className="text-sm text-foreground">
                                    <Text className="font-bold">{item.quantity}x</Text> {item.menu?.name || `Item ${item.menu_id}`}
                                </Text>
                                <Text className="text-sm text-muted">₹{item.price * item.quantity}</Text>
                            </View>
                        ))}
                    </View>

                    <View className="border-t border-border pt-4 flex-row justify-between items-center">
                        <View>
                            <Text className="text-xs text-muted uppercase font-bold">Total Amount</Text>
                            <Text className="font-bold text-primary text-2xl">₹{order.totalPrice}</Text>
                        </View>
                        
                        <TouchableOpacity 
                            className={`px-6 py-3 rounded-xl ${['delivered', 'cancelled'].includes(order.status) ? 'bg-muted/10' : 'bg-primary shadow-md shadow-primary/20'}`}
                            onPress={() => updateStatus(order.id, order.status)}
                            disabled={['delivered', 'cancelled'].includes(order.status)}
                        >
                            <Text className={['delivered', 'cancelled'].includes(order.status) ? 'text-muted font-bold' : 'text-white font-bold'}>
                                {['delivered', 'cancelled'].includes(order.status) ? 'Order Closed' : 'Update Status'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ))
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
