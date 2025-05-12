import { Stack } from 'expo-router';
import React from 'react'; // Import React

export default function HomeStack() {
    return (
        <Stack>
            {/* The index file is usually the initial screen in the stack */}
            <Stack.Screen
                name="index" // Corresponds to app/(tabs)/home/index.js (Your Sessions List)
                options={{
                    title: 'Recent Sessions', // Title for the header
                }}
            />
            <Stack.Screen
                name="[id]" // Corresponds to app/(tabs)/home/[id].js (Your Session Detail)
                options={{
                    title: 'Session Details', // Title for the header when viewing details
                    // Add options like headerRight buttons here
                }}
            />
            {/* If you had other screens specifically part of the Home stack, list them here */}
        </Stack>
    );
}
