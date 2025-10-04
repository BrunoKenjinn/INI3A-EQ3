import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { SafeAreaView, Text, View, StyleSheet, TextInput, TouchableOpacity, Alert, Dimensions, ScrollView } from 'react-native';
import { Header } from '../components/header';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WheelColorPicker from 'react-native-wheel-color-picker';
import useApi from "../hooks/useApi";
import CustomBottomTab from '../components/CustomBottomTab';

const { width, height } = Dimensions.get("window");

const getResponsiveFontSize = (size: number) => {
    const scale = width / 375;
    return Math.round(size * scale);
};

export default function TelaAdicionarCategoria({ navigation }) {
    const [selectedValue, setSelectedValue] = useState('cutlery');
    const [title, setTitle] = useState('');
    const [corSelecionada, setCorSelecionada] = useState('#FF6384');

    const handleSave = async () => {
        let { url } = useApi();
        try {
            const token = await AsyncStorage.getItem('auth_token');
            const response = await axios.post(url + '/api/categorias', {
                nome: title,
                icone: selectedValue,
                cor: corSelecionada,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                }
            });
            navigation.goBack();
        } catch (error) {
            console.error('Erro ao salvar categoria:', error.response?.data || error.message);
            Alert.alert('Erro', 'Erro ao salvar categoria');
        }
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
                title="Adicionar Categoria"
                onLeftPress={() => navigation.goBack()}
            />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.inputArea}>
                    <Text style={styles.textInput}>Digite o nome</Text>
                    <TextInput
                        placeholder='Nome da Categoria'
                        placeholderTextColor="#ccc"
                        style={styles.input}
                        value={title}
                        onChangeText={text => setTitle(text)}
                    />
                </View>

                <View style={styles.inputArea}>
                    <Text style={styles.textInput}>Selecione o icone</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={selectedValue}
                            onValueChange={(itemValue) => setSelectedValue(itemValue)}
                            style={styles.picker}
                            dropdownIconColor="#ffffff"
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
                </View>

                <View style={styles.inputArea}>
                    <Text style={styles.textInput}>Selecione a cor</Text>
                    <View style={styles.inputAreaCor}>
                        <View style={styles.wheelContainer}>
                            <WheelColorPicker
                                color={corSelecionada}
                                onColorChangeComplete={setCorSelecionada}
                                thumbSize={width * 0.05}
                                sliderSize={width * 0.05}
                                noSnap={true}
                                row={false}
                            />
                        </View>
                        <View style={[styles.corPreview, { backgroundColor: corSelecionada }]} />
                    </View>
                </View>
                <TouchableOpacity style={styles.button} onPress={handleSave}>
                    <Text style={styles.textButton}>Salvar</Text>
                </TouchableOpacity>
            </ScrollView>
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
    },
    scrollContainer: {
        alignItems: 'center',
        paddingBottom: height * 0.15,
        paddingHorizontal: width * 0.05,
    },
    inputArea: {
        width: '100%',
        marginTop: height * 0.02,
    },
    inputAreaCor: {
        width: '100%',
        alignItems: 'center',
        marginTop: height * 0.02,
    },
    wheelContainer: {
        height: height * 0.3,
        width: '80%',
    },
    corPreview: {
        width: width * 0.05,
        height: width * 0.05,
        borderRadius: (width * 0.05) / 2,
        marginTop: height * 0.02,
    },
    input: {
        backgroundColor: '#393939',
        padding: width * 0.03,
        borderRadius: 10,
        height: height * 0.05,
        width: '100%',
        color: '#ffffff',
        fontSize: getResponsiveFontSize(14),
    },
    textInput: {
        color: '#ffffff',
        marginLeft: width * 0.04,
        marginBottom: height * 0.01,
        fontSize: getResponsiveFontSize(14),
        fontFamily: 'Poppins-Regular',
    },
    button: {
        backgroundColor: '#f1c40f',
        paddingVertical: height * 0.015,
        paddingHorizontal: width * 0.1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        marginTop: height * 0.04,
    },
    textButton: {
        fontSize: getResponsiveFontSize(18),
        fontWeight: 'bold',
        fontFamily: 'Poppins-Bold',
        color: '#2c2c2c'
    },
    picker: {
        height: '100%',
        width: '100%',
        color: '#ffffff',
        backgroundColor: '#393939',
        fontSize: getResponsiveFontSize(14),
    },
    pickerContainer: {
        backgroundColor: '#393939',
        borderRadius: 10,
        height: height * 0.05,
        justifyContent: 'center',
        width: '100%',
        overflow: 'hidden',
    },
    tabContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
});

