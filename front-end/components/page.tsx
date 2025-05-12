// components/ui/page.tsx
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, View, ScrollViewProps } from 'react-native';

export function Page({ children, ...props }: ScrollViewProps) {
    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView
                contentContainerStyle={{ paddingBottom: 100, alignItems: 'center' }}
                {...props}
            >
                <View className="w-full max-w-md px-4">{children}</View>
            </ScrollView>
        </SafeAreaView>
    );
}
