import { InputWithDelete } from '@/components/forms/InputWithDelete';

import { TextInputWithLabel } from '@/components/forms/TextInputWithLabel';
import { ThemedIcon } from '@/components/icons/ThemedIcon';
import { Separator } from '@/components/shared/Separator';
import { Text } from '@/components/ui/text';
import { deleteExercises, insertExercises, updateExercise } from '@/lib/supabase/exercise';
import { deleteSections, updateSection } from '@/lib/supabase/section';
import { useExercisesStore } from '@/stores/exercise-store';
import { useSectionsStore } from '@/stores/section-store';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, View } from 'react-native';
import { ActionButton } from '@/components/ui/action-button';
import { ScrollView } from 'react-native-gesture-handler';

export type EditableExercise = {
  id?: string;
  name?: string;
  sort_order: number;
};

export default function EditSectionPage() {
  const { sectionId } = useLocalSearchParams<{ sectionId: string }>();

  const router = useRouter();

  const sections = useSectionsStore((state) => state.sections);
  const section = sections.find((section) => section.id === sectionId);
  const exerciseMap = useExercisesStore((state) => state.exercisesBySectionId);
  const exercises = exerciseMap[sectionId];

  const [sectionName, setSectionName] = useState(section?.name || '');
  const [exerciseForms, setExerciseForms] = useState<EditableExercise[]>([]);

  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchSections = useSectionsStore((state) => state.fetchSections);

  useEffect(() => {
    setExerciseForms(
      exercises.map((exercise) => ({
        id: exercise.id,
        name: exercise.name || '',
        sort_order: exercise.sort_order,
      }))
    );
    // only run on page load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveSection = async () => {
    if (!hasChanges) {
      router.navigate(`/library-detail/section/${sectionId}`);
      return;
    }

    setIsSaving(true);

    if (sectionName !== section?.name) {
      await updateSection(sectionId, { name: sectionName });
    }

    // Handle exercises - split into new and existing exercises
    const exercisesToInsert = exerciseForms.filter((exercise) => !exercise.id);
    const exercisesToUpdate = exerciseForms.filter((exercise) => exercise.id);

    // Find exercises that were deleted (exist in original exercises but not in exerciseForms)
    const currentExerciseIds = new Set(exerciseForms.map((e) => e.id).filter(Boolean));
    const deletedExerciseIds = exercises
      .map((e) => e.id)
      .filter((id) => !currentExerciseIds.has(id));

    await Promise.all([
      // Insert new exercises
      exercisesToInsert.length > 0 && insertExercises(sectionId, exercisesToInsert),
      // Update existing exercises
      ...exercisesToUpdate.map((exercise) =>
        updateExercise(exercise.id!, { name: exercise.name || '' })
      ),
      // Delete removed sections
      deletedExerciseIds.length > 0 && deleteExercises(deletedExerciseIds),
    ]);

    setIsSaving(false);
    router.navigate(`/library-detail/section/${sectionId}`);
  };

  const handleDeleteSection = async () => {
    Alert.alert('Delete', `Are you sure you want to delete this section and all its exercises?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteSections([sectionId]);
          await fetchSections();
          router.navigate(`/library-detail/book/${section?.book_id}`);
        },
      },
    ]);
  };

  const handleAddExercise = () => {
    setHasChanges(true);
    setExerciseForms([...exerciseForms, { name: '', sort_order: exerciseForms.length }]);
  };

  const handleUpdateExercise = (index: number, exercise: EditableExercise) => {
    setHasChanges(true);
    setExerciseForms(exerciseForms.map((e, i) => (i === index ? exercise : e)));
  };

  const handleDeleteExercise = (index: number) => {
    setHasChanges(true);
    setExerciseForms(exerciseForms.filter((_, i) => i !== index));
  };

  if (!section) {
    return <Text>Section not found</Text>;
  }

  return (
    <View className="flex-1 bg-white p-4">
      <ScrollView contentContainerStyle={{ paddingBottom: 320 }} className="">
        <View className="gap-y-4">
          <TextInputWithLabel
            label="Section Name"
            value={sectionName}
            onChangeText={setSectionName}
            placeholder="Example Section"
          />
          <Pressable onPress={handleDeleteSection} className="self-start">
            <View className="flex-row items-center gap-x-2 bg-red-100 rounded-xl py-2 px-4">
              <ThemedIcon name="TriangleAlert" size={24} color="red-500" />
              <Text variant="body-semibold" className="text-red-500">
                Delete Section
              </Text>
            </View>
          </Pressable>
          <Separator color="slate" className="my-4" />

          {/* Exercises */}
          <View>
            <View className="flex-row justify-between items-center mb-4">
              <Text variant="title-2xl">Exercises</Text>
              <Pressable
                onPress={handleAddExercise}
                className="bg-slate-100 rounded-xl py-2 px-4 text-lg border border-slate-300 flex-row items-center gap-x-1.5"
              >
                <ThemedIcon name="Plus" size={16} color="slate-500" />
                <Text variant="body-semibold">Add Exercise</Text>
              </Pressable>
            </View>

            <View className="gap-y-2">
              {exerciseForms.map((exercise, index) => (
                <InputWithDelete
                  key={index}
                  name={exercise.name}
                  onNameChange={(value) =>
                    handleUpdateExercise(index, { ...exercise, name: value })
                  }
                  onDelete={() => handleDeleteExercise(index)}
                />
              ))}
            </View>
          </View>

          <ActionButton
            onPress={handleSaveSection}
            disabled={isSaving}
            className={isSaving ? 'bg-primary/70' : undefined}
            textVariant="body-bold"
            text={isSaving ? 'Saving...' : 'Save Section'}
            icon={isSaving ? <ActivityIndicator color="white" /> : undefined}
          />
        </View>
      </ScrollView>
    </View>
  );
}
