import { StyleSheet, SafeAreaView, View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { Header } from "../components/header";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import CustomBottomTab from "../components/CustomBottomTab";
import { Balanço } from "../components/balanco";
import { PieChart } from 'react-native-chart-kit'
import { ComponentType, useCallback, useState } from 'react';
import { IconProps } from '@expo/vector-icons/build/createIconSet';
import { Atalho } from "../components/atalho";
import { TransacaoCard } from "../components/transacaoCard";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

type IconComponentType = ComponentType<IconProps<keyof typeof FontAwesome.glyphMap>>;
interface ChartDataItem {
  name: string;
  population: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}

export default function TelaHome({ navigation }) {
  const [atalhos, setAtalhos] = useState([]);
  const [chartData, setChartData] = useState<ChartDataItem[]>([
    {
      name: "Carregando...",
      population: 100,
      color: "#5A5A5A",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    }
  ]);
  const [title, setTitle] = useState(''); 
  const atalhosComAdicionar = [...atalhos, { id:0, nome: 'Adicionar', icone: 'plus', rota: 'TelaAdicionarAtalho' }];

  interface Entrada {
    id: number;
    descricao: string;
    valor: number;
    data: string;
    icone: React.ComponentProps<typeof FontAwesome>['name']; 
    cor: string;
  }


  const [entradasHoje, setEntradasHoje] = useState<Entrada[]>([]);


  useFocusEffect(
    useCallback(() => {
        const carregarAtalhos = async () => {
            try {
                const token = await AsyncStorage.getItem('auth_token');
                const response = await axios.get('http://localhost:8000/api/atalhos', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setAtalhos(response.data);
            } catch (error) {
                console.error('Erro ao buscar atalhos:', error.response?.data || error.message);
            }
        };

        const carregarDadosGrafico = async () => {
          try {
            const token = await AsyncStorage.getItem('auth_token');
            const response = await axios.get('http://localhost:8000/api/gastos-por-categoria?periodo=hoje', {
              headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data && response.data.length > 0) {
              setChartData(response.data);
            } else {
              setChartData([
                {
                  name: "Nenhum Gasto",
                  population: 100, 
                  color: "#5A5A5A", 
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 15
                }
              ]);
            }

          } catch (error) {
            console.error('Erro ao buscar dados do gráfico:', error.response?.data || error.message);
          }
        };

        const carregarEntradas = async () => {
          try {
            const token = await AsyncStorage.getItem('auth_token');
            const response = await axios.get('http://localhost:8000/api/entradas-hoje', {
              headers: { Authorization: `Bearer ${token}` }
            });
            setEntradasHoje(response.data);
          } catch (error) {
            console.error('Erro ao buscar entradas:', error.response?.data || error.message);
          }
        };

        carregarAtalhos();
        carregarDadosGrafico();
        carregarEntradas();

        return () => { };
    }, [])
);

  const handleDelete = async (id: number) => {
    Alert.alert(
      "Excluir Flho",
      "Tem certeza que deseja excluir este atalho?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("auth_token");
              await axios.delete(`http://localhost:8000/api/atalhos/${id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
            } catch (error) {
              console.error("Erro ao excluir atalho:", error.response?.data || error.message);
            }
          },
          style: "destructive",
        },
      ]
    );
  };


  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    strokeWidth: 2  ,
    barPercentage: 0.5,
    useShadowColorFromDataset: false
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Header 
          leftIconName="bars"
          leftIconColor="#f1c40f"
          leftIconSize={24}
          leftIconComponent={FontAwesome5}
          title="Olá, Bem vindo de volta!"
          rightIconName="user"
          rightIconColor="#f1c40f"
          rightIconSize={24}
          rightIconComponent={FontAwesome5}
        />
        <Balanço credito="200" debito="100"/>

        <View style={{width: '100%'}}>
          <Text style={{color: 'white', fontFamily: 'Poppins-Regular'}}>
            Gráfico de Setores
          </Text>
          <View style={{width: '100%', backgroundColor: '#393939', borderRadius: 20, marginTop: 10, alignItems: "center"}}>
          <PieChart
              data={chartData}
              width={400}
              height={150}
              chartConfig={chartConfig} 
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={"-20"}
              center={[0,0]}
            />
          </View>
        </View>
        
        <View style={{width: '100%', marginTop: 20}}>
          <Text style={{color: 'white', fontFamily: 'Poppins-Regular'}}>
            Sua carteira
          </Text>

          <FlatList
            data={entradasHoje}
            keyExtractor={(item) => item.id.toString()}
            style={{maxHeight: 200}} 
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TransacaoCard
                descricao={item.descricao}
                valor={item.valor}
                hora={new Date(item.data).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                icone={item.icone}
                cor={item.cor}
              />
            )}
          />
        </View>

        <View style={{width: '100%', marginTop: 20}}>
          <Text style={{color: 'white', fontFamily: 'Poppins-Regular'}}>
            Atalhos
          </Text>
          
          <FlatList
            data={atalhosComAdicionar}
            keyExtractor={(item) => item.id.toString()}
            horizontal={true}

            renderItem={({ item }) => (
                <View style={{ marginRight: 12 }}>
                    <Atalho
                        iconName={item.icone}
                        text={item.nome}
                        onPress={() => {
                            navigation.navigate(item.rota);
                        }}
                        onLongPress={() => {
                        if (item.id !== 0) {
                          handleDelete(item.id); 
                        }
                        }}
                    />
                </View>
            )}
            contentContainerStyle={{ paddingVertical: 10 }}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </View>

      <View style={styles.tabContainer}>
        <CustomBottomTab />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c2c2c', 
  },
  content: {
    flex: 1,
    padding: 20,
  },
  tabContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
