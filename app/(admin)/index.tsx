/**
 * Admin Dashboard Screen
 * Overview of platform metrics and management options
 */

import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useAuth } from '@/lib/auth-context';

interface KPICard {
  label: string;
  value: string;
  icon: string;
}

const kpiCards: KPICard[] = [
  { label: 'Total Orders', value: '1,234', icon: 'box' },
  { label: 'Revenue', value: 'Rs 45,600', icon: 'rupee' },
  { label: 'Active Users', value: '342', icon: 'users' },
  { label: 'Vendors', value: '28', icon: 'store' },
];

export default function AdminDashboardScreen() {
  const { state } = useAuth();

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

interface ManagementButtonProps {
  icon: string;
  label: string;
}

function ManagementButton({ icon, label }: ManagementButtonProps) {
  return (
    <TouchableOpacity className="bg-surface rounded-lg px-4 py-3 flex-row items-center gap-3 border border-border active:opacity-70">
      <Text className="text-2xl">{icon}</Text>
      <Text className="text-foreground font-semibold flex-1">{label}</Text>
      <Text className="text-muted">→</Text>
    </TouchableOpacity>
  );
}
