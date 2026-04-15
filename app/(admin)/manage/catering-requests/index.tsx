/**
 * Admin Catering Requests Screen
 * View and manage customer catering service requests
 */

import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { AdminDataTable } from '@/components/ui/admin-data-table';
import { AdminProvider, useAdminContext } from '@/lib/admin-context';
import { EmptyState } from '@/components/ui/empty-state';
import { SkeletonLoader } from '@/components/ui/skeleton-loader';

interface CateringRequest {
    id: string;
    customerName: string;
    eventDate: string;
    guestCount: number;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    budget: number;
}

const mockCateringRequests: CateringRequest[] = [
    {
        id: '1',
        customerName: 'John Doe Wedding',
        eventDate: '2026-05-15',
        guestCount: 150,
        status: 'pending',
        budget: 50000,
    },
    {
        id: '2',
        customerName: 'Corporate Event',
        eventDate: '2026-04-25',
        guestCount: 75,
        status: 'confirmed',
        budget: 25000,
    },
];

function CateringRequestsContent() {
    const [requests, setRequests] = useState<CateringRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setRequests(mockCateringRequests);
            setLoading(false);
        }, 1000);
    }, []);

    const renderRequest = ({ item }: { item: CateringRequest }) => (
        <View className="p-4 border-b border-border bg-surface rounded-lg">
            <View className="flex-row items-start justify-between mb-2">
                <Text className="text-lg font-bold text-foreground flex-1 pr-4">
                    {item.customerName}
                </Text>
                <View className={`px-3 py-1 rounded-full ${item.status === 'pending' ? 'bg-warning/20' :
                    item.status === 'confirmed' ? 'bg-success/20' :
                        item.status === 'cancelled' ? 'bg-error/20' : 'bg-muted/20'
                    }`}>
                    <Text className={`text-xs font-semibold capitalize ${item.status === 'pending' ? 'text-warning' :
                        item.status === 'confirmed' ? 'text-success' :
                            item.status === 'cancelled' ? 'text-error' : 'text-muted'
                        }`}>
                        {item.status}
                    </Text>
                </View>
            </View>
            <Text className="text-sm text-muted mb-1">Date: {item.eventDate}</Text>
            <Text className="text-sm text-muted mb-2">Guests: {item.guestCount}</Text>
            <Text className="text-primary font-semibold">₹{item.budget.toLocaleString()}</Text>
        </View>
    );

    return (
        <View className="flex-1">
            <AdminDataTable
                data={requests}
                keyExtractor={(item) => item.id}
                renderItem={renderRequest}
                filterOptions={[
                    { label: 'Pending', value: 'pending' },
                    { label: 'Confirmed', value: 'confirmed' },
                    { label: 'Completed', value: 'completed' },
                    { label: 'Cancelled', value: 'cancelled' },
                ]}
                onRefresh={async () => {
                    setLoading(true);
                    // Refresh logic
                    setTimeout(() => setLoading(false), 1000);
                }}
                loading={loading}
                emptyTitle="No Catering Requests"
                emptyDescription="No catering requests to review at the moment."
                searchKeys={['customerName'] as any}
            />
        </View>
    );
}

export default function AdminCateringRequestsScreen() {
    return (
        <ScreenContainer className="flex-1 bg-background">
            <CateringRequestsContent />
        </ScreenContainer>
    );
}

