import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Alert,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Header } from "../components/header";
import CustomBottomTab from "../components/CustomBottomTab";
import { useState } from "react";
import useApi from "../hooks/useApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const { width, height } = Dimensions.get("window");
const getResponsiveFontSize = (size: number) => {
  const scale = width / 375;
  return Math.round(size * scale);
};

export default function TelaAdicionarMeta({ navigation }) {
  const [nome, setNome] = useState("");
  const [valorAlvo, setValorAlvo] = useState("");
  const [dataLimite, setDataLimite] = useState("");
  const [loading, setLoading] = useState(false);
  const { url } = useApi();

  const handleDateChange = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    let formatted = cleaned;
    if (cleaned.length > 2) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    }
    if (cleaned.length > 4) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(
        2,
        4
      )}/${cleaned.slice(4, 8)}`;
    }
    setDataLimite(formatted);
  };

  const handleCriarMeta = async () => {
    if (!nome.trim() || !valorAlvo.trim()) {
      Alert.alert("Erro", "Por favor, preencha o título e o valor total.");
      return;
    }

    let dataISO = null;
    if (dataLimite) {
      const dateParts = dataLimite.split("/");
      if (dateParts.length === 3) {
        dataISO = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
      } else {
        Alert.alert("Data Inválida", "Use o formato DD/MM/AAAA para a data.");
        return;
      }
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("auth_token");
      const metaData = {
        nome,
        valor_alvo: parseFloat(valorAlvo.replace(",", ".")),
        data_limite: dataISO,
      };

      await axios.post(`${url}/api/metas`, metaData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Alert.alert("Sucesso", "Meta criada com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.error(
        "Erro ao criar meta:",
        error.response?.data || error.message
      );
      Alert.alert("Erro", "Não foi possível criar a meta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#2c2c2c" }}>
      <Header
        leftIconName="arrow-left"
        leftIconColor="#f1c40f"
        leftIconSize={width * 0.06}
        leftIconComponent={FontAwesome5}
        title="Adicionar Meta"
        rightIconName=""
        rightIconColor="#f1c40f"
        rightIconSize={width * 0.06}
        rightIconComponent={FontAwesome5}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Criar nova meta</Text>
        <Text style={styles.subtitle}>
          Defina seu próximo objetivo financeiro.
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Título da Meta</Text>
          <TextInput
            placeholder="Ex: PC Gamer"
            placeholderTextColor="#BDC3C7"
            style={styles.input}
            value={nome}
            onChangeText={setNome}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Valor Total (R$)</Text>
          <TextInput
            placeholder="Ex: 4000,00"
            placeholderTextColor="#BDC3C7"
            style={styles.input}
            keyboardType="numeric"
            value={valorAlvo}
            onChangeText={setValorAlvo}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Data Limite (Opcional)</Text>
          <TextInput
            placeholder="DD/MM/AAAA"
            placeholderTextColor="#BDC3C7"
            style={styles.input}
            keyboardType="number-pad"
            maxLength={10}
            value={dataLimite}
            onChangeText={handleDateChange}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleCriarMeta}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#2c2c2c" />
          ) : (
            <Text style={styles.buttonText}>Criar Meta</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
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
    paddingHorizontal: width * 0.06,
    paddingBottom: height * 0.15,
  },
  title: {
    fontSize: getResponsiveFontSize(20),
    fontFamily: "Poppins-Bold",
    color: "white",
  },
  subtitle: {
    fontSize: getResponsiveFontSize(12),
    color: "#BDC3C7",
    fontFamily: "Poppins-Regular",
    marginBottom: height * 0.03,
  },
  inputGroup: {
    marginTop: height * 0.02,
  },
  label: {
    fontSize: getResponsiveFontSize(12),
    color: "#BDC3C7",
    marginBottom: height * 0.01,
    fontFamily: "Poppins-Regular",
  },
  input: {
    color: "white",
    padding: width * 0.03,
    borderColor: "#BDC3C7",
    borderWidth: 1,
    backgroundColor: "#3d3d3d",
    borderRadius: width * 0.02,
    fontFamily: "Poppins-Regular",
    fontSize: getResponsiveFontSize(14),
  },
  button: {
    backgroundColor: "#f1c40f",
    padding: width * 0.04,
    borderRadius: width * 0.03,
    marginTop: height * 0.05,
    alignItems: "center",
  },
  buttonText: {
    textAlign: "center",
    fontSize: getResponsiveFontSize(16),
    fontFamily: "Poppins-Bold",
    color: "#2c2c2c",
  },
});
