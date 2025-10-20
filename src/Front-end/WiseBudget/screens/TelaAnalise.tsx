import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  Dimensions,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Header } from "../components/header";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import CustomBottomTab from "../components/CustomBottomTab";
import { Balanço } from "../components/balanco";
import { LineChart } from "react-native-chart-kit";
import { Picker } from "@react-native-picker/picker";
import { Loading } from "../components/loading";
import { useFocusEffect } from "@react-navigation/native";
import useApi from "../hooks/useApi";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TransacaoCard } from "../components/transacaoCard";

const { width, height } = Dimensions.get("window");

const initialChartData = {
  labels: ["1-6", "7-12", "13-18", "19-24", "25-31"],
  datasets: [
    {
      data: [0, 0, 0, 0, 0],
      color: (opacity = 1) => `rgba(241, 196, 15, ${opacity})`,
      strokeWidth: 2,
    },
  ],
};

interface BalancoData {
  credito_mes: number;
  debito_mes: number;
  saldo_total: number;
  saldo_inicial: number;
  saldo: number;
}
type Categoria = {
  id: number;
  nome: string;
  cor: string;
  icone: React.ComponentProps<typeof FontAwesome5>["name"]; 
};

interface TransacaoMaiorValor {
  id: number;
  descricao: string;
  valor: number;
  data: string;
  tipo: 'entrada' | 'saida';
  categoria_id: number;
  recorrente: boolean;
  created_at: string;
}

export default function TelaAnalise({ navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [balanco, setBalanco] = useState<BalancoData>({
    credito_mes: 0,
    debito_mes: 0,
    saldo_total: 0,
    saldo_inicial: 0,
    saldo: 0,
  });

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [chartData, setChartData] = useState(initialChartData);
  const [tipoExibido, setTipoExibido] = useState<"despesas" | "receitas">("despesas");
  const [corCategoria, setCorCategoria] = useState("#f1c40f");
  const [iconeCategoria, setIconeCategoria] = useState<React.ComponentProps<typeof FontAwesome5>["name"]>("exchange");
  
  const [maioresTransacoes, setMaioresTransacoes] = useState<TransacaoMaiorValor[]>([]);

  const chartConfig = {
    backgroundGradientFrom: "#393939",
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: "#393939",
    backgroundGradientToOpacity: 1,
    color: (opacity = 1) => corCategoria,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    propsForDots: { r: "6", strokeWidth: "2", stroke: corCategoria },
  };

  useFocusEffect(
    useCallback(() => {
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

      setIsLoading(true);
      carregarBalanco().finally(() => setIsLoading(false));

      return () => {};
    }, [])
  );
  
  useEffect(() => {
    const fetchCategorias = async () => {
      let { url } = useApi();
      try {
        const token = await AsyncStorage.getItem("auth_token");
        const response = await axios.get(url + "/api/categorias", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        setCategorias(response.data);

        if (response.data.length > 0) {
          setCategoriaId(response.data[0].id);
          setCorCategoria(response.data[0].cor || '#f1c40f');
          setIconeCategoria(response.data[0].icone || 'exchange');
        }
      } catch (error) {
        console.error(
          "Erro ao carregar categorias:",
          error.response?.data || error.message
        );
        Alert.alert("Erro", "Não foi possível carregar as categorias.");
      }
    };
    fetchCategorias();
  }, []);

  useEffect(() => {
    const carregarDadosAnalise = async () => {
      if (!categoriaId) return;

      const categoriaAtual = categorias.find((cat) => cat.id === categoriaId);
      if (categoriaAtual) {
        setCorCategoria(categoriaAtual.cor || '#f1c40f');
        setIconeCategoria(categoriaAtual.icone || 'exchange');
      }

      setIsDataLoading(true);
      setChartData(initialChartData);
      setMaioresTransacoes([]);

      const tipoParaApi = tipoExibido === 'despesas' ? 'saida' : 'entrada';

      try {
        const { url } = useApi();
        const token = await AsyncStorage.getItem("auth_token");
        const date = new Date();
        const mes = date.getMonth() + 1;
        const ano = date.getFullYear();

        const params = {
          categoria_id: categoriaId,
          mes,
          ano,
          tipo: tipoParaApi,
        };

        const headers = { Authorization: `Bearer ${token}` };

        const [graficoResponse, transacoesResponse] = await Promise.all([
          axios.get(`${url}/api/transacoes/categoria-especifica`, { headers, params }),
          axios.get(`${url}/api/transacoes/maiores-por-categoria`, { headers, params })
        ]);

        if (graficoResponse.data && graficoResponse.data.datasets) {
          setChartData(graficoResponse.data);
        }

        if (transacoesResponse.data) {
          const transacoesAdaptadas = transacoesResponse.data.map(t => ({
              ...t,
              tipo: tipoParaApi,
              categoria_id: categoriaId,
              recorrente: t.recorrente ?? false,
              created_at: t.created_at ?? new Date().toISOString(),
              icone: iconeCategoria,
              cor: corCategoria
          }));
          setMaioresTransacoes(transacoesAdaptadas);
        }

      } catch (error) {
        console.error(
          "Erro ao carregar dados de análise:",
          error.response?.data || error.message
        );
        Alert.alert("Erro", "Não foi possível carregar os dados para análise.");
      } finally {
        setIsDataLoading(false);
      }
    };

    carregarDadosAnalise();
  }, [categoriaId, tipoExibido, categorias]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}`;
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        leftIconName="arrow-left"
        leftIconColor="#f1c40f"
        leftIconSize={width * 0.06}
        leftIconComponent={FontAwesome5}
        title="Análise Específica"
        onLeftPress={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <Balanço
          credito={balanco.credito_mes.toString()}
          debito={balanco.debito_mes.toString()}
          saldo={balanco.saldo.toString()}
          saldoTotal={balanco.saldo_total.toString()}
        />

        <View style={styles.tipoContainer}>
          <TouchableOpacity
            style={[styles.tipoButton, tipoExibido === 'despesas' && styles.tipoButtonActive]}
            onPress={() => setTipoExibido('despesas')}
          >
            <Text style={styles.tipoButtonText}>Despesas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tipoButton, tipoExibido === 'receitas' && styles.tipoButtonActive]}
            onPress={() => setTipoExibido('receitas')}
          >
            <Text style={styles.tipoButtonText}>Receitas</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Analisar Categoria</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={categoriaId}
            onValueChange={(itemValue) => setCategoriaId(itemValue)}
            style={styles.picker}
            dropdownIconColor="#f1c40f"
          >
            {categorias.map((cat) => (
              <Picker.Item key={cat.id} label={cat.nome} value={cat.id} />
            ))}
          </Picker>
        </View>

        {isDataLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={corCategoria} />
          </View>
        ) : (
          <>
            <LineChart
              data={chartData}
              width={width * 1.0}
              height={320}
              chartConfig={chartConfig}
              bezier
              style={styles.chartStyle}
              withHorizontalLines={false}
              fromZero={true}
              yAxisLabel="R$ "
              segments={4}
            />

            <View style={styles.maioresTransacoesContainer}>
              <Text style={styles.listTitle}>
                Principais {tipoExibido === 'despesas' ? 'Despesas' : 'Receitas'}
              </Text>
              {maioresTransacoes.length > 0 ? (
                maioresTransacoes.map((item) => (
                  <TransacaoCard
                    key={item.id}
                    descricao={item.descricao}
                    valor={item.valor}
                    data={formatDate(item.data)}
                    hora="" 
                    icone={iconeCategoria} 
                    cor={corCategoria}
                    onPress={() =>
                      navigation.navigate("TelaEditarTransacoes", { transacao: item })
                    }
                  />
                ))
              ) : (
                <Text style={styles.emptyListText}>
                  Nenhuma transação encontrada neste período.
                </Text>
              )}
            </View>
          </>
        )}
      </ScrollView>

      <View style={styles.bottomTabContainer}>
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
  scrollContentContainer: {
    alignItems: "center",
    paddingBottom: 100, 
  },
  tipoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: width - width * 0.16,
    marginTop: height * 0.02,
  },
  tipoButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    backgroundColor: '#393939',
  },
  tipoButtonActive: {
    backgroundColor: '#f1c40f',
  },
  tipoButtonText: {
    color: '#ffffff',
    fontFamily: 'Poppins-Bold',
  },
  pickerContainer: {
    backgroundColor: "#393939",
    borderRadius: 10,
    height: height * 0.055,
    width: width - width * 0.16,
    justifyContent: "center",
    marginTop: height * 0.01,
  },
  picker: {
    color: "#ffffff",
    backgroundColor: "#393939",
  },
  label: {
    color: "#f1c40f",
    fontFamily: "Poppins-Regular",
    fontSize: width * 0.035,
    alignSelf: "flex-start",
    marginLeft: width * 0.08,
    marginTop: height * 0.02,
  },
  chartStyle: {
    borderRadius: width * 0.05,
    paddingTop: 30,
    margin: 10,
  },
  loadingContainer: {
    width: width * 0.95,
    height: 256,
    justifyContent: "center",
    alignItems: "center",
    marginTop: height * 0.02,
  },
  bottomTabContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  maioresTransacoesContainer: {
    width: width * 0.9,
    marginTop: height * 0.03,
  },
  listTitle: {
    color: '#f1c40f',
    fontFamily: 'Poppins-Bold',
    fontSize: width * 0.045,
    marginBottom: 10,
  },
  emptyListText: {
    color: '#a0a0a0',
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    paddingVertical: 20,
  }

});