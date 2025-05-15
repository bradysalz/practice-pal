import { Card, CardContent, CardHeader } from '@/components/ui/card'; // XXX: Your card component imports
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

interface SessionItemCardProps {
  id: string;
  name: string;
  source: string;
  tempo: string;
  onTempoChange: (value: string) => void;
}

export function SessionItemCard({ id, name, source, tempo, onTempoChange }: SessionItemCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [notes, setNotes] = useState('');

  return (
    <Card>
      <CardHeader className="flex-row justify-between items-center pb-2">
        <View>
          <Text className="text-base font-medium">{name}</Text>
          <Text className="text-sm text-slate-500">{source}</Text>
        </View>

        <View className="flex-row items-center space-x-1">
          <TextInput
            value={tempo}
            onChangeText={onTempoChange}
            keyboardType="numeric"
            className="w-16 text-center border border-slate-300 rounded-md bg-white py-1"
          />
          <Text className="text-sm">BPM</Text>
          <Pressable onPress={() => setIsExpanded(!isExpanded)} className="pl-2">
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </Pressable>
        </View>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-2">
          <Text className="text-sm font-medium mb-1">Notes</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Add notes about your practice..."
            multiline
            numberOfLines={3}
            className="w-full border border-slate-300 rounded-md bg-white px-2 py-1 text-sm"
          />
        </CardContent>
      )}
    </Card>
  );
}
