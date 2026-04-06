import { Stack } from 'expo-router';

export default function ChaknaLayout() {
    return (
        <Stack screenOptions={{
            headerStyle: {
                backgroundColor: '#f8fafc',
            },
            headerTintColor: '#0f172a',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        }}>
            <Stack.Screen name="index" options={{
                title: 'Chakna Store',
                headerLargeTitle: true,
            }} />
            <Stack.Screen name="product/[id]" options={{
                title: 'Product Details',
            }} />
            <Stack.Screen name="../cart" options={{
                title: 'My Cart',
                headerBackTitle: 'Store',
            }} />
            <Stack.Screen name="../checkout" options={{
                title: 'Checkout',
                headerBackTitle: 'Cart',
            }} />
        </Stack>
    );
}
