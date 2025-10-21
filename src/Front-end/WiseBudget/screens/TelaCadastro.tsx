import { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, SafeAreaView, Dimensions, Modal } from "react-native";
import { MaskedTextInput } from "react-native-mask-text";
import validate from 'react-native-email-validator';
import axios from 'axios';
import useApi from "../hooks/useApi";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const { width, height } = Dimensions.get("window");

const getResponsiveFontSize = (size: number) => {
    const scale = width / 375;
    return Math.round(size * scale);
};


export default function TelaCadastro({ navigation }) {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [celular, setCelular] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const handleRegister = async () => {

        const dadosParaEnviar = {
            nome,
            email,
            cpf: String(cpf).replace(/\D/g, ''),
            celular: String(celular).replace(/\D/g, ''),
            data_nascimento: dataNascimento,
            password,
            password_confirmation: passwordConfirmation,
        };

        try {
            let { url } = useApi();
            await axios.post(url + '/api/register', dadosParaEnviar, {
                headers: {
                    Accept: 'application/json',
                }
            });
            setModalVisible(true)
        } catch (error) {
            console.log('Erro no cadastro:', error.response?.data);
            const errors = error.response?.data?.errors;
            if (errors) {
                const messages = Object.values(errors).flat().join('\n');
                Alert.alert("Erro no cadastro", messages);
            } else {
                const errorMessage = error.response?.data?.message || "Não foi possível cadastrar. Tente novamente.";
                Alert.alert("Erro", errorMessage);
            }
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <Image source={require('../assets/LogoAmarela.png')} style={styles.logo} />
                <Text style={styles.title}>Crie sua conta</Text>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nome Completo</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Seu nome"
                            placeholderTextColor="#a3a3a3"
                            value={nome}
                            onChangeText={setNome}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="seu@email.com"
                            placeholderTextColor="#a3a3a3"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        {
                            email.length > 0 ? (validate(email) ? null : <Text style={styles.validation}>Email Inválido</Text>) : null
                        }
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>CPF</Text>
                        <MaskedTextInput
                            style={styles.input}
                            placeholder="Digite o CPF"
                            placeholderTextColor="#a3a3a3"
                            value={cpf}
                            onChangeText={(text) => setCpf(text)}
                            keyboardType="numeric"
                            mask='999.999.999-99'
                        />
                        {
                            cpf.length > 0 ? (cpf.length === 14 ? null : <Text style={styles.validation}>CPF Inválido</Text>) : null
                        }
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Celular</Text>
                        <MaskedTextInput
                            style={styles.input}
                            placeholder="Digite o Telefone"
                            placeholderTextColor="#a3a3a3"
                            value={celular}
                            onChangeText={(text) => setCelular(text)}
                            keyboardType="phone-pad"
                            mask="(99) 99999-9999"
                        />
                        {
                            celular.length > 0 ? (celular.length === 15 ? null : <Text style={styles.validation}>Celular Inválido</Text>) : null
                        }
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Data de Nascimento</Text>
                        <MaskedTextInput
                            style={styles.input}
                            placeholder="DD/MM/AAAA"
                            placeholderTextColor="#a3a3a3"
                            value={dataNascimento}
                            onChangeText={setDataNascimento}
                            mask='99/99/9999'
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Senha</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Crie uma senha"
                            placeholderTextColor="#a3a3a3"
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
                            placeholderTextColor="#a3a3a3"
                            value={passwordConfirmation}
                            onChangeText={setPasswordConfirmation}
                            secureTextEntry
                        />
                        {
                            passwordConfirmation.length > 0 ? (passwordConfirmation === password ? null : <Text style={styles.validation}>Senhas diferentes</Text>) : null
                        }
                    </View>

                    <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={nome.length === 0 || !validate(email) || cpf.length !== 14 || celular.length !== 15 || dataNascimento.length === 0 || passwordConfirmation !== password}>
                            <Text style={styles.textButton}>Cadastrar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('TelaLogin')}>
                            <Text style={styles.loginLink}>
                                Já tem cadastro? <Text style={styles.linkText}>Clique aqui</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            <Modal
                transparent
                visible={modalVisible}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={{flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center",}}>
                    <View style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: width * 0.8, backgroundColor: '#2c2c2c', padding: width * 0.05, borderRadius: width * 0.02}}>
                        <FontAwesome5 
                            name="user-check" 
                            size={getResponsiveFontSize(32)} 
                            color="#f1c40f" 
                        />
                        <Text style={{fontFamily: 'Poppins-Bold', fontSize: getResponsiveFontSize(18), color: '#f1c40f', marginTop: height * 0.02}}>Cadastro Concluído!</Text>
                        <Text style={{fontFamily: 'Poppins-Regular', fontSize: getResponsiveFontSize(12), color: 'white', textAlign: 'center', marginTop: height * 0.02}}>
                            Seu cadastro foi realizado com sucesso. Você já pode fazer login.
                        </Text>
                        <TouchableOpacity onPress={() => {navigation.navigate('TelaLogin'); setModalVisible(false)}} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: width * 0.02, backgroundColor: '#f1c40f', borderRadius: width * 0.02, marginTop: height * 0.02}}>
                            <Text style={{fontFamily: 'Poppins-Bold', color: '#393939', fontSize: getResponsiveFontSize(14)}}>Voltar ao Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#2c2c2c',
    },
    container: {
        alignItems: 'center',
        paddingVertical: height * 0.05,
        paddingHorizontal: width * 0.05,
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
        marginBottom: height * 0.02,
    },
    form: {
        width: '100%',
    },
    inputGroup: {
        width: '100%',
        marginBottom: height * 0.02,
    },
    label: {
        color: '#ffffff',
        marginBottom: height * 0.01,
        fontSize: getResponsiveFontSize(14),
        fontFamily: 'Poppins-Regular',
    },
    input: {
        backgroundColor: '#393939',
        paddingVertical: height * 0.015,
        paddingHorizontal: width * 0.04,
        borderRadius: 15,
        color: '#ffffff',
        width: '100%',
        fontSize: getResponsiveFontSize(14),
        fontFamily: 'Poppins-Regular',
    },
    button: {
        backgroundColor: '#f1c40f',
        paddingVertical: height * 0.018,
        width: '60%',
        alignItems: 'center',
        borderRadius: 15,
        marginTop: height * 0.05
    },
    textButton: {
        fontSize: getResponsiveFontSize(18),
        fontFamily: 'Poppins-Bold',
        color: '#2c2c2c',
    },
    loginLink: {
        marginTop: height * 0.02,
        color: '#ffffff',
        textAlign: 'center',
        fontSize: getResponsiveFontSize(14),
        fontFamily: 'Poppins-Regular',
    },
    linkText: {
        color: '#f1c40f',
        fontFamily: 'Poppins-Bold',
        textDecorationLine: 'underline'
    },
    validation: {
        color: '#dc3545',
    }
});
