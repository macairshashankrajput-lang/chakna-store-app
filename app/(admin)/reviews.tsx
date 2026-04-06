/**
 * Admin Reviews Management
 * View and moderate customer reviews
 */

import { View, Text, ScrollView, FlatList } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { Review } from '@/shared/types';

const mockReviews: Review[] = [
    {
        id: 'r1',
        userId: 'user1',
        productId: '1',
        rating: 5,
        comment: 'Excellent masala peanuts! Perfect spice level.',
        createdAt: '2024-01-15T10:30:00Z',
    },
    {
        id: 'r2',
        userId: 'user2',
        orderId: 'o1',
        rating: 4,
        comment: 'Samosas were great, but a bit oily.',
        createdAt: '2024-01-14T18:45:00Z',
    },
    // TODO: tRPC.reviews.list()
];

export default function AdminReviewsScreen() {
    const renderReview = ({ item }: { item: Review }) => (
        <View className="bg-surface p-6 rounded-2xl mb-4 border border-border">
            <View className="flex-row items-center mb-3">
                <View className="flex-row">
                    {[...Array(5)].map((_, i) => (
                        <Text key={i} className={i < item.rating ? 'text-yellow-400 text-xl' : 'text-muted text-xl'}>⭐</Text>
                    ))}
                </View>
                <Text className="ml-3 font-bold text-lg text-foreground">({item.rating}/5)</Text>
            </View>
            <Text className="text-foreground font-semibold mb-2">{item.comment}</Text>
            <Text className="text-muted text-sm">Review #{item.id.slice(-4)} • {new Date(item.createdAt).toLocaleDateString()}</Text>
        </View>
    );

    return (
        <ScreenContainer className="flex-1 bg-background">
            <ScrollView className="px-4 py-6">
                <Text className="text-3xl font-bold text-foreground mb-6">Customer Reviews</Text>
                <Text className="text-muted mb-6">Manage ratings and feedback</Text>

                <FlatList
                    data={mockReviews}
                    renderItem={renderReview}
                    keyExtractor={item => item.id}
                    ListEmptyComponent={
                        <View className="items-center py-12">
                            <Text className="text-5xl mb-4">⭐</Text>
                            <Text className="text-lg font-semibold text-foreground mb-2">No Reviews</Text>
                            <Text className="text-muted text-center">Reviews will appear here when customers rate orders</Text>
                        </View>
                    }
                />
            </ScrollView>
        </ScreenContainer>
    );
}

