/**
 * Admin Profile Screen
 * Admin account and settings
 */

import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useAuth } from '@/lib/auth-context';
import { ScreenContainer } from '@/components/screen-container';

export default function AdminProfileScreen() {
  const { state, signOut } = useAuth();
  const user = state.user;

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        onPress: async () => {
          await signOut();
        },
        style: 'destructive',
      },
    ]);
  };

  return (
    <ScreenContainer className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6">
          {/* Profile Header */}
          <View className="bg-surface rounded-2xl p-6 mb-6 items-center border border-border">
            <View className="w-20 h-20 rounded-full bg-primary items-center justify-center mb-4">
              <Text className="text-4xl">👨‍💼</Text>
            </View>
            <Text className="text-2xl font-bold text-foreground mb-1">{user?.name || 'Admin'}</Text>
            <Text className="text-muted text-sm">{user?.email}</Text>
            <Text className="text-muted text-sm">{user?.phone}</Text>
          </View>

          {/* Menu Items */}
          <View className="gap-2 mb-6">
            <ProfileMenuItem icon="👥" label="User Management" />
            <ProfileMenuItem icon="🏪" label="Vendor Management" />
            <ProfileMenuItem icon="📊" label="Platform Analytics" />
            <ProfileMenuItem icon="⚙️" label="System Settings" />
            <ProfileMenuItem icon="🔐" label="Security" />
            <ProfileMenuItem icon="❓" label="Help & Support" />
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            className="w-full bg-error rounded-lg py-4 items-center"
            onPress={handleLogout}
          >
            <Text className="text-background font-bold text-base">Logout</Text>
          </TouchableOpacity>

          {/* App Version */}
          <View className="mt-6 items-center">
            <Text className="text-muted text-xs">Chakna Store Admin v1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

interface ProfileMenuItemProps {
  icon: string;
  label: string;
}

function ProfileMenuItem({ icon, label }: ProfileMenuItemProps) {
  return (
    <TouchableOpacity className="bg-surface rounded-lg px-4 py-3 flex-row items-center justify-between border border-border active:opacity-70">
      <View className="flex-row items-center gap-3">
        <Text className="text-2xl">{icon}</Text>
        <Text className="text-foreground font-semibold">{label}</Text>
      </View>
      <Text className="text-muted text-lg">→</Text>
    </TouchableOpacity>
  );
}
