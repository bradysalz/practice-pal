
import 'dotenv/config';

export default {
  expo: {
    name: 'PracticePal',
    slug: 'practice-pal',
    extra: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_ANON_KEY,
    },
  },
};
