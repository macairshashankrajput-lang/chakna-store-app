/**
 * Delivery Addresses Screen
 * Manage saved delivery addresses for the customer.
 */

import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';

const savedAddresses = [
    {
        id: 'home',
        title: 'Home Address',
        address: '123 Biryani Street, City Center',
        note: 'Primary delivery address',
    },
    {
        id: 'office',
        title: 'Office Address',
        address: 'Flat 4B, Sunrise Apartments',
        note: 'Work delivery address',
    },
];

export default function DeliveryAddressesScreen() {
    const router = useRouter();

    return (
        <ScreenContainer className="flex-1 bg-background">
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
                <View className="px-4 py-6">
                    <View className="flex-row items-center justify-between mb-6">
                        <TouchableOpacity onPress={() => router.back()}>
                            <Text className="text-2xl">←</Text>
                        </TouchableOpacity>
                        <Text className="text-2xl font-bold text-foreground">Delivery Addresses</Text>
                        <View className="w-10" />
                    </View>

                    <View className="bg-surface rounded-3xl border border-border p-5 mb-6">
                        <Text className="text-base text-muted mb-3">Manage your delivery addresses for faster checkout.</Text>
                        {savedAddresses.map((address) => (
                            <View key={address.id} className="mb-4 p-4 rounded-3xl bg-background border border-border">
                                <Text className="font-semibold text-foreground mb-1">{address.title}</Text>
                                <Text className="text-muted text-sm mb-2">{address.address}</Text>
                                <Text className="text-xs text-muted">{address.note}</Text>
                            </View>
                        ))}
                    </View>

                    <TouchableOpacity className="bg-primary rounded-3xl py-4 items-center mb-4">
                        <Text className="text-background font-bold">Add New Address</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="border border-border rounded-3xl py-4 items-center" onPress={() => router.push('./profile')}>
                        <Text className="text-foreground font-semibold">Back to Profile</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </ScreenContainer>
    );
}
