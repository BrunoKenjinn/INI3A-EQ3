import { PieChart } from "react-native-chart-kit";
import React, { ComponentType, useEffect, useState } from "react";
import { IconProps } from "@expo/vector-icons/build/createIconSet";
import { Loading } from "../components/loading";
import axios from "axios";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import useApi from "../hooks/useApi";
import {
  Alert,
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions
} from "react-native";
import { Header } from "../components/header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Analise } from "../components/analise";
import { BarChart } from "react-native-gifted-charts";
import { TransacaoCard } from "../components/transacaoCard";
import CustomBottomTab from "../components/CustomBottomTab";


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
interface StackItem {
  value: number;
  color?: string;
  nome?: string;
}

interface StackDataItem {
  label: string;
  stacks: StackItem[];
}

interface AnaliseData {
  credito_mes: number;
  debito_mes: number;
  saldo_total: number;
  economia: number;
  maior_gasto?: string;
  icone_maior_gasto?: string;
  cor_maior_gasto?: string;
}
interface BarDataPoint {
  value: number;
  frontColor?: string;
  nome?: string;
  label?: string;
  labelComponent?: () => React.ReactNode;
  spacing?: number;
  topLabelComponent?: () => React.ReactNode;
}

export default function TelaAnaliseRapida({ navigation }) {
  const [analise, setAnalise] = useState<AnaliseData>({
    credito_mes: 0,
    debito_mes: 0,
    saldo_total: 0,
    economia: 0,
    maior_gasto: "Nenhum",
    icone_maior_gasto: "question",
    cor_maior_gasto: "#f1c40f",
  });

  const [chartData, setChartData] = useState<ChartDataItem[]>([
    {
      name: "Carregando...",
      population: 100,
      color: "#5A5A5A",
      legendFontColor: "#7F7F7F",
      legendFontSize: getResponsiveFontSize(15),
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
  const [isLoading, setIsLoading] = useState(true);
  const [dadosAgrupados, setDadosAgrupados] = useState<BarDataPoint[]>([]);
  const [chartWidthState, setChartWidthState] = useState<number>(480);
  const [tipoSelecionado, setTipoSelecionado] = useState<"credito" | "debito">(
    "credito"
  );
  const [dadosBarras, setDadosBarras] = useState<StackDataItem[]>([
    { label: "Dom", stacks: [{ value: 0, color: "#5A5A5A" }] },
    { label: "Seg", stacks: [{ value: 0, color: "#5A5A5A" }] },
    { label: "Ter", stacks: [{ value: 0, color: "#5A5A5A" }] },
    { label: "Qua", stacks: [{ value: 0, color: "#5A5A5A" }] },
    { label: "Qui", stacks: [{ value: 0, color: "#5A5A5A" }] },
    { label: "Sex", stacks: [{ value: 0, color: "#5A5A5A" }] },
    { label: "Sáb", stacks: [{ value: 0, color: "#5A5A5A" }] },
  ]);
  const [principaisTransacoes, setPrincipaisTransacoes] = useState<any[]>([]);
  const BAR_WIDTH = width * 0.08;
  const INNER_SPACING = width * 0.012;
  const GROUP_SPACING = width * 0.12;
  const Y_AXIS_LABEL_WIDTH = width * 0.13;

  useEffect(() => {
    const carregarTudo = async () => {
      setIsLoading(true);
      try {
        await carregarAnalise();
        await carregarDadosGraficoDeSetores();
        await carregarPrincipaisTransacoes();
        await carregarGraficoDeBarras();
      } catch (error) {
        console.error(
          "Erro ao carregar dados da Tela de Adicionar Atalhos:",
          error
        );
        Alert.alert(
          "Erro",
          "Não foi possível carregar os dados. Tente novamente."
        );
      } finally {
        setIsLoading(false);
      }
    };

    const carregarAnalise = async () => {
      let { url } = useApi();
      const token = await AsyncStorage.getItem("auth_token");
      const response = await axios.get(url + "/api/balanco", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnalise(response.data);
    };

    const carregarDadosGraficoDeSetores = async () => {
      try {
        let { url } = useApi();
        const token = await AsyncStorage.getItem("auth_token");
        const tipoBackend = tipoSelecionado === "credito" ? "entrada" : "saida";
        const response = await axios.get(
          url + `/api/gastos-por-categoria?periodo=semana&tipo=${tipoBackend}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data && response.data.length > 0) {
          const responsiveChartData = response.data.map(item => ({
            ...item,
            legendFontSize: getResponsiveFontSize(15)
          }));
          setChartData(responsiveChartData);
        } else {
          setChartData([
            {
              name: "Nenhum",
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


    const buildChartDataAndWidth = (dadosFormatados: StackDataItem[]) => {
      const dados: BarDataPoint[] = [];
      const groupWidths: number[] = [];

      dadosFormatados.forEach((dia) => {
        const barrasDoDia = dia.stacks.filter((s) => s.value > 0);
        const count = barrasDoDia.length || 1;
        const barsWidth =
          count * BAR_WIDTH + Math.max(0, count - 1) * INNER_SPACING;

        const LabelDoDia = () => {
          if (barrasDoDia.length > 1) {
            return (
              <View style={{ width: barsWidth, alignItems: "center" }}>
                <Text style={{ color: "white", fontFamily: "Poppins-Regular" }}>
                  {dia.label}
                </Text>
              </View>
            );
          }

          const labelComEspaco = `\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0${dia.label}`;

          return (
            <Text style={{ color: "white", fontFamily: "Poppins-Regular" }}>
              {labelComEspaco}
            </Text>
          );
        };

        if (barrasDoDia.length === 0) {
          dados.push({
            value: 0,
            frontColor: "#5A5A5A",
            labelComponent: LabelDoDia,
            spacing: GROUP_SPACING,
          });
        } else {
          barrasDoDia.forEach((stack, index) => {
            dados.push({
              value: stack.value,
              frontColor: stack.color || "#5A5A5A",
              nome: stack.nome,
              topLabelComponent:
                stack.value > 0
                  ? () => (
                    <Text
                      style={{
                        color: "white",
                        fontSize: 10,
                        marginBottom: 5,
                      }}
                    >
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                        maximumFractionDigits: 0,
                      }).format(stack.value)}
                    </Text>
                  )
                  : undefined,
              labelComponent: index === 0 ? LabelDoDia : undefined,
              spacing:
                index < barrasDoDia.length - 1 ? INNER_SPACING : GROUP_SPACING,
            });
          });
        }
        groupWidths.push(barsWidth + GROUP_SPACING);
      });
      const totalWidth =
        Y_AXIS_LABEL_WIDTH + groupWidths.reduce((acc, w) => acc + w, 0) + 40;
      return { dados, totalWidth };
    };

    const carregarGraficoDeBarras = async () => {
      try {
        let { url } = useApi();
        const token = await AsyncStorage.getItem("auth_token");
        const tipoBackend = tipoSelecionado === "credito" ? "entrada" : "saida";

        const response = await axios.get(
          url + `/api/gastos-por-dia?tipo=${tipoBackend}&periodo=semana`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
        const dadosFormatados = diasSemana.map((dia) => {
          const itemDoDia = response.data.find((i) => i.dia === dia);

          if (
            !itemDoDia ||
            !itemDoDia.categorias ||
            itemDoDia.categorias.length === 0
          ) {
            return {
              label: dia,
              stacks: [{ value: 0, color: "#5A5A5A" }],
            };
          }

          return {
            label: dia,
            stacks: itemDoDia.categorias.map((cat) => ({
              value: Number(cat.valor) || 0,
              color: cat.cor || "#5A5A5A",
              nome: cat.categoria,
            })),
          };
        });

        const { dados, totalWidth } = buildChartDataAndWidth(dadosFormatados);
        setDadosAgrupados(dados);
        setDadosBarras(dadosFormatados);
        setChartWidthState(totalWidth);
      } catch (error) {
        console.error(
          "Erro ao carregar gráfico de barras:",
          error.response?.data || error.message
        );
      }
    };

    const carregarPrincipaisTransacoes = async () => {
      try {
        let { url } = useApi();
        const token = await AsyncStorage.getItem("auth_token");
        const tipoBackend = tipoSelecionado === "credito" ? "entrada" : "saida";
        const response = await axios.get(
          url + `/api/principais-transacoes?tipo=${tipoBackend}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPrincipaisTransacoes(response.data);
      } catch (error) {
        console.error(
          "Erro ao carregar principais transações:",
          error.response?.data || error.message
        );
      }
    };
    carregarTudo();
  }, [tipoSelecionado]);

  if (isLoading) {
    return <Loading />;
  }
  const yAxisMaxValue = Math.max(
    10,
    ...dadosAgrupados.map((item) => item.value || 0)
  );

  const formatarLabelY = (label) => {
    const valor = Number(label);
    if (valor >= 1000) {
      return `${(valor / 1000).toFixed(1)}k`.replace(".0", "");
    }
    return `${valor}`;
  };

  const totalPopulation = chartData.reduce((sum, item) => sum + item.population, 0);

  return (
    <SafeAreaView style={styles.body}>
      <Header
        leftIconName="arrowleft"
        leftIconSize={width * 0.06}
        leftIconColor="#f1c40f"
        rightIconName="bells"
        rightIconSize={width * 0.06}
        rightIconColor="#f1c40f"
        title="Analise Rápida"
      />
      <ScrollView>
        <Analise
          total={analise.saldo_total.toString()}
          economia={analise.economia.toString()}
          maiorGasto={analise.maior_gasto || "Nenhum"}
          iconeMaiorGasto={analise.icone_maior_gasto || "question"}
          corMaiorGasto={analise.cor_maior_gasto || "#f1c40f"}
        />

        <View style={styles.container}>
          <View style={{ alignItems: "center" }}>
            <View style={styles.toggle}>
              <TouchableOpacity
                style={[
                  styles.botao,
                  tipoSelecionado === "credito"
                    ? styles.selecionado
                    : styles.naoSelecionado,
                  { borderTopLeftRadius: 10, borderBottomLeftRadius: 10 },
                ]}
                onPress={() => setTipoSelecionado("credito")}
              >
                <Text
                  style={[
                    styles.texto,
                    tipoSelecionado === "credito"
                      ? styles.textoSelecionado
                      : styles.textoNormal,
                  ]}
                >
                  Crédito
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.botao,
                  tipoSelecionado === "debito"
                    ? styles.selecionado
                    : styles.naoSelecionado,
                  { borderTopRightRadius: 10, borderBottomRightRadius: 10 },
                ]}
                onPress={() => setTipoSelecionado("debito")}
              >
                <Text
                  style={[
                    styles.texto,
                    tipoSelecionado === "debito"
                      ? styles.textoSelecionado
                      : styles.textoNormal,
                  ]}
                >
                  Débito
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.title}>Gráfico de Setores</Text>
          <View style={styles.chartContainer}>
            <PieChart
              data={chartData}
              width={width * 0.5}
              height={height * 0.18}
              chartConfig={chartConfig}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={'30'}
              center={[0, 0]}
              hasLegend={false}
            />

            <View style={styles.legendContainer}>
              {chartData.map((item, index) => {
                const percentage = totalPopulation > 0 ? ((item.population / totalPopulation) * 100).toFixed(0) : 0;

                return (
                  <View key={index} style={styles.legendItem}>
                    <View
                      style={[styles.legendColor, { backgroundColor: item.color }]}
                    />
                    <Text style={styles.legendText} numberOfLines={2}>
                      {item.name} ({percentage}%)
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.separador}></View>

          <View style={{ marginTop: 20 }}>
            <Text style={styles.title}>Grafico de Barras</Text>

            <View style={{ marginHorizontal: width * 0.02 }}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                <BarChart
                  data={dadosAgrupados}
                  spacing={0}
                  barWidth={BAR_WIDTH}
                  width={chartWidthState}
                  maxValue={yAxisMaxValue}
                  yAxisExtraHeight={30}
                  noOfSections={5}
                  yAxisLabelWidth={Y_AXIS_LABEL_WIDTH}
                  yAxisLabelPrefix="R$ "
                  yAxisTextStyle={{ color: "white", fontSize: getResponsiveFontSize(10) }}
                  xAxisLabelTextStyle={{ color: "transparent" }}
                  backgroundColor="#393939"
                  yAxisThickness={0}
                  xAxisThickness={0}
                  barBorderRadius={4}
                  formatYLabel={formatarLabelY}
                  initialSpacing={10}
                  endSpacing={GROUP_SPACING}
                  onPress={(item: StackItem) => {
                    const valorFormatado = new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(item.value);

                    Alert.alert(
                      item.nome || "Detalhe da Categoria",
                      `Valor: ${valorFormatado}`
                    );
                  }}
                />
              </ScrollView>
            </View>
          </View>
          <View style={styles.separador}></View>
          <Text style={styles.title}>Principais Transações</Text>
          <View style={{ marginBottom: 20 }}>
            {principaisTransacoes.map((item, index) => (
              <View key={item.id}>
                <TransacaoCard
                  descricao={item.descricao}
                  valor={item.valor}
                  hora={new Date(item.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  icone={item.icone}
                  cor={item.cor}
                />
                {index < principaisTransacoes.length - 1 && (
                  <View style={styles.cardSeparator} />
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <View style={styles.tabContainer}>
        <CustomBottomTab />
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  body: {
    backgroundColor: "#2c2c2c",
    flex: 1,
    paddingHorizontal: width * 0.05,
  },
  container: {
    backgroundColor: "#393939",
    marginHorizontal: width * 0.04,
    borderRadius: 30,
    marginTop: height * 0.02,
    marginBottom: height * 0.08,
    paddingVertical: height * 0.01,
  },
  toggle: {
    width: width * 0.5,
    flexDirection: "row",
    marginVertical: height * 0.02,
  },
  botao: {
    flex: 1,
    alignItems: "center",
    paddingVertical: height * 0.01,
    borderWidth: 1,
    borderColor: "#000",
  },
  selecionado: {
    backgroundColor: "#f1c40f",
  },
  naoSelecionado: {
    backgroundColor: "#5A5A5A",
  },
  texto: {
    fontSize: getResponsiveFontSize(12),
    fontFamily: "Poppins-Regular",
  },
  textoSelecionado: {
    color: "#000",
    fontWeight: "bold",
  },
  textoNormal: {
    color: "#d1d1d1",
  },
  separador: {
    backgroundColor: "#2c2c2c",
    height: 2,
    marginHorizontal: "8%",
    marginVertical: height * 0.02,
  },
  tabContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  title: {
    color: "white",
    fontFamily: "Poppins-Regular",
    fontSize: getResponsiveFontSize(14),
    marginLeft: width * 0.05,
    marginVertical: height * 0.01,
  },
  chartContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#393939",
    borderRadius: width * 0.05,
    marginTop: height * 0.01,
    padding: width * 0.02,
  },
  cardSeparator: {
    height: 2,
    backgroundColor: "#2c2c2c",
    marginVertical: 5,
    marginHorizontal: "8%",
  },
  legendContainer: {
    marginLeft: 15,
    flex: 1,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    color: "white",
    fontSize: getResponsiveFontSize(11),
    fontFamily: "Poppins-Regular",
    flexShrink: 1,
  },
});