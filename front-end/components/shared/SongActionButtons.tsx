import { View } from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

interface SongActionButtonsProps {
  isAdded: boolean;
  onAddPress: () => void;
  onRemovePress: () => void;
}

export function SongActionButtons({ isAdded, onAddPress, onRemovePress }: SongActionButtonsProps) {
  return (
    <View className="flex-row items-center">
      <BouncyCheckbox
        size={24}
        fillColor="#2563eb" // bg-primary color
        unFillColor="#FFFFFF"
        iconStyle={{ borderColor: "#2563eb" }}
        innerIconStyle={{ borderWidth: 2 }}
        onPress={(isChecked: boolean) => {
          if (isChecked) {
            onAddPress();
          } else {
            onRemovePress();
          }
        }}
        isChecked={isAdded}
      />
    </View>
  );
}
