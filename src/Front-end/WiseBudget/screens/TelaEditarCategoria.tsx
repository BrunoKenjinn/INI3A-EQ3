import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import {
    SafeAreaView,
    Text,
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
    Dimensions,
    ScrollView,
} from "react-native";
import { Header } from "../components/header";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import WheelColorPicker from "react-native-wheel-color-picker";
import useApi from "../hooks/useApi";
import CustomBottomTab from "../components/CustomBottomTab";

const { width, height } = Dimensions.get("window");

const getResponsiveFontSize = (size: number) => {
    const scale = width / 375;
    return Math.round(size * scale);
};

export default function TelaEditarCategoria({ navigation, route }) {
    const { categoria } = route.params;
    const [selectedValue, setSelectedValue] = useState(categoria.icone);
    const [title, setTitle] = useState(categoria.nome);
    const [corSelecionada, setCorSelecionada] = useState(
        categoria.cor || "#FF6384"
    );

    const handleUpdate = async () => {
        try {
            let { url } = useApi();
            const token = await AsyncStorage.getItem("auth_token");
            await axios.put(
                url + `/api/categorias/${categoria.id}`,
                {
                    nome: title,
                    icone: selectedValue,
                    cor: corSelecionada,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            Alert.alert("Sucesso", "Categoria atualizada com sucesso!");
            navigation.goBack();
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Erro ao atualizar a categoria.";
            Alert.alert("Erro", errorMessage);
        }
    };

    const confirmDelete = () => {
        Alert.alert(
            "Excluir Categoria",
            "Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita.",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Excluir", style: "destructive", onPress: handleDelete },
            ]
        );
    };


    const handleDelete = async () => {
        try {
            let { url } = useApi();
            const token = await AsyncStorage.getItem("auth_token");

            await axios.delete(url + `/api/categorias/${categoria.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            navigation.goBack();
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Erro ao excluir a categoria.";
            Alert.alert("Erro", errorMessage);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header
                leftIconName="arrowleft"
                leftIconSize={width * 0.06}
                leftIconColor="#f1c40f"
                rightIconName="bells"
                rightIconSize={width * 0.06}
                rightIconColor="#f1c40f"
                title="Editar Categoria"
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
                        onChangeText={setTitle}
                    />
                </View>

                <View style={styles.inputArea}>
                    <Text style={styles.textInput}>Selecione o ícone</Text>
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
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                        <Text style={styles.textButton}>Salvar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={confirmDelete}>
                        <Text style={styles.textButton}>Excluir</Text>
                    </TouchableOpacity>
                </View>
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: height * 0.04,
    },
    button: {
        backgroundColor: '#f1c40f',
        paddingVertical: height * 0.015,
        paddingHorizontal: width * 0.1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
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

