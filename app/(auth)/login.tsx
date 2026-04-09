/**
 * Login Screen
 * User authentication with email and password
 * Demo credentials available for testing
 */

import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useAuth } from '@/lib/auth-context';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, state, getTestUsers } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);

  const testUsers = getTestUsers();

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    if (!password) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }
    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email');
      return;
    }

    setIsLoading(true);
    try {
      await signIn(email.toLowerCase().trim(), password);
    } catch (error) {
      Alert.alert('Login Failed', state.error || 'Invalid credentials. Try demo credentials below.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (testUser: typeof testUsers[0]) => {
    setIsLoading(true);
    try {
      await signIn(testUser.email, testUser.password);
    } catch (error) {
      Alert.alert('Login Failed', state.error || 'Demo login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenContainer className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 justify-center px-6 py-8">
          {/* Header */}
          <View className="mb-8">
            <Text className="text-4xl font-bold text-primary mb-2">Chakna Store</Text>
            <Text className="text-lg text-foreground mb-1">Welcome Back</Text>
            <Text className="text-base text-muted">Sign in to your account</Text>
          </View>

          {/* Email Input */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-foreground mb-2">Email</Text>
            <TextInput
              className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholder="you@example.com"
              placeholderTextColor="#687076"
              value={email}
              onChangeText={setEmail}
              editable={!isLoading}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password Input */}
          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-sm font-semibold text-foreground">Password</Text>
              <TouchableOpacity>
                <Text className="text-sm text-primary font-semibold">Forgot?</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholder="••••••••"
              placeholderTextColor="#687076"
              value={password}
              onChangeText={setPassword}
              editable={!isLoading}
              secureTextEntry
            />
          </View>

          {/* Error Message */}
          {state.error && (
            <View className="bg-error/10 border border-error rounded-lg px-4 py-3 mb-4">
              <Text className="text-error text-sm">{state.error}</Text>
            </View>
          )}

          {/* Login Button */}
          <TouchableOpacity
            className="w-full bg-primary rounded-lg py-4 items-center mb-4"
            onPress={handleLogin}
            disabled={isLoading}
            style={{ opacity: isLoading ? 0.6 : 1 }}
          >
            <Text className="text-background font-bold text-base">
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center mb-4">
            <View className="flex-1 h-px bg-border" />
            <Text className="mx-3 text-muted text-sm">or</Text>
            <View className="flex-1 h-px bg-border" />
          </View>

          {/* Social Login Buttons */}
          <TouchableOpacity className="w-full border border-border rounded-lg py-3 items-center mb-4">
            <Text className="text-foreground font-semibold">Sign in with Google</Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View className="flex-row justify-center items-center mt-6">
            <Text className="text-muted text-sm">Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('./register')}>
              <Text className="text-primary font-bold text-sm">Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* Demo Credentials Section */}
          <View className="mt-8 pt-6 border-t border-border">
            <TouchableOpacity
              onPress={() => setShowDemoCredentials(!showDemoCredentials)}
              className="flex-row items-center justify-between"
            >
              <Text className="text-sm font-semibold text-muted">Demo Credentials</Text>
              <Text className="text-lg text-muted">{showDemoCredentials ? '−' : '+'}</Text>
            </TouchableOpacity>

            {showDemoCredentials && (
              <View className="mt-4 gap-2">
                {testUsers.map((user, index) => (
                  <TouchableOpacity
                    key={index}
                    className="bg-surface rounded-lg p-3 border border-border active:opacity-70"
                    onPress={() => handleQuickLogin(user)}
                    disabled={isLoading}
                  >
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1">
                        <Text className="text-sm font-semibold text-foreground">{user.name}</Text>
                        <Text className="text-xs text-muted">{user.email}</Text>
                        <Text className="text-xs text-muted capitalize">Role: {user.role}</Text>
                      </View>
                      <Text className="text-primary font-bold text-xs">Login</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
