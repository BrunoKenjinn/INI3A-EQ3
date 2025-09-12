import { Dimensions, SafeAreaView, View } from "react-native";
import { Header } from "../components/header";
import CustomBottomTab from "../components/CustomBottomTab";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Meta } from "../components/meta";

export default function TelaMetas() {
  const { width, height } = Dimensions.get("window");

  const metasData = [
    {
      id: "1", // É importante ter um ID único para cada item da lista
      progress: 75,
      goalAmount: "R$1.000",
      subtitle: "Economia para viagem.",
      date: "Setembro 30",
    },
    {
      id: "2",
      progress: 30,
      goalAmount: "R$20.000",
      subtitle: "Entrada do apartamento.",
      date: "Dezembro 25",
    },
    {
      id: "3",
      progress: 95,
      goalAmount: "R$5.000",
      subtitle: "Comprar novo celular.",
      date: "Setembro 15",
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#2c2c2c" }}>
      <Header
        leftIconName="arrow-left"
        leftIconColor="#f1c40f"
        leftIconSize={width * 0.06}
        leftIconComponent={FontAwesome5}
        title="Metas"
        rightIconName="plus"
        rightIconColor="#f1c40f"
        rightIconSize={width * 0.06}
        rightIconComponent={FontAwesome5}
      />
      <View style={{flexDirection: 'column', alignItems: 'center', padding: 20}}>
        {metasData.map((item) => (
          <Meta
            key={item.id}
            progress={item.progress}
            goalAmount={item.goalAmount}
            subtitle={item.subtitle}
            date={item.date}
          />
        ))}
      </View>
      <CustomBottomTab />
    </SafeAreaView>
  );
}
