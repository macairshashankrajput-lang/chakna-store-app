/**
 * Forgot Password Screen
 * Sends a Supabase password reset email by username or phone identifier.
 */

import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useAuth } from '@/lib/auth-context';

const appLogo = require('@/applogo.png');

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const { forgotPassword, state } = useAuth();
    const [identifier, setIdentifier] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleReset = async () => {
        if (!identifier.trim()) {
            Alert.alert('Error', 'Please enter your username or phone number');
            return;
        }

        setIsLoading(true);
        try {
            await forgotPassword(identifier.trim());
            Alert.alert('Reset Sent', 'Check your email for password reset instructions.');
            router.push('./login');
        } catch (error) {
            Alert.alert('Reset Failed', state.error || 'Unable to send reset email.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScreenContainer className="flex-1 bg-background">
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
                <View className="flex-1 justify-center px-6 py-8">
                    <View className="mb-8 items-center">
                        <View className="w-[140px] h-[140px] rounded-lg bg-surface p-4 items-center justify-center shadow-sm mb-4">
                            <Image
                                source={appLogo}
                                style={{ width: 96, height: 96, resizeMode: 'cover', borderRadius: 12 }}
                            />
                        </View>
                        <Text className="text-4xl font-bold text-primary mb-2">Forgot Password</Text>
                        <Text className="text-base text-muted text-center">
                            Enter your username or phone to receive reset instructions.
                        </Text>
                    </View>

                    <View className="mb-6">
                        <Text className="text-sm font-semibold text-foreground mb-2">Username or Phone</Text>
                        <TextInput
                            className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                            placeholder="username or +91 98765 43210"
                            placeholderTextColor="#687076"
                            value={identifier}
                            onChangeText={setIdentifier}
                            editable={!isLoading}
                            keyboardType="default"
                            autoCapitalize="none"
                        />
                    </View>

                    {state.error && (
                        <View className="bg-error/10 border border-error rounded-lg px-4 py-3 mb-4">
                            <Text className="text-error text-sm">{state.error}</Text>
                        </View>
                    )}

                    <TouchableOpacity
                        className="w-full bg-primary rounded-lg py-4 items-center mb-4"
                        onPress={handleReset}
                        disabled={isLoading}
                        style={{ opacity: isLoading ? 0.6 : 1 }}
                    >
                        <Text className="text-background font-bold text-base">
                            {isLoading ? 'Sending reset...' : 'Send Reset Link'}
                        </Text>
                    </TouchableOpacity>

                    <View className="flex-row justify-center items-center mt-4">
                        <Text className="text-muted text-sm">Remembered your password? </Text>
                        <TouchableOpacity onPress={() => router.push('./login')}>
                            <Text className="text-primary font-bold text-sm">Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </ScreenContainer>
    );
}
