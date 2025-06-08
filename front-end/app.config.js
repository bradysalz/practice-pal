import 'dotenv/config';

export default () => ({
  name: 'PracticePal',
  owner: 'bradysalz',
  slug: 'practicepal',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'practicepal',
  userInterfaceStyle: 'automatic',
  jsEngine: 'hermes',
  newArchEnabled: true,
  ios: {
    bundleIdentifier: 'com.bradysalz.practicepal',
    supportsTablet: true
  },
  android: {
    package: 'com.bradysalz.practicepal',
    versionCode: 1,
    adaptiveIcon: {
      backgroundColor: '#ffffff'
    },
    edgeToEdgeEnabled: true
  },
  web: {
    bundler: 'metro',
    favicon: './assets/images/favicon.png'
  },
  plugins: [
    'expo-router',
    'expo-font',
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#ffffff'
      }
    ]
  ],
  experiments: {
    typedRoutes: true
  },
  extra: {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_ANON_KEY,
  },
});
