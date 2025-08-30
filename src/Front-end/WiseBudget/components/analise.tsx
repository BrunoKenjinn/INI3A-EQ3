import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState } from "react";

type Props = {
    total: string;
    economia: string;
    maiorGasto: string;
    iconeMaiorGasto: string;
    corMaiorGasto?: string;
};

export function Analise({ total, economia, maiorGasto, iconeMaiorGasto, corMaiorGasto }: Props) {
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
            {/* Total */}
            <Text style={styles.label}>Total</Text>
            <View style={styles.valorComOlho}>
                <Text style={styles.total}>
                    {mostrarValores ? formatar(total) : valorMascarado(total)}
                </Text>
                <TouchableOpacity onPress={() => setMostrarValores(!mostrarValores)}>
                    <FontAwesome
                        name={mostrarValores ? "eye" : "eye-slash"}
                        size={15}
                        color="white"
                    />
                </TouchableOpacity>
            </View>

            {/* Economia e Maior Gasto */}
            <View style={styles.bottom}>
                <View style={styles.col}>
                    <Text style={styles.label}>Total de Economia:</Text>
                    <Text style={styles.subValor}>
                        {mostrarValores ? formatar(economia) : valorMascarado(economia)}
                    </Text>
                </View>

                <Text style={styles.border}>|</Text>

                <View style={styles.col}>
                    <Text style={styles.label}>Maior Gasto:</Text>
                    <View style={styles.gastoRow}>
                        <Text style={styles.subValor}>{maiorGasto}</Text>
                        <View style={[styles.iconeWrapper, { backgroundColor: "#393939" }]}>
                            <FontAwesome name={iconeMaiorGasto} size={18} color={corMaiorGasto || "#f1c40f"} />
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        alignItems: "center",
        marginTop: 10,
    },
    label: {
        fontFamily: "Poppins-Regular",
        color: "#ffffff",
        textAlign: "center",
    },
    total: {
        fontFamily: "Poppins-Bold",
        color: "#ffffff",
        fontSize: 22,
    },
    valorComOlho: {
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
    },
    bottom: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 15,
        alignItems: "center",
    },
    col: {
        alignItems: "center",
    },
    border: {
        color: "#ffffff",
        fontSize: 50,
        fontWeight: "100"
    },
    subValor: {
        fontFamily: "Poppins-Bold",
        color: "#ffffff",
        fontSize: 16,
        marginTop: 5,
    },
    gastoRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    iconeWrapper: {
        padding: 5,
        borderRadius: 20,
    },
});
