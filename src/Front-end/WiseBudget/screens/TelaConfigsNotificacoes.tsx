import { SafeAreaView, Text, View, StyleSheet, Switch, Dimensions } from "react-native";
import { Header } from "../components/header";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomBottomTab from "../components/CustomBottomTab";

const { width, height } = Dimensions.get("window");

const getResponsiveFontSize = (size: number) => {
    const scale = width / 375;
    return Math.round(size * scale);
};

const STORAGE_KEY = "@config_notificacoes";

export default function TelaConfigsNotificacoes({ navigation }) {
    const [todasAtivas, setTodasAtivas] = useState(true);
    const [somAtivo, setSomAtivo] = useState(true);
    const [vibracaoAtiva, setVibracaoAtiva] = useState(true);
    const [pushAtivo, setPushAtivo] = useState(true);
    const [emailAtivo, setEmailAtivo] = useState(false);
    const [lembretesAtivos, setLembretesAtivos] = useState(true);
    const [modoSilencioso, setModoSilencioso] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    const salvarConfigs = async (configs: any) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
        } catch (error) {
            console.log("Erro ao salvar configs:", error);
        }
    };

    const carregarConfigs = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
            if (jsonValue != null) {
                const configs = JSON.parse(jsonValue);
                setTodasAtivas(configs.todasAtivas);
                setSomAtivo(configs.somAtivo);
                setVibracaoAtiva(configs.vibracaoAtiva);
                setPushAtivo(configs.pushAtivo);
                setEmailAtivo(configs.emailAtivo);
                setLembretesAtivos(configs.lembretesAtivos);
                setModoSilencioso(configs.modoSilencioso);
            }
        } catch (error) {
            console.log("Erro ao carregar configs:", error);
        }
    };

    useEffect(() => {
        if (!isLoaded) return; 
        const configs = { todasAtivas, somAtivo, vibracaoAtiva, pushAtivo, emailAtivo, lembretesAtivos, modoSilencioso };
        salvarConfigs(configs);
    }, [todasAtivas, somAtivo, vibracaoAtiva, pushAtivo, emailAtivo, lembretesAtivos, modoSilencioso]);

    useEffect(() => {
        const carregar = async () => {
            await carregarConfigs();
            setIsLoaded(true); 
        };
        carregar();
    }, []);

    const toggleTodas = (value: boolean) => {
        setTodasAtivas(value);
        setSomAtivo(value);
        setVibracaoAtiva(value);
        setPushAtivo(value);
        setEmailAtivo(value);
        setLembretesAtivos(value);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#2c2c2c" }}>
            <Header
                leftIconName="arrow-left"
                leftIconColor="#f1c40f"
                leftIconSize={24}
                leftIconComponent={FontAwesome5}
                title="Configurações de Notificações"
                rightIconName="bell"
                rightIconColor="#f1c40f"
                rightIconSize={24}
                rightIconComponent={FontAwesome5}
            />

            <View style={styles.container}>
                <ConfigItem label="Ativar todas notificações" value={todasAtivas} onChange={toggleTodas} />

                <ConfigItem label="Som" value={somAtivo} onChange={setSomAtivo} disabled={!todasAtivas} />
                <ConfigItem label="Vibração" value={vibracaoAtiva} onChange={setVibracaoAtiva} disabled={!todasAtivas} />
                <ConfigItem label="Notificações Push" value={pushAtivo} onChange={setPushAtivo} disabled={!todasAtivas} />
                <ConfigItem label="Notificações por E-mail" value={emailAtivo} onChange={setEmailAtivo} disabled={!todasAtivas} />
                <ConfigItem label="Lembretes (metas, transações)" value={lembretesAtivos} onChange={setLembretesAtivos} disabled={!todasAtivas} />
                <ConfigItem label="Silenciar à noite (22h às 7h)" value={modoSilencioso} onChange={setModoSilencioso} disabled={!todasAtivas} />
            </View>

            <View style={styles.tabContainer}>
                <CustomBottomTab />
            </View>
        </SafeAreaView>
    );
}

function ConfigItem({ label, value, onChange, disabled = false }) {
    return (
        <View style={[styles.item, disabled && { opacity: 0.5 }]}>
            <Text style={styles.text}>{label}</Text>
            <Switch
                value={value}
                onValueChange={onChange}
                thumbColor={value ? "#f1c40f" : "#888"}
                trackColor={{ true: "#f1c40f50", false: "#555" }}
                disabled={disabled}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: width * 0.06,
        gap: height * 0.025,
    },
    item: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: height * 0.015,
        borderBottomWidth: 1,
        borderBottomColor: "#444",
    },
    text: {
        fontSize: getResponsiveFontSize(16),
        color: "#f1c40f",
        fontFamily: "Poppins-Regular",
        flex: 1,
        paddingRight: 10,
    },
    tabContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
    },
});
