import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import { AppState, Platform } from 'react-native';

// Only import AsyncStorage on native to avoid web crash
let storage;
if (Platform.OS !== 'web') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  storage = require('@react-native-async-storage/async-storage').default;
}

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl!;
const supabaseKey = Constants.expoConfig?.extra?.supabaseKey!;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    ...(Platform.OS !== 'web' && {
      storage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    }),
  },
});

// Only hook AppState for native platforms
if (Platform.OS !== 'web') {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}
