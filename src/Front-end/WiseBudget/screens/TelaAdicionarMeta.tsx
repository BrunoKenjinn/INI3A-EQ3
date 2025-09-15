import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Header } from "../components/header";
import CustomBottomTab from "../components/CustomBottomTab";

export default function TelaAdicionarMeta() {
    const { width, height } = Dimensions.get("window");
    const getResponsiveFontSize = (size: number) => {
        const scale = width / 375;
        return Math.round(size * scale);
    };

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#2c2c2c'}}>
            <Header
                leftIconName="arrow-left"
                leftIconColor="#f1c40f"
                leftIconSize={width * 0.06}
                leftIconComponent={FontAwesome5}
                title="Adicionar Meta"
                rightIconName=""
                rightIconColor="#f1c40f"
                rightIconSize={width * 0.06}
                rightIconComponent={FontAwesome5}
            />
            <View style={{paddingHorizontal: width * 0.06}}>
                <Text style={{fontSize: getResponsiveFontSize(20), fontWeight: 'bold', color: 'white'}}>Criar nova meta</Text>
                <Text style={{fontSize: getResponsiveFontSize(12), color: '#BDC3C7'}}>Defina seu próximo objetivo financeiro.</Text>

                <View style={{marginTop: height * 0.02}}>
                    <Text style={{fontSize: getResponsiveFontSize(12), color: '#BDC3C7', marginBottom: height * 0.01}}>Título da Meta</Text>
                    <TextInput placeholder="Ex: PC Gamer" placeholderTextColor={'#BDC3C7'} style={{color: '#BDC3C7', padding: width * 0.03, borderColor: '#BDC3C7', borderWidth: 1, backgroundColor: '#3d3d3d', borderRadius: width * 0.01}}/>
                </View>
                <View style={{marginTop: height * 0.02}}>
                    <Text style={{fontSize: getResponsiveFontSize(12), color: '#BDC3C7', marginBottom: height * 0.01}}>Valor Total ($)</Text>
                    <TextInput placeholder="Ex: R$ 4.000,00" placeholderTextColor={'#BDC3C7'} style={{color: '#BDC3C7', padding: width * 0.03, borderColor: '#BDC3C7', borderWidth: 1, backgroundColor: '#3d3d3d', borderRadius: width * 0.01}}/>
                </View>
                <View style={{marginTop: height * 0.02}}>
                    <Text style={{fontSize: getResponsiveFontSize(12), color: '#BDC3C7', marginBottom: height * 0.01}}>Data Limite</Text>
                    <TextInput placeholder="Ex: 31/12/2025" placeholderTextColor={'#BDC3C7'} style={{color: '#BDC3C7', padding: width * 0.03, borderColor: '#BDC3C7', borderWidth: 1, backgroundColor: '#3d3d3d', borderRadius: width * 0.01}}/>
                </View>

                <TouchableOpacity style={{backgroundColor: '#f1c40f', padding: width * 0.03, borderRadius: width * 0.02, marginTop: height * 0.45}}>
                    <Text style={{textAlign: 'center', fontSize: getResponsiveFontSize(16), fontWeight: 'bold'}}>Criar Meta</Text>
                </TouchableOpacity>
            </View>
            <CustomBottomTab />
        </SafeAreaView>
    );
}
