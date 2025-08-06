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
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

type IconComponentType = ComponentType<IconProps<keyof typeof FontAwesome.glyphMap>>;

export default function TelaHome({ navigation }) {
  const [atalhos, setAtalhos] = useState([]);
  const [title, setTitle] = useState(''); 
  const atalhosComAdicionar = [...atalhos, { id:'adicionar', nome: 'Adicionar', icone: 'plus' }];


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

        carregarAtalhos();

        return () => { };
    }, [])
);

  const handleDelete = async (nome: string) => {
    Alert.alert(
      "Excluir Atalho",
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


  const data = [
    {
      name: "Valorant",
      population: 70,
      color: "rgba(131, 167, 234, 1)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
    {
      name: "Restaurante",
      population: 30,
      color: "#F00",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    }
  ];

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
          <View style={{width: '100%', backgroundColor: '#393939', borderRadius: 20, marginTop: 10}}>
          <PieChart
              data={data}
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
          <View style={{width: '100%', backgroundColor: '#EAE3C9', borderRadius: 20, marginTop: 10, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20}}>
            <View style={{display: 'flex', flexDirection: 'row', gap: 10}}>
              <View style={{height: 50, width: 50, borderRadius: 10, backgroundColor: '#B1B1B1'}}></View>
              <View>
                <Text style={{fontFamily: 'Poppins-Bold'}}>Salário</Text>
                <Text style={{fontFamily: 'Poppins-Regular', color: '#B7B7B7'}}>12:34 - Abril 12</Text>
              </View>
            </View>
            <Text style={{fontFamily: 'Poppins-Bold'}}>R$1.234,56</Text>
          </View>
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
                          if (item.id === 'adicionar') {
                            navigation.navigate('TelaAdicionarAtalho');
                          } else {
                            navigation.navigate(item.rota);
                          }
                        }}
                        onLongPress={() => {
                        if (item.id !== 'adicionar') {
                          handleDelete(item.nome); 
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
