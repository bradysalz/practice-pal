import 'dotenv/config';
import baseConfig from './app.json';

export default {
  ...baseConfig.expo,
  name: 'PracticePal',
  slug: 'practice-pal',
  extra: {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_ANON_KEY,
  },
};
