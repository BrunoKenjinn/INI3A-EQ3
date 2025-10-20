import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Header } from "../components/header";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useAuth } from "../App";
import CustomBottomTab from "../components/CustomBottomTab";
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Icon } from "react-native-elements";
import axios from "axios";
import useApi from "../hooks/useApi";
import { Loading } from "../components/loading";

const { width, height } = Dimensions.get("window");

const getResponsiveFontSize = (size: number) => {
  const scale = width / 375;
  return Math.round(size * scale);
};

export default function TelaPerfil({ navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const [infoUser, setInfoUser] = useState<any>(null);
  const { signOut } = useAuth();

  useFocusEffect(
    useCallback(() => {
      const carregarInformacoes = async () => {
        setIsLoading(true);
        try {
          let { url } = useApi();
          const token = await AsyncStorage.getItem("auth_token");
          const response = await axios.get(url + "/api/usuario", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setInfoUser(response.data);
        } catch (error: any) {
          console.error(
            "Erro ao buscar as informações do usuario:",
            error.response?.data || error.message
          );
          Alert.alert("Erro", "Erro ao buscar informações");
        } finally {
          setIsLoading(false);
        }
      };
      carregarInformacoes();
    }, [])
  );

  if (isLoading) return <Loading />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Header
          leftIconName="arrow-left"
          leftIconColor="#f1c40f"
          leftIconSize={width * 0.06}
          leftIconComponent={FontAwesome5}
          title="Perfil"
          rightIconName="bell"
          rightIconColor="#f1c40f"
          rightIconSize={width * 0.06}
          rightIconComponent={FontAwesome5}
          onLeftPress={() => navigation.goBack()}
        />

        <Image
          style={styles.profileImage}
          source={
            infoUser?.foto
              ? { uri: infoUser.foto }
              : require("../assets/images/FotoPerfil.png")
          }
        />

        <View style={styles.infoSheet}>
          <View style={styles.infoHeader}>
            <View>
              <Text style={styles.userName}>
                {infoUser?.nome || "Carregando..."}
              </Text>
              <Text style={styles.userInfo}>
                {infoUser?.idade
                  ? `${infoUser.idade} anos, Pessoa Física`
                  : "Idade não disponível"}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.botaoEditar}
              onPress={() =>
                navigation.navigate("TelaEditarPerfil", { usuario: infoUser })
              }
            >
              <Text style={styles.botaoEditarText}>Editar</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.actionsGrid} onPress={() => navigation.navigate("TelaConfigs")}>
            <View style={styles.botao}> 
              <FontAwesome5
                name="cog"
                size={getResponsiveFontSize(28)}
                color="white"
              />
            </View>
            <Text style={styles.botaoText}>Configs</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionsGridExit} onPress={signOut}>
            <View style={styles.botao}> 
              <FontAwesome5
                name="sign-out-alt"
                size={getResponsiveFontSize(28)}
                color="white"
              />
            </View>
            <Text style={styles.botaoText}>Sair</Text>
          </TouchableOpacity>
        </View>
        <CustomBottomTab />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2c2c2c",
  },
  content: {
    flex: 1,
    position: "relative",
  },
  profileImage: {
    width: "100%",
    height: height * 0.4,
    position: "absolute",
    top: 0,
  },
  infoSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#2c2c2c",
    borderTopLeftRadius: width * 0.08,
    borderTopRightRadius: width * 0.08,
    height: height * 0.65,
    padding: width * 0.05,
  },
  infoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: height * 0.02,
  },
  userName: {
    color: "#f1c40f",
    fontFamily: "Poppins-Bold",
    fontSize: getResponsiveFontSize(28),
  },
  userInfo: {
    color: "#a3a3a3",
    fontFamily: "Poppins-Regular",
    fontSize: getResponsiveFontSize(14),
  },
  botaoEditar: {
    backgroundColor: "#f1c40f",
    borderRadius: 20,
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.06,
    alignItems: "center",
    justifyContent: "center",
  },
  botaoEditarText: {
    fontFamily: "Poppins-Bold",
    fontSize: getResponsiveFontSize(16),
    color: "#2c2c2c",
  },
  actionsGrid: {
    alignItems: 'center',
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#f1c40f",
    marginTop: height * 0.04,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  botao: {
    padding: width * 0.02,
    alignItems: "center",
    width: "33.33%",
    height: height * 0.12,
    justifyContent: "center",
    gap: height * 0.01,
    marginRight: width * 0.02
  },
  botaoText: {
    color: "white",
    fontFamily: "Poppins-Regular",
    fontSize: getResponsiveFontSize(20),
    letterSpacing: width * 0.02
  },
  actionsGridExit: {
    alignItems: 'center',
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#dc3545",
    marginTop: height * 0.04,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
});
