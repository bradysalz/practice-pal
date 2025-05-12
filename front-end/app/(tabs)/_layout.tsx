import { useSession } from '@/components/SessionProvider';
import { Home, BookOpen, ListMusic, BarChart } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from 'react-native';
import { Redirect, Tabs } from 'expo-router';
import { JSX } from 'react';

export default function TabLayout() {
  const session = useSession();
  const insets = useSafeAreaInsets();

  if (session === null) {
    return <Redirect href="/login" />;
  }

  if (!session?.user) {
    // Redirect to login/home screen
    return <Redirect href="/login" />;
  }


  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#ef4444', // Tailwind red-500
        tabBarInactiveTintColor: '#64748b', // Tailwind slate-500
        tabBarLabelStyle: { fontSize: 12 },
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, JSX.Element> = {
            'sessions': <Home size={size} color={color} />,
            'setlists': <ListMusic size={size} color={color} />,
            'library': <BookOpen size={size} color={color} />,
            'stats': <BarChart size={size} color={color} />,
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
          height: 60 + insets.bottom,
        },
      })}
    >
      <Tabs.Screen name="sessions" options={{ title: 'Home' }} />
      <Tabs.Screen name="setlists" options={{ title: 'Setlists' }} />
      <Tabs.Screen name="library" options={{ title: 'Library' }} />
      <Tabs.Screen name="stats" options={{ title: 'Stats' }} />

      {/* Need to get manually hide all routes in the folder  */}
      {/* Downside of too much automagic with the Expo router */}
      <Tabs.Screen
        name="about"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen name="account" options={{
        href: null,
      }} />
    </Tabs>
  );
}
