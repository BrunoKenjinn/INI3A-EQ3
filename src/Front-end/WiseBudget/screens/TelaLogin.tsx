import { Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import LogoAmarela from '../assets/LogoAmarela.png'; 
import { useState } from "react";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function TelaLogin({ navigation }) {

    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if (!identifier || !password) {
            Alert.alert('Atenção', 'Por favor, preencha o CPF/Email e a senha.');
            return;
        }

        axios.post('http://localhost:8000/api/login', {
            identifier: identifier,
            password: password,
        })
        .then(async response => {
            const { user, access_token } = response.data;

            await AsyncStorage.setItem('auth_token', access_token);
            await AsyncStorage.setItem('user', JSON.stringify(user));

            
            console.log('Token:', access_token);
            console.log('Dados do Usuário:', user);
        })
        .catch(error => {
            if (error.response) {
                console.error('Dados do erro:', error.response.data);
            } else if (error.request) {
                console.error('Erro de requisição:', error.request);
            } else {
                console.error('Erro:', error.message);
            }
        });
    };

    return <>
        <SafeAreaView style={styles.container}>
            <Image source={LogoAmarela} style={styles.logo} />
            <Text style={styles.title}>Bem-vindo</Text>

            <View style={styles.form}>
                <View style={styles.inputArea}>
                    <Text style={styles.textInput}>
                        CPF ou Email
                    </Text>
                    <TextInput
                        placeholder="exemplo@exemplo.com"
                        style={styles.input}
                        placeholderTextColor="#6E6E6E"
                        selectionColor="#393939"
                        value={identifier}
                        onChangeText={setIdentifier}
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.inputArea}>
                    <Text style={styles.textInput}>
                        Senha
                    </Text>
                    <View style={styles.inputPasswordContainer}>
                        <TextInput
                            placeholder="Digite a senha"
                            secureTextEntry={!mostrarSenha}
                            style={styles.inputPassword}
                            placeholderTextColor="#6E6E6E"
                            selectionColor="#393939"
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
                            <FontAwesome
                                name={mostrarSenha ? "eye" : "eye-slash"}
                                size={20}
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
                <Text style={styles.textButtonTop}>Nao Tem Conta Ainda?</Text>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TelaCadastro')}>
                        <Text style={styles.buttonText}>Cadastre-se</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    </>
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: '#2c2c2c',
        display: 'flex',
        alignItems: 'center',
    },
    logo: {
        width: 150,
        height: 150
    },
    title: {
        fontSize: 30,
        color: '#f1c40f',
        fontWeight: 'bold',
        marginTop: 10
    },
    form: {
        width: '100%',
        paddingHorizontal: 40,
        display: 'flex',
        gap: 20,
        marginTop: 30
    },
    inputArea: {
        width: '100%'
    },
    textInput: {
        color: '#ffffff',
        fontSize: 15,
        marginBottom: 5
    },
    input: {
        width: '100%',
        borderRadius: 20,
        padding: 10,
        backgroundColor: '#393939',
        fontSize: 18,
        color: '#ffffff'
    },
    inputPasswordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#393939',
        borderRadius: 20,
        paddingRight: 15,
    },
    inputPassword: {
        flex: 1,
        width: '100%',
        borderRadius: 20,
        padding: 10,
        backgroundColor: '#393939',
        fontSize: 18,
        color: '#ffffff'
    },
    textLink: {
        color: '#EAE3C9',
        textAlign: "right",
        marginTop: 5
    },
    buttons: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        marginTop: 70
    },
    button: {
        backgroundColor: '#f1c40f',
        padding: 8,
        width: '50%',
        display: 'flex',
        alignItems: 'center',
        borderRadius: 20
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 23,
        color: '#2c2c2c'
    },
    textButtonTop: {
        color: '#ffffff',
        fontFamily: 'Poppins-Regular',
        marginTop: 30,
        marginBottom: 5
    }
});