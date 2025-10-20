import {
  Dimensions,
  SafeAreaView,
  View,
  ActivityIndicator,
  Alert,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Header } from "../components/header";
import CustomBottomTab from "../components/CustomBottomTab";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Meta } from "../components/meta";
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import useApi from "../hooks/useApi";

const { width, height } = Dimensions.get("window");

const getResponsiveFontSize = (size: number) => {
  const scale = width / 375;
  return Math.round(size * scale);
};

interface MetaType {
  id: number;
  progress: number;
  goalAmount: string;
  subtitle: string;
  date: string | null;
  valor_atual_formatado: string;
  isCompleted: boolean;
}

export default function TelaMetas({ navigation }) {
  const [metas, setMetas] = useState<MetaType[]>([]);
  const [loading, setLoading] = useState(true);
  const { url } = useApi();

  useFocusEffect(
    useCallback(() => {
      const carregarMetas = async () => {
        setLoading(true);
        try {
          const token = await AsyncStorage.getItem("auth_token");
          const response = await axios.get(url + "/api/metas", {
            headers: { Authorization: `Bearer ${token}` },
          });

          const metasFormatadas = response.data
            .map((meta: any) => ({
              ...meta,
              isCompleted: meta.progress >= 100,
            }))
            .sort((a, b) => {
              if (a.isCompleted !== b.isCompleted) {
                return a.isCompleted ? 1 : -1;
              }
              return (
                new Date(b.created_at || 0).getTime() -
                new Date(a.created_at || 0).getTime()
              );
            });
          setMetas(metasFormatadas);
        } catch (error) {
          console.error(
            "Erro ao buscar metas:",
            error.response?.data || error.message
          );
          Alert.alert("Erro", "Erro ao buscar metas");
        } finally {
          setLoading(false);
        }
      };

      carregarMetas();
    }, [url])
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        leftIconName="arrow-left"
        leftIconColor="#f1c40f"
        leftIconSize={width * 0.06}
        leftIconComponent={FontAwesome5}
        title="Minhas Metas"
        rightIconName="plus-circle"
        onRightPress={() => navigation.navigate("TelaAdicionarMeta")}
        rightIconColor="#f1c40f"
        rightIconSize={width * 0.065}
        rightIconComponent={FontAwesome5}
        onLeftPress={() => navigation.goBack()}
      />

      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#f1c40f" style={{ flex: 1 }} />
        ) : metas.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma meta encontrada.</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("TelaAdicionarMeta")}
            >
              <Text style={styles.textButton}>Criar minha primeira meta!</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <TouchableOpacity
              style={styles.distribuirButton}
              onPress={() => navigation.navigate("TelaDistribuirMetas")}
            >
              <FontAwesome5
                name="coins"
                size={getResponsiveFontSize(16)}
                color="#2c2c2c"
              />
              <Text style={styles.distribuirButtonText}>Distribuir Ganhos</Text>
            </TouchableOpacity>
            <FlatList
              data={metas}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <Meta
                  progress={item.progress}
                  goalAmount={item.goalAmount}
                  subtitle={item.subtitle}
                  date={item.date}
                  valorAtualFormatado={item.valor_atual_formatado}
                  isCompleted={item.isCompleted} 
                />
              )}
              contentContainerStyle={styles.listContent}
              style={{ width: "100%" }}
            />
          </>
        )}
      </View>

      <CustomBottomTab />
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
    alignItems: "center",
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.02,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: width * 0.1,
    marginBottom: height * 0.1,
  },
  emptyText: {
    color: "#a3a3a3",
    textAlign: "center",
    fontSize: getResponsiveFontSize(16),
    fontFamily: "Poppins-Regular",
    marginBottom: height * 0.03,
  },
  listContent: {
    paddingBottom: height * 0.12,
  },
  button: {
    backgroundColor: "#f1c40f",
    paddingVertical: height * 0.018,
    paddingHorizontal: width * 0.1,
    alignItems: "center",
    borderRadius: 25,
    marginTop: height * 0.02,
  },
  textButton: {
    fontSize: getResponsiveFontSize(15),
    fontFamily: "Poppins-Bold",
    color: "#2c2c2c",
  },
  distribuirButton: {
    backgroundColor: "#f1c40f",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: height * 0.018,
    width: "100%",
    borderRadius: 15,
    marginBottom: height * 0.03,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  distribuirButtonText: {
    fontSize: getResponsiveFontSize(16),
    fontFamily: "Poppins-Bold",
    color: "#2c2c2c",
    marginLeft: 10,
  },
  
});
