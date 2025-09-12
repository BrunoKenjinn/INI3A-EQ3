import { SafeAreaView, Text, TouchableOpacity, View, StyleSheet, Dimensions } from 'react-native'
import { Header } from '../components/header'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import CustomBottomTab from '../components/CustomBottomTab';

const { width, height } = Dimensions.get("window");

const getResponsiveFontSize = (size: number) => {
  const scale = width / 375;
  return Math.round(size * scale);
};



export default function TelaConfigs({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#2c2c2c', height: '100%', width: '100%' }}>
      <View style={{ flex: 1, position: 'relative' }}>
        <Header
          leftIconName="arrow-left"
          leftIconColor="#f1c40f"
          leftIconSize={24}
          leftIconComponent={FontAwesome5}
          title="Configs"
          rightIconName="sliders-h"
          rightIconColor="#f1c40f"
          rightIconSize={24}
          rightIconComponent={FontAwesome5}
        />


        <View style={{ position: 'center', bottom: 0, left: 0, right: 0, backgroundColor: '#2c2c2c' }}>
          <View style={styles.botoes}>
            <TouchableOpacity style={styles.botao}>
              <View style={styles.iconContainer}>
                <FontAwesome5 name="adjust" size={width * 0.05} color="#f1c40f" />
              </View>
              <Text style={styles.text}>Tema</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate("TelaConfigsNotificacoes")}>
              <View style={styles.iconContainer}>
                <FontAwesome5 name="bell" size={width * 0.05} color="#f1c40f" />
              </View>
              <Text style={styles.text}>Configs De Notificacoes</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botao}>
              <View style={styles.iconContainer}>
                <FontAwesome5 name="question-circle" size={width * 0.05} color="#f1c40f" />
              </View>
              <Text style={styles.text}>Ajuda e Suporte</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botao}>
              <View style={styles.iconContainer}>
                <FontAwesome5 name="info-circle" size={width * 0.05} color="#f1c40f" />
              </View>
              <Text style={styles.text}>Sobre o App</Text>
            </TouchableOpacity>
          </View>
        </View>

        <CustomBottomTab />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  botoes: {
    flexDirection: "column",
    paddingTop: height * 0.05,
    paddingHorizontal: width * 0.08,
    gap: height * 0.03,
  },
  botao: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: height * 0.02,
  },
  iconContainer: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: (width * 0.12) / 2,
    borderWidth: 1.5,
    borderColor: "#f1c40f",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginLeft: width * 0.04,
    fontSize: getResponsiveFontSize(16),
    color: "#f1c40f",
    fontFamily: "Poppins-Regular",
  },
});

