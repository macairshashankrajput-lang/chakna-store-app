/**
 * Coupons & Rewards Screen
 * Display customer coupons and reward status.
 */

import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';

const rewards = [
    {
        id: 'coupon-01',
        title: '20% off first order',
        description: 'Valid for your next order over ₹300.',
        expiry: 'Expires in 5 days',
    },
    {
        id: 'reward-02',
        title: '50 reward points',
        description: 'Earned for your recent order.',
        expiry: 'No expiry',
    },
];

export default function RewardsScreen() {
    const router = useRouter();

    return (
        <ScreenContainer className="flex-1 bg-background">
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
                <View className="px-4 py-6">
                    <View className="flex-row items-center justify-between mb-6">
                        <TouchableOpacity onPress={() => router.back()}>
                            <Text className="text-2xl">←</Text>
                        </TouchableOpacity>
                        <Text className="text-2xl font-bold text-foreground">Coupons & Rewards</Text>
                        <View className="w-10" />
                    </View>

                    <View className="bg-surface rounded-3xl border border-border p-5 mb-6">
                        <Text className="text-base text-muted mb-4">Use these coupons and rewards to save on your next meal.</Text>
                        {rewards.map((reward) => (
                            <View key={reward.id} className="mb-4 p-4 rounded-3xl bg-background border border-border">
                                <Text className="font-semibold text-foreground mb-1">{reward.title}</Text>
                                <Text className="text-muted text-sm mb-1">{reward.description}</Text>
                                <Text className="text-xs text-muted">{reward.expiry}</Text>
                            </View>
                        ))}
                    </View>

                    <TouchableOpacity className="bg-primary rounded-3xl py-4 items-center mb-4">
                        <Text className="text-background font-bold">Apply Coupon</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="border border-border rounded-3xl py-4 items-center" onPress={() => router.push('./profile')}>
                        <Text className="text-foreground font-semibold">Back to Profile</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </ScreenContainer>
    );
}
