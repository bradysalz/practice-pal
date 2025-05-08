import Auth from '@/components/Auth';
import { View } from 'react-native';

export default function LoginScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
            <Auth />
        </View>
    );
}
