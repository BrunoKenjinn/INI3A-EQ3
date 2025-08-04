import { StyleSheet, SafeAreaView, View, Text } from "react-native";
import { Header } from "../components/header";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import CustomBottomTab from "../components/CustomBottomTab";
import { Balanço } from "../components/balanco";
import {} from 'react-native-svg'

export default function TelaHome() {
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
        <Balanço credito="234" debito="123"/>

        <View style={{width: '100%'}}>
          <Text style={{color: 'white', fontFamily: 'Poppins-Regular'}}>
            Gráfico de Setores
          </Text>
          <View style={{width: '100%', backgroundColor: '#393939', height: 10}}>
        
          </View>
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
