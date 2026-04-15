/**
 * Admin Analytics Screen
 * View platform analytics and reports
 */

import { View, Text, ScrollView } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';

export const unstable_settings = {
  preserveState: true
};

export default function AdminAnalyticsScreen() {
  return (
    <ScreenContainer className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6">
          <Text className="text-2xl font-bold text-foreground mb-4">Analytics</Text>

          {/* Empty State */}
          <View className="flex-1 items-center justify-center py-12">
            <Text className="text-5xl mb-4">📊</Text>
            <Text className="text-lg font-semibold text-foreground mb-2">Analytics Coming Soon</Text>
            <Text className="text-muted text-center">Detailed analytics and reports will be available here</Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
