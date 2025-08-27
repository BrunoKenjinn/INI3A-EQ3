import { SafeAreaView, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../App";
import useApi from "../hooks/useApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TelaDefinirSaldoInicial({ navigation }) {
    const { signOut, setNeedSaldoInicial } = useAuth();
    const [saldo, setSaldo] = useState("");

    const salvarSaldo = async () => {
        try {
            const token = await AsyncStorage.getItem('auth_token');
            let {url} = useApi();
            await axios.put(url + "/api/definir-saldo-inicial", { saldo_inicial: saldo }, {
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
            <Text style={styles.title}>Defina seu saldo inicial</Text>
            <TextInput
                style={styles.input}
                placeholder="Digite o saldo"
                keyboardType="numeric"
                value={saldo}
                onChangeText={setSaldo}
            />
            <TouchableOpacity style={styles.button} onPress={salvarSaldo}>
                <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={signOut}>
                <Text style={styles.logout}>Sair</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#2c2c2c"
    },
    title: {
        color: "#fff",
        fontSize: 22,
        marginBottom: 20
    },
    input: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 10,
        width: "80%",
        marginBottom: 20
    },
    button: {
        backgroundColor: "#f1c40f",
        padding: 12,
        borderRadius: 20
    },
    buttonText: {
        fontWeight: "bold",
        fontSize: 18,
        color: "#2c2c2c"
    },
    logout: {
        color: "#fff",
        marginTop: 20
    }
});
