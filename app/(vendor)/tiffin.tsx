/**
 * Vendor Tiffin Management Screen
 * Manage tiffin orders and calendar
 */

import { View, Text, ScrollView } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';

export default function VendorTiffinScreen() {
  return (
    <ScreenContainer className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6">
          <Text className="text-2xl font-bold text-foreground mb-4">Tiffin Management</Text>
          
          {/* Empty State */}
          <View className="flex-1 items-center justify-center py-12">
            <Text className="text-5xl mb-4">📅</Text>
            <Text className="text-lg font-semibold text-foreground mb-2">No Tiffin Orders</Text>
            <Text className="text-muted text-center">Tiffin orders will appear here</Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
