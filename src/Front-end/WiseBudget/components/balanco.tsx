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
    saldoTotal: string;
};

export function Balanço({ debito, credito, saldo, saldoTotal }: Props) {
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

        <View style={styles.container}>
            <View style={styles.column}>
                <View style={styles.topItem}>
                    <Text style={styles.text1}>Saldo Mensal</Text>
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

                <View style={styles.bottomItem}>
                    <Text style={styles.text1}>Despesas</Text>
                    <Text style={styles.text2}>
                        {mostrarValores ? formatar(debito) : valorMascarado(debito)}
                    </Text>
                </View>
            </View>

            <View style={styles.divisor} />

            <View style={styles.column}>
                <View style={styles.topItem}>
                    <Text style={styles.text1}>Saldo Total</Text>
                    <View style={styles.valorComOlho}>
                        <Text style={styles.text2}>
                            {mostrarValores ? formatar(saldoTotal) : valorMascarado(saldoTotal)}
                        </Text>
                        <TouchableOpacity onPress={() => setMostrarValores(!mostrarValores)}>
                            <FontAwesome
                                name={mostrarValores ? "eye" : "eye-slash"}
                                size={getResponsiveFontSize(15)}
                                color="white"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.bottomItem}>
                    <Text style={styles.text1}>Receitas</Text>
                    <Text style={styles.text2}>
                        {mostrarValores ? formatar(credito) : valorMascarado(credito)}
                    </Text>
                </View>
            </View>
        </View>
    );


}
const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 7,
        marginBottom: 7,
    },
    column: {
        flex: 1,
        alignItems: "center",
    },
    text1: {
        fontFamily: 'Poppins-Regular',
        color: "#ffffff",
        textAlign: 'center',
        fontSize: getResponsiveFontSize(13),
    },
    text2: {
        fontFamily: 'Poppins-Bold',
        color: "#ffffff",
        fontSize: getResponsiveFontSize(16),
    },
    topItem: {
        alignItems: "center",
    },
    bottomItem: {
        alignItems: "center",
    },
    valorComOlho: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        marginTop: 4,
    },
    divisor: {
        width: 2,
        backgroundColor: "#fff",
        opacity: 0.6,
        marginHorizontal: 10,
        alignSelf: "stretch",
    },
});
