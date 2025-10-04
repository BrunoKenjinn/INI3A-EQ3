import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    SectionList,
    ActivityIndicator,
    Alert,
    Dimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Header } from '../components/header';
import { Notificacao } from '../components/notificacao';
import CustomBottomTab from '../components/CustomBottomTab';
import useApi from '../hooks/useApi';
import { getIconForNotification } from '../utils/notificationUtils';
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Picker } from '@react-native-picker/picker';

const { width, height } = Dimensions.get('window');

const getResponsiveFontSize = (size: number) => {
    const scale = width / 375;
    return Math.round(size * scale);
};

interface Notificacao {
    id: number;
    titulo: string;
    descricao: string;
    tipo: string;
    data_criacao: string;
    lida?: boolean;
}

export default function TelaNotificacoes({ navigation }) {
    const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
    const [loading, setLoading] = useState(true);
    const [filtroStatus, setFiltroStatus] = useState('nao_lidas');

    useFocusEffect(
        useCallback(() => {
            const carregarNotificacoes = async () => {
                setLoading(true);
                try {
                    const { url } = useApi();
                    const token = await AsyncStorage.getItem("auth_token");
                    
                    const response = await axios.get(
                        `${url}/api/notificacoes?status=${filtroStatus}`, 
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );
                    
                    setNotificacoes(response.data);
                } catch (error) {
                    console.error(
                        "Erro ao buscar notificações:",
                        error.response?.data || error.message
                    );
                    Alert.alert("Erro", "Não foi possível carregar as notificações.");
                } finally {
                    setLoading(false);
                }
            };

            carregarNotificacoes();
        }, [filtroStatus]) 
    );

    const agruparNotificacoes = () => {
        if (notificacoes.length === 0) return [];
        const grupos: { [key: string]: Notificacao[] } = { "Hoje": [], "Ontem": [], "Esta Semana": [], "Este Mês": [], "Mais Antigas": [] };
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const ontem = new Date(hoje);
        ontem.setDate(hoje.getDate() - 1);
        const inicioSemana = new Date(hoje);
        inicioSemana.setDate(hoje.getDate() - hoje.getDay());

        notificacoes.forEach((notificacao) => {
            const dataNotificacao = new Date(notificacao.data_criacao);
            dataNotificacao.setHours(0, 0, 0, 0);

            if (dataNotificacao.getTime() === hoje.getTime()) grupos["Hoje"].push(notificacao);
            else if (dataNotificacao.getTime() === ontem.getTime()) grupos["Ontem"].push(notificacao);
            else if (dataNotificacao >= inicioSemana) grupos["Esta Semana"].push(notificacao);
            else if (dataNotificacao.getMonth() === hoje.getMonth() && dataNotificacao.getFullYear() === hoje.getFullYear()) grupos["Este Mês"].push(notificacao);
            else grupos["Mais Antigas"].push(notificacao);
        });

        return Object.keys(grupos).map((key) => ({ title: key, data: grupos[key] })).filter((grupo) => grupo.data.length > 0);
    };

    const dadosAgrupados = agruparNotificacoes();

    return (
        <SafeAreaView style={styles.container}>
            <Header
                leftIconName="arrow-left"
                leftIconColor="#f1c40f"
                leftIconSize={width * 0.06}
                leftIconComponent={FontAwesome5}
                title="Notificações"
                rightIconName="bell"
                rightIconColor="#f1c40f"
                rightIconSize={width * 0.06}
                rightIconComponent={FontAwesome5}
                onLeftPress={() => navigation.goBack()}
            />
            
            <View style={styles.filtersContainer}>
                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={filtroStatus}
                        onValueChange={(itemValue) => setFiltroStatus(itemValue)}
                        style={styles.picker}
                        dropdownIconColor="#f1c40f"
                    >
                        <Picker.Item label="Não Lidas" value="nao_lidas" />
                        <Picker.Item label="Lidas" value="lidas" />
                    </Picker>
                </View>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#f1c40f" style={{ flex: 1 }} />
            ) : (
                <SectionList
                    sections={dadosAgrupados}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContentContainer}
                    renderItem={({ item }) => (
                        <Notificacao
                            iconName={getIconForNotification(item.tipo)}
                            title={item.titulo}
                            description={item.descricao}
                            date={new Date(item.data_criacao).toLocaleDateString('pt-BR', {
                                day: '2-digit', month: '2-digit', year: 'numeric',
                                hour: '2-digit', minute: '2-digit'
                            })}
                            onPress={() => navigation.navigate('TelaPerfil')}
                        />
                    )}
                    renderSectionHeader={({ section: { title } }) => (
                        <Text style={styles.sectionHeader}>{title}</Text>
                    )}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>
                            {`Nenhuma notificação ${filtroStatus === 'lidas' ? 'lida' : 'não lida'} encontrada.`}
                        </Text>
                    }
                />
            )}

            <CustomBottomTab/>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#2c2c2c",
    },
    filtersContainer: {
        paddingHorizontal: width * 0.05,
        marginBottom: height * 0.015,
        marginTop: height * 0.01,
    },
    pickerWrapper: {
        backgroundColor: "#393939",
        borderRadius: 8,
        height: height * 0.06,
        justifyContent: "center",
    },
    picker: {
        color: "#ffffff",
        backgroundColor: "#393939",
    },
    sectionHeader: {
        color: "#f1c40f",
        fontSize: getResponsiveFontSize(16),
        fontFamily: 'Poppins-Bold',
        marginTop: height * 0.02,
        marginBottom: height * 0.01,
    },
    emptyText: {
        color: "#a3a3a3",
        textAlign: "center",
        marginTop: height * 0.1,
        fontSize: getResponsiveFontSize(14),
        fontFamily: 'Poppins-Regular',
    },
    listContentContainer: {
        paddingHorizontal: width * 0.05,
        paddingBottom: height * 0.1,
    }
});