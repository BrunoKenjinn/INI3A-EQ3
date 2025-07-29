import { View, StyleSheet, Text } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';

type Props = {
  title: string;
  leftIconName?: string;
  leftIconSize?: number;
  leftIconColor?: string;
  leftIconComponent?: React.ElementType;
  rightIconName?: string;
  rightIconSize?: number;
  rightIconColor?: string;
  rightIconComponent?: React.ElementType;
};

export function Header({
  title,
  leftIconName,
  leftIconSize = 24,
  leftIconColor = "#fff",
  leftIconComponent: LeftIcon = AntDesign,
  rightIconName,
  rightIconSize = 24,
  rightIconColor = "#fff",
  rightIconComponent: RightIcon = AntDesign,
}: Props) {
  return (
    <View style={[styles.header, { marginTop: 28 }]}>
      {leftIconName && (
        <LeftIcon name={leftIconName} size={leftIconSize} color={leftIconColor} />
      )}
      <Text style={[styles.title, { fontSize: 20 }]}>{title}</Text>
      {rightIconName && (
        <RightIcon name={rightIconName} size={rightIconSize} color={rightIconColor} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    color: '#f1c40f',
    fontFamily: 'Poppins-Bold',
  },
});
