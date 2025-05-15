import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Label } from './ui/label';

type ExerciseRow = Database['public']['Tables']['exercises']['Row'];
type SectionRow = Database['public']['Tables']['sections']['Row'];
type BookRow = Database['public']['Tables']['books']['Row'];

type ExerciseWithJoins = ExerciseRow & {
  sections:
    | (SectionRow & {
        books: BookRow | null;
      })
    | null;
};

export default function PracticeList({ session }: { session: Session }) {
  const [loading, setLoading] = useState(true);
  const [practices, setPractice] = useState<ExerciseWithJoins[]>([]);

  // TODO: tsc lint
  console.log(loading);

  useEffect(() => {
    if (!session) return;

    const getPractices = async () => {
      try {
        setLoading(true);
        if (!session?.user) throw new Error('No user on the session!');

        const { data, error, status } = await supabase
          .from(`exercises`)
          .select(
            `
            *,
            sections (
              *,
              books (*)
            )
          `
          )
          .eq('created_by', session?.user.id)
          .limit(10);
        console.log('Data: \n', data);
        console.log('Error: ', error);
        console.log('Status: ', status);
        if (error && status !== 406) {
          throw error;
        }
        if (data) {
          setPractice(data as ExerciseWithJoins[]);
        }
      } catch (error) {
        if (error instanceof Error) {
          Alert.alert(error.message);
        }
      } finally {
        setLoading(false);
      }
    };
    getPractices();
  }, [session]);

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Label>Email</Label>
        <Input value={session?.user?.email} editable={false} />
      </View>
      <View style={styles.verticallySpaced}>
        {practices.map((ex, i) => (
          <View key={i} style={{ marginBottom: 12 }}>
            <Text style={{ fontWeight: 'bold' }}>{ex.name}</Text>
            <Text>Section: {ex.sections?.section ?? '—'}</Text>
            <Text>Book: {ex.sections?.books?.name ?? '—'}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
});
