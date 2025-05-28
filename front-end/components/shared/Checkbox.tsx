import { View } from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

interface CheckboxProps {
  isChecked: boolean;
  onCheck: () => void;
  onUncheck: () => void;
}

export function Checkbox({ isChecked, onCheck, onUncheck }: CheckboxProps) {
  return (
    <View className="w-6 h-6">
      <BouncyCheckbox
        size={24}
        fillColor="#f97316" // orange-200
        unFillColor="#FFFFFF"
        iconStyle={{ borderColor: "#f97316" }}
        innerIconStyle={{ borderWidth: 2 }}
        onPress={(isChecked: boolean) => {
          if (isChecked) {
            onCheck();
          } else {
            onUncheck();
          }
        }}
        isChecked={isChecked}
      />
    </View>
  );
}
