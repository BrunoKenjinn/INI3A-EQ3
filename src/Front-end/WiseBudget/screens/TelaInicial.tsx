import { View, Text, Image, StyleSheet, Pressable, SafeAreaView, Dimensions } from "react-native";
import Logo from '../assets/Logo.png';

const { width, height } = Dimensions.get("window");

const getResponsiveFontSize = (size: number) => {
    const scale = width / 375;
    return Math.round(size * scale);
};

export default function TelaInicial({ navigation }) {
    return (
        <SafeAreaView style={styles.container}>
            <Image source={Logo} style={styles.logo} />
            <View style={styles.buttonsContainer}>
                <Pressable style={styles.button} onPress={() => navigation.navigate('TelaLogin')}>
                    <Text style={styles.textButton}>Log In</Text>
                </Pressable>
                <Pressable style={styles.button} onPress={() => navigation.navigate('TelaCadastro')}>
                    <Text style={styles.textButton}>Cadastrar-se</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#2c2c2c',
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: height * 0.1,
    },
    logo: {
        width: width * 0.85,
        height: width * 0.85,
        resizeMode: 'contain',
    },
    buttonsContainer: {
        paddingTop: height*0.25,
        width: '60%',
        alignItems: 'center',
        gap: height * 0.05,
    },
    button: {
        backgroundColor: '#f1c40f',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: height * 0.015,
        borderRadius: 18,
        width: '100%',
    },
    textButton: {
        color: '#2c2c2c',
        fontSize: getResponsiveFontSize(18),
        fontFamily: 'Poppins-Bold'
    }
});
