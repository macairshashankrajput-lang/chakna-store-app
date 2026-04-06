import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useAuth } from '@/lib/auth-context';

interface KPICard {
  label: string;
  value: string;
  icon: string;
  color: string;
}

const kpiCards: KPICard[] = [
  { label: 'New Orders', value: '12', icon: 'box', color: 'bg-blue-100' },
  { label: 'Active Orders', value: '5', icon: 'truck', color: 'bg-orange-100' },
  { label: 'Earnings', value: 'Rs 2,450', icon: 'rupee', color: 'bg-green-100' },
  { label: 'Rating', value: '4.8', icon: 'star', color: 'bg-yellow-100' },
];

export default function VendorDashboardScreen() {
  const { state } = useAuth();

  return (
    <ScreenContainer className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6">
          <View className="mb-6 flex-row items-center justify-between">
            <View>
              <Text className="text-3xl font-bold text-foreground mb-1">
                Welcome, {state.user?.name?.split(' ')[0]}
              </Text>
              <Text className="text-muted text-sm">Vendor Dashboard</Text>
            </View>
            <TouchableOpacity className="bg-success rounded-full px-4 py-2">
              <Text className="text-white font-semibold text-sm">Online</Text>
            </TouchableOpacity>
          </View>

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

          <View className="mb-6">
            <Text className="text-lg font-bold text-foreground mb-3">Quick Actions</Text>
            <View className="gap-2">
              <QuickActionButton icon="list" label="View Orders" />
              <QuickActionButton icon="calendar" label="Tiffin Schedule" />
              <QuickActionButton icon="chart" label="Analytics" />
              <QuickActionButton icon="settings" label="Settings" />
            </View>
          </View>

          <View>
            <Text className="text-lg font-bold text-foreground mb-3">Recent Orders</Text>
            <View className="bg-surface rounded-lg p-4 border border-border items-center justify-center py-8">
              <Text className="text-4xl mb-2">inbox</Text>
              <Text className="text-muted text-sm">No recent orders</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

interface QuickActionButtonProps {
  icon: string;
  label: string;
}

function QuickActionButton({ icon, label }: QuickActionButtonProps) {
  return (
    <TouchableOpacity className="bg-surface rounded-lg px-4 py-3 flex-row items-center gap-3 border border-border active:opacity-70">
      <Text className="text-2xl">{icon}</Text>
      <Text className="text-foreground font-semibold flex-1">{label}</Text>
      <Text className="text-muted">arrow-right</Text>
    </TouchableOpacity>
  );
}
