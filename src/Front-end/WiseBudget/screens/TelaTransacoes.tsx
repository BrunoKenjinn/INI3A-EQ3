import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  SectionList,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import { TransacaoCard } from "../components/transacaoCard";
import { Header } from "../components/header";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import CustomBottomTab from "../components/CustomBottomTab";
import { Picker } from "@react-native-picker/picker";
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import useApi from "../hooks/useApi";

const { width, height } = Dimensions.get("window");

const getResponsiveFontSize = (size: number) => {
  const scale = width / 375;
  return Math.round(size * scale);
};

interface Transacao {
  id: number;
  descricao: string;
  valor: number;
  data: string;
  tipo: "entrada" | "saida";
  recorrente: boolean;
  created_at: string;
  icone: React.ComponentProps<typeof FontAwesome5>["name"];
  cor: string;
  categoria_id: number;
}

export default function TelaTransacoes({ navigation }) {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroPeriodo, setFiltroPeriodo] = useState("semana");
  const [filtroTipo, setFiltroTipo] = useState("todos");

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}`;
  };
  const parseDateYMD = (dateString: string) => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day); 
  };

  useFocusEffect(
    useCallback(() => {
      const carregarTransacoes = async () => {
        setLoading(true);
        try {
          let { url } = useApi();
          const token = await AsyncStorage.getItem("auth_token");
          const response = await axios.get(
            url + `/api/transacoes?periodo=${filtroPeriodo}&tipo=${filtroTipo}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setTransacoes(response.data);
        } catch (error) {
          console.error(
            "Erro ao buscar transações:",
            error.response?.data || error.message
          );
          Alert.alert("Erro", "Erro ao buscar transações");
        } finally {
          setLoading(false);
        }
      };

      carregarTransacoes();
    }, [filtroPeriodo, filtroTipo])
  );

  const agruparTransacoes = () => {
    if (transacoes.length === 0) return [];

    const grupos: { [key: string]: Transacao[] } = {
      Hoje: [],
      Ontem: [],
      "Esta Semana": [],
      "Este Mês": [],
      "Mais Antigas": [],
    };

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const ontem = new Date();
    ontem.setHours(0, 0, 0, 0);
    ontem.setDate(hoje.getDate() - 1);
    const inicioSemana = new Date();
    inicioSemana.setHours(0, 0, 0, 0);
    inicioSemana.setDate(hoje.getDate() - hoje.getDay());

    transacoes.forEach((transacao) => {
      const dataTransacao = parseDateYMD(transacao.data);
      dataTransacao.setHours(0, 0, 0, 0);

      if (dataTransacao.getTime() === hoje.getTime()) {
        grupos["Hoje"].push(transacao);
      } else if (dataTransacao.getTime() === ontem.getTime()) {
        grupos["Ontem"].push(transacao);
      } else if (dataTransacao >= inicioSemana) {
        grupos["Esta Semana"].push(transacao);
      } else if (
        dataTransacao.getMonth() === hoje.getMonth() &&
        dataTransacao.getFullYear() === hoje.getFullYear()
      ) {
        grupos["Este Mês"].push(transacao);
      } else {
        grupos["Mais Antigas"].push(transacao);
      }
    });

    return Object.keys(grupos)
      .map((key) => ({ title: key, data: grupos[key] }))
      .filter((grupo) => grupo.data.length > 0);
  };

  const dadosAgrupados = agruparTransacoes();

  return (
    <SafeAreaView style={styles.container}>
      <Header
        leftIconName="arrow-left"
        leftIconColor="#f1c40f"
        leftIconSize={width * 0.06}
        leftIconComponent={FontAwesome5}
        title="Transações"
        rightIconName="bell"
        rightIconColor="#f1c40f"
        rightIconSize={width * 0.06}
        rightIconComponent={FontAwesome5}
        onLeftPress={() => navigation.goBack()}
        onRightPress={() => navigation.navigate('TelaNotificacoes')}
      />

      <View style={styles.filtersContainer}>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={filtroPeriodo}
            onValueChange={(itemValue) => setFiltroPeriodo(itemValue)}
            style={styles.picker}
            dropdownIconColor="#f1c40f"
          >
            <Picker.Item label="Esta Semana" value="semana" />
            <Picker.Item label="Este Mês" value="mes" />
          </Picker>
        </View>

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={filtroTipo}
            onValueChange={(itemValue) => setFiltroTipo(itemValue)}
            style={styles.picker}
            dropdownIconColor="#f1c40f"
          >
            <Picker.Item label="Todos" value="todos" />
            <Picker.Item label="Receitas" value="entrada" />
            <Picker.Item label="Despesas" value="saida" />
            <Picker.Item label="Recorrente" value="recorrente" />
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
            <TransacaoCard
              descricao={item.descricao}
              data={formatDate(item.data)}
              hora={new Date(item.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
              valor={item.valor}
              icone={item.icone}
              cor={item.cor}
              onPress={() =>
                navigation.navigate("TelaEditarTransacoes", { transacao: item })
              }
            />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhuma transação encontrada.</Text>
          }
        />
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
  filtersContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: height * 0.015,
    paddingHorizontal: width * 0.05,
  },
  pickerWrapper: {
    flex: 1,
    backgroundColor: "#393939",
    borderRadius: 8,
    height: height * 0.06,
    justifyContent: "center",
    marginHorizontal: width * 0.01,
  },
  picker: {
    color: "#ffffff",
    backgroundColor: "#393939",
  },
  sectionHeader: {
    color: "#f1c40f",
    fontSize: getResponsiveFontSize(16),
    fontFamily: "Poppins-Bold",
    marginTop: height * 0.02,
    marginBottom: height * 0.01,
  },
  emptyText: {
    color: "#a3a3a3",
    textAlign: "center",
    marginTop: height * 0.1,
    fontSize: getResponsiveFontSize(14),
    fontFamily: "Poppins-Regular",
  },
  listContentContainer: {
    paddingHorizontal: width * 0.05,
    paddingBottom: height * 0.1,
  },
});
