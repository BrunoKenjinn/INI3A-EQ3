import { View, StyleSheet, Pressable, SafeAreaView, FlatList, Alert, Dimensions } from "react-native";
import { Header } from "../components/header";
import { Balanço } from "../components/balanco";
import axios from 'axios';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Atalho } from "../components/atalho";
import useApi from "../hooks/useApi";
import { Loading } from "../components/loading";
import CustomBottomTab from "../components/CustomBottomTab";

const { width, height } = Dimensions.get("window");

interface BalancoData {
    credito_mes: number;
    debito_mes: number;
    saldo_total: number;
    saldo_inicial: number;
    saldo: number;
}

export default function TelaAdicionarAtalhos({ navigation }) {
    const [balanco, setBalanco] = useState<BalancoData>({
        credito_mes: 0,
        debito_mes: 0,
        saldo_total: 0,
        saldo_inicial: 0,
        saldo: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [atalhos, setAtalhos] = useState([]);

    const handleSave = async (nome: string, icone: string, rota: string) => {
        const jaExiste = atalhos.some((a) => a.rota === rota || a.nome === nome);
        if (jaExiste) {
            Alert.alert("Duplicado", "Este atalho já foi adicionado");
            return;
        }

        let { url } = useApi();
        try {
            const token = await AsyncStorage.getItem('auth_token');
            const response = await axios.post(url + '/api/atalhos', {
                nome,
                icone,
                rota,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                }
            });
            navigation.navigate('TelaHome');
        } catch (error) {
            console.error('Erro ao salvar atalho:', error.response?.data || error.message);
            Alert.alert('Erro', 'Erro ao salvar atalho');
        }
    };

    useEffect(() => {
        const carregarTudo = async () => {
            setIsLoading(true);
            try {
                await carregarAtalhos();
                await carregarBalanco();
            } catch (error) {
                console.error("Erro ao carregar dados da Tela de Adicionar Atalhos:", error);
                Alert.alert("Erro", "Não foi possível carregar os dados. Tente novamente.");
            } finally {
                setIsLoading(false);
            }
        };

        const carregarAtalhos = async () => {
            try {
                let { url } = useApi();
                const token = await AsyncStorage.getItem("auth_token");
                const response = await axios.get(url + "/api/atalhos", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAtalhos(response.data);
            } catch (error) {
                console.error("Erro ao carregar atalhos:", error.response?.data || error.message);
                Alert.alert('Erro', 'Erro ao carregar atalhos');
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
                Alert.alert('Erro', 'Erro ao buscar balanço')
            }
        };

        carregarTudo();
    }, []);

    const atalhosPredefinidos = [
        { id: 2, nome: 'Balanço', icone: 'money', rota: 'TelaBalanco' },
        { id: 3, nome: 'Análise Rápida', icone: 'flash', rota: 'TelaAnaliseRapida' },
        { id: 4, nome: 'Categorias', icone: 'th-large', rota: 'TelaCategorias' },
        { id: 5, nome: 'Adicionar Transações', icone: 'plus', rota: 'TelaAdicionarTransacoes' },
        { id: 6, nome: 'Transações', icone: 'exchange', rota: 'TelaTransacoes' },
        { id: 7, nome: 'Busca de Transações', icone: 'search', rota: 'TelaBusca' },
        { id: 8, nome: 'Analise Específica', icone: 'search-plus', rota: 'TelaAnalise' },
    ];

    if (isLoading) {
        return <Loading />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <Header
                leftIconName="arrowleft"
                leftIconSize={width * 0.06}
                leftIconColor="#f1c40f"
                rightIconName="bells"
                rightIconSize={width * 0.06}
                rightIconColor="#f1c40f"
                title="Atalhos"
                onLeftPress={() => navigation.goBack()}
            />
            <FlatList
                data={atalhosPredefinidos}
                keyExtractor={(item) => item.id.toString()}
                numColumns={3}
                ListHeaderComponent={
                    <Balanço
                        credito={balanco.credito_mes.toString()}
                        debito={balanco.debito_mes.toString()}
                        saldo={balanco.saldo.toString()}
                        saldoTotal={balanco.saldo_total.toString()}
                    />
                }
                renderItem={({ item }) => (
                    <Pressable style={styles.atalhoContainer}>
                        <Atalho
                            iconName={item.icone}
                            text={item.nome}
                            onPress={() => handleSave(item.nome, item.icone, item.rota)}
                        />
                    </Pressable>
                )}
                contentContainerStyle={{ paddingBottom: height * 0.1 }}
                columnWrapperStyle={styles.row}
            />
            <View style={styles.tabContainer}>
                <CustomBottomTab />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#2c2c2c',
        flex: 1,
        paddingHorizontal: width * 0.05,
    },
    row: {
        justifyContent: 'flex-start',
        gap: width * 0.02,
        marginBottom: width * 0.02,
    },
    atalhoContainer: {
        width: '32%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
});

