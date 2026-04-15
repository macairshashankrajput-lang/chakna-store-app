/**
 * Referral Program Screen
 * Invite friends and earn rewards.
 */

import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';

export default function ReferralScreen() {
    const router = useRouter();
    const referralCode = 'CHAKNA2026';

    return (
        <ScreenContainer className="flex-1 bg-background">
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
                <View className="px-4 py-6">
                    <View className="flex-row items-center justify-between mb-6">
                        <TouchableOpacity onPress={() => router.back()}>
                            <Text className="text-2xl">←</Text>
                        </TouchableOpacity>
                        <Text className="text-2xl font-bold text-foreground">Referral Program</Text>
                        <View className="w-10" />
                    </View>

                    <View className="bg-surface rounded-3xl border border-border p-5 mb-6">
                        <Text className="text-base text-muted mb-4">Share this code with friends and earn reward points on every successful referral.</Text>
                        <View className="bg-primary/10 rounded-3xl p-4">
                            <Text className="text-lg font-bold text-foreground mb-2">Your referral code</Text>
                            <Text className="text-2xl font-bold text-primary">{referralCode}</Text>
                        </View>
                    </View>

                    <TouchableOpacity className="bg-primary rounded-3xl py-4 items-center mb-4">
                        <Text className="text-background font-bold">Copy Code</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="border border-border rounded-3xl py-4 items-center" onPress={() => router.push('./profile')}>
                        <Text className="text-foreground font-semibold">Back to Profile</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </ScreenContainer>
    );
}
