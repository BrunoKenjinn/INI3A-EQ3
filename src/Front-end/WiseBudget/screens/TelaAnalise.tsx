import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Dimensions,
  StyleSheet,
  View,
  Text,
  FlatList,
  Alert,
  ActivityIndicator, // Usado para o loading do seletor
} from "react-native";
import { Header } from "../components/header";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import CustomBottomTab from "../components/CustomBottomTab";
import { Balanço } from "../components/balanco";
import { LineChart } from "react-native-chart-kit";
import { TransacaoCard } from "../components/transacaoCard";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useApi from "../hooks/useApi";
import { Loading } from "../components/loading";

const { width, height } = Dimensions.get("window");

// Dados iniciais para o gráfico, para evitar erros de renderização
const initialChartData = {
  labels: ["1-6", "7-12", "13-18", "19-24", "25+"],
  datasets: [
    {
      data: [0, 0, 0, 0, 0],
    },
  ],
};

export default function TelaAnalise({ navigation }) {
  // --- ESTADOS ---
  const [isLoading, setIsLoading] = useState(true); // Controla o loading inicial da tela inteira
  const [isPickerLoading, setIsPickerLoading] = useState(false); // Controla o loading ao mudar de categoria
  const [categorias, setCategorias] = useState([]);
  const [categoriaId, setCategoriaId] = useState(null);

  const [balanco, setBalanco] = useState({ credito: 0, debito: 0, saldo: 0, saldoTotal: 0 });
  const [chartData, setChartData] = useState(initialChartData);
  const [principaisTransacoes, setPrincipaisTransacoes] = useState([]);

  const { url } = useApi();

  // --- EFEITOS (BUSCA DE DADOS) ---

  // EFEITO 1: Roda APENAS UMA VEZ para carregar todos os dados iniciais da tela.
  useEffect(() => {
    const carregarDadosIniciais = async () => {
      setIsLoading(true);
      try {
        const token = await AsyncStorage.getItem("auth_token");
        const headers = { Authorization: `Bearer ${token}` };

        // 1. Busca as categorias e o balanço geral em paralelo para otimizar o tempo
        const [categoriasResponse, balancoResponse] = await Promise.all([
            axios.get(`${url}/api/categorias`, { headers }),
            axios.get(`${url}/api/balanco`, { headers })
        ]);
        
        // Atualiza o balanço
        setBalanco({
          credito: balancoResponse.data.credito_mes,
          debito: balancoResponse.data.debito_mes,
          saldo: balancoResponse.data.saldo,
          saldoTotal: balancoResponse.data.saldo_total,
        });

        // 2. Verifica se existem categorias
        if (!categoriasResponse.data || categoriasResponse.data.length === 0) {
          setCategorias([]);
          setIsLoading(false); // Para o loading se não há nada para analisar
          return;
        }

        const todasCategorias = categoriasResponse.data;
        const primeiraCategoria = todasCategorias[0];
        setCategorias(todasCategorias);
        setCategoriaId(primeiraCategoria.id);

        // 3. Busca os dados de análise da PRIMEIRA categoria da lista
        const analiseResponse = await axios.get(`${url}/api/analise-categoria`, {
          headers,
          params: {
            categoria_id: primeiraCategoria.id,
            tipo: 'saida', // fixo para garantir funcionamento
          },
        });

        // 4. Atualiza os estados do gráfico e da lista com os dados recebidos
        setChartData(analiseResponse.data.chartData);
        setPrincipaisTransacoes(analiseResponse.data.principaisTransacoes);

      } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error);
        // O erro 500 será capturado aqui.
        Alert.alert("Erro no Servidor", "Não foi possível carregar os dados da tela de análise. Verifique o backend.");
        setCategorias([]); // Garante que a tela de "sem categorias" apareça
      } finally {
        setIsLoading(false); // Garante que o loading principal sempre termine
      }
    };

    carregarDadosIniciais();
  }, []); // Array de dependências vazio, executa apenas na montagem do componente

  // --- FUNÇÕES ---

  // Função chamada QUANDO O USUÁRIO MUDA O VALOR NO SELETOR (PICKER)
  const handleCategoriaChange = async (novoCategoriaId) => {
    if (novoCategoriaId === null || novoCategoriaId === categoriaId) {
      return; // Evita recargas desnecessárias
    }

    setCategoriaId(novoCategoriaId); // Atualiza o ID selecionado
    setIsPickerLoading(true); // Ativa o loading do gráfico/lista

    try {
      const categoriaSelecionada = categorias.find(cat => cat.id === novoCategoriaId);
      if (!categoriaSelecionada) {
        throw new Error("Categoria selecionada não encontrada");
      }

      const token = await AsyncStorage.getItem("auth_token");
      const response = await axios.get(`${url}/api/analise-categoria`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          categoria_id: categoriaSelecionada.id,
          tipo: 'saida', // fixo para garantir funcionamento
        },
      });

      setChartData(response.data.chartData);
      setPrincipaisTransacoes(response.data.principaisTransacoes);
    } catch (error) {
      console.error("Erro ao carregar dados da categoria:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados para esta categoria.");
      setChartData(initialChartData); // Reseta para o estado inicial em caso de erro
      setPrincipaisTransacoes([]);
    } finally {
      setIsPickerLoading(false); // Desativa o loading do gráfico/lista
    }
  };

  // --- CONFIGURAÇÕES E FUNÇÕES DE RENDERIZAÇÃO ---

  const chartConfig = {
    backgroundGradientFrom: "#393939",
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: "#393939",
    backgroundGradientToOpacity: 1,
    color: (opacity = 1) => `rgba(241, 196, 15, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    propsForDots: { r: "6", strokeWidth: "2", stroke: "#f1c40f" },
  };

  const formatYLabel = (yValue) => Math.round(Number(yValue)).toString();

  const renderItem = ({ item }) => <TransacaoCard {...item} />;

  const renderListHeader = () => (
    <View style={{ alignItems: "center" }}>
      <Balanço {...balanco} />
      <Text style={styles.label}>Analisar Categoria</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={categoriaId}
          onValueChange={(itemValue) => handleCategoriaChange(itemValue)}
          style={styles.picker}
          dropdownIconColor="#f1c40f"
        >
          {categorias.map((cat) => (
            <Picker.Item key={cat.id} label={cat.nome} value={cat.id} />
          ))}
        </Picker>
      </View>
      
      {/* View para mostrar o loading no lugar do gráfico e lista */}
      {isPickerLoading ? (
        <View style={styles.pickerLoadingContainer}>
          <ActivityIndicator size="large" color="#f1c40f" />
        </View>
      ) : (
        <>
          <LineChart
            data={chartData.datasets && chartData.datasets[0].data.length > 0 ? chartData : initialChartData}
            width={width * 0.95}
            height={256}
            chartConfig={chartConfig}
            bezier
            style={{ borderRadius: width * 0.05, marginTop: height * 0.02, paddingRight: 40 }}
            withHorizontalLines={false}
            fromZero={true}
            yAxisLabel="R$ "
            formatYLabel={formatYLabel}
            segments={4}
          />
          <View style={{ marginTop: height * 0.02, width: width - width * 0.16 }}>
            <Text style={styles.listHeader}>Principais Transações no Mês</Text>
          </View>
        </>
      )}
    </View>
  );

  // --- COMPONENTE PRINCIPAL ---

  // Mostra o loading da tela inteira apenas na primeira carga
  if (isLoading) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        leftIconName="arrow-left" leftIconColor="#f1c40f" leftIconSize={width * 0.06}
        leftIconComponent={FontAwesome5} title="Análise Específica"
        onLeftPress={() => navigation.goBack()}
      />

      {categorias.length > 0 ? (
        <FlatList
          data={principaisTransacoes}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={renderListHeader}
          contentContainerStyle={{ paddingBottom: 80 }}
          ListEmptyComponent={() => (
            // Não mostra a mensagem de "vazio" enquanto estiver carregando
            !isPickerLoading && (
                <View style={styles.emptyListContainer}>
                    <Text style={styles.emptyText}>Nenhuma transação encontrada para esta categoria no mês.</Text>
                </View>
            )
          )}
        />
      ) : (
        // Mensagem mostrada se não houver nenhuma categoria cadastrada
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhuma categoria encontrada.</Text>
          <Text style={styles.emptyText}>Adicione uma categoria para começar a análise.</Text>
        </View>
      )}

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
  pickerContainer: {
    backgroundColor: '#393939',
    borderRadius: 10,
    height: height * 0.055,
    width: width - width * 0.16,
    justifyContent: 'center',
    marginTop: height * 0.01,
  },
  picker: {
    color: '#ffffff',
  },
  label: {
    color: '#f1c40f',
    fontFamily: 'Poppins-Regular',
    fontSize: width * 0.035,
    alignSelf: 'flex-start',
    marginLeft: width * 0.08,
    marginTop: height * 0.02,
  },
  listHeader: {
    color: "#f1c40f",
    fontFamily: "Poppins-Bold",
    fontSize: width * 0.04,
  },
  bottomTabContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  emptyListContainer: {
    marginTop: 20,
    alignItems: 'center'
  },
  emptyText: {
    color: '#a0a0a0',
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'Poppins-Regular',
    fontSize: width * 0.04,
    paddingHorizontal: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  pickerLoadingContainer: {
    width: width * 0.95,
    height: 256 + height * 0.02, // Altura do gráfico + margem
    justifyContent: 'center',
    alignItems: 'center',
  }
});
