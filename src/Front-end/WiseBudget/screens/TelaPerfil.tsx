import { Image, SafeAreaView, Text, TouchableOpacity, View, StyleSheet, Alert } from 'react-native'
import { Header } from '../components/header'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useAuth } from '../App';
import CustomBottomTab from '../components/CustomBottomTab';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Loading } from '../components/loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import useApi from '../hooks/useApi';

export default function TelaPerfil({navigation}) {
    const [isLoading, setIsLoading] = useState(true);
    const [infoUser, setInfoUser] = useState<any>(null);
    useFocusEffect(
        useCallback(() => {
            const carregarInformacoes = async () => {
                if(!isLoading) 
                    setIsLoading(true);
                try {
                    let {url} = useApi();
                    const token = await AsyncStorage.getItem('auth_token');
                    const response = await axios.get(url + '/api/usuario', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setInfoUser(response.data);
                } catch (error: any) {
                    console.error('Erro ao buscar as informações do usuario:', error.response?.data || error.message);
                    Alert.alert("Erro", "Erro ao buscar informações")
                } finally{
                    setIsLoading(false);
                }
            };
            carregarInformacoes();

            return () => { };
        }, [])
    );

    const { signOut } = useAuth();
    let {url} = useApi();

    if(isLoading)
        return <Loading />

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#2c2c2c', height:'100%', width:'100%'}}>
            <View style={{ flex: 1, position: 'relative' }}>
                <Header
                    leftIconName="arrow-left"
                    leftIconColor="#f1c40f"
                    leftIconSize={24}
                    leftIconComponent={FontAwesome5}
                    title="Perfil"
                    rightIconName="bell"
                    rightIconColor="#f1c40f"
                    rightIconSize={24}
                    rightIconComponent={FontAwesome5}
                    infoUser={infoUser}
                />

                <Image style={{width:'100%'}} source={infoUser?.foto ? { uri: url + `/storage/img/fotos_usuarios${infoUser.foto}` } : require('../assets/images/FotoPerfil.png')} />

                <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#2c2c2c', borderTopLeftRadius: 30, borderTopRightRadius: 30, zIndex: 99, height: 530, padding: 20 }}>
                    <View style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', marginTop: 20 }}>
                        <View>
                            <Text style={{ color: '#f1c40f', fontFamily: 'Poppins-Bold', fontSize: 30, lineHeight: 25 }}>  {infoUser?.nome || "Carregando..."}</Text>
                            <Text style={{ color: '#a3a3a3', fontFamily: 'Poppins-Regular', fontSize: 16 }}>  {infoUser?.idade ? `${infoUser.idade} anos, Pessoa Física` : "Idade não disponível"}</Text>
                        </View>
                        <TouchableOpacity style={styles.botaoEditar} onPress={() => navigation.navigate('TelaEditarPerfil', { usuario: infoUser })}>
                            <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 18, color: '#2c2c2c' }}>Editar</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.botoes}>
                        <View style={styles.botao}>
                            <FontAwesome5 name="user-friends" size={24} color="#f1c40f" />
                            <Text style={{ color: '#f1c40f', fontFamily: 'Poppins-Regular' }}>Amigos</Text>
                        </View>
                        <View style={styles.botao}>
                            <FontAwesome5 name="sliders-h" size={24} color="#f1c40f" />
                            <Text style={{ color: '#f1c40f', fontFamily: 'Poppins-Regular' }}>Configs</Text>
                        </View>
                        <View style={styles.botao}>
                            <FontAwesome5 name="comment-alt" size={24} color="#f1c40f" />
                            <Text style={{ color: '#f1c40f', fontFamily: 'Poppins-Regular' }}>Chat</Text>
                        </View>
                        <View style={styles.botao}>
                            <FontAwesome5 name="wallet" size={24} color="#f1c40f" />
                            <Text style={{ color: '#f1c40f', fontFamily: 'Poppins-Regular' }}>Carteira</Text>
                        </View>
                        <View style={styles.botao}>
                            <FontAwesome5 name="piggy-bank" size={24} color="#f1c40f" />
                            <Text style={{ color: '#f1c40f', fontFamily: 'Poppins-Regular' }}>Cofrinho</Text>
                        </View>
                        <TouchableOpacity style={styles.botao} onPress={signOut}>
                            <FontAwesome5 name="sign-out-alt" size={24} color="#f1c40f" />
                            <Text style={{ color: '#f1c40f', fontFamily: 'Poppins-Regular' }}>Sair</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <CustomBottomTab />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    botaoEditar: {
        backgroundColor: '#f1c40f',
        borderRadius: 20,
        padding: 5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 120,
    },
    botoes: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderColor: '#f1c40f',
        borderWidth: 1,
        marginTop: 50,
        borderRadius: 30
    },
    botao: {
        padding: 10,
        alignItems: 'center',
        width: '33%',
        height: 100,
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
        gap: 10
    }
})