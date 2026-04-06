/**
 * Admin Catering Requests
 * View and manage catering orders
 */

import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { CateringRequest } from '@/shared/types';

const mockRequests: CateringRequest[] = [
    {
        id: 'cr1',
        userId: 'user1',
        eventDate: '2024-02-20',
        guestCount: 50,
        menuType: 'both',
        notes: 'Wedding reception, prefer non-veg heavy',
        status: 'confirmed',
        createdAt: '2024-01-20T10:00:00Z',
    },
    {
        id: 'cr2',
        userId: 'user2',
        eventDate: '2024-02-15',
        guestCount: 30,
        menuType: 'veg',
        status: 'cancelled',
        createdAt: '2024-01-18T14:30:00Z',
    },
    // TODO: tRPC.cateringRequests.list()
];

const statusColors = {
    confirmed: 'bg-green-100 border-green-200 text-green-800',
    cancelled: 'bg-red-100 border-red-200 text-red-800',
    'in-progress': 'bg-yellow-100 border-yellow-200 text-yellow-800',
    completed: 'bg-blue-100 border-blue-200 text-blue-800',
};

export default function CateringRequestsScreen() {
    const renderRequest = ({ item }: { item: CateringRequest }) => (
        <TouchableOpacity className="bg-surface rounded-2xl p-6 mb-4 border border-border active:opacity-90">
            <View className="flex-row justify-between items-start mb-3">
                <Text className="text-2xl font-bold text-foreground">{item.guestCount} Guests</Text>
                <View className={`px-3 py-1 rounded-full border ${statusColors[item.status as keyof typeof statusColors] || 'bg-gray-100 border-gray-200 text-gray-800'}`}>
                    <Text className="font-semibold capitalize">{item.status}</Text>
                </View>
            </View>
            <Text className="text-muted mb-2">{item.menuType.toUpperCase()} • {item.eventDate}</Text>
            {item.notes && <Text className="text-foreground mb-4 italic">"{item.notes}"</Text>}
            <View className="flex-row gap-2">
                <TouchableOpacity className="flex-1 bg-primary py-2 rounded-xl">
                    <Text className="text-background font-semibold text-center">Share Details</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 bg-muted py-2 rounded-xl border border-border">
                    <Text className="text-foreground font-semibold text-center">Update Status</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <ScreenContainer className="flex-1 bg-background">
            <ScrollView className="px-4 py-6">
                <Text className="text-3xl font-bold text-foreground mb-6">Catering Requests</Text>
                <Text className="text-muted mb-6">Manage event catering orders</Text>

                <FlatList
                    data={mockRequests}
                    renderItem={renderRequest}
                    keyExtractor={item => item.id}
                    ListEmptyComponent={
                        <View className="items-center py-12">
                            <Text className="text-5xl mb-4">🍽️</Text>
                            <Text className="text-lg font-semibold text-foreground mb-2">No Requests</Text>
                            <Text className="text-muted text-center">Catering requests will appear here</Text>
                        </View>
                    }
                />
            </ScrollView>
        </ScreenContainer>
    );
}

