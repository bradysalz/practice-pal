import React from 'react';
import { Platform, StyleProp, ViewStyle } from 'react-native';
// import { useColorScheme } from 'nativewind';
import { getTailwindColor } from '@/utils/tailwind-utils';

// Import icons explicitly
import {
  ArrowLeft,
  BarChart,
  Bookmark,
  BookOpen,
  Check,
  ChevronRight,
  Clock,
  Drum,
  Dumbbell,
  Edit,
  Home,
  ListMusic,
  MicVocal,
  Music,
  NotebookPen,
  Pause,
  Play,
  Plus,
  Save,
  Trash2,
  TriangleAlert,
  X,
} from 'lucide-react-native';

// Map icon names to components
const ICONS = {
  Home,
  Drum,
  BookOpen,
  BarChart,
  Bookmark,
  Dumbbell,
  Clock,
  Edit,
  ListMusic,
  Check,
  Save,
  Music,
  NotebookPen,
  Plus,
  MicVocal,
  ArrowLeft,
  ChevronRight,
  Trash2,
  TriangleAlert,
  Play,
  Pause,
  X,
} as const;

// Icons that should be filled
const FILLED_ICONS: IconName[] = ['Play', 'Pause'];

type IconName = keyof typeof ICONS;

export interface ThemedIconProps {
  name: IconName;
  size?: number;
  color?: string; // e.g., "red-500", "slate-300", "#ef4444"
  className?: string; // web-only
  style?: StyleProp<ViewStyle>; // RN style
}

// Set default tailwind color tokens per icon
const DEFAULT_COLORS: Record<string, string> = {
  Dumbbell: 'orange-500',
  Music: 'orange-500',
  Plus: 'white',
  Trash2: 'red-500',
  NotebookPen: 'orange-500',
  Save: 'white',
  Check: 'white',
  Play: 'orange-500',
  Pause: 'orange-500',
  Edit: 'black',
  X: 'red-500',
  TriangleAlert: 'red-500',
};

export const ThemedIcon = ({ name, size = 24, className, style, color }: ThemedIconProps) => {
  const IconComponent = ICONS[name];
  const inputColor = color || DEFAULT_COLORS[name] || 'slate-500';
  // const scheme = useColorScheme(); // Optional if you want to react to dark mode tokens later

  const resolvedColor = getTailwindColor(inputColor);
  const shouldFill = FILLED_ICONS.includes(name);

  const iconProps = {
    size,
    color: resolvedColor,
    fill: shouldFill ? resolvedColor : 'none',
    ...(Platform.OS === 'web' ? { className } : { style }),
  };

  return <IconComponent {...iconProps} />;
};
