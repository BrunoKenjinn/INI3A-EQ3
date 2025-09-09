import { Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Dimensions, ScrollView } from "react-native";
import { useState } from "react";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useAuth } from "../App";
import { MaskedTextInput } from "react-native-mask-text";
import useApi from "../hooks/useApi";

const { width, height } = Dimensions.get("window");

const getResponsiveFontSize = (size: number) => {
    const scale = width / 375;
    return Math.round(size * scale);
};


export default function TelaLogin({ navigation }) {
    const { signIn } = useAuth();
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [mask, setMask] = useState("");

    const handleLogin = () => {
        let { url } = useApi();

        if (!identifier || !password) {
            Alert.alert('Atenção', 'Por favor, preencha o CPF/Email e a senha.');
            return;
        }

        let payload: any = {
            identifier: identifier.includes("@")
                ? identifier // email
                : identifier.replace(/\D/g, ''), 
            password,
        };


        axios.post(url + '/api/login', payload)
            .then(async response => {
                const { access_token } = response.data;
                if (access_token) {
                    signIn(access_token);
                } else {
                    Alert.alert("Token nao recebido");
                }
            })
            .catch(error => {
                if (error.response) {
                    console.log("Erro 422:", error.response.data);
                    Alert.alert('Erro', error.response.data.message || 'Credenciais inválidas.');
                } else {
                    Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
                }
            });
    };


    const handleChange = (text: string) => {
        if (/[a-zA-Z]/.test(text)) {
            setMask("");
        } else {
            setMask("999.999.999-99");
        }
        setIdentifier(text);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Image source={require('../assets/LogoAmarela.png')} style={styles.logo} />
                <Text style={styles.title}>Bem-vindo</Text>

                <View style={styles.form}>
                    <View style={styles.inputArea}>
                        <Text style={styles.textInputLabel}>
                            CPF ou Email
                        </Text>
                        <MaskedTextInput
                            placeholder="Digite o Email ou CPF"
                            style={styles.input}
                            placeholderTextColor="#6E6E6E"
                            value={identifier}
                            onChangeText={handleChange}
                            autoCapitalize="none"
                            mask={mask || undefined}
                        />
                    </View>

                    <View style={styles.inputArea}>
                        <Text style={styles.textInputLabel}>
                            Senha
                        </Text>
                        <View style={styles.inputPasswordContainer}>
                            <TextInput
                                placeholder="Digite a senha"
                                secureTextEntry={!mostrarSenha}
                                style={styles.inputPassword}
                                placeholderTextColor="#6E6E6E"
                                value={password}
                                onChangeText={setPassword}
                            />
                            <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
                                <FontAwesome
                                    name={mostrarSenha ? "eye" : "eye-slash"}
                                    size={getResponsiveFontSize(20)}
                                    color="#6E6E6E"
                                />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity>
                            <Text style={styles.textLink}>Esqueceu a senha?</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.buttons}>
                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>Log In</Text>
                    </TouchableOpacity>
                    <Text style={styles.textButtonTop}>Não tem conta ainda?</Text>
                    <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => navigation.navigate('TelaCadastro')}>
                        <Text style={[styles.buttonText, styles.secondaryButtonText]}>Cadastre-se</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2c2c2c',
    },
    scrollContainer: {
        alignItems: 'center',
        paddingVertical: height * 0.05,
    },
    logo: {
        width: width * 0.4,
        height: width * 0.4,
        resizeMode: 'contain',
    },
    title: {
        fontSize: getResponsiveFontSize(28),
        color: '#f1c40f',
        fontFamily: 'Poppins-Bold',
        marginTop: height * 0.02,
    },
    form: {
        width: '90%',
        gap: height * 0.02,
        marginTop: height * 0.04
    },
    inputArea: {
        width: '100%'
    },
    textInputLabel: {
        color: '#ffffff',
        fontSize: getResponsiveFontSize(14),
        fontFamily: 'Poppins-Regular',
        marginBottom: height * 0.01,
    },
    input: {
        width: '100%',
        borderRadius: 15,
        padding: height * 0.015,
        backgroundColor: '#393939',
        fontSize: getResponsiveFontSize(14),
        color: '#ffffff',
        fontFamily: 'Poppins-Regular',
    },
    inputPasswordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#393939',
        borderRadius: 15,
        paddingRight: width * 0.04,
    },
    inputPassword: {
        flex: 1,
        borderRadius: 15,
        padding: height * 0.015,
        backgroundColor: '#393939',
        fontSize: getResponsiveFontSize(14),
        color: '#ffffff',
        fontFamily: 'Poppins-Regular',
    },
    textLink: {
        color: '#EAE3C9',
        textAlign: "right",
        marginTop: height * 0.01,
        fontSize: getResponsiveFontSize(12),
        fontFamily: 'Poppins-Regular',
    },
    buttons: {
        width: '60%',
        alignItems: 'center',
        marginTop: height * 0.15,
    },
    button: {
        backgroundColor: '#f1c40f',
        paddingVertical: height * 0.015,
        width: '100%',
        alignItems: 'center',
        borderRadius: 15,
    },
    buttonText: {
        fontFamily: 'Poppins-Bold',
        fontSize: getResponsiveFontSize(16),
        color: '#2c2c2c'
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#f1c40f',
    },
    secondaryButtonText: {
        color: '#f1c40f',
    },
    textButtonTop: {
        color: '#ffffff',
        fontFamily: 'Poppins-Regular',
        marginVertical: height * 0.02,
        fontSize: getResponsiveFontSize(14),
    }
});
