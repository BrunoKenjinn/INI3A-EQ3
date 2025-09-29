import { SafeAreaView, Dimensions, View } from "react-native"
import { Header } from "../components/header"
import FontAwesome5 from "@expo/vector-icons/FontAwesome5"
import CustomBottomTab from "../components/CustomBottomTab";

export default function TelaAnalise( navigation ) {

    const { width, height } = Dimensions.get("window");

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#2c2c2c'}}>
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
            />            

            <View>

            </View>

            <CustomBottomTab />
        </SafeAreaView>
    )
}