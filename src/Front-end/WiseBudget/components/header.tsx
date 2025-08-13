import { View, StyleSheet, Text } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';

type RootStackParamList = {
  TelaPerfil: undefined;
};

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

  
const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={[styles.header, { marginTop: 28 }]}>
      {leftIconName ? (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <LeftIcon name={leftIconName} size={leftIconSize} color={leftIconColor} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: leftIconSize }} />
      )}

      <Text style={[styles.title, { fontSize: 20 }]}>{title}</Text>

      {rightIconName ? (
        <TouchableOpacity onPress={() => navigation.navigate('TelaPerfil')}>
          <RightIcon name={rightIconName} size={rightIconSize} color={rightIconColor} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: rightIconSize }} /> 
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
