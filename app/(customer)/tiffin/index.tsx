/**
 * Tiffin Service Screen
 * Points-based subscription with calendar
 */

import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useState } from 'react';

export default function TiffinScreen() {
    const [pointsBalance, setPointsBalance] = useState(150);
    const [selectedDate, setSelectedDate] = useState(new Date().toDateString());

    const handleOrderTiffin = () => {
        // TODO: tRPC createTiffinOrder
        alert('Tiffin order placed for ' + selectedDate);
        setPointsBalance(pointsBalance - 20);
    };

    return (
        <ScreenContainer className="flex-1 bg-background">
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-4 py-6">
                <Text className="text-3xl font-bold text-foreground mb-6">Tiffin Service</Text>

                {/* Points Balance */}
                <View className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 mb-8 items-center">
                    <Text className="text-white text-3xl font-bold mb-1">Points Balance</Text>
                    <Text className="text-white text-4xl font-bold">{pointsBalance}</Text>
                </View>

                {/* Calendar Picker Stub */}
                <View className="bg-surface rounded-2xl p-6 mb-8 items-center border border-border">
                    <Text className="text-2xl mb-2">📅 Select Date</Text>
                    <TouchableOpacity className="bg-primary px-6 py-3 rounded-xl">
                        <Text className="text-background font-bold text-lg">{selectedDate}</Text>
                    </TouchableOpacity>
                    <Text className="text-muted mt-2 text-sm">Edit min 2 days prior</Text>
                </View>

                {/* Menu Selection */}
                <View className="mb-6">
                    <Text className="text-lg font-bold text-foreground mb-4">Today's Menu</Text>
                    <View className="space-y-3">
                        <View className="bg-surface p-4 rounded-xl border border-border">
                            <Text className="font-bold">Lunch: Dal Rice + Veg Curry (20 points)</Text>
                        </View>
                        <View className="bg-surface p-4 rounded-xl border border-border">
                            <Text className="font-bold">Dinner: Roti Sabji + Salad (15 points)</Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    className="bg-primary py-4 rounded-2xl items-center mb-6"
                    onPress={handleOrderTiffin}
                    disabled={pointsBalance < 20}
                >
                    <Text className="text-2xl font-bold text-background">Order Tiffin (35 points)</Text>
                </TouchableOpacity>

                <Text className="text-muted text-center">Vendor Location: Nearby Area</Text>
            </ScrollView>
        </ScreenContainer>
    );
}

