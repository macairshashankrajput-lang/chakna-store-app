/**
 * Catering Service Form
 * Event planning request form
 */

import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useState } from 'react';

export default function CateringScreen() {
    const [form, setForm] = useState({
        eventDate: '',
        guestCount: '',
        menuType: 'both',
        notes: '',
    });

    const handleSubmit = () => {
        // TODO: tRPC createCateringRequest
        alert('Catering request submitted! Vendor will contact you.');
    };

    return (
        <ScreenContainer className="flex-1 bg-background">
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-4 py-6">
                <Text className="text-3xl font-bold text-foreground mb-6">Catering Request</Text>

                <View className="space-y-4 mb-6">
                    <View>
                        <Text className="text-foreground font-semibold mb-2">Event Date *</Text>
                        <TextInput
                            className="bg-surface p-4 rounded-2xl border border-border"
                            placeholder="YYYY-MM-DD"
                            value={form.eventDate}
                            onChangeText={(text) => setForm({ ...form, eventDate: text })}
                        />
                    </View>

                    <View>
                        <Text className="text-foreground font-semibold mb-2">Guest Count *</Text>
                        <TextInput
                            className="bg-surface p-4 rounded-2xl border border-border"
                            placeholder="e.g. 50"
                            keyboardType="numeric"
                            value={form.guestCount}
                            onChangeText={(text) => setForm({ ...form, guestCount: text })}
                        />
                    </View>

                    <View>
                        <Text className="text-foreground font-semibold mb-2">Menu Type *</Text>
                        <View className="flex-row gap-2">
                            {(['veg', 'non-veg', 'both', 'alcohol'] as const).map((type) => (
                                <TouchableOpacity
                                    key={type}
                                    className={`flex-1 p-4 rounded-xl border-2 ${form.menuType === type
                                            ? 'bg-primary border-primary'
                                            : 'bg-surface border-border'
                                        }`}
                                    onPress={() => setForm({ ...form, menuType: type })}
                                >
                                    <Text className={`font-semibold text-center ${form.menuType === type ? 'text-background' : 'text-foreground'
                                        }`}>
                                        {type.toUpperCase()}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View>
                        <Text className="text-foreground font-semibold mb-2">Additional Notes</Text>
                        <TextInput
                            className="bg-surface p-4 rounded-2xl border border-border h-32"
                            placeholder="Special requirements, dietary restrictions..."
                            multiline
                            value={form.notes}
                            onChangeText={(text) => setForm({ ...form, notes: text })}
                        />
                    </View>
                </View>

                <TouchableOpacity
                    className="bg-primary py-4 rounded-2xl items-center"
                    onPress={handleSubmit}
                >
                    <Text className="text-2xl font-bold text-background">Submit Request</Text>
                </TouchableOpacity>
            </ScrollView>
        </ScreenContainer>
    );
}

