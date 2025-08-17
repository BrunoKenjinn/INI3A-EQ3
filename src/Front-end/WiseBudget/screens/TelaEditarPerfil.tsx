import { useState } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import axios from 'axios';
import { MaskedTextInput } from "react-native-mask-text";
import { Header } from '../components/header';
import { useAuth } from '../App'; 

export default function TelaEditarPerfil({ navigation, route }) {
    const { usuario } = route.params;
    const { signOut } = useAuth(); 

    const [nome, setNome] = useState(usuario?.nome || '');
    const [email, setEmail] = useState(usuario?.email || '');
    const [cpf, setCpf] = useState(usuario?.cpf || '');
    const [celular, setCelular] = useState(usuario?.celular || '');
    const [dataNascimento, setDataNascimento] = useState(usuario?.data_nascimento || '');

    const handleUpdate = async () => {
        const dadosParaEnviar = {
            nome,
            email,
            cpf: String(cpf).replace(/\D/g, ''),
            celular: String(celular).replace(/\D/g, ''),
            data_nascimento: dataNascimento,
        };

        try {
            await axios.put(`http://localhost:8000/api/usuario`, dadosParaEnviar, {
                headers: {
                    Accept: 'application/json',
                }
            });

            Alert.alert("Sucesso", "Perfil atualizado com sucesso.");
            navigation.goBack();
        } catch (error) {
            console.log('Erro ao atualizar perfil:', error.response?.data);
            const errors = error.response?.data?.errors;
            if (errors) {
                const messages = Object.values(errors).flat().join('\n');
                Alert.alert("Erro de Validação", messages);
            } else {
                const errorMessage = error.response?.data?.message || "Não foi possível atualizar. Tente novamente.";
                Alert.alert("Erro", errorMessage);
            }
        }
    };

    const handleDelete = async () => {
        Alert.alert(
            "Excluir Conta",
            "Tem a certeza de que deseja excluir a sua conta? Esta ação é irreversível.",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await axios.delete(`http://localhost:8000/api/usuario`);
                            Alert.alert("Sucesso", "A sua conta foi excluída.");
                            signOut();
                        } catch (error) {
                            console.error("Erro ao excluir conta:", error.response?.data);
                            Alert.alert("Erro", "Não foi possível excluir a sua conta.");
                        }
                    },
                },
            ]
        );
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Header
                leftIconName="arrowleft"
                leftIconSize={24}
                leftIconColor="#f1c40f"
                title="Editar Perfil"
            />

            <TouchableOpacity style={styles.avatarContainer} onPress={() => Alert.alert("Foto", "Futuramente abrir seletor de imagem")}>
                <Image
                    source={
                        usuario && usuario.foto
                            ? { uri: usuario.foto }
                            : require('../assets/images/FotoPerfil.png')
                    }
                    style={styles.avatar}
                />
            </TouchableOpacity>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Nome Completo</Text>
                <TextInput
                    style={styles.input}
                    value={nome}
                    onChangeText={setNome}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>CPF</Text>
                <MaskedTextInput
                    style={styles.input}
                    value={cpf}
                    onChangeText={(text, rawText) => setCpf(rawText)}
                    mask="999.999.999-99"
                    keyboardType="numeric"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Celular</Text>
                <MaskedTextInput
                    style={styles.input}
                    value={celular}
                    onChangeText={(text, rawText) => setCelular(rawText)}
                    mask="(99) 99999-9999"
                    keyboardType="phone-pad"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Data de Nascimento</Text>
                <MaskedTextInput
                    style={styles.input}
                    value={dataNascimento}
                    onChangeText={(text, rawText) => setDataNascimento(text)}
                    mask="99/99/9999"
                    keyboardType="numeric"
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                <Text style={styles.textButton}>Salvar Alterações</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
                <Text style={[styles.textButton, styles.deleteButtonText]}>Excluir Conta</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#2c2c2c',
        minHeight: '100%',
        alignItems: 'center',
        padding: 10,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: '#f1c40f',
    },
    inputGroup: {
        width: '100%',
        marginBottom: 15,
        paddingHorizontal: 20,
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
        padding: 12,
        width: 250,
        alignItems: 'center',
        borderRadius: 15,
        marginTop: 20,
    },
    textButton: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2c2c2c',
    },
    deleteButton: {
        backgroundColor: 'transparent',
        borderColor: '#E74C3C',
        borderWidth: 2,
    },
    deleteButtonText: {
        color: '#E74C3C',
    }
});
