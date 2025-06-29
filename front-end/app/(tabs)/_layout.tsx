import { useSession } from '@/components/providers/SessionProvider';
import { Redirect, Tabs } from 'expo-router';
import { BookOpen, Home, ListMusic } from 'lucide-react-native';
import React from 'react';
import { Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const session = useSession();
  const insets = useSafeAreaInsets();

  if (session === null) {
    return <Redirect href="/login" />;
  }

  if (!session?.session?.user) {
    // Redirect to login/home screen
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#ef4444', // Tailwind red-500
        tabBarInactiveTintColor: '#64748b', // Tailwind slate-500
        tabBarLabelStyle: { fontSize: 16, fontFamily: 'Inter_400Regular' },
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, React.ReactNode> = {
            sessions: <Home size={size} color={color} />,
            setlists: <ListMusic size={size} color={color} />,
            library: <BookOpen size={size} color={color} />,
          };
          return icons[route.name] || <Text>?</Text>;
        },
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 1,
          borderColor: '#e2e8f0', // slate-200
          backgroundColor: 'white',
          paddingBottom: Math.max(insets.bottom, 8),
          paddingTop: 4,
          height: 70 + insets.bottom,
        },
      })}
    >
      <Tabs.Screen name="sessions" options={{ title: 'Home' }} />
      <Tabs.Screen name="setlists" options={{ title: 'Setlists' }} />
      <Tabs.Screen name="library" options={{ title: 'Library' }} />

      {/* Need to get manually hide all routes in the folder  */}
      {/* Downside of too much automagic with the Expo router */}
      <Tabs.Screen
        name="about"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
