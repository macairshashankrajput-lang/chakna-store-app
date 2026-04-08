/**
 * Admin Reviews Management Screen
 * View and manage customer reviews
 */

import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useState } from 'react';

interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  itemName: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

const mockReviews: Review[] = [
  {
    id: '1',
    customerName: 'John Doe',
    rating: 5,
    comment: 'Excellent quality and taste!',
    itemName: 'Masala Peanuts',
    date: '2026-04-08',
    status: 'pending',
  },
  {
    id: '2',
    customerName: 'Jane Smith',
    rating: 4,
    comment: 'Good but a bit pricey',
    itemName: 'Chivda Mix',
    date: '2026-04-07',
    status: 'approved',
  },
];

export default function AdminReviewsScreen() {
  const [reviews, setReviews] = useState(mockReviews);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const filteredReviews = reviews.filter(review =>
    filterStatus === 'all' ? true : review.status === filterStatus
  );

  const handleApprove = (id: string) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, status: 'approved' } : r));
  };

  const handleReject = (id: string) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
  };

  const renderStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <ScreenContainer className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6">
          {/* Header */}
          <View className="mb-6">
            <Text className="text-3xl font-bold text-foreground mb-2">Reviews Management</Text>
            <Text className="text-muted text-sm">Moderate and manage customer reviews</Text>
          </View>

          {/* Filter Buttons */}
          <View className="flex-row gap-2 mb-6">
            {(['all', 'pending', 'approved', 'rejected'] as const).map(status => (
              <TouchableOpacity
                key={status}
                className={`px-4 py-2 rounded-full ${
                  filterStatus === status
                    ? 'bg-primary'
                    : 'bg-surface border border-border'
                }`}
                onPress={() => setFilterStatus(status)}
              >
                <Text
                  className={`text-sm font-semibold capitalize ${
                    filterStatus === status ? 'text-white' : 'text-foreground'
                  }`}
                >
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Reviews List */}
          <View>
            {filteredReviews.length > 0 ? (
              filteredReviews.map(review => (
                <View
                  key={review.id}
                  className="bg-surface rounded-lg p-4 mb-3 border border-border"
                >
                  {/* Review Header */}
                  <View className="flex-row items-start justify-between mb-2">
                    <View className="flex-1">
                      <Text className="text-base font-bold text-foreground">
                        {review.customerName}
                      </Text>
                      <Text className="text-sm text-muted">{review.itemName}</Text>
                    </View>
                    <View
                      className={`px-2 py-1 rounded ${
                        review.status === 'approved'
                          ? 'bg-success/20'
                          : review.status === 'rejected'
                          ? 'bg-error/20'
                          : 'bg-warning/20'
                      }`}
                    >
                      <Text
                        className={`text-xs font-semibold capitalize ${
                          review.status === 'approved'
                            ? 'text-success'
                            : review.status === 'rejected'
                            ? 'text-error'
                            : 'text-warning'
                        }`}
                      >
                        {review.status}
                      </Text>
                    </View>
                  </View>

                  {/* Rating */}
                  <Text className="text-yellow-500 font-bold mb-2">
                    {renderStars(review.rating)}
                  </Text>

                  {/* Comment */}
                  <Text className="text-sm text-foreground mb-3 leading-relaxed">
                    {review.comment}
                  </Text>

                  {/* Date */}
                  <Text className="text-xs text-muted mb-3">{review.date}</Text>

                  {/* Action Buttons */}
                  {review.status === 'pending' && (
                    <View className="flex-row gap-2">
                      <TouchableOpacity
                        className="flex-1 bg-success/20 rounded-lg py-2 items-center"
                        onPress={() => handleApprove(review.id)}
                      >
                        <Text className="text-success font-bold text-sm">Approve</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="flex-1 bg-error/20 rounded-lg py-2 items-center"
                        onPress={() => handleReject(review.id)}
                      >
                        <Text className="text-error font-bold text-sm">Reject</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))
            ) : (
              <View className="items-center py-8">
                <Text className="text-muted text-base">No reviews found</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
