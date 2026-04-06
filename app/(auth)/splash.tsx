/**
 * Splash Screen
 * Initial loading screen with app logo and branding
 */

import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/lib/auth-context';
import { ScreenContainer } from '@/components/screen-container';

export default function SplashScreen() {
  const router = useRouter();
  const { state } = useAuth();

  useEffect(() => {
    // Simulate loading and then navigate to onboarding or login
    const timer = setTimeout(() => {
      router.replace('/(auth)/login');
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);


  return (
    <ScreenContainer className="flex-1 items-center justify-center bg-background">
      <View className="items-center gap-4">
        {/* App Logo */}
        <View className="w-24 h-24 rounded-2xl bg-primary items-center justify-center shadow-lg">
          <Text className="text-5xl">🍱</Text>
        </View>

        {/* App Name */}
        <Text className="text-3xl font-bold text-foreground text-center">
          Chakna Store
        </Text>

        {/* Tagline */}
        <Text className="text-base text-muted text-center mt-2">
          Your Favorite Food, Delivered Fresh
        </Text>

        {/* Loading Indicator */}
        <View className="mt-8">
          <Text className="text-sm text-muted">Loading...</Text>
        </View>
      </View>
    </ScreenContainer>
  );
}
