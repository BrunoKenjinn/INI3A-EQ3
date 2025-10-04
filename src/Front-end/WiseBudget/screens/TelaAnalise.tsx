import { SafeAreaView, Dimensions, View, Text, FlatList } from "react-native";
import { Header } from "../components/header";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import CustomBottomTab from "../components/CustomBottomTab";
import { Balanço } from "../components/balanco";
import { LineChart } from "react-native-chart-kit";
import { TransacaoCard } from "../components/transacaoCard";

export default function TelaAnalise({navigation}) {
  const { width, height } = Dimensions.get("window");

  const chartConfig = {
    backgroundGradientFrom: "#EAE3C9",
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: "#EAE3C9",
    backgroundGradientToOpacity: 1,
    color: (opacity = 1) => `#34495E`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  };

  const data = {
    labels: ["Dia 1-10", "Dia 11-20", "Dia 21-31"],
    datasets: [
      {
        data: [20, 45, 43],
        color: (opacity = 1) => `#34495E`, // optional
        strokeWidth: 2, // optional
      },
    ],
    legend: [], // optional
  };

  const transacoesDoDia = [
    {
      id: '1', // É importante ter um ID único para cada item da lista
      descricao: 'Compra no supermercado',
      valor: 1000000,
      hora: '4:20',
      icone: 'bug',
      cor: '#f1c40f',
      data: '07/11/2006',
    },
    {
      id: '2',
      descricao: 'Pagamento conta de luz',
      valor: 1000000,
      hora: '4:20',
      icone: 'bug',
      cor: '#f1c40f',
      data: '07/11/2006',
    }
  ];

  const renderItem = ({ item }) => (
    <TransacaoCard
      descricao={item.descricao}
      valor={item.valor}
      hora={item.hora}
      icone={item.icone}
      cor={item.cor}
      data={item.data}
    />
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#2c2c2c" }}>
      <Header
        leftIconName="arrow-left"
        leftIconColor="#f1c40f"
        leftIconSize={width * 0.06}
        leftIconComponent={FontAwesome5}
        title="Analise"
        rightIconName="sliders-h"
        onRightPress={() => navigation.navigate("TelaHome")}
        rightIconColor="#f1c40f"
        rightIconSize={width * 0.06}
        rightIconComponent={FontAwesome5}
        onLeftPress={() => navigation.goBack()}
      />

      <View style={{ alignItems: "center" }}>
        <Balanço debito="123" saldo="333" saldoTotal="222" credito="123" />

        <LineChart
          data={data}
          width={width - width * 0.16}
          height={256}
          verticalLabelRotation={10}
          chartConfig={chartConfig}
          bezier
          style={{ borderRadius: width * 0.05, marginTop: height * 0.02 }}
          withHorizontalLines={false}
        />

        <View style={{ marginTop: height * 0.02, maxWidth: width - width * 0.16}}>
          <Text
            style={{
              color: "#f1c40f",
              fontFamily: "Poppins-Bold",
              fontSize: width * 0.035,
            }}
          >
            Hoje
          </Text>
          <FlatList
            data={transacoesDoDia} 
            renderItem={renderItem} 
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>

      <CustomBottomTab />
    </SafeAreaView>
  );
}
