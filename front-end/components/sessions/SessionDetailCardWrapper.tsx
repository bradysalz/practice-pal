import { CardWithAccent } from '@/components/card-with-accent';
import { ThemedIcon } from '@/components/icons/themed-icon';
import { CardContent, CardHeader } from '@/components/ui/card';
import React from 'react';
import { Text, View } from 'react-native';

type Props = {
  iconName: Parameters<typeof ThemedIcon>[0]['name'];
  iconColor?: string;
  accentColor: string;
  title: string;
  children: React.ReactNode;
};

export function SessionDetailCardWrapper({
  iconName,
  iconColor,
  accentColor,
  title,
  children,
}: Props) {
  return (
    <CardWithAccent accentColor={accentColor}>
      <CardHeader className="mb-4 bg-slate-100 dark:bg-slate-800 border-b-4 border-slate-200 dark:border-slate-700">
        <View className="flex-row items-center">
          <ThemedIcon
            name={iconName}
            size={28}
            color={iconColor}
            className="mr-2"
            style={{ marginRight: 6 }}
          />
          <Text className="text-2xl font-semibold">{title}</Text>
        </View>
      </CardHeader>
      <CardContent className=" space-y-2">{children}</CardContent>
    </CardWithAccent>
  );
}
