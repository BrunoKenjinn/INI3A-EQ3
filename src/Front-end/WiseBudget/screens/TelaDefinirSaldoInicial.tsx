import { SafeAreaView, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Dimensions, View } from "react-native";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../App";
import useApi from "../hooks/useApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

const getResponsiveFontSize = (size: number) => {
    const scale = width / 375;
    return Math.round(size * scale);
};

export default function TelaDefinirSaldoInicial({ navigation }) {
    const { signOut, setNeedSaldoInicial } = useAuth();
    const [saldo, setSaldo] = useState("");

    const salvarSaldo = async () => {
        if (!saldo) {
            Alert.alert("Atenção", "Por favor, digite um valor para o saldo.");
            return;
        }
        try {
            const token = await AsyncStorage.getItem('auth_token');
            let { url } = useApi();
            await axios.put(url + "/api/definir-saldo-inicial", { saldo_inicial: saldo.replace(',', '.') }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNeedSaldoInicial(false);
        } catch (error) {
            console.error(error.response?.data || error.message);
            Alert.alert("Erro", "Erro ao inserir saldo");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Defina seu saldo inicial</Text>
                <Text style={styles.subtitle}>Este será o ponto de partida para o seu controle financeiro.</Text>
                
                <View style={styles.inputContainer}>
                     <Text style={styles.currencySymbol}>R$</Text>
                     <TextInput
                        style={styles.input}
                        placeholder="0,00"
                        placeholderTextColor="#a3a3a3"
                        keyboardType="numeric"
                        value={saldo}
                        onChangeText={setSaldo}
                    />
                </View>

                <TouchableOpacity style={styles.button} onPress={salvarSaldo}>
                    <Text style={styles.buttonText}>Salvar</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={signOut}>
                    <Text style={styles.logout}>Sair</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#2c2c2c",
        justifyContent: "center",
    },
    content: {
        alignItems: "center",
        paddingHorizontal: width * 0.1,
    },
    title: {
        color: "#f1c40f",
        fontSize: getResponsiveFontSize(24),
        fontFamily: 'Poppins-Bold',
        marginBottom: height * 0.01,
        textAlign: 'center',
    },
    subtitle: {
        color: "#a3a3a3",
        fontSize: getResponsiveFontSize(14),
        fontFamily: 'Poppins-Regular',
        marginBottom: height * 0.05,
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#393939",
        borderRadius: 15,
        width: "100%",
        marginBottom: height * 0.03,
        paddingHorizontal: width * 0.04,
    },
    currencySymbol: {
        color: "#a3a3a3",
        fontSize: getResponsiveFontSize(20),
        fontFamily: 'Poppins-Bold',
    },
    input: {
        flex: 1,
        paddingVertical: height * 0.02,
        color: "#ffffff",
        fontSize: getResponsiveFontSize(20),
        fontFamily: 'Poppins-Regular',
        marginLeft: width * 0.02,
    },
    button: {
        backgroundColor: "#f1c40f",
        paddingVertical: height * 0.02,
        borderRadius: 15,
        width: "100%",
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontWeight: "bold",
        fontSize: getResponsiveFontSize(18),
        color: "#2c2c2c",
        fontFamily: 'Poppins-Bold',
    },
    logout: {
        color: "#a3a3a3",
        marginTop: height * 0.03,
        fontSize: getResponsiveFontSize(14),
        fontFamily: 'Poppins-Regular',
        textDecorationLine: 'underline',
    }
});
