import { Stack } from 'expo-router';

export default function SessionDetailLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="book/[bookId]"
        options={{
          title: 'Book Stats'
        }}
      />
      <Stack.Screen
        name="section/[sectionId]"
        options={{
          title: 'Section Stats'
        }}
      />
    </Stack>
  );
}
