import React, { useState, useCallback, useMemo } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Header } from "../components/header";
import CustomBottomTab from "../components/CustomBottomTab";
import useApi from "../hooks/useApi";
import * as Progress from "react-native-progress";

const { width, height } = Dimensions.get("window");

const getResponsiveFontSize = (size: number) => {
  const scale = width / 375;
  return Math.round(size * scale);
};

interface MetaType {
  id: number;
  nome: string;
  valor_alvo: number;
  valor_atual: number;
  valor_restante: number;
  goalAmount: string;
  valor_atual_formatado: string;
}

const AjusteMesAnterior = ({ valorAjuste }) => {
  if (!valorAjuste || valorAjuste === 0) {
    return null;
  }

  const isBonus = valorAjuste > 0;
  const cor = isBonus ? "#2ecc71" : "#e74c3c";
  const texto = isBonus
    ? "Bônus por economia no mês anterior:"
    : "Ajuste por gastos extras no mês anterior:";
  const valorFormatado = valorAjuste.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <View style={styles.ajusteContainer}>
      <Text style={styles.ajusteTexto}>{texto}</Text>
      <Text style={[styles.ajusteValor, { color: cor }]}>{valorFormatado}</Text>
    </View>
  );
};

export default function TelaDistribuirMetas({ navigation }) {
  const [sugestao, setSugestao] = useState(0);
  const [ajuste, setAjuste] = useState(0);
  const [metas, setMetas] = useState<MetaType[]>([]);
  const [depositos, setDepositos] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(true);
  const { url } = useApi();

  const carregarDados = async () => {
    setLoading(true);
    setDepositos({});
    try {
      const token = await AsyncStorage.getItem("auth_token");
      const headers = { Authorization: `Bearer ${token}` };

      const sugestaoResponse = await axios.get(
        `${url}/api/metas/sugestao-investimento`,
        { headers }
      );
      setSugestao(sugestaoResponse.data.valor_sugerido || 0);
      setAjuste(sugestaoResponse.data.ajuste_mes_anterior || 0);

      const metasResponse = await axios.get(
        `${url}/api/metas?status=incompletas`,
        { headers }
      );
      const metasComRestante = metasResponse.data.map((meta: any) => ({
        ...meta,
        nome: meta.subtitle,
        valor_restante: Math.max(0, meta.valor_alvo - meta.valor_atual),
      }));
      setMetas(metasComRestante);
    } catch (error) {
      console.error(
        "Erro ao buscar dados:",
        error.response?.data || error.message
      );
      Alert.alert(
        "Erro",
        "Não foi possível carregar os dados para distribuição."
      );
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [])
  );

  const handleDepositoChange = (metaId: number, valor: string) => {
    const valorLimpo = valor.replace(/[^0-9.]/g, "");
    const valorNumerico = parseFloat(valorLimpo) || 0;

    const metaAtual = metas.find((m) => m.id === metaId);
    if (!metaAtual) return;

    if (valorNumerico > metaAtual.valor_restante) {
      setDepositos((prev) => ({
        ...prev,
        [metaId]: metaAtual.valor_restante.toFixed(2).toString(),
      }));
      Alert.alert(
        "Limite Atingido",
        `O máximo que você pode adicionar a "${
          metaAtual.nome
        }" é ${metaAtual.valor_restante.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}.`
      );
    } else {
      setDepositos((prev) => ({
        ...prev,
        [metaId]: valorLimpo,
      }));
    }
  };

  const totalDistribuido = useMemo(() => {
    return Object.values(depositos).reduce(
      (acc, valor) => acc + (parseFloat(valor) || 0),
      0
    );
  }, [depositos]);

  const valorRestanteGeral = useMemo(() => {
    return Math.max(0, sugestao - totalDistribuido);
  }, [sugestao, totalDistribuido]);

  const handleSalvarDistribuicao = async () => {
    const depositosParaEnviar = Object.entries(depositos)
      .map(([meta_id, valor]) => ({
        meta_id: parseInt(meta_id, 10),
        valor: parseFloat(valor),
      }))
      .filter((deposito) => deposito.valor > 0);

    if (depositosParaEnviar.length === 0) {
      Alert.alert("Atenção", "Você não distribuiu nenhum valor.");
      return;
    }

    if (totalDistribuido > sugestao) {
      Alert.alert(
        "Valor Excedido",
        `O total distribuído (${totalDistribuido.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}) excede o valor disponível (${sugestao.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}).`
      );
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("auth_token");
      await axios.post(
        `${url}/api/metas/depositar`,
        { depositos: depositosParaEnviar },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert("Sucesso!", "Valores distribuídos com sucesso.");
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao salvar distribuição:", error);
      if (error.response && error.response.status === 422) {
        const erros = error.response.data.errors;
        const primeiraMensagem =
          Object.values(erros)[0]?.[0] || "Erro de validação.";
        Alert.alert("Erro de Validação", primeiraMensagem);
      } else {
        Alert.alert(
          "Erro",
          error.response?.data?.message ||
            "Não foi possível salvar a distribuição."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const renderMetaItem = ({ item }: { item: MetaType }) => {
    const valorDeposito = parseFloat(depositos[item.id]) || 0;
    const progressoAtual =
      item.valor_alvo > 0 ? item.valor_atual / item.valor_alvo : 0;
    const progressoComDeposito =
      item.valor_alvo > 0
        ? (item.valor_atual + valorDeposito) / item.valor_alvo
        : 0;

    return (
      <View style={styles.metaContainer}>
        <View style={styles.metaHeader}>
          <Text style={styles.metaTitle}>{item.nome}</Text>
          <Text style={styles.metaValores}>
            {item.valor_atual_formatado} / {item.goalAmount}
          </Text>
        </View>
        <View style={styles.progressBarContainer}>
          <Progress.Bar
            progress={progressoAtual}
            width={null}
            height={height * 0.008}
            color="#f1c40f"
            unfilledColor="#555"
            borderWidth={0}
          />
          {valorDeposito > 0 && (
            <View
              style={[
                styles.progressOverlay,
                { width: `${Math.min(100, progressoComDeposito * 100)}%` },
              ]}
            />
          )}
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.restanteText}>
            Faltam:{" "}
            {item.valor_restante.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </Text>
          <View style={styles.inputContainer}>
            <Text style={styles.currencySymbol}>R$</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor="#BDC3C7"
              keyboardType="numeric"
              value={depositos[item.id] || ""}
              onChangeText={(valor) => handleDepositoChange(item.id, valor)}
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        leftIconName="arrow-left"
        leftIconColor="#f1c40f"
        leftIconSize={width * 0.06}
        leftIconComponent={FontAwesome5}
        title="Distribuir Ganhos"
        onLeftPress={() => navigation.goBack()}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#f1c40f" style={{ flex: 1 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.sugestaoCard}>
            <Text style={styles.sugestaoLabel}>
              Valor disponível para metas este mês:
            </Text>
            <Text style={styles.sugestaoValor}>
              {sugestao.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </Text>
            <AjusteMesAnterior valorAjuste={ajuste} />
            <Text style={styles.valorRestanteGeral}>
              Restante para distribuir:{" "}
              {valorRestanteGeral.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </Text>
          </View>

          <Text style={styles.instrucao}>
            Distribua o valor entre seus objetivos:
          </Text>

          {metas.length > 0 ? (
            <FlatList
              data={metas}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderMetaItem}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.semMetasText}>
              Você não tem metas pendentes para distribuir.
            </Text>
          )}

          <View style={styles.footer}>
            <Text style={styles.totalLabel}>
              Total Distribuído:
              <Text
                style={{
                  color: totalDistribuido > sugestao ? "#e74c3c" : "#2ecc71",
                  fontWeight: "bold",
                }}
              >
                {" "}
                {totalDistribuido.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </Text>
              /{" "}
              {sugestao.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </Text>
            <TouchableOpacity
              style={[
                styles.button,
                (totalDistribuido === 0 || totalDistribuido > sugestao) &&
                  styles.buttonDisabled,
              ]}
              onPress={handleSalvarDistribuicao}
              disabled={totalDistribuido === 0 || totalDistribuido > sugestao}
            >
              <Text style={styles.textButton}>Salvar Distribuição</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
      <CustomBottomTab />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2c2c2c",
  },
  content: {
    padding: width * 0.05,
    paddingBottom: height * 0.15,
  },
  sugestaoCard: {
    backgroundColor: "#393939",
    borderRadius: 15,
    padding: width * 0.05,
    marginBottom: height * 0.03,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sugestaoLabel: {
    fontFamily: "Poppins-Regular",
    color: "#BDC3C7",
    fontSize: getResponsiveFontSize(14),
    textAlign: "center",
  },
  sugestaoValor: {
    fontFamily: "Poppins-Bold",
    color: "#f1c40f",
    fontSize: getResponsiveFontSize(26),
    marginTop: height * 0.005,
    textAlign: "center",
  },
  valorRestanteGeral: {
    fontFamily: "Poppins-Medium",
    color: "#95a5a6",
    fontSize: getResponsiveFontSize(13),
    marginTop: height * 0.015,
    textAlign: "center",
  },
  ajusteContainer: {
    borderTopWidth: 1,
    borderTopColor: "#4a545e",
    marginTop: height * 0.015,
    paddingTop: height * 0.01,
    width: "100%",
    alignItems: "center",
  },
  ajusteTexto: {
    fontFamily: "Poppins-Regular",
    color: "#BDC3C7",
    fontSize: getResponsiveFontSize(12),
  },
  ajusteValor: {
    fontFamily: "Poppins-Bold",
    fontSize: getResponsiveFontSize(15),
    marginTop: 2,
  },
  instrucao: {
    fontFamily: "Poppins-Medium",
    color: "#ecf0f1",
    fontSize: getResponsiveFontSize(16),
    marginBottom: height * 0.025,
    textAlign: "center",
  },
  semMetasText: {
    fontFamily: "Poppins-Regular",
    color: "#95a5a6",
    fontSize: getResponsiveFontSize(15),
    textAlign: "center",
    marginTop: height * 0.05,
  },
  metaContainer: {
    backgroundColor: "#3d3d3d",
    borderRadius: 12,
    padding: width * 0.04,
    marginBottom: height * 0.02,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  metaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: height * 0.01,
  },
  metaTitle: {
    fontFamily: "Poppins-Bold",
    color: "#f1c40f",
    fontSize: getResponsiveFontSize(16),
    flex: 1,
    marginRight: 10,
  },
  metaValores: {
    fontFamily: "Poppins-Regular",
    color: "#BDC3C7",
    fontSize: getResponsiveFontSize(12),
  },
  progressBarContainer: {
    height: height * 0.008,
    backgroundColor: "#555",
    borderRadius: 4,
    marginBottom: height * 0.015,
    overflow: "hidden",
    position: "relative",
  },
  progressOverlay: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(46, 204, 113, 0.5)",
    borderRadius: 4,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: height * 0.005,
    flexWrap: "wrap",
  },
  restanteText: {
    fontFamily: "Poppins-Regular", 
    color: "#95a5a6",
    fontSize: getResponsiveFontSize(13),
    flexShrink: 1, 
    marginRight: width * 0.03, 
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2c2c2c",
    borderRadius: 8,
    paddingHorizontal: width * 0.03,
    borderWidth: 1,
    borderColor: "#555",
    flexGrow: 1, 
    minWidth: width * 0.3, 
  },
  currencySymbol: {
    fontFamily: "Poppins-Regular",
    color: "#BDC3C7",
    fontSize: getResponsiveFontSize(14),
    marginRight: 5,
  },
  input: {
    color: "white",
    fontFamily: "Poppins-Medium",
    fontSize: getResponsiveFontSize(15),
    flex: 1,
    height: height * 0.05,
    textAlign: "right",
  },
  footer: {
    marginTop: height * 0.04,
    alignItems: "center",
  },
  totalLabel: {
    fontFamily: "Poppins-Medium",
    color: "#BDC3C7",
    fontSize: getResponsiveFontSize(15),
    marginBottom: height * 0.02,
  },
  button: {
    backgroundColor: "#f1c40f",
    paddingVertical: height * 0.018,
    width: "100%",
    alignItems: "center",
    borderRadius: 15,
  },
  buttonDisabled: {
    backgroundColor: "#5e5b4a",
    opacity: 0.7,
  },
  textButton: {
    fontSize: getResponsiveFontSize(16),
    fontFamily: "Poppins-Bold",
    color: "#2c2c2c",
  },
});
