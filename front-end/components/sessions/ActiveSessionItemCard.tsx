import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ChevronDown } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface SessionItemCardProps {
  id: string;
  name: string;
  source: string;
  tempo: string;
  onTempoChange: (value: string) => void;
}

export function ActiveSessionItemCard({ id, name, source, tempo, onTempoChange }: SessionItemCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [notes, setNotes] = useState('');

  const chevronStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: withTiming(isExpanded ? '180deg' : '0deg', { duration: 300 }) }],
    };
  });

  const cardStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(tempo ? 0.4 : 1, { duration: 300 }),
    };
  });

  return (
    <Animated.View style={cardStyle} className="rounded-xl my-3 border-l-4 border-l-slate-700 overflow-hidden">
      <Pressable onPress={() => setIsExpanded(!isExpanded)} className="active:opacity-80">
        <Card>
          <CardHeader className="p-4 pb-3 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <View className="flex-row justify-between items-center">
              <View className="flex-1">
                <Text className="text-xl font-bold mb-1">{name}</Text>
                <Text className="text-slate-500 text-base">{source}</Text>
              </View>

              <View className="flex-row items-center space-x-3">
                <View className="flex-row items-center">
                  <TextInput
                    value={tempo}
                    onChangeText={onTempoChange}
                    keyboardType="numeric"
                    className="w-16 text-center border border-slate-300 rounded-xl bg-white py-2 text-lg"
                  />
                  <Text className="text-base ml-2 text-slate-600">BPM</Text>
                </View>

                <Animated.View style={chevronStyle}>
                  <ChevronDown size={24} className="text-slate-600" />
                </Animated.View>
              </View>
            </View>
          </CardHeader>

          {isExpanded && (
            <CardContent className="p-4 bg-white">
              <Text className="text-base font-semibold mb-2">Notes</Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Add notes about your practice..."
                multiline
                numberOfLines={4}
                className="w-full border border-slate-300 rounded-xl bg-white px-3 py-2 text-base"
                placeholderTextColor="#94a3b8"
              />
            </CardContent>
          )}
        </Card>
      </Pressable>
    </Animated.View>
  );
}
