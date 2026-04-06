import { Stack } from 'expo-router';

export default function CateringLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
        </Stack>
    );
}

