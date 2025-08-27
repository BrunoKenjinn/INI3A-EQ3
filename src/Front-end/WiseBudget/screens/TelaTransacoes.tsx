import { View, Text, StyleSheet, SafeAreaView, SectionList, ActivityIndicator, Alert } from "react-native";
import { TransacaoCard } from "../components/transacaoCard";
import { Header } from '../components/header';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import CustomBottomTab from "../components/CustomBottomTab";
import { Picker } from '@react-native-picker/picker';
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import useApi from "../hooks/useApi";

interface Transacao {
  id: number;
  descricao: string;
  valor: number;
  data: string;
  tipo: 'entrada' | 'saida';
  icone: React.ComponentProps<typeof FontAwesome5>['name'];
  cor: string;
}

export default function TelaTransacoes() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [filtroPeriodo, setFiltroPeriodo] = useState('semana');
  const [filtroTipo, setFiltroTipo] = useState('todos');

  useFocusEffect(
    useCallback(() => {
      const carregarTransacoes = async () => {
        setLoading(true);
        try {
          let {url} = useApi();
          const token = await AsyncStorage.getItem('auth_token');
          const response = await axios.get(url + `/api/transacoes?periodo=${filtroPeriodo}&tipo=${filtroTipo}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setTransacoes(response.data);
        } catch (error) {
          console.error('Erro ao buscar transações:', error.response?.data || error.message);
          Alert.alert("Erro","Erro ao buscar transações")
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
      'Hoje': [],
      'Ontem': [],
      'Esta Semana': [],
      'Este Mês': [],
      'Mais Antigas': [],
    };

    const hoje = new Date();
    const ontem = new Date();
    ontem.setDate(hoje.getDate() - 1);

    transacoes.forEach(transacao => {
      const dataTransacao = new Date(transacao.data);
      
      if (dataTransacao.toDateString() === hoje.toDateString()) {
        grupos['Hoje'].push(transacao);
      } else if (dataTransacao.toDateString() === ontem.toDateString()) {
        grupos['Ontem'].push(transacao);
      } else if (dataTransacao.getTime() >= new Date().setDate(new Date().getDate() - 7)) {
        grupos['Esta Semana'].push(transacao);
      } else if (dataTransacao.getMonth() === hoje.getMonth() && dataTransacao.getFullYear() === hoje.getFullYear()) {
        grupos['Este Mês'].push(transacao);
      } else {
        grupos['Mais Antigas'].push(transacao);
      }
    });

    return Object.keys(grupos)
      .map(key => ({ title: key, data: grupos[key] }))
      .filter(grupo => grupo.data.length > 0); 
  };

  const dadosAgrupados = agruparTransacoes();

  return (
    <SafeAreaView style={styles.container}>
      <Header
        leftIconName="arrow-left"
        leftIconColor="#f1c40f"
        leftIconSize={24}
        leftIconComponent={FontAwesome5}
        title="Transações"
        rightIconName="bell"
        rightIconColor="#f1c40f"
        rightIconSize={24}
        rightIconComponent={FontAwesome5}
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
            style={styles.picker} // O estilo do picker em si
            dropdownIconColor="#f1c40f"
        >
            <Picker.Item label="Todos" value="todos" />
            <Picker.Item label="Entradas" value="entrada" />
            <Picker.Item label="Saídas" value="saida" />
            <Picker.Item label="Recorrente" value="recorrente"/>
        </Picker>
    </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#f1c40f" style={{ flex: 1 }} />
      ) : (
        <SectionList
          sections={dadosAgrupados}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TransacaoCard
              descricao={item.descricao}
              hora={new Date(item.data).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              valor={item.valor}
              icone={item.icone}
              cor={item.cor}
            />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma transação encontrada.</Text>}
        />
      )}

      <CustomBottomTab />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2c2c2c",
    padding: 16,
  },
  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    columnGap: 15,
  },
   pickerWrapper: {
        flex: 1, 
        backgroundColor: '#393939',
        borderRadius: 8,
        height: 50, 
        justifyContent: 'center', 
        marginHorizontal: 5,
    },
  picker: {
    color: '#f1c40f',
  },
  sectionHeader: {
    color: "#f1c40f",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    paddingLeft: 10,
  },
  emptyText: {
      color: '#a3a3a3',
      textAlign: 'center',
      marginTop: 50,
      fontSize: 16,
  }
});
