import {
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  Platform,
  StatusBar,
  TouchableOpacity
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import useApi from "../hooks/useApi";

let { url } = useApi();

const { width } = Dimensions.get("window");

const getResponsiveFontSize = (size: number) => {
  const scale = width / 375;
  return Math.round(size * scale);
};

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
  infoUser?: any;
  onRightPress?: () => void;
};

export function Header({
  title,
  leftIconName,
  leftIconSize = width * 0.07,
  leftIconColor = "#fff",
  leftIconComponent: LeftIcon = AntDesign,
  rightIconName,
  rightIconSize = width * 0.06,
  rightIconColor = "#fff",
  rightIconComponent: RightIcon = AntDesign,
  infoUser,
  onRightPress,
}: Props) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={styles.header}>
      {leftIconName ? (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <LeftIcon
            name={leftIconName}
            size={leftIconSize}
            color={leftIconColor}
          />
        </TouchableOpacity>
      ) : (
        <View style={{ width: leftIconSize }} />
      )}

      <Text style={styles.title}>{title}</Text>

      {rightIconName ? (
        <TouchableOpacity onPress={onRightPress ? onRightPress : () => { }}>
          {infoUser?.foto ? (
            <Image
              style={styles.profilePic}
              source={{ uri: infoUser.foto }}
            />
          ) : (
            <RightIcon
              name={rightIconName}
              size={rightIconSize}
              color={rightIconColor}
            />
          )}
        </TouchableOpacity>
      ) : (
        <View style={{ width: rightIconSize }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 20,
    paddingBottom: 10,
    zIndex: 10,
  },
  title: {
    color: "#f1c40f",
    fontFamily: "Poppins-Bold",
    fontSize: getResponsiveFontSize(18),
    textAlign: "center",
    flex: 1,
  },
  profilePic: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: (width * 0.12) / 2,
  },
});
