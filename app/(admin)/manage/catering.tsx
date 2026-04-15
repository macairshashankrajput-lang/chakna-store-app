/**
 * Admin Catering Requests Screen
 * View and manage customer catering service requests
 */

import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useState } from 'react';

interface CateringRequest {
  id: string;
  customerName: string;
  customerPhone: string;
  eventName: string;
  eventDate: string;
  guestCount: number;
  budget: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
}

const customerRequests: CateringRequest[] = [
  {
    id: '1',
    customerName: 'Rajesh Kumar',
    customerPhone: '9876543210',
    eventName: 'Wedding Reception',
    eventDate: '2026-05-15',
    guestCount: 150,
    budget: 75000,
    status: 'pending',
    submittedDate: '2026-04-08',
  },
  {
    id: '2',
    customerName: 'Priya Singh',
    customerPhone: '9123456789',
    eventName: 'Birthday Party',
    eventDate: '2026-04-20',
    guestCount: 50,
    budget: 15000,
    status: 'approved',
    submittedDate: '2026-04-07',
  },
  {
    id: '3',
    customerName: 'Amit Patel',
    customerPhone: '9988776655',
    eventName: 'Corporate Event',
    eventDate: '2026-05-01',
    guestCount: 200,
    budget: 100000,
    status: 'pending',
    submittedDate: '2026-04-06',
  },
];

export const unstable_settings = {
  preserveState: true
};

export default function AdminCateringScreen() {
  const [requests, setRequests] = useState(customerRequests);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const filteredRequests = requests.filter(req =>
    filterStatus === 'all' ? true : req.status === filterStatus
  );

  const handleApprove = (id: string) => {
    Alert.alert('Approve Request', 'Send approval to customer?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Approve',
        onPress: () => {
          setRequests(requests.map(r => r.id === id ? { ...r, status: 'approved' } : r));
          Alert.alert('Success', 'Request approved and customer notified');
        },
      },
    ]);
  };

  const handleReject = (id: string) => {
    Alert.alert('Reject Request', 'Are you sure? Customer will be notified.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reject',
        onPress: () => {
          setRequests(requests.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
          Alert.alert('Success', 'Request rejected');
        },
        style: 'destructive',
      },
    ]);
  };

  return (
    <ScreenContainer className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6">
          {/* Header */}
          <View className="mb-6">
            <Text className="text-3xl font-bold text-foreground mb-2">Catering Requests</Text>
            <Text className="text-muted text-sm">Customer catering service requests</Text>
          </View>

          {/* Filter Buttons */}
          <View className="flex-row gap-2 mb-6 flex-wrap">
            {(['all', 'pending', 'approved', 'rejected'] as const).map(status => (
              <TouchableOpacity
                key={status}
                className={`px-4 py-2 rounded-full ${filterStatus === status ? 'bg-primary' : 'bg-surface border border-border'
                  }`}
                onPress={() => setFilterStatus(status)}
              >
                <Text
                  className={`text-sm font-semibold capitalize ${filterStatus === status ? 'text-white' : 'text-foreground'
                    }`}
                >
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Requests List */}
          <View>
            {filteredRequests.length > 0 ? (
              filteredRequests.map(request => (
                <View
                  key={request.id}
                  className="bg-surface rounded-lg p-4 mb-3 border border-border"
                >
                  {/* Request Header */}
                  <View className="flex-row items-start justify-between mb-3">
                    <View className="flex-1">
                      <Text className="text-base font-bold text-foreground">
                        {request.eventName}
                      </Text>
                      <Text className="text-sm text-muted">{request.customerName}</Text>
                    </View>
                    <View
                      className={`px-2 py-1 rounded ${request.status === 'approved'
                          ? 'bg-success/20'
                          : request.status === 'rejected'
                            ? 'bg-error/20'
                            : 'bg-warning/20'
                        }`}
                    >
                      <Text
                        className={`text-xs font-semibold capitalize ${request.status === 'approved'
                            ? 'text-success'
                            : request.status === 'rejected'
                              ? 'text-error'
                              : 'text-warning'
                          }`}
                      >
                        {request.status}
                      </Text>
                    </View>
                  </View>

                  {/* Request Details */}
                  <View className="gap-2 mb-3 pb-3 border-b border-border">
                    <View className="flex-row items-center justify-between">
                      <Text className="text-sm text-muted">Phone</Text>
                      <Text className="text-sm text-foreground font-semibold">{request.customerPhone}</Text>
                    </View>
                    <View className="flex-row items-center justify-between">
                      <Text className="text-sm text-muted">Event Date</Text>
                      <Text className="text-sm text-foreground font-semibold">{request.eventDate}</Text>
                    </View>
                    <View className="flex-row items-center justify-between">
                      <Text className="text-sm text-muted">Guests</Text>
                      <Text className="text-sm text-foreground font-semibold">{request.guestCount}</Text>
                    </View>
                    <View className="flex-row items-center justify-between">
                      <Text className="text-sm text-muted">Budget</Text>
                      <Text className="text-sm text-primary font-bold">₹{request.budget}</Text>
                    </View>
                    <View className="flex-row items-center justify-between">
                      <Text className="text-sm text-muted">Submitted</Text>
                      <Text className="text-sm text-foreground font-semibold">{request.submittedDate}</Text>
                    </View>
                  </View>

                  {/* Action Buttons */}
                  {request.status === 'pending' && (
                    <View className="flex-row gap-2">
                      <TouchableOpacity
                        className="flex-1 bg-success/20 rounded-lg py-2 items-center"
                        onPress={() => handleApprove(request.id)}
                      >
                        <Text className="text-success font-bold text-sm">Approve</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="flex-1 bg-error/20 rounded-lg py-2 items-center"
                        onPress={() => handleReject(request.id)}
                      >
                        <Text className="text-error font-bold text-sm">Reject</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))
            ) : (
              <View className="items-center py-8">
                <Text className="text-muted text-base">No requests found</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
