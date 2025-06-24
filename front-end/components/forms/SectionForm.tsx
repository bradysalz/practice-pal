import { ThemedIcon } from '@/components/icons/ThemedIcon';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Option,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Text } from '@/components/ui/text';
import { ExerciseNamingType, SectionFormData } from '@/types/book';
import { updateCustomName, updateExerciseCount, updateNamingType } from '@/utils/section-form';
import { ChevronDown } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { ExerciseNamingPreview } from './ExerciseNamingPreview';
import { TextInputWithLabel } from './TextInputWithLabel';

interface SectionFormProps {
  section: SectionFormData;
  onUpdate: (section: SectionFormData) => void;
  onDelete: () => void;
  index: number;
}

export function SectionForm({ section, onUpdate, onDelete, index }: SectionFormProps) {
  const [customNames, setCustomNames] = useState<string[]>(section.customExerciseNames || []);
  const [isExpanded, setIsExpanded] = useState(true);

  const chevronStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: withTiming(isExpanded ? '180deg' : '0deg', { duration: 300 }) }],
    };
  });

  const handleExerciseCountChange = (value: string) => {
    const updated = updateExerciseCount(section, value, customNames);
    onUpdate(updated);
  };

  const handleNamingTypeChange = (option: Option) => {
    if (!option) return;
    const updated = updateNamingType(section, option.value as ExerciseNamingType);
    onUpdate(updated);
  };

  const handleCustomNameChange = (index: number, value: string) => {
    const { names, section: updated } = updateCustomName(section, customNames, index, value);
    setCustomNames(names);
    onUpdate(updated);
  };

  return (
    <View className="mb-4 rounded-xl overflow-hidden border-l-4 border-l-primary">
      <Card>
        <Pressable onPress={() => setIsExpanded(!isExpanded)}>
          <CardHeader className="p-4 pb-3 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <View className="flex-row justify-between items-center">
              <View className="flex-1">
                <Text variant="title-xl">{section.name || `Section ${index + 1}`}</Text>
              </View>
              <Animated.View style={chevronStyle}>
                <ChevronDown size={24} className="text-slate-600" />
              </Animated.View>
            </View>
          </CardHeader>
        </Pressable>

        {isExpanded && (
          <CardContent className="p-4 bg-white">
            <View className="gap-y-4">
              <View>
                <View className="flex-row justify-between items-end">
                  <View className="flex-1">
                    <TextInputWithLabel
                      label="Section Name"
                      value={section.name}
                      onChangeText={(value) => onUpdate({ ...section, name: value })}
                      placeholder={`Syncopation Work`}
                      textSize="lg"
                    />
                  </View>
                  <Pressable
                    onPress={onDelete}
                    className="ml-4 h-[40px] w-[40px] items-center justify-center bg-slate-100 rounded-xl border border-slate-500"
                  >
                    <ThemedIcon name="Trash2" size={24} />
                  </Pressable>
                </View>
              </View>

              <View className="flex-row items-end gap-x-6">
                <View className="flex-1">
                  <TextInputWithLabel
                    label="Exercises"
                    value={section.exerciseCount.toString()}
                    onChangeText={handleExerciseCountChange}
                    placeholder="5"
                    keyboardType="numeric"
                    textSize="lg"
                  />
                </View>

                <View className="flex-[2] ">
                  <Text variant="body-semibold" className="text-xl mb-1">
                    Naming Convention
                  </Text>
                  <View className="flex-row gap-x-2">
                    <Select onValueChange={handleNamingTypeChange}>
                      <SelectTrigger className="rounded-xl w-fit bg-slate-50 border border-slate-500">
                        <SelectValue placeholder="1, 2, 3..." className="text-lg" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="alpha" label="A, B, C..." />
                        <SelectItem value="numeric" label="1, 2, 3..." />
                        <SelectItem value="roman" label="I, II, III..." />
                        <SelectItem value="custom" label="Custom" />
                      </SelectContent>
                    </Select>
                  </View>
                </View>
              </View>

              {section.exerciseNaming !== 'custom' && (
                <ExerciseNamingPreview
                  type={section.exerciseNaming}
                  count={section.exerciseCount}
                  customNames={section.customExerciseNames}
                />
              )}

              {section.exerciseNaming === 'custom' && (
                <View className="gap-y-2">
                  {Array.from({ length: section.exerciseCount }).map((_, i) => (
                    <TextInputWithLabel
                      key={i}
                      value={section.customExerciseNames?.[i] || ''}
                      onChangeText={(value) => handleCustomNameChange(i, value)}
                      placeholder={`Exercise ${i + 1} Name`}
                      textSize="md"
                    />
                  ))}
                </View>
              )}
            </View>
          </CardContent>
        )}
      </Card>
    </View>
  );
}
