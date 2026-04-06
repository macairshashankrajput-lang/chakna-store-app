/**
 * Admin Dashboard Screen
 * Overview of platform metrics and management options
 */

import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useAuth } from '@/lib/auth-context';


interface KPICard {
  label: string;
  value: string;
  icon: string;
}

const kpiCards: KPICard[] = [
  { label: 'Total Orders', value: '1,234', icon: '📦' },
  { label: 'Revenue', value: '₹45,600', icon: '₹' },
  { label: 'Active Users', value: '342', icon: '👥' },
  { label: 'Vendors', value: '28', icon: '🏪' },
];

interface ManagementButtonProps {
  icon: string;
  label: string;
}

function ManagementButton({ icon, label }: ManagementButtonProps) {
  const router = useRouter();
  return (
    <TouchableOpacity
      className="bg-surface rounded-lg px-4 py-3 flex-row items-center gap-3 border border-border active:opacity-70"
      onPress={() => {
        switch (label) {
          case 'Menu Management':
            router.push('/(admin)/menu');
            break;
          case 'Reviews Management':
            router.push('/(admin)/reviews');
            break;

          case 'Notifications':
            router.push('/(admin)/orders');
            break;
          case 'Reminder System':
            router.push('/(admin)/profile');
            break;
          case 'Catering Requests':
            router.push('/(admin)/catering-requests'); // TODO create
            break;

          default:
            Alert.alert('Coming Soon', `${label} feature in development`);
        }
      }}
    >
      <Text className="text-2xl">{icon}</Text>
      <Text className="text-foreground font-semibold flex-1">{label}</Text>
      <Text className="text-muted">→</Text>
    </TouchableOpacity>
  );
}

export default function AdminDashboardScreen() {
  const { state } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (state.isLoading) return;
    if (!state.user || state.user.role !== 'admin') {
      router.replace('/(auth)/login');
    }
  }, [state.isLoading, state.user, router]);

  return (

    <ScreenContainer className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6">
          {/* Header */}
          <View className="mb-6">
            <Text className="text-3xl font-bold text-foreground mb-1">
              Admin Dashboard
            </Text>
            <Text className="text-muted text-sm">Welcome, {state.user?.name?.split(' ')[0]}</Text>
          </View>

          {/* KPI Cards */}
          <View className="gap-3 mb-8">
            {kpiCards.map((card, index) => (
              <View
                key={index}
                className="bg-surface rounded-lg p-4 border border-border flex-row items-center justify-between"
              >
                <View className="flex-1">
                  <Text className="text-muted text-sm mb-1">{card.label}</Text>
                  <Text className="text-2xl font-bold text-foreground">{card.value}</Text>
                </View>
                <Text className="text-3xl">{card.icon}</Text>
              </View>
            ))}
          </View>

          {/* Management Options */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-foreground mb-3">Management</Text>
            <View className="gap-2">
              <ManagementButton icon="🍽️" label="Menu Management" />
              <ManagementButton icon="⭐" label="Reviews Management" />
              <ManagementButton icon="📊" label="Customer Data Export" />
              <ManagementButton icon="🔔" label="Notifications" />
              <ManagementButton icon="⏰" label="Reminder System" />
              <ManagementButton icon="🍽️" label="Catering Requests" />
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

