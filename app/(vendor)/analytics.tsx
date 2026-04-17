import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useAuth } from '@/lib/auth-context';
import { vendorOrderService, type VendorOrderSummary } from '@/lib/vendor-order-service';

export default function VendorAnalyticsScreen() {
  const { state } = useAuth();
  const [summary, setSummary] = useState<VendorOrderSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!state.user?.id) return;
    vendorOrderService.getVendorOrderSummary(state.user.id)
      .then(setSummary)
      .finally(() => setLoading(false));
  }, [state.user?.id]);

  if (loading) {
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
          <Text className="text-3xl font-bold text-foreground mb-6">Your Analytics</Text>

          <View className="bg-surface rounded-3xl p-6 border border-border mb-6 shadow-sm">
            <Text className="text-muted text-sm uppercase font-bold mb-2">Total Earnings</Text>
            <Text className="text-4xl font-bold text-success mb-2">₹{summary?.totalEarnings.toLocaleString()}</Text>
            <Text className="text-xs text-muted">Cleared and ready for withdrawal</Text>
          </View>

          <View className="flex-row gap-4 mb-6">
            <View className="flex-1 bg-surface rounded-3xl p-6 border border-border items-center">
              <Text className="text-muted text-xs uppercase font-bold mb-2">Total Orders</Text>
              <Text className="text-2xl font-bold text-foreground">{summary?.activeOrders ?? 0 + (summary?.newOrders ?? 0)}</Text>
            </View>
            <View className="flex-1 bg-surface rounded-3xl p-6 border border-border items-center">
              <Text className="text-muted text-xs uppercase font-bold mb-2">Avg Rating</Text>
              <Text className="text-2xl font-bold text-foreground">{summary?.avgRating.toFixed(1)} ⭐</Text>
            </View>
          </View>

          <View className="bg-surface rounded-3xl p-6 border border-border">
            <Text className="text-lg font-bold text-foreground mb-4">Performance Insights</Text>
            <Text className="text-muted text-sm italic">"Your most popular item this week is the Special Chakna Mix. Consider adding a combo offer!"</Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
