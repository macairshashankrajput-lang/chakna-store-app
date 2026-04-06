/**
 * Customer Favorites Screen
 * View saved favorite items and restaurants
 */

import { View, Text, ScrollView } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';

export default function FavoritesScreen() {
  return (
    <ScreenContainer className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6">
          <Text className="text-2xl font-bold text-foreground mb-4">Favorites</Text>
          
          {/* Empty State */}
          <View className="flex-1 items-center justify-center py-12">
            <Text className="text-5xl mb-4">❤️</Text>
            <Text className="text-lg font-semibold text-foreground mb-2">No Favorites Yet</Text>
            <Text className="text-muted text-center">Save your favorite items and restaurants here</Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
