import { View, Text, Image, StyleSheet, Pressable, TextInput, SafeAreaView, FlatList, ScrollView } from "react-native";
import { Header } from "../components/header";
import { Balanço } from "../components/balanco";
import { Categoria } from "../components/categoria";
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from "@react-navigation/native";




export default function TelaAdicionarAtalhos({ navigation }) {
    const [atalhos, setAtalhos] = useState([]);
    const atalhosComAdicionar = [...atalhos, { id: 'adicionar', nome: 'Adicionar', icone: 'plus' }];
    useFocusEffect(
        useCallback(() => {
            const carregarAtalhos = async () => {
                try {
                    const token = await AsyncStorage.getItem('auth_token');
                    const response = await axios.get('http://localhost:8000/api/atalhos', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    setAtalhos(response.data);
                } catch (error) {
                    console.error('Erro ao buscar atalhos:', error.response?.data || error.message);
                }
            };

            carregarAtalhos();

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