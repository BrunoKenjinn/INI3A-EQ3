import { View, Text, Image, StyleSheet, Pressable, TextInput, SafeAreaView, FlatList, ScrollView } from "react-native";
import { Header } from "../components/header";
import { Balanço } from "../components/balanco";
import { Categoria } from "../components/categoria";
import axios from 'axios';
import { useEffect, useState } from 'react';




export default function TelaCategorias({ navigation }) {
    useEffect(() => {
        axios.get('http://localhost:8000/api/categorias')
            .then(response => {
                setCategorias(response.data);
            })
            .catch(error => {
                console.error('Erro ao buscar categorias:', error.response?.data || error.message);
            });
    }, []);

    const [categorias, setCategorias] = useState([]);
    const categoriasComAdicionar = [...categorias, { id: 'adicionar', nome: 'Adicionar', icone: 'plus' }];

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