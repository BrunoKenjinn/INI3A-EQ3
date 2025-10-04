import React, { useState, useCallback, useMemo } from 'react';
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
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header } from '../components/header';
import CustomBottomTab from '../components/CustomBottomTab';
import useApi from '../hooks/useApi';

const { width, height } = Dimensions.get('window');

const getResponsiveFontSize = (size: number) => {
  const scale = width / 375;
  return Math.round(size * scale);
};

interface MetaType {
  id: number;
  nome: string;
  valor_alvo: number;
  valor_atual: number;
  goalAmount: string; 
  subtitle: string;
}

const AjusteMesAnterior = ({ valorAjuste }) => {
  if (!valorAjuste || valorAjuste === 0) {
    return null; 
  }

  const isBonus = valorAjuste > 0;
  const cor = isBonus ? '#2ecc71' : '#e74c3c'; 
  const texto = isBonus ? 'Bônus por economia no mês anterior:' : 'Ajuste por gastos extras no mês anterior:';
  const valorFormatado = valorAjuste.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

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
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const headers = { Authorization: `Bearer ${token}` };

      const sugestaoResponse = await axios.get(`${url}/api/metas/sugestao-investimento`, { headers });
      setSugestao(sugestaoResponse.data.valor_sugerido || 0);
      setAjuste(sugestaoResponse.data.ajuste_mes_anterior || 0); 

      const metasResponse = await axios.get(`${url}/api/metas`, { headers });
      setMetas(metasResponse.data);
    } catch (error) {
      console.error('Erro ao buscar dados:', error.response?.data || error.message);
      Alert.alert('Erro', 'Não foi possível carregar os dados para distribuição.');
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
    const valorLimpo = valor.replace(/[^0-9.]/g, '');
    setDepositos((prev) => ({
      ...prev,
      [metaId]: valorLimpo,
    }));
  };

  const totalDistribuido = useMemo(() => {
    return Object.values(depositos).reduce((acc, valor) => acc + (parseFloat(valor) || 0), 0);
  }, [depositos]);

  const handleSalvarDistribuicao = async () => {
    const depositosParaEnviar = Object.entries(depositos)
      .map(([meta_id, valor]) => ({
        meta_id: parseInt(meta_id, 10),
        valor: parseFloat(valor),
      }))
      .filter(deposito => deposito.valor > 0);

    if (depositosParaEnviar.length === 0) {
      Alert.alert('Atenção', 'Você não distribuiu nenhum valor.');
      return;
    }

    if (totalDistribuido > sugestao) {
        Alert.alert('Valor Excedido', `O total distribuído (R$ ${totalDistribuido.toFixed(2)}) excede o valor disponível (R$ ${sugestao.toFixed(2)}).`);
        return;
    }


    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('auth_token');
      await axios.post(
        `${url}/api/metas/depositar`,
        { depositos: depositosParaEnviar },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Sucesso!', 'Valores distribuídos com sucesso.');
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar distribuição:', error.response?.data || error.message);
      Alert.alert('Erro', 'Não foi possível salvar a distribuição.');
    } finally {
      setLoading(false);
    }
  };
  
  const renderMetaItem = ({ item }: { item: MetaType }) => (
    <View style={styles.metaContainer}>
      <Text style={styles.metaTitle}>{item.subtitle}</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.currencySymbol}>R$</Text>
        <TextInput
          style={styles.input}
          placeholder="0.00"
          placeholderTextColor="#BDC3C7"
          keyboardType="numeric"
          value={depositos[item.id] || ''}
          onChangeText={(valor) => handleDepositoChange(item.id, valor)}
        />
      </View>
    </View>
  );

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
            <Text style={styles.sugestaoLabel}>Valor disponível para metas:</Text>
            <Text style={styles.sugestaoValor}>
              {sugestao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </Text>
            <AjusteMesAnterior valorAjuste={ajuste} />
          </View>

          <Text style={styles.instrucao}>Distribua o valor entre seus objetivos:</Text>

          <FlatList
            data={metas}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderMetaItem}
            scrollEnabled={false} 
          />

          <View style={styles.footer}>
            <Text style={styles.totalLabel}>
                Total Distribuído: 
                <Text style={{color: totalDistribuido > sugestao ? '#e74c3c' : 'white'}}>
                    {totalDistribuido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </Text>
            </Text>
            <TouchableOpacity 
                style={[styles.button, (totalDistribuido === 0 || totalDistribuido > sugestao) && styles.buttonDisabled]} 
                onPress={handleSalvarDistribuicao}
                disabled={totalDistribuido === 0 || totalDistribuido > sugestao}
                >
              <Text style={styles.textButton}>Salvar</Text>
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
    backgroundColor: '#2c2c2c',
  },
  content: {
    padding: width * 0.06,
    paddingBottom: height * 0.15,
  },
  sugestaoCard: {
    backgroundColor: '#3d3d3d',
    borderRadius: 15,
    padding: width * 0.05,
    alignItems: 'center',
    marginBottom: height * 0.03,
  },
  sugestaoLabel: {
    fontFamily: 'Poppins-Regular',
    color: '#BDC3C7',
    fontSize: getResponsiveFontSize(14),
  },
  sugestaoValor: {
    fontFamily: 'Poppins-Bold',
    color: '#f1c40f',
    fontSize: getResponsiveFontSize(28),
    marginTop: height * 0.01,
  },
  ajusteContainer: {
    borderTopWidth: 1,
    borderTopColor: '#4a545e',
    marginTop: height * 0.02,
    paddingTop: height * 0.015,
    width: '100%',
    alignItems: 'center',
  },
  ajusteTexto: {
    fontFamily: 'Poppins-Regular',
    color: '#BDC3C7',
    fontSize: getResponsiveFontSize(12),
  },
  ajusteValor: {
    fontFamily: 'Poppins-Bold',
    fontSize: getResponsiveFontSize(16),
    marginTop: 2,
  },
  instrucao: {
    fontFamily: 'Poppins-Medium',
    color: 'white',
    fontSize: getResponsiveFontSize(16),
    marginBottom: height * 0.02,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#3d3d3d',
    borderRadius: 10,
    padding: width * 0.04,
    marginBottom: height * 0.015,
  },
  metaTitle: {
    fontFamily: 'Poppins-Medium',
    color: 'white',
    fontSize: getResponsiveFontSize(15),
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2c2c2c',
    borderRadius: 8,
    paddingHorizontal: width * 0.03,
    borderWidth: 1,
    borderColor: '#4a545e',
  },
  currencySymbol: {
    fontFamily: 'Poppins-Regular',
    color: '#BDC3C7',
    fontSize: getResponsiveFontSize(14),
    marginRight: 5,
  },
  input: {
    color: 'white',
    fontFamily: 'Poppins-Medium',
    fontSize: getResponsiveFontSize(14),
    width: width * 0.25,
    height: height * 0.05,
    textAlign: 'right',
  },
  footer: {
    marginTop: height * 0.03,
    alignItems: 'center',
  },
  totalLabel: {
      fontFamily: 'Poppins-Regular',
      color: '#BDC3C7',
      fontSize: getResponsiveFontSize(14),
      marginBottom: height * 0.02,
  },
  button: {
    backgroundColor: '#f1c40f',
    paddingVertical: height * 0.018,
    width: '100%',
    alignItems: 'center',
    borderRadius: 15,
  },
  buttonDisabled: {
    backgroundColor: '#5e5b4a'
  },
  textButton: {
    fontSize: getResponsiveFontSize(16),
    fontFamily: 'Poppins-Bold',
    color: '#2c2c2c',
  },
});