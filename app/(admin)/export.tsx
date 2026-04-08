/**
 * Admin Customer Data Export Screen
 * Export customer data in various formats
 */

import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';

interface ExportOption {
  id: string;
  label: string;
  format: string;
  icon: string;
  description: string;
}

const exportOptions: ExportOption[] = [
  {
    id: '1',
    label: 'Export as CSV',
    format: 'csv',
    icon: '📊',
    description: 'Download customer data as CSV file',
  },
  {
    id: '2',
    label: 'Export as Excel',
    format: 'xlsx',
    icon: '📈',
    description: 'Download customer data as Excel file',
  },
  {
    id: '3',
    label: 'Export as PDF',
    format: 'pdf',
    icon: '📄',
    description: 'Download customer data as PDF report',
  },
];

export default function AdminExportScreen() {
  const handleExport = (format: string) => {
    Alert.alert(
      'Export Data',
      `Exporting customer data as ${format.toUpperCase()}...`,
      [{ text: 'OK' }]
    );
    // Simulate export
    setTimeout(() => {
      Alert.alert('Success', `Data exported as ${format.toUpperCase()}`);
    }, 1000);
  };

  return (
    <ScreenContainer className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6">
          {/* Header */}
          <View className="mb-6">
            <Text className="text-3xl font-bold text-foreground mb-2">Customer Data Export</Text>
            <Text className="text-muted text-sm">Export customer information in various formats</Text>
          </View>

          {/* Info Card */}
          <View className="bg-primary/10 border border-primary rounded-lg p-4 mb-6">
            <Text className="text-sm text-foreground leading-relaxed">
              Download customer data for analysis, reporting, or backup purposes. All exports are secure and encrypted.
            </Text>
          </View>

          {/* Export Options */}
          <View className="gap-3 mb-6">
            {exportOptions.map(option => (
              <TouchableOpacity
                key={option.id}
                className="bg-surface rounded-lg p-4 border border-border active:opacity-70"
                onPress={() => handleExport(option.format)}
              >
                <View className="flex-row items-start gap-4">
                  <View className="w-12 h-12 rounded-lg bg-primary/10 items-center justify-center">
                    <Text className="text-2xl">{option.icon}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-bold text-foreground mb-1">
                      {option.label}
                    </Text>
                    <Text className="text-sm text-muted">{option.description}</Text>
                  </View>
                  <Text className="text-2xl text-primary">→</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Export Statistics */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-foreground mb-3">Export Statistics</Text>
            <View className="gap-2">
              <View className="bg-surface rounded-lg p-3 border border-border flex-row items-center justify-between">
                <Text className="text-foreground font-semibold">Total Customers</Text>
                <Text className="text-primary font-bold text-lg">342</Text>
              </View>
              <View className="bg-surface rounded-lg p-3 border border-border flex-row items-center justify-between">
                <Text className="text-foreground font-semibold">Total Orders</Text>
                <Text className="text-primary font-bold text-lg">1,234</Text>
              </View>
              <View className="bg-surface rounded-lg p-3 border border-border flex-row items-center justify-between">
                <Text className="text-foreground font-semibold">Total Revenue</Text>
                <Text className="text-primary font-bold text-lg">₹45,600</Text>
              </View>
            </View>
          </View>

          {/* Recent Exports */}
          <View>
            <Text className="text-lg font-bold text-foreground mb-3">Recent Exports</Text>
            <View className="bg-surface rounded-lg p-4 border border-border">
              <Text className="text-muted text-sm">
                No exports yet. Start by selecting an export format above.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
