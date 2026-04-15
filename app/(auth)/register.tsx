/**
 * Register Screen
 * Customer account creation only
 * Vendor and Admin accounts are managed by administrators
 */

import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useAuth } from '@/lib/auth-context';

export default function RegisterScreen() {
  const router = useRouter();
  const { signUp, state } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!formData.username.trim()) {
      Alert.alert('Error', 'Please enter a username');
      return;
    }
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const result = await signUp({
        username: formData.username.trim(),
        name: formData.name,
        email: formData.email.trim() ? formData.email.trim() : undefined,
        phone: formData.phone,
        role: 'customer',
        referralCode: formData.referralCode || undefined,
        password: formData.password,
      });
      if (!result.token) {
        Alert.alert(
          'Account Created',
          'Your account has been created successfully. You can now sign in with your username and password.',
        );
        router.push('./login');
        return;
      }
    } catch (error) {
      Alert.alert('Registration Failed', state.error || 'Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <ScreenContainer className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingVertical: 16 }} showsVerticalScrollIndicator={false}>
        <View className="px-6 py-4">
          {/* Header */}
          <View className="mb-5">
            <Text className="text-4xl font-bold text-foreground mb-2">Create Account</Text>
            <Text className="text-base text-muted">Join Chakna Store today</Text>
          </View>

          {/* Username */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-foreground mb-2">Username</Text>
            <TextInput
              className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholder="your username"
              placeholderTextColor="#687076"
              value={formData.username}
              onChangeText={value => handleInputChange('username', value)}
              editable={!isLoading}
              autoCapitalize="none"
            />
          </View>

          {/* Full Name */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-foreground mb-2">Full Name</Text>
            <TextInput
              className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholder="John Doe"
              placeholderTextColor="#687076"
              value={formData.name}
              onChangeText={value => handleInputChange('name', value)}
              editable={!isLoading}
            />
          </View>

          {/* Email */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-foreground mb-2">Email</Text>
            <TextInput
              className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholder="you@example.com"
              placeholderTextColor="#687076"
              value={formData.email}
              onChangeText={value => handleInputChange('email', value)}
              editable={!isLoading}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Phone */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-foreground mb-2">Phone Number</Text>
            <TextInput
              className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholder="+91 98765 43210"
              placeholderTextColor="#687076"
              value={formData.phone}
              onChangeText={value => handleInputChange('phone', value)}
              editable={!isLoading}
              keyboardType="phone-pad"
            />
          </View>

          {/* Info Message */}
          <View className="bg-primary/10 border border-primary rounded-lg px-4 py-3 mb-6">
            <Text className="text-sm text-foreground leading-relaxed">
              You are creating a customer account. Vendor and admin accounts are managed separately by administrators.
            </Text>
          </View>

          {/* Password */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-foreground mb-2">Password</Text>
            <TextInput
              className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholder="••••••••"
              placeholderTextColor="#687076"
              value={formData.password}
              onChangeText={value => handleInputChange('password', value)}
              editable={!isLoading}
              secureTextEntry
            />
          </View>

          {/* Confirm Password */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-foreground mb-2">Confirm Password</Text>
            <TextInput
              className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholder="••••••••"
              placeholderTextColor="#687076"
              value={formData.confirmPassword}
              onChangeText={value => handleInputChange('confirmPassword', value)}
              editable={!isLoading}
              secureTextEntry
            />
          </View>

          {/* Referral Code */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-foreground mb-2">Referral Code (Optional)</Text>
            <TextInput
              className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholder="Enter referral code"
              placeholderTextColor="#687076"
              value={formData.referralCode}
              onChangeText={value => handleInputChange('referralCode', value)}
              editable={!isLoading}
            />
            <Text className="text-xs text-muted mt-2">
              Optional referral codes give your friend 5% off when they sign up.
            </Text>
          </View>

          {/* Error Message */}
          {state.error && (
            <View className="bg-error/10 border border-error rounded-lg px-4 py-3 mb-4">
              <Text className="text-error text-sm">{state.error}</Text>
            </View>
          )}

          {/* Register Button */}
          <TouchableOpacity
            className="w-full bg-primary rounded-lg py-4 items-center mb-4"
            onPress={handleRegister}
            disabled={isLoading}
            style={{ opacity: isLoading ? 0.6 : 1 }}
          >
            <Text className="text-background font-bold text-base">
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          {/* Login Link */}
          <View className="flex-row justify-center items-center mt-4">
            <Text className="text-muted text-sm">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-primary font-bold text-sm">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
