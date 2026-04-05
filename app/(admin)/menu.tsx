/**
 * Admin Menu Management Screen
 * Add, edit, and delete menu items
 */

import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';

export default function AdminMenuScreen() {
  return (
    <ScreenContainer className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-2xl font-bold text-foreground">Menu Management</Text>
            <TouchableOpacity className="bg-primary rounded-lg px-4 py-2">
              <Text className="text-background font-semibold text-sm">Add Item</Text>
            </TouchableOpacity>
          </View>
          
          {/* Empty State */}
          <View className="flex-1 items-center justify-center py-12">
            <Text className="text-5xl mb-4">🍽️</Text>
            <Text className="text-lg font-semibold text-foreground mb-2">No Items</Text>
            <Text className="text-muted text-center">Add menu items to get started</Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
