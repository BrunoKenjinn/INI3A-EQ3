import { View, Text, Image, StyleSheet, Pressable} from "react-native";
import Logo from '../assets/Logo.png';

export function TelaInicial({navigation}) {
    return <>
        <View style={styles.container}>
            <Image source={Logo}/>
            <View style={styles.buttons}>
                <Pressable style={styles.button}>
                    <Text style={styles.textButton}>Log In</Text>
                </Pressable>
                <Pressable style={styles.button} onPress={() => navigation.navigate('TelaCadastro')}>
                    <Text style={styles.textButton}>Cadastrar-se</Text>
                </Pressable>
            </View>
        </View>
    </>
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#2c2c2c',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 150
    },
    buttons: {
        display: 'flex',
        gap: 50
    },
    button: {
        backgroundColor: '#f1c40f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 18,
        width: 180,
    },
    textButton: {
        color: '#2c2c2c',
        fontSize: 20,
        fontFamily: 'Poppins-Bold'
    }
});