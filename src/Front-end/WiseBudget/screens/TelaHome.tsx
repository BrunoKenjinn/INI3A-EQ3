import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  FlatList,
  Alert,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import { Header } from "../components/header";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import CustomBottomTab from "../components/CustomBottomTab";
import { Balanço } from "../components/balanco";
import { PieChart } from "react-native-chart-kit";
import { ComponentType, useCallback, useState } from "react";
import { IconProps } from "@expo/vector-icons/build/createIconSet";
import { Atalho } from "../components/atalho";
import { TransacaoCard } from "../components/transacaoCard";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Loading } from "../components/loading";
import axios from "axios";
import useApi from "../hooks/useApi";
import { useAuth } from "../App";

const { width, height } = Dimensions.get("window");

const getResponsiveFontSize = (size: number) => {
  const scale = width / 375;
  return Math.round(size * scale);
};

type IconComponentType = ComponentType<
  IconProps<keyof typeof FontAwesome.glyphMap>
>;
interface ChartDataItem {
  name: string;
  population: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}

interface BalancoData {
  credito_mes: number;
  debito_mes: number;
  saldo_total: number;
  saldo_inicial: number;
  saldo: number;
}

interface Entrada {
  id: number;
  descricao: string;
  valor: number;
  data: string;
  created_at: string;
  icone: React.ComponentProps<typeof FontAwesome>["name"];
  cor: string;
}

export default function TelaHome({ navigation }) {
  const { signOut } = useAuth();
  const [isActive, setIsActive] = useState(false);
  const { user } = useAuth();
  const [atalhos, setAtalhos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartDataItem[]>([
    {
      name: "Carregando...",
      population: 100,
      color: "#5A5A5A",
      legendFontColor: "#7F7F7F",
      legendFontSize: getResponsiveFontSize(14),
    },
  ]);

  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  const atalhosComAdicionar = [
    ...atalhos,
    {
      id: 0,
      nome: "Adicionar",
      icone: "plus-circle",
      rota: "TelaAdicionarAtalho",
    },
  ];

  const [balanco, setBalanco] = useState<BalancoData>({
    credito_mes: 0,
    debito_mes: 0,
    saldo_total: 0,
    saldo_inicial: 0,
    saldo: 0,
  });

  const [entradasHoje, setEntradasHoje] = useState<Entrada[]>([]);

  useFocusEffect(
    useCallback(() => {
      const carregarTudo = async () => {
        setIsLoading(true);
        try {
          await carregarAtalhos();
          await carregarDadosGrafico();
          await carregarEntradas();
          await carregarBalanco();
        } catch (error) {
          console.error("Erro ao carregar dados da Tela Home:", error);
          Alert.alert(
            "Erro",
            "Não foi possível carregar os dados. Tente novamente."
          );
        } finally {
          setIsLoading(false);
        }
      };
      const carregarAtalhos = async () => {
        try {
          let { url } = useApi();
          const token = await AsyncStorage.getItem("auth_token");
          const response = await axios.get(url + "/api/atalhos", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setAtalhos(response.data);
        } catch (error) {
          console.error(
            "Erro ao buscar atalhos:",
            error.response?.data || error.message
          );
        }
      };

      const carregarDadosGrafico = async () => {
        try {
          let { url } = useApi();
          const token = await AsyncStorage.getItem("auth_token");
          const response = await axios.get(
            url + "/api/gastos-por-categoria?periodo=hoje",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (response.data && response.data.length > 0) {
            setChartData(response.data);
          } else {
            setChartData([
              {
                name: "Nenhum Gasto",
                population: 100,
                color: "#5A5A5A",
                legendFontColor: "#7F7F7F",
                legendFontSize: getResponsiveFontSize(15),
              },
            ]);
          }
        } catch (error) {
          console.error(
            "Erro ao buscar dados do gráfico:",
            error.response?.data || error.message
          );
        }
      };

      const carregarEntradas = async () => {
        try {
          let { url } = useApi();
          const token = await AsyncStorage.getItem("auth_token");
          const response = await axios.get(url + "/api/entradas-hoje", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setEntradasHoje(response.data);
        } catch (error) {
          console.error(
            "Erro ao buscar entradas:",
            error.response?.data || error.message
          );
        }
      };

      const carregarBalanco = async () => {
        try {
          let { url } = useApi();
          const token = await AsyncStorage.getItem("auth_token");
          const response = await axios.get(url + "/api/balanco", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setBalanco(response.data);
        } catch (error) {
          console.error(
            "Erro ao buscar balanço:",
            error.response?.data || error.message
          );
        }
      };

      carregarTudo();

      return () => {};
    }, [])
  );

  const handleDelete = async (id: number) => {
    Alert.alert(
      "Excluir Atalho",
      "Tem certeza que deseja excluir este atalho?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          onPress: async () => {
            try {
              let { url } = useApi();
              const token = await AsyncStorage.getItem("auth_token");
              await axios.delete(url + `/api/atalhos/${id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              setAtalhos((prev) => prev.filter((a) => a.id !== id));
            } catch (error) {
              console.error(
                "Erro ao excluir atalho:",
                error.response?.data || error.message
              );
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  if (isLoading) {
    return <Loading />;
  }

  const totalPopulation = chartData.reduce(
    (sum, item) => sum + item.population,
    0
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Header
          leftIconName="bars"
          leftIconColor="#f1c40f"
          leftIconSize={width * 0.06}
          leftIconComponent={FontAwesome5}
          title="Olá, Bem vindo de volta!"
          rightIconName="user"
          rightIconColor="#f1c40f"
          rightIconSize={width * 0.06}
          rightIconComponent={FontAwesome5}
          infoUser={user}
          onRightPress={() => navigation.navigate("TelaPerfil")}
          onLeftPress={() => {
            setIsActive(true);
          }}
        />

        {isActive && (
          <TouchableWithoutFeedback onPress={() => setIsActive(false)}>
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>
        )}

        {isActive && (
          <SafeAreaView style={styles.sidebar}>
            <Text style={styles.sidebarTitle}>Menu</Text>
            <TouchableOpacity
              style={styles.sidebarItemContainer}
              onPress={() => {
                setIsActive(false);
                navigation.navigate("TelaConfigs");
              }}
            >
              <FontAwesome5
                name="cog"
                size={getResponsiveFontSize(16)}
                color="#f1c40f"
                style={styles.sidebarIcon}
              />
              <Text style={styles.sidebarItemText}>Configurações</Text>
            </TouchableOpacity>
            <View style={styles.sidebarDivider} />

            <TouchableOpacity
              style={styles.sidebarItemContainer}
              onPress={() => {
                signOut();
                setIsActive(false);
              }}
            >
              <FontAwesome5
                name="sign-out-alt"
                size={getResponsiveFontSize(16)}
                color="#e74c3c"
                style={styles.sidebarIcon}
              />
              <Text style={[styles.sidebarItemText, styles.sidebarItemSair]}>
                Sair
              </Text>
            </TouchableOpacity>
          </SafeAreaView>
        )}
        <Balanço
          credito={balanco.credito_mes.toString()}
          debito={balanco.debito_mes.toString()}
          saldo={balanco.saldo.toString()}
          saldoTotal={balanco.saldo_total.toString()}
        />

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionText}>Gráfico de Setores</Text>
            <Text style={styles.sectionText}>Saídas</Text>
          </View>

          <View style={styles.chartWrapper}>
            <PieChart
              data={chartData}
              width={width * 0.5}
              height={height * 0.16}
              chartConfig={chartConfig}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft="30"
              center={[0, 0]}
              hasLegend={false}
            />

            <View style={styles.legendContainer}>
              {chartData.map((item, index) => {
                const percentage =
                  totalPopulation > 0
                    ? ((item.population / totalPopulation) * 100).toFixed(0)
                    : 0;

                return (
                  <View key={index} style={styles.legendItem}>
                    <View
                      style={[
                        styles.legendColor,
                        { backgroundColor: item.color },
                      ]}
                    />
                    <Text style={styles.legendText}>
                      {item.name} ({percentage}%)
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionText}>Sua Carteira</Text>
            <Text style={styles.sectionText}>Entradas</Text>
          </View>
          <FlatList
            data={entradasHoje}
            keyExtractor={(item) => item.id.toString()}
            style={{ maxHeight: height * 0.2 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TransacaoCard
                descricao={item.descricao}
                valor={item.valor}
                hora={new Date(item.created_at).toLocaleTimeString("pt-BR",{ 
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                icone={item.icone}
                cor={item.cor}
              />
            )}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionText}>Atalhos</Text>

          <FlatList
            data={atalhosComAdicionar}
            keyExtractor={(item) => item.id.toString()}
            horizontal={true}
            renderItem={({ item }) => (
              <View style={styles.atalhoItem}>
                <Atalho
                  iconName={item.icone}
                  text={item.nome}
                  onPress={() => {
                    navigation.navigate(item.rota);
                  }}
                  onLongPress={() => {
                    if (item.id !== 0) {
                      handleDelete(item.id);
                    }
                  }}
                />
              </View>
            )}
            contentContainerStyle={styles.atalhoList}
            showsHorizontalScrollIndicator={false}
          />
        </View>
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
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.01,
    paddingBottom: height * 0.6,
  },
  section: {
    width: "100%",
    marginTop: height * 0.02,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: width * 0.02,
  },
  sectionText: {
    color: "white",
    fontFamily: "Poppins-Regular",
    fontSize: getResponsiveFontSize(12),
  },
  chartWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#393939",
    borderRadius: width * 0.05,
    marginTop: height * 0.01,
    padding: width * 0.02,
  },

  legendContainer: {
    marginLeft: 10,
    flexShrink: 1,
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },

  legendText: {
    color: "white",
    fontSize: getResponsiveFontSize(12),
    flexShrink: 1,
    flexWrap: "wrap",
    fontFamily: "Poppins-Regular",
  },

  atalhoItem: {
    marginRight: width * 0.03,
  },

  sidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: width * 0.75,
    backgroundColor: "#343a40", 
    paddingTop: height * 0.05, 
    paddingHorizontal: width * 0.05,
    zIndex: 10,
    elevation: 10,
    borderRightWidth: 1, 
    borderRightColor: "#495057",
  },
  sidebarTitle: {
    color: "#f1c40f",
    fontSize: getResponsiveFontSize(20), 
    fontFamily: "Poppins-Bold",
    marginBottom: height * 0.04, 
    textAlign: "center",
  },
  sidebarItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: height * 0.018, 
    marginBottom: height * 0.005, 
    borderRadius: 8, 
    paddingHorizontal: width * 0.02, 
  },
  sidebarIcon: {
    width: width * 0.08, 
    textAlign: "center", 
    marginRight: width * 0.04, 
  },
  sidebarItemText: {
    color: "#ecf0f1", 
    fontSize: getResponsiveFontSize(15),
    fontFamily: "Poppins-Medium",
  },
  sidebarItemSair: {
    color: "#e74c3c", 
    fontFamily: "Poppins-Bold", 
  },
  sidebarDivider: {
    height: 1,
    backgroundColor: "#495057",
    marginVertical: height * 0.025, 
    marginHorizontal: width * 0.02, 
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Mais escuro
    zIndex: 9,
  },
});
