import { View, StyleSheet, Text, Image } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import useApi from "../hooks/useApi";

let {url} = useApi();

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
  infoUser,
}: Props) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={[styles.header, { marginTop: 28 }]}>
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

      <Text style={[styles.title, { fontSize: 20 }]}>{title}</Text>

      {rightIconName ? (
        <TouchableOpacity onPress={() => navigation.navigate("TelaPerfil")}>
          {infoUser?.foto ? (
            <Image
              style={{ width: 30, height: 30, borderRadius: 15 }}
              source={{
                uri: url+ `/storage/img/fotos_usuarios${infoUser.foto}`,
              }}
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
    padding: 20,
  },
  title: {
    color: "#f1c40f",
    fontFamily: "Poppins-Bold",
  },
});
