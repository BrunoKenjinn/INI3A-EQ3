import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { SafeAreaView, Text, View, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Header } from '../components/header';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function TelaEditarCategoria({ navigation , route} ) {;
    const { categoria } = route.params;
    const [selectedValue, setSelectedValue] = useState(categoria.icone);
    const [title, setTitle] = useState(categoria.nome);

    

    const handleUpdate = async () => {
        try {
            const token = await AsyncStorage.getItem('auth_token');
            const response = await axios.put(`http://localhost:8000/api/categorias/${categoria.id}`, {
            nome: title,
            icone: selectedValue
            }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

            Alert.alert('Sucesso', 'Categoria atualizada com sucesso!');
            navigation.navigate('TelaCategorias');
        } catch (error) {
            if (error.response) {
                Alert.alert('Erro', error.response.data.message || 'Erro ao atualizar');
            } else {
                Alert.alert('Erro', 'Erro de conexão.');
            }
        };
    }

    const handleDelete = async () => {
        try {
            const token = await AsyncStorage.getItem('auth_token');

            await axios.delete(`http://localhost:8000/api/categorias/${categoria.id}`, {
                headers: {
                Authorization: `Bearer ${token}`
            }});
            Alert.alert('Sucesso', 'Categoria excluída com sucesso!');
            navigation.navigate('TelaCategorias');
        } catch (error) {
            if (error.response) {
                Alert.alert('Erro', error.response.data.message || 'Erro ao excluir.');
            } else {
                Alert.alert('Erro', 'Erro de conexão.');
            }
        }
    };


    return <>
        <SafeAreaView style={styles.container}>
            <Header leftIconName="arrowleft"
                                    leftIconSize={24}
                                    leftIconColor="#f1c40f"
                                    rightIconName="bells"
                                    rightIconSize={24}
                                    rightIconColor="#f1c40f"
                                    title="Categorias"/>

            <View style={styles.main}>
                <Text style={styles.h1}>Editar Categoria</Text>

                <View style={styles.inputArea}>
                    <Text style={styles.textInput}>Digite o nome</Text>
                    <TextInput 
                        placeholder={categoria.nome} 
                        style={styles.input}
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>

                <View style={styles.inputArea}>
                    <Text style={styles.textInput}>Selecione o icone</Text>
                    <Picker
                        selectedValue={selectedValue}
                        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                        style={{ height: 40, backgroundColor: '#393939', borderRadius: 20, color: '#ffffff' }}
                    >
                        <Picker.Item label="Alimentação" value="cutlery" />
                        <Picker.Item label="Transporte" value="bus" />
                        <Picker.Item label="Saúde" value="heart" />
                        <Picker.Item label="Despesas" value="file-text" />
                        <Picker.Item label="Moradia" value="home" />
                        <Picker.Item label="Educação" value="graduation-cap" />
                        <Picker.Item label="Lazer" value="smile-o" />
                        <Picker.Item label="Investimentos" value="line-chart" />
                        <Picker.Item label="Cartão" value="credit-card" />
                        <Picker.Item label="Viagens" value="paper-plane" />
                        <Picker.Item label="PET" value="paw" />
                    </Picker>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                    <Text style={styles.textButton}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={handleDelete}>
                    <Text style={styles.textButton}>Excluir</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    </>
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#2c2c2c',
        height: '100%',
        padding: 20,
    },

    main: {
        display: 'flex',
        alignItems: 'center',
    },

    h1: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#f1c40f',
        marginTop: 25
    },

    inputArea: {
        width: '100%'
    },

    input: {
        backgroundColor: '#393939',
        padding: 10,
        borderRadius: 20,
        width: '100%',
        color: '#ffffff'
    },

    textInput: {
        color: '#ffffff',
        marginLeft: 15,
        marginBottom: 5
    },

    button: {
        backgroundColor: '#f1c40f',
        padding: 5,
        width: 120,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        marginTop: 20
    },

    textButton: {
        fontSize: 20,
        fontWeight: 'bold'
    }
});