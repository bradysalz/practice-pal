import React from 'react';
import { Platform, ViewStyle, TextStyle, StyleProp } from 'react-native';
// import { useColorScheme } from 'nativewind';
import { getTailwindColor } from '@/lib/utils';

// Import icons explicitly
import {
    Home,
    Drum,
    BookOpen,
    BarChart,
    Dumbbell,
    Clock,
    ListMusic,
    Plus,
    Music,
    ArrowLeft,
    ChevronRight,
} from 'lucide-react-native';

// Map icon names to components
const ICONS = {
    Home,
    Drum,
    BookOpen,
    BarChart,
    Dumbbell,
    Clock,
    ListMusic,
    Music,
    Plus,
    ArrowLeft,
    ChevronRight,
} as const;

type IconName = keyof typeof ICONS;

interface ThemedIconProps {
    name: IconName;
    size?: number;
    color?: string; // e.g., "red-500", "slate-300", "#ef4444"
    className?: string; // web-only
    style?: StyleProp<ViewStyle | TextStyle>; // RN style
}

export const ThemedIcon = ({ name, size = 24, color = 'slate-500', className, style }: ThemedIconProps) => {
    const IconComponent = ICONS[name];
    // const scheme = useColorScheme(); // Optional if you want to react to dark mode tokens later

    let resolvedColor = getTailwindColor(color);


    const iconProps = {
        size,
        ...(Platform.OS === 'web'
            ? { className }
            : { color: resolvedColor, style }),
    };

    return <IconComponent {...iconProps} />;
};
