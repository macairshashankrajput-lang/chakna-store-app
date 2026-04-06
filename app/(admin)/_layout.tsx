/**
 * Admin Stack Layout
 * Manages navigation for admin role
 */

import { Tabs } from 'expo-router';
import { useColors } from '@/hooks/use-colors';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { HapticTab } from '@/components/haptic-tab';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';

import { useAuth } from '@/lib/auth-context';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

export default function AdminLayout() {
  const { state } = useAuth();
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === 'web' ? 12 : Math.max(insets.bottom, 8);
  const tabBarHeight = 56 + bottomPadding;

  useEffect(() => {
    if (state.isLoading) return;

    if (!state.user || state.user?.role !== 'admin') {
      router.replace('/(auth)/login');
      return;
    }
  }, [state.isLoading, state.user, router]);

  if (state.isLoading || !state.user || state.user.role !== 'admin') {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-foreground">Loading...</Text>
      </View>
    );
  }


  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          paddingTop: 8,
          paddingBottom: bottomPadding,
          height: tabBarHeight,
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 0.5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: 'Menu',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analytics',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="chevron.right" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
