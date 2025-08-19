import { View, Text, Image, StyleSheet, Pressable, TextInput, SafeAreaView, FlatList, ScrollView } from "react-native";
import { Header } from "../components/header";
import { Balanço } from "../components/balanco";
import { Categoria } from "../components/categoria";
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from "@react-navigation/native";
import useApi from "../hooks/useApi";




export default function TelaCategorias({ navigation }) {
    const [categorias, setCategorias] = useState([]);
    const categoriasComAdicionar = [...categorias, { id: 'adicionar', nome: 'Adicionar', icone: 'plus' }];
    useFocusEffect(
        useCallback(() => {
            const carregarCategorias = async () => {
                try {
                    let {url} = useApi();
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

            carregarCategorias();

            return () => { };
        }, [])
    );

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
                <Balanço saldo="12.345,00" gasto="12.345,00" />
                <FlatList
                    data={categoriasComAdicionar}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={3}
                    renderItem={({ item }) => (
                        <View style={{ flex: 1, margin: 8 }}>
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
                    contentContainerStyle={{ paddingVertical: 10 }}
                    columnWrapperStyle={{ justifyContent: 'center' }}
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
    }
});