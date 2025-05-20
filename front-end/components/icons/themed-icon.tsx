import React from 'react';
import { Platform, StyleProp, TextStyle, ViewStyle } from 'react-native';
// import { useColorScheme } from 'nativewind';
import { getTailwindColor } from '@/lib/utils/tailwind-utils';

// Import icons explicitly
import {
  ArrowLeft,
  BarChart,
  BookOpen,
  ChevronRight,
  Clock,
  Drum,
  Dumbbell,
  Edit,
  Home,
  ListMusic,
  Music,
  Plus,
  Save,
  Trash2,
} from 'lucide-react-native';

// Map icon names to components
const ICONS = {
  Home,
  Drum,
  BookOpen,
  BarChart,
  Dumbbell,
  Clock,
  Edit,
  ListMusic,
  Save,
  Music,
  Plus,
  ArrowLeft,
  ChevronRight,
  Trash2,
} as const;

type IconName = keyof typeof ICONS;

interface ThemedIconProps {
  name: IconName;
  size?: number;
  color?: string; // e.g., "red-500", "slate-300", "#ef4444"
  className?: string; // web-only
  style?: StyleProp<ViewStyle | TextStyle>; // RN style
}

// Set default tailwind color tokens per icon
const DEFAULT_COLORS: Record<string, string> = {
  Dumbbell: 'orange-500',
  Music: 'orange-500',
  Plus: 'white',
};

export const ThemedIcon = ({ name, size = 24, className, style }: ThemedIconProps) => {
  const color = DEFAULT_COLORS[name] || 'slate-500';
  const IconComponent = ICONS[name];
  // const scheme = useColorScheme(); // Optional if you want to react to dark mode tokens later

  const resolvedColor = getTailwindColor(color);

  const iconProps = {
    size,
    ...(Platform.OS === 'web'
      ? {
          className: `text-${color} ${className}`.trim(), // auto-apply tailwind text color
        }
      : { color: resolvedColor, style }),
  };

  return <IconComponent {...iconProps} />;
};
