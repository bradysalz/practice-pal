import 'dotenv/config';
import baseConfig from './app.json';

export default ({ config }) => ({
  ...baseConfig.expo,
  name: 'PracticePal', // you can override values here if needed
  slug: 'practice-pal',
  extra: {
    ...baseConfig.expo.extra,
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_ANON_KEY,
  },
});
