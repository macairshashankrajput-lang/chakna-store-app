/**
 * Admin Notifications Screen
 * Send and manage notifications
 */

import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useState } from 'react';

export const unstable_settings = {
  preserveState: true
};

export default function AdminNotificationsScreen() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetAudience, setTargetAudience] = useState('all');

  const audiences = ['all', 'customers', 'vendors', 'inactive_users'];

  const handleSendNotification = () => {
    if (!title || !message) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    Alert.alert('Success', `Notification sent to ${targetAudience} users`);
    setTitle('');
    setMessage('');
  };

  return (
    <ScreenContainer className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6">
          {/* Header */}
          <View className="mb-6">
            <Text className="text-3xl font-bold text-foreground mb-2">Notifications</Text>
            <Text className="text-muted text-sm">Send notifications to users</Text>
          </View>

          {/* Send Notification Form */}
          <View className="bg-surface rounded-lg p-4 border border-border mb-6">
            <Text className="text-lg font-bold text-foreground mb-4">Send Notification</Text>

            {/* Title */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-foreground mb-2">Title</Text>
              <TextInput
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground"
                placeholder="Notification title"
                placeholderTextColor="#7A7A7A"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            {/* Message */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-foreground mb-2">Message</Text>
              <TextInput
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground"
                placeholder="Notification message"
                placeholderTextColor="#7A7A7A"
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Target Audience */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-foreground mb-2">Target Audience</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
                {audiences.map(audience => (
                  <TouchableOpacity
                    key={audience}
                    className={`px-4 py-2 rounded-full ${targetAudience === audience
                        ? 'bg-primary'
                        : 'bg-background border border-border'
                      }`}
                    onPress={() => setTargetAudience(audience)}
                  >
                    <Text
                      className={`text-sm font-semibold capitalize ${targetAudience === audience ? 'text-white' : 'text-foreground'
                        }`}
                    >
                      {audience.replace('_', ' ')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Send Button */}
            <TouchableOpacity
              className="w-full bg-primary rounded-lg py-3 items-center"
              onPress={handleSendNotification}
            >
              <Text className="text-white font-bold">Send Notification</Text>
            </TouchableOpacity>
          </View>

          {/* Notification History */}
          <View>
            <Text className="text-lg font-bold text-foreground mb-3">Notification History</Text>
            <View className="gap-2">
              {[
                { title: 'Special Offer', message: '20% off on first order', date: '2026-04-08', users: '342' },
                { title: 'New Feature', message: 'Check out our new Tiffin service', date: '2026-04-07', users: '300' },
              ].map((notif, index) => (
                <View key={index} className="bg-surface rounded-lg p-4 border border-border">
                  <View className="flex-row items-start justify-between mb-2">
                    <View className="flex-1">
                      <Text className="text-base font-bold text-foreground">{notif.title}</Text>
                      <Text className="text-sm text-muted">{notif.message}</Text>
                    </View>
                  </View>
                  <View className="flex-row items-center justify-between pt-2 border-t border-border">
                    <Text className="text-xs text-muted">{notif.date}</Text>
                    <Text className="text-xs text-primary font-semibold">{notif.users} users</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
