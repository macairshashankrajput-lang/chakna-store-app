/**
 * Vendor Orders Screen
 * Manage incoming orders and update status
 */

import { View, Text, ScrollView } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';

export default function VendorOrdersScreen() {
  return (
    <ScreenContainer className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6">
          <Text className="text-2xl font-bold text-foreground mb-4">Orders</Text>
          
          {/* Empty State */}
          <View className="flex-1 items-center justify-center py-12">
            <Text className="text-5xl mb-4">📭</Text>
            <Text className="text-lg font-semibold text-foreground mb-2">No Orders</Text>
            <Text className="text-muted text-center">New orders will appear here</Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
