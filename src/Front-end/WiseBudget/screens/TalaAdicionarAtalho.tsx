import { View, Text, Image, StyleSheet, Pressable, TextInput, SafeAreaView, FlatList, ScrollView, Alert } from "react-native";
import { Header } from "../components/header";
import { Balanço } from "../components/balanco";
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Atalho } from "../components/atalho";
import useApi from "../hooks/useApi";
import { Loading } from "../components/loading";

interface BalancoData {
    credito_mes: number;
    debito_mes: number;
    saldo_total: number;
    saldo_inicial: number;
}


export default function TelaAdicionarAtalhos({ navigation }) {
    const [balanco, setBalanco] = useState<BalancoData>({
            credito_mes: 0,
            debito_mes: 0,
            saldo_total: 0,
            saldo_inicial: 0,
        });
    const [isLoading, setIsLoading] = useState(true); 
    const handleSave = async (nome: string, icone: string, rota: string) => {
        const jaExiste = atalhos.some((a) => a.rota === rota || a.nome === nome);
        if (jaExiste) {
            console.log("Duplicado", "Este atalho já foi adicionado.");
            Alert.alert("Duplicado", "Este atalho já foi adicionado")
            return;
        }
        //esse ja é dele
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

            console.log('Atalho criado:', response.data);
            navigation.navigate('TelaHome');

        } catch (error) {
            console.error('Erro ao salvar atalho:', error.response?.data || error.message);
            Alert.alert('Erro','Erro ao salvar atalho');
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
                Alert.alert('Erro','Errro ao carregar');
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
                    Alert.alert('Erro','Erro ao buscar balnço')
                }
            };

        carregarTudo();
    }, []);


    const atalhosPredefinidos = [
        { id: 2, nome: 'Balanço', icone: 'money', rota: 'TelaBalanco' },
        { id: 3, nome: 'Análise Rápida', icone: 'flash', rota: 'TelaAnaliseRapida' },
        { id: 4, nome: 'Categorias', icone: 'th-large', rota: 'TelaCategorias' },
        { id: 5, nome: 'Configurações', icone: 'cog', rota: 'TelaConfiguracoes' },
        { id: 6, nome: 'Adicionar Transações', icone: 'plus', rota: 'TelaAdicionarTransacoes' },
        { id: 7, nome: 'Metas', icone: 'bullseye', rota: 'TelaMetas' },
        { id: 8, nome: 'Transações', icone: 'exchange', rota: 'TelaTransacoes' },
    ];

    const [atalhos, setAtalhos] = useState(atalhosPredefinidos);

    if (isLoading) {
        return <Loading />;
    }

    return <>
        <SafeAreaView style={styles.container}>
            <Header leftIconName="arrowleft"
                leftIconSize={24}
                leftIconColor="#f1c40f"
                rightIconName="bells"
                rightIconSize={24}
                rightIconColor="#f1c40f"
                title="Atalhos"
            />


            <FlatList
                data={atalhosPredefinidos}
                keyExtractor={(item) => item.id.toString()}
                numColumns={3}
                ListHeaderComponent={
                    <Balanço
                        credito={balanco.credito_mes.toString()}
                        debito={balanco.debito_mes.toString()}
                        saldo={balanco.saldo_total.toString()}
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
                contentContainerStyle={{ paddingVertical: 10 }}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
            />
        </SafeAreaView>
    </>
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#2c2c2c',
        height: '100%',
        flex: 1,
        paddingHorizontal: 20
    },
    atalhoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        margin: 8,
        backgroundColor: '#3a3a3a',
        borderRadius: 12,
        minHeight: 100,
        maxWidth: '30%',
    },
});