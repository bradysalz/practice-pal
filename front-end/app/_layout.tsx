import '@/global.css';
import 'react-native-get-random-values'; // For UUIDs

import { DataProvider } from '@/components/providers/DataProvider';
import { SessionProvider } from '@/components/providers/SessionProvider';
import { NAV_THEME } from '@/lib/constants';
import { useColorScheme } from '@/lib/useColorScheme';
import { Inter_400Regular, Inter_700Bold, useFonts as useInter } from '@expo-google-fonts/inter';
import { SpaceGrotesk_400Regular, SpaceGrotesk_700Bold, useFonts as useSpaceGrotesk } from '@expo-google-fonts/space-grotesk';
import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { SplashScreen, Stack } from 'expo-router';
import React, { useCallback } from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export default function RootLayout() {
  const hasMounted = React.useRef(false);
  const { isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);
  const [interLoaded] = useInter({ Inter_400Regular, Inter_700Bold });
  const [groteskLoaded] = useSpaceGrotesk({ SpaceGrotesk_400Regular, SpaceGrotesk_700Bold });
  const fontsLoaded = interLoaded && groteskLoaded;

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return;
    }

    if (Platform.OS === 'web') {
      // Adds the background color to the html element to prevent white background on overscroll.
      document.documentElement.classList.add('bg-background');
    }
    setIsColorSchemeLoaded(true);
    hasMounted.current = true;
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && isColorSchemeLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isColorSchemeLoaded]);

  if (!fontsLoaded || !isColorSchemeLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <SessionProvider>
        <DataProvider>
          <GestureHandlerRootView onLayout={onLayoutRootView}>
            {/* <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} /> */}
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="stat-detail" options={{ headerShown: false }} />
              <Stack.Screen name="session-detail" options={{ headerShown: false }} />
              <Stack.Screen name="library-detail" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <PortalHost />
          </GestureHandlerRootView>
        </DataProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}

const useIsomorphicLayoutEffect =
  Platform.OS === 'web' && typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;
