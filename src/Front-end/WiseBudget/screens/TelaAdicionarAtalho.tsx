import { View, Text, Image, StyleSheet, Pressable, TextInput, SafeAreaView, FlatList, ScrollView } from "react-native";
import { Header } from "../components/header";
import { Balanço } from "../components/balanco";
import { Categoria } from "../components/categoria";
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from "@react-navigation/native";




export default function TelaAdicionarAtalhos({ navigation }) {
    const atalhosPredefinidos = [
    { id: 1, nome: 'Financas', icone: 'dollar-sign'},
    { id: 2, nome: 'Gastos', icone: 'credit-card'},
    { id: 3, nome: 'Investimentos', icone: 'chart-line'}
    ];

    const [atalhos, setAtalhos] = useState(atalhosPredefinidos);

    const [selectedValue, setSelectedValue] = useState('cutlery'); // ícone inicial padrão
    const [title, setTitle] = useState('');

    const handleSave = async () => {
        try {
            const token = await AsyncStorage.getItem('auth_token');

            const response = await axios.post('http://localhost:8000/api/atalhos', {
                nome: title,
                icone: selectedValue
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                }
            });

            console.log('Categoria criada:', response.data);
            navigation.navigate('TelaCategorias');

        } catch (error) {
            console.error('Erro ao salvar categoria:', error.response?.data || error.message);
        }
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