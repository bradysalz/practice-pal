import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function AboutScreen() {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase.from('exercises').select('*');
            if (error) console.error(error);
            else setData(data);
        };

        fetchData();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
                Exercises:
            </Text>
            {data.map((item) => (
                <Text key={item.id}>{item.name}</Text>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#fff',
    },
});
