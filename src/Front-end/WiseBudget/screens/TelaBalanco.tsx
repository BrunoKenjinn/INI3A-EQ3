import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { LineChart } from "react-native-chart-kit";
import useApi from "../hooks/useApi";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Header } from "../components/header";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import CustomBottomTab from "../components/CustomBottomTab";

const { width, height } = Dimensions.get("window");

const getResponsiveFontSize = (size) => {
  if (width < 350) return size * 0.85;
  if (width < 400) return size * 0.9;
  return size;
};

const formatYLabel = (yLabel) => {
  const value = Number(yLabel);
  if (isNaN(value)) {
    return yLabel;
  }
  if (value === 0) {
    return "0";
  }
  if (Math.abs(value) >= 1000) {
    return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  }
  return `${value}`;
};

const monthLabels = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

export default function TelaBalanco({ navigation }) {
  const anoAtual = new Date().getFullYear();
  const [chartData, setChartData] = useState({
    labels: monthLabels,
    datasets: [{ data: Array(12).fill(0) }],
  });
  const [metrics, setMetrics] = useState({
    maiorSaldo: 0,
    menorSaldo: 0,
    saldoTotal: 0,
  });
  const [extraMetrics, setExtraMetrics] = useState({
    mediaMensal: 0,
    mesMaiorSaldo: "-",
    mesMenorSaldo: "-",
  });
  const [anoSelecionado, setAnoSelecionado] = useState(anoAtual);
  const [isLoading, setIsLoading] = useState(false);
  const [hasData, setHasData] = useState(false);

  const calcularExtraMetrics = (monthlyValues: number[]) => {
    const valuesWithData = monthlyValues.filter((v: number) => v !== 0);
    let mediaMensal = 0;
    let mesMaiorSaldo = "-";
    let mesMenorSaldo = "-";
    if (valuesWithData.length > 0) {
      mediaMensal =
        valuesWithData.reduce((a: number, b: number) => a + b, 0) /
        valuesWithData.length;
      const maior = Math.max(...valuesWithData);
      const menor = Math.min(...valuesWithData);
      const idxMaior = monthlyValues.findIndex((v: number) => v === maior);
      const idxMenor = monthlyValues.findIndex((v: number) => v === menor);
      mesMaiorSaldo = monthLabels[idxMaior] || "-";
      mesMenorSaldo = monthLabels[idxMenor] || "-";
    }
    setExtraMetrics({ mediaMensal, mesMaiorSaldo, mesMenorSaldo });
  };

  const fetchMonthlyBalance = async (ano = anoSelecionado) => {
    setIsLoading(true);
    setHasData(false);
    let { url } = useApi();

    try {
      const token = await AsyncStorage.getItem("auth_token");
      const response = await axios.get(`${url}/api/balanco-historico`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { ano: ano },
      });

      const data: any[] = response.data || [];
      const monthlyValues: number[] = Array(12).fill(0);

      data.forEach((item: any) => {
        const monthIndex = Number(item.mes) - 1;
        if (monthIndex >= 0 && monthIndex < 12) {
          monthlyValues[monthIndex] = Number(item.saldo) || 0;
        }
      });

      setChartData({
        labels: monthLabels,
        datasets: [
          {
            data: monthlyValues,
          },
        ],
      });

      calcularExtraMetrics(monthlyValues);

      const valuesWithData = monthlyValues.filter((v: number) => v !== 0);
      if (valuesWithData.length > 0) {
        setHasData(true);
        setMetrics({
          maiorSaldo: Math.max(...valuesWithData),
          menorSaldo: Math.min(...valuesWithData),
          saldoTotal: valuesWithData.reduce((a: number, b: number) => a + b, 0),
        });
      } else {
        setMetrics({ maiorSaldo: 0, menorSaldo: 0, saldoTotal: 0 });
      }
    } catch (error) {
      console.error("Erro ao buscar histórico de balanço:", error);
      setChartData({
        labels: monthLabels,
        datasets: [{ data: Array(12).fill(0) }],
      });
      setMetrics({ maiorSaldo: 0, menorSaldo: 0, saldoTotal: 0 });
      setExtraMetrics({
        mediaMensal: 0,
        mesMaiorSaldo: "-",
        mesMenorSaldo: "-",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthlyBalance();
  }, []);

  const chartConfig = {
    backgroundGradientFrom: "#2c2c2c",
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: "#2c2c2c",
    backgroundGradientToOpacity: 1,
    color: (opacity = 1) => `rgba(241, 196, 15, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 2,
    propsForLabels: {
      fontSize: getResponsiveFontSize(12),
    },
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Header
        leftIconName="arrow-left"
        leftIconColor="#f1c40f"
        leftIconSize={width * 0.06}
        leftIconComponent={FontAwesome5}
        title="Balanço"
        rightIconName="bell"
        rightIconColor="#f1c40f"
        rightIconSize={width * 0.06}
        rightIconComponent={FontAwesome5}
        onLeftPress={() => navigation.goBack()}
        onRightPress={() => navigation.navigate('TelaNotificacoes')}
      />

      <View style={styles.yearSelector}>
        <TouchableOpacity
          onPress={() => {
            const novoAno = anoSelecionado - 1;
            setAnoSelecionado(novoAno);
            fetchMonthlyBalance(novoAno);
          }}
        >
          <FontAwesome name="chevron-left" size={20} color="#f1c40f" />
        </TouchableOpacity>
        <Text style={styles.yearText}>{anoSelecionado}</Text>
        <TouchableOpacity
          onPress={() => {
            const novoAno = anoSelecionado + 1;
            if (novoAno <= anoAtual) {
              setAnoSelecionado(novoAno);
              fetchMonthlyBalance(novoAno);
            }
          }}
        >
          <FontAwesome name="chevron-right" size={20} color="#f1c40f" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#f1c40f"
          style={styles.chartContainer}
        />
      ) : hasData ? (
        <View style={styles.chartContainer}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View
              style={{
                overflow: "hidden",
                marginTop: height * 0.02,
              }}
            >
              <LineChart
                data={chartData}
                width={width - width * 0.09}
                height={height * 0.5}
                verticalLabelRotation={50}
                chartConfig={chartConfig}
                bezier
                withHorizontalLines={false}
              />
            </View>
          </ScrollView>
        </View>
      ) : (
        <View style={[styles.chartContainer, { justifyContent: "center" }]}>
          <Text style={styles.noData}>
            Nenhum dado disponível para este ano.
          </Text>
        </View>
      )}

      <View style={styles.metricsWrapper}>
        <View style={styles.metricsContainer}>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Maior Saldo</Text>
            <Text style={styles.metricValue}>
              R$ {metrics.maiorSaldo.toFixed(2)}
            </Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Menor Saldo</Text>
            <Text style={styles.metricValue}>
              R$ {metrics.menorSaldo.toFixed(2)}
            </Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Saldo Total</Text>
            <Text style={styles.metricValue}>
              R$ {metrics.saldoTotal.toFixed(2)}
            </Text>
          </View>
        </View>
        <View style={styles.metricsContainer}>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Média Mensal</Text>
            <Text style={styles.metricValue}>
              R$ {extraMetrics.mediaMensal.toFixed(2)}
            </Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Mês Maior Saldo</Text>
            <Text style={styles.metricValue}>{extraMetrics.mesMaiorSaldo}</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Mês Menor Saldo</Text>
            <Text style={styles.metricValue}>{extraMetrics.mesMenorSaldo}</Text>
          </View>
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
    alignItems: "center",
  },
  yearSelector: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  yearText: {
    color: "#fff",
    fontSize: getResponsiveFontSize(18),
    fontWeight: "bold",
    marginHorizontal: 15,
  },
  chartContainer: {
    width: "90%",
    height: 420,
    borderRadius: 16,
    marginBottom: 10,
    justifyContent: "center",
  },
  noData: {
    color: "#bbb",
    fontSize: getResponsiveFontSize(14),
    alignSelf: "center",
  },
  metricsWrapper: {
    width: "90%",
  },
  metricsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  metricBox: {
    backgroundColor: '#393939',
    padding: 10,
    borderRadius: 12,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 3,
  },
  metricLabel: {
    color: "#bbb",
    fontSize: getResponsiveFontSize(14),
    marginBottom: 5,
  },
  metricValue: {
    color: "#fff",
    fontSize: getResponsiveFontSize(14),
    fontWeight: "bold",
  },
});
