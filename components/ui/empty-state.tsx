/**
 * Empty State Component
 * With illustrations and call-to-action
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { IconSymbol } from './icon-symbol';

interface EmptyStateProps {
    title: string;
    description: string;
    action?: { label: string; onPress: () => void; icon?: string };
    illustration?: string; // Emoji or SVG
}

export function EmptyState({
    title,
    description,
    action,
    illustration = '🔍'
}: EmptyStateProps) {
    return (
        <View className="flex-1 items-center justify-center p-8 bg-background">
            <View className="w-24 h-24 bg-muted/20 rounded-2xl items-center justify-center mb-6">
                <Text className="text-4xl">{illustration}</Text>
            </View>
            <Text className="text-2xl font-bold text-foreground mb-2 text-center">{title}</Text>
            <Text className="text-muted text-center mb-6 px-4">{description}</Text>
            {action && (
                <TouchableOpacity className="bg-primary rounded-lg px-8 py-4" onPress={action.onPress}>
                    <Text className="text-white font-bold text-base">{action.label}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

