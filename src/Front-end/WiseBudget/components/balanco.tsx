import { Text, View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState } from "react";

const { width } = Dimensions.get("window");

const getResponsiveFontSize = (size: number) => {
    const scale = width / 375;
    return Math.round(size * scale);
};

type Props = {
    debito: string;
    credito: string;
    saldo: string;
};

export function Balanço({ debito, credito, saldo }: Props) {
    const [mostrarValores, setMostrarValores] = useState(true);

    const formatar = (value: string) => {
        const numberValue = parseFloat(value);
        if (isNaN(numberValue)) {
            return 'R$ 0,00';
        }
        return numberValue.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
    };

    const valorMascarado = (valor: string) => {
        const valorNumero = parseFloat(valor);
        const valorComVirgula = valorNumero.toFixed(2);
        const valorApenasDigitos = valorComVirgula.replace('.', '');
        return '*'.repeat(valorApenasDigitos.length);
    };

    return (
        <View>
            <View style={styles.top}>
                <Text style={styles.text1}>Saldo</Text>
                <View style={styles.valorComOlho}>
                    <Text style={styles.text2}>
                        {mostrarValores ? formatar(saldo) : valorMascarado(saldo)}
                    </Text>
                    <TouchableOpacity onPress={() => setMostrarValores(!mostrarValores)}>
                        <FontAwesome
                            name={mostrarValores ? "eye" : "eye-slash"}
                            size={getResponsiveFontSize(16)}
                            color="white"
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.bottom}>
                <View style={styles.bottomItem}>
                    <Text style={styles.text1}>Débito</Text>
                    <Text style={styles.text2}>
                        {mostrarValores ? formatar(debito) : valorMascarado(debito)}
                    </Text>
                </View>

                <View style={styles.divisor} />

                <View style={styles.bottomItem}>
                    <Text style={styles.text1}>Crédito</Text>
                    <Text style={styles.text2}>
                        {mostrarValores ? formatar(credito) : valorMascarado(credito)}
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    text1: {
        fontFamily: 'Poppins-Regular',
        color: "#ffffff",
        textAlign: 'center',
        fontSize: getResponsiveFontSize(14),
    },
    text2: {
        fontFamily: 'Poppins-Bold',
        color: "#ffffff",
        fontSize: getResponsiveFontSize(20),
    },
    top: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 12,
    },
    valorComOlho: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        marginTop: 4,
    },
    bottom: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 8,
    },
    bottomItem: {
        alignItems: "center",
    },
    divisor: {
        width: 2,
        height: "90%",
        backgroundColor: "#fff",
        opacity: 0.6,
    },
});
