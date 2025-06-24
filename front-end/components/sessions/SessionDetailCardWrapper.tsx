import { CardWithAccent } from '@/components/card-with-accent';
import { ThemedIcon } from '@/components/icons/ThemedIcon';
import { CardContent, CardHeader } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import React from 'react';
import { View } from 'react-native';

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
            size={26}
            color={iconColor}
            className="mr-2"
            style={{ marginRight: 6 }}
          />
          <Text variant="title-2xl">{title}</Text>
        </View>
      </CardHeader>
      <CardContent className=" space-y-2">{children}</CardContent>
    </CardWithAccent>
  );
}
