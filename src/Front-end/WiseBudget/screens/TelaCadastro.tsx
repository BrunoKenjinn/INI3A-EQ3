import { useState } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import axios from 'axios';
import Logo from '../assets/LogoAmarela.png';

export default function TelaCadastro({ navigation }) {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [celular, setCelular] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');

    const handleRegister = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/register', {
                nome,
                email,
                cpf,
                celular,
                data_nascimento: dataNascimento,
                password,
                password_confirmation: passwordConfirmation,
            }, {
                headers: {
                    Accept: 'application/json',
                }
            });

            Alert.alert("Sucesso", "Usuário cadastrado com sucesso.");
            navigation.navigate('TelaLogin'); // ajuste se tiver outro nome
        } catch (error) {
            console.log('Erro no cadastro:', error.response?.data);

            const errors = error.response?.data?.errors;
            if (errors) {
                const messages = Object.values(errors).flat().join('\n');
                Alert.alert("Erro no cadastro", messages);
            } else {
                Alert.alert("Erro", "Não foi possível cadastrar. Tente novamente.");
            }
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image source={Logo} style={styles.logo} />
            <Text style={styles.title}>Crie sua conta</Text>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Nome Completo</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Seu nome"
                    value={nome}
                    onChangeText={setNome}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="seu@email.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>CPF</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Apenas números"
                    value={cpf}
                    onChangeText={setCpf}
                    keyboardType="numeric"
                    maxLength={11}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Celular</Text>
                <TextInput
                    style={styles.input}
                    placeholder="(99) 99999-9999"
                    value={celular}
                    onChangeText={setCelular}
                    keyboardType="phone-pad"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Data de Nascimento</Text>
                <TextInput
                    style={styles.input}
                    placeholder="AAAA-MM-DD"
                    value={dataNascimento}
                    onChangeText={setDataNascimento}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Senha</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirmar Senha</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Confirme a senha"
                    value={passwordConfirmation}
                    onChangeText={setPasswordConfirmation}
                    secureTextEntry
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.textButton}>Cadastrar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('TelaLogin')}>
            <Text style={styles.loginLink}>
                Já tem cadastro? <Text style={styles.linkText}>Clique aqui</Text>
            </Text>
        </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#2c2c2c',
        height:'100%',
        alignItems: 'center',
        paddingRight:30,
        paddingLeft:30,
    },
    logo: {
        width: 150,
        height: 150
    },
    title: {
        fontSize: 30,
        color: '#f1c40f',
        fontFamily: 'Poppins-Bold',
        marginTop: 10
    },
    inputGroup: {
        width: '100%',
        marginBottom: 15,
    },
    label: {
        color: '#ffffff',
        marginBottom: 5,
        marginLeft: 10,
    },
    input: {
        backgroundColor: '#393939',
        padding: 10,
        borderRadius: 20,
        color: '#ffffff',
        width: '100%',
    },
    button: {
        backgroundColor: '#f1c40f',
        padding: 10,
        width: 160,
        alignItems: 'center',
        borderRadius: 15,
        marginTop: 20
    },
    textButton: {
        fontSize: 18,
        fontWeight: 'bold'
    },

    loginLink: {
    marginTop: 10,
    color: '#ffffff',
    textAlign: 'center'
    },

    linkText: {
        color: '#f1c40f',
        fontWeight: 'bold',
        textDecorationLine: 'underline'
    }

});
