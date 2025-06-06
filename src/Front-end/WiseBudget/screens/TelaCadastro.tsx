import { View, Text, Image, StyleSheet, Pressable, TextInput} from "react-native";
import Logo from '../assets/LogoAmarela.png';

export function TelaCadastro({navigation}) {

    return <>
        <View style={styles.container}>
            <Image source={Logo}/>
            <Text style={styles.title}>Crie sua conta</Text>
            <View style={styles.form}>
                <View>
                    <Text>Nome Completo</Text>
                    <TextInput placeholder="useless placeholder"/>
                </View>
            </View>
        </View>
    </>
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#2c2c2c',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: 40,
    },

});