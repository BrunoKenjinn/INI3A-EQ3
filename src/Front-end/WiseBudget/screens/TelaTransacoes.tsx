import { View, Text, FlatList, StyleSheet } from "react-native";
import { TransacaoCard } from "../components/transacaoCard";
import { Header } from '../components/header'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import CustomBottomTab from "../components/CustomBottomTab";


const TelaTransacoes = () => {

  const transacoes = [
    {
      descricao: "Pix Cobrança",
      valor: "R$ 123,45",
      hora: "22 Abr 2025\n12:34",
      icone: "arrow-up",
      cor: "#f1c40f"
    },
    {
      descricao: "Pix Cobrança",
      valor: "R$ 123,45",
      hora: "22 Abr 2025\n12:34",
      icone: "arrow-up",
      cor: "#f1c40f"
    },
    {
      descricao: "Pix Cobrança",
      valor: "R$ 123,45",
      hora: "22 Abr 2025\n12:34",
      icone: "arrow-down",
      cor: "#f1c40f"
    },
  ];

  return (
    <View style={styles.container}>

         <Header
                    leftIconName="arrow-left"
                    leftIconColor="#f1c40f"
                    leftIconSize={24}
                    leftIconComponent={FontAwesome5}
                    title=""
                    rightIconName="bell"
                    rightIconColor="#f1c40f"
                    rightIconSize={24}
                    rightIconComponent={FontAwesome5}
                />
      <Text style={styles.semana}>Esta semana</Text>
      <FlatList
        data={transacoes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TransacaoCard
            descricao={item.descricao}
            hora={item.hora}
            valor={item.valor}
            icone={item.icone}
            cor={item.cor}
          />
        )}
      />
      <CustomBottomTab />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e1e",
    padding: 16,
  },
  semana: {
    color: "#FFD700",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#333333",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#FFD700",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  icon: {
    fontSize: 22,
    color: "#000",
  },
  info: {
    flex: 1,
  },
  tipo: {
    color: "#fff",
    fontWeight: "bold",
  },
  nome: {
    color: "#bbb",
    fontSize: 13,
  },
  id: {
    color: "#777",
    fontSize: 11,
    marginTop: 2,
  },
  valorData: {
    alignItems: "flex-end",
  },
  valor: {
    color: "#FFD700",
    fontWeight: "bold",
  },
  data: {
    color: "#999",
    fontSize: 11,
    marginTop: 4,
    textAlign: "right",
  },
});

export default TelaTransacoes;
