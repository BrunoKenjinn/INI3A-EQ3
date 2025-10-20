import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Switch,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Header } from "../components/header";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomBottomTab from "../components/CustomBottomTab";
import useApi from "../hooks/useApi";
import { Loading } from "../components/loading";
import axios from "axios";

const { width, height } = Dimensions.get("window");

const getResponsiveFontSize = (size: number) => {
  const scale = width / 375;
  return Math.round(size * scale);
};

type BackendConfigs = {
  todas_ativas: boolean;
  som_ativo: boolean;
  vibracao_ativa: boolean;
  push_ativo: boolean;
  email_ativo: boolean;
  lembretes_ativos: boolean;
  modo_silencioso: boolean;
};

type FrontendConfigs = {
  todasAtivas: boolean;
  somAtivo: boolean;
  vibracaoAtiva: boolean;
  pushAtivo: boolean;
  emailAtivo: boolean;
  lembretesAtivos: boolean;
  modoSilencioso: boolean;
};

export default function TelaConfigsNotificacoes({ navigation }) {
  const [configs, setConfigs] = useState<FrontendConfigs | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { url } = useApi();

  const carregarConfigs = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("auth_token");
      const response = await axios.get(`${url}/api/config-notificacoes`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data: BackendConfigs = response.data;

      setConfigs({
        todasAtivas: data.todas_ativas,
        somAtivo: data.som_ativo,
        vibracaoAtiva: data.vibracao_ativa,
        pushAtivo: data.push_ativo,
        emailAtivo: data.email_ativo,
        lembretesAtivos: data.lembretes_ativos,
        modoSilencioso: data.modo_silencioso,
      });
    } catch (error) {
      console.log(
        "Erro ao carregar configs da API:",
        error.response?.data || error.message
      );
      Alert.alert("Erro", "Não foi possível buscar suas configurações.");
    } finally {
      setIsLoading(false);
    }
  }, [url]);

  const salvarConfigs = useCallback(
    async (configsParaSalvar: FrontendConfigs) => {
      const payload: BackendConfigs = {
        todas_ativas: configsParaSalvar.todasAtivas,
        som_ativo: configsParaSalvar.somAtivo,
        vibracao_ativa: configsParaSalvar.vibracaoAtiva,
        push_ativo: configsParaSalvar.pushAtivo,
        email_ativo: configsParaSalvar.emailAtivo,
        lembretes_ativos: configsParaSalvar.lembretesAtivos,
        modo_silencioso: configsParaSalvar.modoSilencioso,
      };

      try {
        const token = await AsyncStorage.getItem("auth_token");
        await axios.put(`${url}/api/config-notificacoes`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        }); //
        console.log("Configurações salvas!");
      } catch (error) {
        console.log("Erro ao salvar configs na API:", error);
        Alert.alert("Erro", "Não foi possível salvar suas configurações.");
      }
    },
    [url]
  );

  useEffect(() => {
    carregarConfigs();
  }, [carregarConfigs]);

  useEffect(() => {
    if (!isLoading && configs) {
      salvarConfigs(configs);
    }
  }, [configs, isLoading, salvarConfigs]);

  const toggleTodas = (value: boolean) => {
    setConfigs({
      todasAtivas: value,
      somAtivo: value,
      vibracaoAtiva: value,
      pushAtivo: value,
      emailAtivo: value,
      lembretesAtivos: value,
      modoSilencioso: configs?.modoSilencioso || false,
    });
  };

  const setValorConfig = (key: keyof FrontendConfigs, value: boolean) => {
    setConfigs((prev) => (prev ? { ...prev, [key]: value } : null));
  };

  if (isLoading || !configs) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#2c2c2c",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#f1c40f" />
      </SafeAreaView>
    );
  }

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
        onLeftPress={() => navigation.goBack()}
      />

      <View style={styles.container}>
        <ConfigItem
          label="Ativar todas notificações"
          value={configs.todasAtivas}
          onChange={toggleTodas}
        />

        <ConfigItem
          label="Som"
          value={configs.somAtivo}
          onChange={(value) => setValorConfig("somAtivo", value)}
          disabled={!configs.todasAtivas}
        />
        <ConfigItem
          label="Vibração"
          value={configs.vibracaoAtiva}
          onChange={(value) => setValorConfig("vibracaoAtiva", value)}
          disabled={!configs.todasAtivas}
        />
        <ConfigItem
          label="Notificações Push"
          value={configs.pushAtivo}
          onChange={(value) => setValorConfig("pushAtivo", value)}
          disabled={!configs.todasAtivas}
        />
        <ConfigItem
          label="Notificações por E-mail"
          value={configs.emailAtivo}
          onChange={(value) => setValorConfig("emailAtivo", value)}
          disabled={!configs.todasAtivas}
        />
        <ConfigItem
          label="Lembretes (metas, transações)"
          value={configs.lembretesAtivos}
          onChange={(value) => setValorConfig("lembretesAtivos", value)}
          disabled={!configs.todasAtivas}
        />
        <ConfigItem
          label="Silenciar à noite (22h às 7h)"
          value={configs.modoSilencioso}
          onChange={(value) => setValorConfig("modoSilencioso", value)}
          disabled={!configs.todasAtivas}
        />
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
