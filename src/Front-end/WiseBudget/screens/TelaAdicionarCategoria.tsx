import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { SafeAreaView, Text, View, StyleSheet, TextInput, Button, TouchableOpacity } from 'react-native';
import { Header } from '../components/header';
import axios from 'axios';

export default function TelaAdicionarCategoria({navigation}) {

    const [selectedValue, setSelectedValue] = useState('cutlery');
    const [title, setTitle] = useState('');

    const handleSave = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/categorias', {
                nome: title,
                icone: selectedValue
            }, {
                headers: {
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
                                    title="Categorias"/>

            <View style={styles.main}>
                <Text style={styles.h1}>Adicionar Categoria</Text>

                <View style={styles.inputArea}>
                    <Text style={styles.textInput}>Digite o nome</Text>
                    <TextInput
                        placeholder='Nome da Categoria'
                        style={styles.input}
                        value={title}
                        onChangeText={text => setTitle(text)}
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

                <TouchableOpacity style={styles.button} onPress={handleSave}>
                    <Text style={styles.textButton}>Salvar</Text>
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