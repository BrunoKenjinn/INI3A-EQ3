import { View, Text, Image, StyleSheet, Pressable, TextInput, SafeAreaView, FlatList, ScrollView, Alert } from "react-native";
import { Header } from "../components/header";
import { Balanço } from "../components/balanco";
import { Categoria } from "../components/categoria";
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from "@react-navigation/native";
import useApi from "../hooks/useApi";
import { Loading } from "../components/loading";

interface BalancoData {
    credito_mes: number;
    debito_mes: number;
    saldo_total: number;
    saldo_inicial: number;
}




export default function TelaCategorias({ navigation }) {
    const [categorias, setCategorias] = useState([]);
    const categoriasComAdicionar = [...categorias, { id: 'adicionar', nome: 'Adicionar', icone: 'plus' }];
    const [isLoading, setIsLoading] = useState(true); // Estado para o carregamento
    const [balanco, setBalanco] = useState<BalancoData>({
        credito_mes: 0,
        debito_mes: 0,
        saldo_total: 0,
        saldo_inicial: 0,
    });
    useFocusEffect(
        useCallback(() => {
            const carregarTudo = async () => {
                setIsLoading(true);
                try {
                    await carregarCategorias();
                    await carregarBalanco();
                } catch (error) {
                    console.error("Erro ao carregar dados da Tela de Categorias:", error);
                    Alert.alert("Erro", "Não foi possível carregar os dados. Tente novamente.");
                } finally {
                    setIsLoading(false);
                }
            };

            const carregarCategorias = async () => {
                try {
                    let { url } = useApi();
                    const token = await AsyncStorage.getItem('auth_token');
                    const response = await axios.get(url + '/api/categorias', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    setCategorias(response.data);
                } catch (error) {
                    console.error('Erro ao buscar categorias:', error.response?.data || error.message);
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
                }
            };
            carregarTudo();

            return () => { };
        }, [])
    );

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
                title="Categorias" />

            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <Balanço
                    credito={balanco.credito_mes.toString()}
                    debito={balanco.debito_mes.toString()}
                    saldo={balanco.saldo_total.toString()}
                />
                <FlatList
                    data={categoriasComAdicionar}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={3}
                    renderItem={({ item }) => (
                        <View style={styles.categoriaWrapper}>
                            <Categoria
                                iconName={item.icone}
                                text={item.nome}
                                onPress={() => {
                                    if (item.id === 'adicionar') {
                                        navigation.navigate('TelaAdicionarCategoria');
                                    } else {
                                        navigation.navigate('TelaEditarCategoria', { categoria: item });
                                    }
                                }}
                            />
                        </View>
                    )}
                />


            </ScrollView>
        </SafeAreaView>
    </>
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#2c2c2c',
        height: '100%',
        padding: 20
    },
    categoriaWrapper: {
        width: '33.33%',   // sempre ocupa 1/3 da tela
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 15,
    }

});