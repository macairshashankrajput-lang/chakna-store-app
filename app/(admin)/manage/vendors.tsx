/**
 * Vendor Management Screen
 * List and manage vendor status from Supabase.
 */

import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { vendorService, type Vendor } from '@/lib/supabase-service';

export default function AdminVendorManagementScreen() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVendors = async () => {
      try {
        setIsLoading(true);
        const data = await vendorService.getAllVendors();
        setVendors(data);
      } catch (err) {
        console.error('Failed to load vendors', err);
        setError('Unable to load vendor list.');
      } finally {
        setIsLoading(false);
      }
    };

    loadVendors();
  }, []);

  const toggleStatus = async (vendor: Vendor) => {
    const nextStatus = vendor.status === 'active' ? 'inactive' : 'active';

    Alert.alert(
      'Change status',
      `Switch ${vendor.name} to ${nextStatus}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              await vendorService.updateVendorStatus(vendor.id, nextStatus);
              setVendors((prev) =>
                prev.map((item) =>
                  item.id === vendor.id ? { ...item, status: nextStatus } : item,
                ),
              );
            } catch (err) {
              console.error('Vendor status update failed', err);
              Alert.alert('Error', 'Unable to update vendor status.');
            }
          },
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <ScreenContainer className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#2563eb" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6">
          <Text className="text-3xl font-bold text-foreground mb-2">Vendor Management</Text>
          <Text className="text-muted text-sm mb-6">Review vendors and update active status quickly.</Text>

          {error ? (
            <View className="bg-error/10 border border-error rounded-3xl p-4 mb-4">
              <Text className="text-error">{error}</Text>
            </View>
          ) : null}

          {vendors.length === 0 ? (
            <View className="bg-surface rounded-3xl border border-border p-6 items-center">
              <Text className="text-foreground text-base">No vendors found.</Text>
              <Text className="text-muted text-sm mt-2">Vendor accounts are created by the admin.</Text>
            </View>
          ) : (
            vendors.map((vendor) => (
              <View
                key={vendor.id}
                className="bg-surface rounded-3xl border border-border p-4 mb-4"
              >
                <View className="flex-row items-start justify-between gap-4 mb-3">
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-foreground">{vendor.name}</Text>
                    <Text className="text-sm text-muted">{vendor.businessName}</Text>
                    <Text className="text-sm text-muted mt-1">{vendor.email}</Text>
                    <Text className="text-sm text-muted">{vendor.phone}</Text>
                  </View>
                  <View className="rounded-full bg-primary/10 px-3 py-1">
                    <Text className="text-xs font-semibold text-primary capitalize">{vendor.status}</Text>
                  </View>
                </View>

                <View className="flex-row gap-3">
                  <TouchableOpacity
                    className="flex-1 bg-primary rounded-3xl py-3 items-center"
                    onPress={() => toggleStatus(vendor)}
                    activeOpacity={0.8}
                  >
                    <Text className="text-background font-semibold">{vendor.status === 'active' ? 'Deactivate' : 'Activate'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-1 bg-surface border border-border rounded-3xl py-3 items-center"
                    activeOpacity={0.8}
                  >
                    <Text className="text-foreground font-semibold">View</Text>
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
