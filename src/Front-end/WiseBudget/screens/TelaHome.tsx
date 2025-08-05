import { StyleSheet, SafeAreaView, View, Text, FlatList, TouchableOpacity } from "react-native";
import { Header } from "../components/header";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import CustomBottomTab from "../components/CustomBottomTab";
import { Balanço } from "../components/balanco";
import { PieChart } from 'react-native-chart-kit'
import { ComponentType } from 'react';
import { IconProps } from '@expo/vector-icons/build/createIconSet';

type IconComponentType = ComponentType<IconProps<keyof typeof FontAwesome.glyphMap>>;

interface AtalhoItemProps {
  title: string;
  iconName: string;
  iconComponent: IconComponentType;
}

export default function TelaHome() {

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

  const atalhosData = [
    {
      id: '1',
      title: 'Relatório',
      iconName: 'signal',
      iconComponent: FontAwesome,
    },
    {
      id: '2',
      title: 'Pesquisa',
      iconName: 'search',
      iconComponent: FontAwesome,
    },
    {
      id: '3',
      title: '',
      iconName: 'plus-circle',
      iconComponent: FontAwesome,
    },
  ];
  
  const AtalhoItem = ({ title, iconName, iconComponent: Icon } : AtalhoItemProps) => (
    <TouchableOpacity style={styles.atalhoItem}>
      <Icon name={iconName} size={32} color="#f1c40f" />
      <Text style={styles.atalhoText}>{title}</Text>
    </TouchableOpacity>
  );
  

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
          data={atalhosData}
          renderItem={({ item }) => (
            <AtalhoItem
              title={item.title}
              iconName={item.iconName}
              iconComponent={item.iconComponent}
            />
          )}
          keyExtractor={(item) => item.id}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{marginTop: 10}}
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
  atalhosTitle: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Poppins-Regular',  
    marginBottom: 10,
  },
  atalhoItem: {
    backgroundColor: '#393939',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 19,
    width: 110, 
    height: 110, 
  },
  atalhoText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginTop: 8,
    textAlign: 'center',
  },
});
