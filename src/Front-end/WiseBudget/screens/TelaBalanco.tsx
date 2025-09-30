/*import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
    Platform,
    StatusBar,
    SafeAreaView,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { LineChart } from "react-native-wagmi-charts";
import useApi from "../hooks/useApi";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Header } from "../components/header";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import CustomBottomTab from "../components/CustomBottomTab";

const { width } = Dimensions.get("window");

const getResponsiveFontSize = (size) => {
    if (width < 350) return size * 0.85;
    if (width < 400) return size * 0.9;
    return size;
};

export default function TelaBalanco() {
    const anoAtual = new Date().getFullYear();
    const [chartData, setChartData] = useState([]);
    const [metrics, setMetrics] = useState({
        maiorSaldo: 0,
        menorSaldo: 0,
        saldoTotal: 0,
    });
    const [anoSelecionado, setAnoSelecionado] = useState(anoAtual);
    const [isLoading, setIsLoading] = useState(false);
    const [currentValue, setCurrentValue] = useState(0);
    const [currentDate, setCurrentDate] = useState("");

    const fetchMonthlyBalance = async (ano = anoSelecionado) => {
        setIsLoading(true);
        let { url } = useApi();

        try {
            const token = await AsyncStorage.getItem("auth_token");
            const response = await axios.get(`${url}/api/balanco-historico`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { ano: ano },
            });

            const data = response.data || [];

            // 🔎 Sempre gerar 12 meses, mesmo se a API trouxer só alguns
            const formattedData = Array.from({ length: 12 }, (_, i) => {
                const monthData = data.find((d) => Number(d.mes) === i + 1);
                const rawSaldo = monthData?.saldo;

                const value = rawSaldo && !isNaN(Number(rawSaldo))
                    ? Number(rawSaldo)
                    : 0;

                const ts = new Date(ano, i, 1).getTime();
                return {
                    timestamp: isNaN(ts) ? Date.now() : ts,
                    value,
                };
            });

            // 🔎 Remove qualquer item inválido
            const cleanedData = formattedData.filter(
                (d) =>
                    typeof d.timestamp === "number" &&
                    !isNaN(d.timestamp) &&
                    typeof d.value === "number" &&
                    !isNaN(d.value)
            );

            const values = cleanedData.map((d) => d.value).filter((v) => v > 0);

            if (values.length > 0) {
                const total = values.reduce((acc, curr) => acc + curr, 0);
                const max = Math.max(...values);
                const min = Math.min(...values);

                setChartData(cleanedData);
                setMetrics({
                    maiorSaldo: max,
                    menorSaldo: min,
                    saldoTotal: total,
                });
            } else {
                setChartData(cleanedData);
                setMetrics({
                    maiorSaldo: 0,
                    menorSaldo: 0,
                    saldoTotal: 0,
                });
            }
        } catch (error) {
            console.error("Erro ao buscar histórico de balanço:", error);
            setChartData([]);
            setMetrics({ maiorSaldo: 0, menorSaldo: 0, saldoTotal: 0 });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMonthlyBalance();
    }, []);

    return (
        <SafeAreaView style={styles.container} edges={["right", "left"]}>
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
            />

            {/* seletor de ano }
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
                    <FontAwesome
                        name="chevron-right"
                        size={20}
                        color="#f1c40f"
                    />
                </TouchableOpacity>
            </View>

            {/* gráfico }
            {isLoading ? (
                <ActivityIndicator
                    size="large"
                    color="#f1c40f"
                    style={{ flex: 1, justifyContent: "center" }}
                />
            ) : chartData.length > 0 && chartData.some((d) => d.value > 0) ? (
                Platform.OS !== "web" ? (
                    <View style={styles.chartContainer}>
                        <LineChart.Provider data={chartData}>
                            <View style={styles.infoContainer}>
                                <Text style={styles.infoText}>
                                    R$ {currentValue.toFixed(2)}
                                </Text>
                                <Text style={styles.infoText}>
                                    {currentDate}
                                </Text>
                            </View>

                            <LineChart
                                onCurrentIndexChange={(i) => {
                                    if (i !== null && chartData[i]) {
                                        const point = chartData[i];
                                        setCurrentValue(point.value);

                                        const date = new Date(point.timestamp);
                                        setCurrentDate(
                                            date.toLocaleDateString("pt-BR", {
                                                month: "long",
                                                year: "numeric",
                                            })
                                        );
                                    }
                                }}
                            >
                                <LineChart.Path color="#f1c40f" />
                                <LineChart.CursorCrosshair />
                            </LineChart>
                        </LineChart.Provider>
                    </View>
                ) : (
                    <View
                        style={[
                            styles.chartContainer,
                            { alignItems: "center", justifyContent: "center" },
                        ]}
                    >
                        <Text style={styles.noData}>
                            Gráfico não disponível na versão web.
                        </Text>
                    </View>
                )
            ) : (
                <View
                    style={[
                        styles.chartContainer,
                        { alignItems: "center", justifyContent: "center" },
                    ]}
                >
                    <Text style={styles.noData}>
                        Nenhum dado disponível para este ano.
                    </Text>
                </View>
            )}

            {/* métricas }
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

            <CustomBottomTab />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1e1e1e",
    },
    infoContainer: {
        width: "100%",
        padding: 16,
        backgroundColor: "#2c2c2c",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    infoText: {
        color: "white",
        fontSize: getResponsiveFontSize(16),
        fontWeight: "bold",
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
        backgroundColor: "#2c2c2c",
        borderRadius: 12,
        marginBottom: 20,
        height: 500,
        alignItems: "center",
    },
    noData: {
        color: "#bbb",
        fontSize: getResponsiveFontSize(14),
    },
    metricsContainer: {
        width: "90%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignSelf: "center",
        marginTop: 20,
    },
    metricBox: {
        backgroundColor: "#2c2c2c",
        padding: 15,
        borderRadius: 12,
        alignItems: "center",
        flex: 1,
        marginHorizontal: 5,
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
});*/
