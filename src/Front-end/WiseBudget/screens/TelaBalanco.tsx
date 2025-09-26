import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    SafeAreaView,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Header } from "../components/header";
import CustomBottomTab from "../components/CustomBottomTab";
import { Loading } from "../components/loading";
import { LineChart } from "react-native-wagmi-charts";
import useApi from "../hooks/useApi";

const { width, height } = Dimensions.get("window");

const getResponsiveFontSize = (size) => {
    const scale = width / 375;
    return Math.round(size * scale);
};

export default function TelaBalanco({ navigation }) {
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [metrics, setMetrics] = useState({
        maiorSaldo: 0,
        menorSaldo: 0,
        saldoTotal: 0,
    });

    const fetchMonthlyBalance = async () => {
        setIsLoading(true);
        let { url } = useApi();

        try {
            // Chamada ao novo endpoint que retorna o saldo líquido mensal
            const response = await fetch(url+`/api/balanco-historico`);
            const data = await response.json();

            if (data && data.length > 0) {
                // Os dados já vêm como Saldo Líquido (Receita - Despesa) por mês
                const total = data.reduce((acc, curr) => acc + curr.value, 0);
                const values = data.map(d => d.value);
                const max = Math.max(...values);
                const min = Math.min(...values);

                setChartData(data);
                setMetrics({
                    maiorSaldo: max,
                    menorSaldo: min,
                    saldoTotal: total,
                });
            } else {
                setChartData([]);
                setMetrics({ maiorSaldo: 0, menorSaldo: 0, saldoTotal: 0 });
            }
        } catch (error) {
            console.error("Erro ao buscar histórico de balanço:", error);
            // Definir dados de fallback ou erro
            setChartData([]);
            setMetrics({ maiorSaldo: 0, menorSaldo: 0, saldoTotal: 0 });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMonthlyBalance();
    }, []);

    if (isLoading) {
        return <Loading />;
    }

    const formatValue = (value) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value);
    };

    const corGrafico = '#f1c40f';

    return (
        <SafeAreaView style={styles.body}>
            <Header
                leftIconName="arrowleft"
                leftIconSize={width * 0.06}
                leftIconColor="#f1c40f"
                rightIconName="bells"
                rightIconSize={width * 0.06}
                rightIconColor="#f1c40f"
                title="Balanço"
            />

            <ScrollView contentContainerStyle={{ paddingBottom: height * 0.08 }}>
                <View style={styles.container}>

                    <Text style={styles.title}>Saldo Mensal (Últimos 12 Meses)</Text>

                    <View style={styles.chartArea}>
                        {chartData.length > 0 ? (
                            <LineChart.Provider data={chartData}>
                                <LineChart width={width * 0.7} height={height * 0.25}>
                                    <LineChart.Path color={corGrafico} width={2} />

                                    <LineChart.CursorCrosshair>
                                        <LineChart.Tooltip
                                            textStyle={{ color: "#000", fontWeight: "bold" }}
                                            format={({ value }) => formatValue(value)}
                                        />
                                        <LineChart.Tooltip position="bottom">
                                            <LineChart.DatetimeText
                                                locale="pt-BR"
                                                options={{ month: "short", year: "2-digit" }}
                                                style={{ color: "#fff", fontSize: getResponsiveFontSize(10) }}
                                            />
                                        </LineChart.Tooltip>
                                    </LineChart.CursorCrosshair>
                                </LineChart>
                            </LineChart.Provider>
                        ) : (
                            <View style={styles.noDataContainer}>
                                <Text style={styles.noDataText}>
                                    Sem dados suficientes para exibir o gráfico de histórico.
                                </Text>
                            </View>
                        )}
                    </View>

                    <Text style={styles.saldoAcumuladoText}>
                        Saldo Acumulado: <Text style={{ color: metrics.saldoTotal >= 0 ? '#2ecc71' : '#e74c3c', fontWeight: 'bold' }}>
                            {formatValue(metrics.saldoTotal)}
                        </Text>
                    </Text>

                    <View style={styles.separador}></View>

                    <Text style={styles.title}>Resumo do Saldo</Text>
                    <View style={styles.metricsContainer}>
                        <View style={styles.metricCard}>
                            <Text style={[styles.metricValue, { color: metrics.maiorSaldo > 0 ? '#2ecc71' : '#f1c40f' }]}>
                                {formatValue(metrics.maiorSaldo)}
                            </Text>
                            <Text style={styles.metricLabel}>Melhor Mês</Text>
                        </View>
                        <View style={styles.metricCard}>
                            <Text style={[styles.metricValue, { color: metrics.menorSaldo >= 0 ? '#f1c40f' : '#e74c3c' }]}>
                                {formatValue(metrics.menorSaldo)}
                            </Text>
                            <Text style={styles.metricLabel}>Pior Mês</Text>
                        </View>
                        <View style={styles.metricCard}>
                            <Text style={[styles.metricValue, { color: metrics.saldoTotal >= 0 ? '#2ecc71' : '#e74c3c' }]}>
                                {formatValue(metrics.saldoTotal)}
                            </Text>
                            <Text style={styles.metricLabel}>Saldo Total</Text>
                        </View>
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
        paddingHorizontal: width * 0.02,
    },
    container: {
        backgroundColor: "#393939",
        marginHorizontal: width * 0.03,
        borderRadius: 25,
        marginTop: height * 0.02,
        marginBottom: height * 0.08,
        paddingVertical: height * 0.01,
        paddingHorizontal: width * 0.02,
    },
    title: {
        color: "white",
        fontFamily: "Poppins-Regular",
        fontSize: getResponsiveFontSize(16),
        marginLeft: width * 0.03,
        marginTop: height * 0.02,
        marginBottom: height * 0.01,
        fontWeight: 'bold',
    },
    separador: {
        backgroundColor: "#2c2c2c",
        height: 2,
        marginHorizontal: "5%",
        marginVertical: height * 0.02,
    },
    tabContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
    },
    chartArea: {
        marginHorizontal: width * 0.03,
        padding: 10,
        borderRadius: 15,
        backgroundColor: '#444444',
        height: height * 0.35,
        justifyContent: 'center',
    },
    saldoAcumuladoText: {
        color: '#D1D1D1',
        fontSize: getResponsiveFontSize(14),
        fontFamily: "Poppins-Regular",
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 5,
    },
    chartInnerContainer: {
        width: '100%',
        height: '100%',
    },
    metricsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: width * 0.01,
        marginBottom: height * 0.02,
    },
    metricCard: {
        backgroundColor: '#444444',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        width: width * 0.28,
    },
    metricValue: {
        fontSize: getResponsiveFontSize(14),
        fontWeight: 'bold',
        color: '#f1c40f',
    },
    metricLabel: {
        fontSize: getResponsiveFontSize(10),
        color: '#d1d1d1',
        marginTop: 5,
        textAlign: 'center',
    },
    noDataContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noDataText: {
        color: '#D1D1D1',
        fontSize: getResponsiveFontSize(14),
        textAlign: 'center',
    }
});
