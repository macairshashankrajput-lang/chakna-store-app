/**
 * Admin Reminder System Screen
 * Set up and manage reminders for users
 */

import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useState } from 'react';

interface Reminder {
  id: string;
  title: string;
  description: string;
  frequency: string;
  nextRun: string;
  active: boolean;
}

const mockReminders: Reminder[] = [
  {
    id: '1',
    title: 'Daily Order Reminder',
    description: 'Remind users to place their daily Tiffin order',
    frequency: 'Daily at 8:00 AM',
    nextRun: '2026-04-09 08:00',
    active: true,
  },
  {
    id: '2',
    title: 'Weekly Special Offer',
    description: 'Send weekly special offers to customers',
    frequency: 'Weekly on Monday',
    nextRun: '2026-04-14 10:00',
    active: true,
  },
];

export default function AdminRemindersScreen() {
  const [reminders, setReminders] = useState(mockReminders);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReminder, setNewReminder] = useState({ title: '', description: '', frequency: 'daily' });

  const handleAddReminder = () => {
    if (!newReminder.title || !newReminder.description) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    const reminder: Reminder = {
      id: Date.now().toString(),
      title: newReminder.title,
      description: newReminder.description,
      frequency: newReminder.frequency === 'daily' ? 'Daily at 8:00 AM' : 'Weekly on Monday',
      nextRun: '2026-04-09 08:00',
      active: true,
    };
    setReminders([...reminders, reminder]);
    setNewReminder({ title: '', description: '', frequency: 'daily' });
    setShowAddForm(false);
    Alert.alert('Success', 'Reminder created successfully');
  };

  const handleToggleReminder = (id: string) => {
    setReminders(
      reminders.map(r => r.id === id ? { ...r, active: !r.active } : r)
    );
  };

  const handleDeleteReminder = (id: string) => {
    Alert.alert('Delete Reminder', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        onPress: () => {
          setReminders(reminders.filter(r => r.id !== id));
          Alert.alert('Success', 'Reminder deleted');
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
            <Text className="text-3xl font-bold text-foreground mb-2">Reminder System</Text>
            <Text className="text-muted text-sm">Set up automated reminders for users</Text>
          </View>

          {/* Add Reminder Button */}
          <TouchableOpacity
            className="w-full bg-primary rounded-lg py-3 items-center mb-6"
            onPress={() => setShowAddForm(!showAddForm)}
          >
            <Text className="text-white font-bold text-base">
              {showAddForm ? 'Cancel' : '+ Add New Reminder'}
            </Text>
          </TouchableOpacity>

          {/* Add Reminder Form */}
          {showAddForm && (
            <View className="bg-surface border border-border rounded-lg p-4 mb-6">
              <Text className="text-lg font-bold text-foreground mb-3">Add New Reminder</Text>

              <TextInput
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground mb-3"
                placeholder="Reminder title"
                placeholderTextColor="#7A7A7A"
                value={newReminder.title}
                onChangeText={title => setNewReminder({ ...newReminder, title })}
              />

              <TextInput
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground mb-3"
                placeholder="Description"
                placeholderTextColor="#7A7A7A"
                value={newReminder.description}
                onChangeText={description => setNewReminder({ ...newReminder, description })}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />

              <View className="mb-4">
                <Text className="text-sm font-semibold text-foreground mb-2">Frequency</Text>
                <View className="flex-row gap-2">
                  {['daily', 'weekly'].map(freq => (
                    <TouchableOpacity
                      key={freq}
                      className={`flex-1 px-4 py-2 rounded-lg capitalize ${
                        newReminder.frequency === freq
                          ? 'bg-primary'
                          : 'bg-background border border-border'
                      }`}
                      onPress={() => setNewReminder({ ...newReminder, frequency: freq })}
                    >
                      <Text
                        className={`text-sm font-semibold text-center ${
                          newReminder.frequency === freq ? 'text-white' : 'text-foreground'
                        }`}
                      >
                        {freq}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                className="w-full bg-primary rounded-lg py-3 items-center"
                onPress={handleAddReminder}
              >
                <Text className="text-white font-bold">Create Reminder</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Reminders List */}
          <View>
            <Text className="text-lg font-bold text-foreground mb-3">
              Active Reminders ({reminders.filter(r => r.active).length})
            </Text>
            {reminders.length > 0 ? (
              reminders.map(reminder => (
                <View
                  key={reminder.id}
                  className="bg-surface rounded-lg p-4 mb-3 border border-border"
                >
                  <View className="flex-row items-start justify-between mb-2">
                    <View className="flex-1">
                      <Text className="text-base font-bold text-foreground">{reminder.title}</Text>
                      <Text className="text-sm text-muted">{reminder.description}</Text>
                    </View>
                    <TouchableOpacity
                      className={`px-3 py-1 rounded-full ${
                        reminder.active ? 'bg-success/20' : 'bg-error/20'
                      }`}
                      onPress={() => handleToggleReminder(reminder.id)}
                    >
                      <Text
                        className={`text-xs font-semibold ${
                          reminder.active ? 'text-success' : 'text-error'
                        }`}
                      >
                        {reminder.active ? 'Active' : 'Inactive'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View className="flex-row items-center justify-between pt-3 border-t border-border">
                    <View>
                      <Text className="text-xs text-muted">Frequency</Text>
                      <Text className="text-sm text-foreground font-semibold">{reminder.frequency}</Text>
                    </View>
                    <TouchableOpacity
                      className="bg-error/20 px-3 py-2 rounded-lg"
                      onPress={() => handleDeleteReminder(reminder.id)}
                    >
                      <Text className="text-error font-bold text-sm">Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <View className="items-center py-8">
                <Text className="text-muted text-base">No reminders set</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
