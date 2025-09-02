import { PieChart } from 'react-native-chart-kit'
import { ComponentType, useEffect, useState } from 'react';
import { IconProps } from '@expo/vector-icons/build/createIconSet';
import { Loading } from '../components/loading';
import axios from "axios";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import useApi from "../hooks/useApi";
import { Alert, View, SafeAreaView, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { Header } from '../components/header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Analise } from '../components/analise';
import { BarChart } from "react-native-gifted-charts";
import { TransacaoCard } from '../components/transacaoCard';
import CustomBottomTab from '../components/CustomBottomTab';

type IconComponentType = ComponentType<IconProps<keyof typeof FontAwesome.glyphMap>>;
interface ChartDataItem {
    name: string;
    population: number;
    color: string;
    legendFontColor: string;
    legendFontSize: number;
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

export default function TelaCadastro({ navigation }) {
    const [analise, setAnalise] = useState<AnaliseData>({
        credito_mes: 0,
        debito_mes: 0,
        saldo_total: 0,
        economia: 0,
        maior_gasto: "Nenhum",
        icone_maior_gasto: "question",
        cor_maior_gasto: "#f1c40f"
    });

    const [chartData, setChartData] = useState<ChartDataItem[]>([
        {
            name: "Carregando...",
            population: 100,
            color: "#5A5A5A",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        }
    ]);
    const chartConfig = {
        backgroundGradientFrom: "#1E2923",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#08130D",
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        strokeWidth: 2,
        barPercentage: 0.5,
        useShadowColorFromDataset: false
    };
    const [isLoading, setIsLoading] = useState(true);
    const [tipoSelecionado, setTipoSelecionado] = useState<"credito" | "debito">("credito");
    const [principaisTransacoes, setPrincipaisTransacoes] = useState<any[]>([]);

    useEffect(() => {
        const carregarTudo = async () => {
            setIsLoading(true);
            try {
                await carregarAnalise();
                await carregarDadosGraficoDeSetores();
                await carregarPrincipaisTransacoes();
            } catch (error) {
                console.error("Erro ao carregar dados da Tela de Adicionar Atalhos:", error);
                Alert.alert("Erro", "Não foi possível carregar os dados. Tente novamente.");
            } finally {
                setIsLoading(false);
            }
        };

        const carregarAnalise = async () => {
            let { url } = useApi();
            const token = await AsyncStorage.getItem('auth_token');
            const response = await axios.get(url + '/api/balanco', {
                headers: { Authorization: `Bearer ${token}` }
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
                    setChartData(response.data);
                } else {
                    setChartData([
                        {
                            name: "Nenhum",
                            population: 100,
                            color: "#5A5A5A",
                            legendFontColor: "#7F7F7F",
                            legendFontSize: 15,
                        },
                    ]);
                }
            } catch (error) {
                console.error("Erro ao buscar dados do gráfico:", error.response?.data || error.message);
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
                console.error("Erro ao carregar principais transações:", error.response?.data || error.message);
            }
        };
        carregarTudo();
    }, [tipoSelecionado]);


    if (isLoading) {
        return <Loading />;
    }

    return (
        <SafeAreaView style={styles.body}>
            <Header
                leftIconName="arrowleft"
                leftIconSize={24}
                leftIconColor="#f1c40f"
                rightIconName="bells"
                rightIconSize={24}
                rightIconColor="#f1c40f"
                title="Analise Rápida"
            />
            <ScrollView >
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
                                    tipoSelecionado === "credito" ? styles.selecionado : styles.naoSelecionado,
                                    { borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }
                                ]}
                                onPress={() => setTipoSelecionado("credito")}
                            >
                                <Text
                                    style={[
                                        styles.texto,
                                        tipoSelecionado === "credito" ? styles.textoSelecionado : styles.textoNormal
                                    ]}
                                >
                                    Crédito
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.botao,
                                    tipoSelecionado === "debito" ? styles.selecionado : styles.naoSelecionado,
                                    { borderTopRightRadius: 10, borderBottomRightRadius: 10 }
                                ]}
                                onPress={() => setTipoSelecionado("debito")}
                            >
                                <Text
                                    style={[
                                        styles.texto,
                                        tipoSelecionado === "debito" ? styles.textoSelecionado : styles.textoNormal
                                    ]}
                                >
                                    Débito
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>


                    <Text style={{ color: 'white', fontFamily: 'Poppins-Regular', marginLeft: 10, marginTop: 20 }}>
                        Gráfico de Setores
                    </Text>
                    <View style={{ width: '100%', backgroundColor: '#393939', borderRadius: 20, alignItems: "center" }}>
                        <PieChart
                            data={chartData}
                            width={400}
                            height={150}
                            chartConfig={chartConfig}
                            accessor={"population"}
                            backgroundColor={"transparent"}
                            paddingLeft={"-20"}
                            center={[0, 0]}
                        />
                    </View>

                    <View style={styles.separador}></View>

                    <View style={{ marginTop: 20 }}>
                        <Text
                            style={{
                                color: "white",
                                fontFamily: "Poppins-Regular",
                                marginLeft: 10,
                                marginBottom: 10,
                            }}
                        >
                            Grafico de Barras
                        </Text>

                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 10 }}
                        >
                            <BarChart
                                data={[
                                    { value: 50, label: "Seg" },
                                    { value: 80, label: "Ter" },
                                    { value: 65, label: "Qua" },
                                    { value: 70, label: "Qui" },
                                    { value: 40, label: "Sex" },
                                    { value: 90, label: "Sáb" },
                                    { value: 30, label: "Dom" },
                                ]}
                                barWidth={10}
                                spacing={30}
                                hideRules
                                frontColor="#f1c40f"
                                xAxisLabelTextStyle={{ color: "white", fontFamily: "Poppins-Regular" }}
                                yAxisTextStyle={{ color: "white" }}
                                noOfSections={4}
                                maxValue={100}
                                roundedTop
                                barBorderRadius={12}
                                yAxisThickness={0}
                                xAxisThickness={0}
                                backgroundColor="#393939"
                            />
                        </ScrollView>
                    </View>
                    <View style={styles.separador}></View>
                    <Text
                        style={{
                            color: "white",
                            fontFamily: "Poppins-Regular",
                            marginLeft: 10,
                            marginTop: 10,
                        }}
                    >
                        Principais Transações
                    </Text>
                    <View style={{ marginBottom: 20 }}>
                        {principaisTransacoes.map((item, index) => (
                            <View key={item.id}>
                                <TransacaoCard
                                    descricao={item.descricao}
                                    valor={item.valor}
                                    hora={new Date(item.data).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    icone={item.icone}
                                    cor={item.cor}
                                />
                                {index < principaisTransacoes.length - 1 && (
                                    <View style={{ height: 2, backgroundColor: '#2c2c2c', marginVertical: 5, marginHorizontal: '8%' }} />
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
    )
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: '#2c2c2c',
        flex: 1,
        paddingHorizontal: 20,
    },
    container: {
        backgroundColor: '#393939',
        margin: 10,
        borderRadius: 30,
        marginBottom: 60
    },
    toggle: {
        width: 200,
        flexDirection: "row",
        margin: 20,
    },
    botao: {
        flex: 1,
        alignItems: "center",
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
        fontSize: 11,
        fontFamily: "Poppins-Regular",
    },
    textoSelecionado: {
        color: "#000",
        fontWeight: "bold",
    },
    textoNormal: {
        color: "#7f8c8d",
    },
    separador: {
        backgroundColor: '#2c2c2c',
        height: 2,
        marginHorizontal: '8%',
        marginVertical: 10,
    },
    tabContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
});
