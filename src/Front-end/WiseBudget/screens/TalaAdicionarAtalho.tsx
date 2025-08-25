import { View, Text, Image, StyleSheet, Pressable, TextInput, SafeAreaView, FlatList, ScrollView } from "react-native";
import { Header } from "../components/header";
import { Balanço } from "../components/balanco";
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Atalho } from "../components/atalho";
import useApi from "../hooks/useApi";


export default function TelaAdicionarAtalhos({ navigation }) {
    const handleSave = async (nome: string, icone: string, rota:string) => {
        let {url} = useApi();
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
        }
    };

    const atalhosPredefinidos = [
    { id: 2, nome: 'Balanço', icone: 'money', rota: 'TelaBalanco' },
    { id: 3, nome: 'Análise Rápida', icone: 'flash', rota: 'TelaAnaliseRapida' },
    { id: 4, nome: 'Categorias', icone: 'th-large', rota: 'TelaCategorias' },
    { id: 5, nome: 'Configurações', icone: 'cog', rota: 'TelaConfiguracoes' },
    { id: 6, nome: 'Adicionar Gastos', icone: 'plus', rota: 'TelaAdicionarTransacoes' },
    { id: 7, nome: 'Metas', icone: 'bullseye', rota: 'TelaMetas' },
    { id: 8, nome: 'Transações', icone: 'exchange', rota: 'TelaTransacoes' },
];

    const [atalhos, setAtalhos] = useState(atalhosPredefinidos);

    const [selectedValue, setSelectedValue] = useState('cutlery'); 
    const [title, setTitle] = useState('');


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

            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <Balanço saldo="12.345,00" gasto="12.345,00" />
                <FlatList
                    data={atalhosPredefinidos}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={3}
                    renderItem={({ item }) => (
                    <Pressable style={styles.atalhoContainer}>
                    <Atalho
                        iconName={item.icone}
                        text={item.nome}
                        onPress={() => handleSave(item.nome, item.icone,item.rota)}
                        onLongPress={() => handleDelete(item.id)}
                    />
                    </Pressable>
                    )}
                    contentContainerStyle={{ paddingVertical: 10}}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
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