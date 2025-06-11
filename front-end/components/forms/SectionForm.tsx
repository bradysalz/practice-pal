import { ThemedIcon } from '@/components/icons/ThemedIcon';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ExerciseNamingType, SectionFormData } from '@/types/book';
import {
  updateCustomName,
  updateExerciseCount,
  updateNamingType,
} from '@/utils/section-form';
import { ChevronDown } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
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

  const handleNamingTypeChange = (type: ExerciseNamingType) => {
    const updated = updateNamingType(section, type);
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
                <Text className="text-xl font-bold">
                  {section.name || `Section ${index + 1}`}
                </Text>
              </View>
              <Animated.View style={chevronStyle}>
                <ChevronDown size={24} className="text-slate-600" />
              </Animated.View>
            </View>
          </CardHeader>
        </Pressable>

        {isExpanded && (
          <CardContent className="p-4">
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
                    className="ml-4 h-[40px] w-[40px] items-center justify-center bg-slate-100 rounded-xl"
                  >
                    <ThemedIcon name="Trash2" size={24} />
                  </Pressable>
                </View>
              </View>

              <View className="flex-row items-end gap-x-2">
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

                <View className="flex-[3] ">
                  <Text className="mb-1 font-medium text-lg">Exercise Names</Text>
                  <View className="flex-row gap-x-2">
                    <Pressable
                      onPress={() => handleNamingTypeChange('alpha')}
                      className={`flex-1 py-2 px-2 rounded-xl ${section.exerciseNaming === 'alpha' ? 'bg-primary' : 'bg-slate-200'
                        }`}
                    >
                      <Text
                        className={`text-center text-lg  ${section.exerciseNaming === 'alpha' ? 'text-white' : 'text-black'
                          }`}
                      >
                        A, B, C
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handleNamingTypeChange('numeric')}
                      className={`flex-1 py-2 px-2 rounded-xl ${section.exerciseNaming === 'numeric' ? 'bg-primary' : 'bg-slate-200'
                        }`}
                    >
                      <Text
                        className={`text-center text-lg  ${section.exerciseNaming === 'numeric' ? 'text-white' : 'text-black'
                          }`}
                      >
                        1, 2, 3
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handleNamingTypeChange('custom')}
                      className={`flex-1 py-2 px-2 rounded-xl ${section.exerciseNaming === 'custom' ? 'bg-primary' : 'bg-slate-200'
                        }`}
                    >
                      <Text
                        className={`text-center text-lg  ${section.exerciseNaming === 'custom' ? 'text-white' : 'text-black'
                          }`}
                      >
                        Custom
                      </Text>
                    </Pressable>
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
