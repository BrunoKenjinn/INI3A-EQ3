import { PieChart } from 'react-native-chart-kit'
import { ComponentType, useCallback, useEffect, useState } from 'react';
import { IconProps } from '@expo/vector-icons/build/createIconSet';
import { Loading } from '../components/loading';
import axios from "axios";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import useApi from "../hooks/useApi";
import { Alert, View, SafeAreaView, Text, StyleSheet } from 'react-native';
import { Header } from '../components/header';
import { Balanço } from '../components/balanco';
import AsyncStorage from '@react-native-async-storage/async-storage';

type IconComponentType = ComponentType<IconProps<keyof typeof FontAwesome.glyphMap>>;
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
}

export default function TelaCadastro({ navigation }) {
    const [balanco, setBalanco] = useState<BalancoData>({
        credito_mes: 0,
        debito_mes: 0,
        saldo_total: 0,
        saldo_inicial: 0,
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

    useEffect(() => {
        const carregarTudo = async () => {
            setIsLoading(true);
            try {
                await carregarBalanco();
            } catch (error) {
                console.error("Erro ao carregar dados da Tela de Adicionar Atalhos:", error);
                Alert.alert("Erro", "Não foi possível carregar os dados. Tente novamente.");
            } finally {
                setIsLoading(false);
            }
        };

        const carregarBalanco = async () => {
            try {
                let { url } = useApi();
                const token = await AsyncStorage.getItem('auth_token');
                const response = await axios.get(url + '/api/balanco', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBalanco(response.data);
            } catch (error) {
                console.error("Erro ao buscar balanço:", error.response?.data || error.message);
                Alert.alert('Erro', 'Erro ao buscar balnço')
            }
        };

        carregarTudo();
    }, []);


    if (isLoading) {
        return <Loading />;
    }

    return <>
        <SafeAreaView style={styles.body}>
            <Header leftIconName="arrowleft"
                leftIconSize={24}
                leftIconColor="#f1c40f"
                rightIconName="bells"
                rightIconSize={24}
                rightIconColor="#f1c40f"
                title="Analise Rápida"
            />
            <Balanço
                credito={balanco.credito_mes.toString()}
                debito={balanco.debito_mes.toString()}
                saldo={balanco.saldo_total.toString()}
            />
            <View style={styles.border}></View>
            <View style={styles.container}>
                <Text style={{ color: 'white', fontFamily: 'Poppins-Regular', margin: 10}}>
                    Gráfico de Setores
                </Text>
                <View style={{ width: '100%', backgroundColor: '#393939', borderRadius: 20, marginTop: 10, alignItems: "center" }}>
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
            </View>
        </SafeAreaView>
    </>

}

const styles = StyleSheet.create({
    body: {
        backgroundColor: '#2c2c2c',
        height: '100%',
        flex: 1,
        paddingHorizontal: 20
    },
    container: {
        backgroundColor: '#393939',
        margin: 10,
        borderRadius: 30,
    },
    border: {
        backgroundColor: "#ffffff",
        height: 2,
        width: '60%',
        marginHorizontal:'20%',
        marginVertical: 20
    }
});
