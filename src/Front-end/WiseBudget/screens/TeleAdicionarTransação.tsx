import { View, StyleSheet, Text, TextInput } from "react-native"
import { SafeAreaView } from 'react-native-safe-area-context'
import { Header } from "../components/header";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function TelaAdicionarTransação() {
    return (
        <SafeAreaView style={styles.container} edges={['top', 'right', 'bottom', 'left']}>
            <Header leftIconName="times"
                    leftIconColor="#f1c40f"
                    leftIconSize={24}
                    leftIconComponent={FontAwesome5}
                    title="Adicionar Transação"
                    rightIconName=""
                    rightIconColor=""
                    rightIconSize={0}
                    rightIconComponent={FontAwesome5}/>

            <View style={{paddingHorizontal: 20}}>
                <View style={{display: 'flex'}}>
                    <Text style={{textAlign: 'center', fontFamily: 'Poppins-Regular', color: '#fdfdfd'}}>Qual o valor da transação?</Text>
                    <View style={{display: 'flex', flexDirection: 'row'}}>
                        <Text style={{color: '#fdfdfd', fontSize: 45, opacity: 0.5, fontFamily:'Poppins-Bold', marginTop: 20}}>R$</Text>
                        <TextInput placeholder="0,00" placeholderTextColor={'#393939'} style={{height: 100, fontSize: 80, fontFamily: 'Poppins-Bold', color: '#fdfdfd', width: 332}}/>
                    </View>
                </View>
                <View>
                    <View>
                        <Text>Qual o nome da transação?</Text>
                        <TextInput placeholder="Nome ou Descrição"/>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2c2c2c',
    }
});