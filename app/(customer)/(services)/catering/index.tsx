/**
 * Catering Services Screen
 * Plan events with catering services
 */

import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useState } from 'react';
import { menuCatalog } from '@/lib/menu-data';

export default function CateringScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
    guestCount: '',
    eventType: 'Wedding',
    budget: '',
    location: '',
    specialRequests: '',
  });

  const eventTypes = ['Wedding', 'Birthday', 'Corporate', 'Anniversary', 'Other'];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.eventName || !formData.eventDate || !formData.guestCount) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    Alert.alert('Success', 'Catering request submitted! We will contact you soon.');
  };

  return (
    <ScreenContainer className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6">
          {/* Header */}
          <View className="mb-6">
            <Text className="text-3xl font-bold text-foreground mb-2">Catering Services</Text>
            <Text className="text-muted text-sm">Plan your special event with us</Text>
          </View>

          {/* Info Card */}
          <View className="bg-primary/10 rounded-xl p-4 mb-6 border border-primary">
            <Text className="text-sm text-foreground leading-relaxed">
              Our professional catering team will make your event memorable with delicious food and excellent service.
            </Text>
          </View>

          {/* Event Name */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-foreground mb-2">Event Name *</Text>
            <TextInput
              className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholder="e.g., My Wedding Reception"
              placeholderTextColor="#687076"
              value={formData.eventName}
              onChangeText={value => handleInputChange('eventName', value)}
            />
          </View>

          {/* Event Type */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-foreground mb-2">Event Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-4 px-4">
              {eventTypes.map(type => (
                <TouchableOpacity
                  key={type}
                  className={`px-4 py-2 rounded-full mr-2 border ${formData.eventType === type
                    ? 'bg-primary border-primary'
                    : 'bg-surface border-border'
                    }`}
                  onPress={() => handleInputChange('eventType', type)}
                >
                  <Text
                    className={`font-semibold text-sm ${formData.eventType === type ? 'text-background' : 'text-foreground'
                      }`}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Event Date */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-foreground mb-2">Event Date *</Text>
            <TextInput
              className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholder="DD/MM/YYYY"
              placeholderTextColor="#687076"
              value={formData.eventDate}
              onChangeText={value => handleInputChange('eventDate', value)}
            />
          </View>

          {/* Guest Count */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-foreground mb-2">Number of Guests *</Text>
            <TextInput
              className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholder="e.g., 100"
              placeholderTextColor="#687076"
              value={formData.guestCount}
              onChangeText={value => handleInputChange('guestCount', value)}
              keyboardType="number-pad"
            />
          </View>

          {/* Budget */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-foreground mb-2">Budget (per person)</Text>
            <TextInput
              className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholder="e.g., 500"
              placeholderTextColor="#687076"
              value={formData.budget}
              onChangeText={value => handleInputChange('budget', value)}
              keyboardType="number-pad"
            />
          </View>

          {/* Location */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-foreground mb-2">Event Location</Text>
            <TextInput
              className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholder="Enter venue address"
              placeholderTextColor="#687076"
              value={formData.location}
              onChangeText={value => handleInputChange('location', value)}
            />
          </View>

          {/* Special Requests */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-foreground mb-2">Special Requests</Text>
            <TextInput
              className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholder="Any dietary restrictions or preferences?"
              placeholderTextColor="#687076"
              value={formData.specialRequests}
              onChangeText={value => handleInputChange('specialRequests', value)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            className="w-full bg-primary rounded-lg py-4 items-center mb-4"
            onPress={handleSubmit}
          >
            <Text className="text-background font-bold text-base">Submit Catering Request</Text>
          </TouchableOpacity>

          {/* Catering Menu Preview */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-foreground mb-3">Catering Menu Ideas</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-4 px-4">
              {menuCatalog.slice(0, 3).map((category) => (
                <View key={category.category} className="w-60 bg-surface rounded-3xl p-4 mr-4 border border-border">
                  <Text className="text-base font-semibold text-foreground mb-2">{category.category}</Text>
                  {category.items.slice(0, 3).map((item) => (
                    <View key={item.id} className="mb-2">
                      <Text className="text-sm font-semibold text-foreground">{item.name}</Text>
                      <Text className="text-xs text-muted">₹{item.price} · {item.portion}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Info Footer */}
          <View className="bg-surface rounded-lg p-4 border border-border">
            <Text className="text-xs text-muted leading-relaxed">
              Our team will review your request and contact you within 24 hours with a customized quote and menu options.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
