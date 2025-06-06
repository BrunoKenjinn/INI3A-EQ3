import { Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import LogoAmarela from '../assets/LogoAmarela.png'
import { useState } from "react";
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function TelaLogin() {

    const [mostrarSenha, setMostrarSenha] = useState(false);

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
        fontFamily: 'Poppins-Bold',
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
        fontFamily: 'Poppins-Regular',
        marginBottom: 5
    },
    input: {
        width: '100%',
        borderRadius: 20,
        padding: 10,
        backgroundColor: '#393939',
        fontFamily: 'Poppins-Regular',
        fontSize: 18
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
        fontFamily: 'Poppins-Regular',
        fontSize: 18
    },
    textLink: {
        color: '#ffffff',
        textAlign: "right",
        fontFamily: 'Poppins-Regular',
        marginTop: 5
    }
});