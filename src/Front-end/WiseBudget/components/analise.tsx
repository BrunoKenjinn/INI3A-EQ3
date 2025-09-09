import { Text, View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState } from "react";

const { width } = Dimensions.get("window");

const getResponsiveFontSize = (size: number) => {
    const scale = width / 375;
    return Math.round(size * scale);
};

type Props = {
    total: string;
    economia: string;
    maiorGasto: string;
    iconeMaiorGasto: React.ComponentProps<typeof FontAwesome>["name"];
    corMaiorGasto?: string;
};

export function Analise({ total, economia, maiorGasto, iconeMaiorGasto, corMaiorGasto }: Props) {
    const [mostrarValores, setMostrarValores] = useState(true);

    const formatar = (value: string) => {
        const numberValue = parseFloat(value);
        if (isNaN(numberValue)) return 'R$ 0,00';

        const abs = Math.abs(numberValue).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });

        return numberValue < 0 ? `R$ -${abs.replace('R$', '').trim()}` : abs;
    };

    const valorMascarado = (valor: string) => {
        const valorNumero = parseFloat(valor);
        if (isNaN(valorNumero)) return '*****';
        const valorComVirgula = valorNumero.toFixed(2);
        const valorApenasDigitos = valorComVirgula.replace('.', '');
        return '*'.repeat(valorApenasDigitos.length);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Total</Text>
            <View style={styles.valorComOlho}>
                <Text style={styles.total}>
                    {mostrarValores ? formatar(total) : valorMascarado(total)}
                </Text>
                <TouchableOpacity onPress={() => setMostrarValores(!mostrarValores)}>
                    <FontAwesome
                        name={mostrarValores ? "eye" : "eye-slash"}
                        size={getResponsiveFontSize(15)}
                        color="white"
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.bottom}>
                <View style={styles.col}>
                    <Text style={styles.label}>Total de Economia:</Text>
                    <Text style={styles.subValor}>
                        {mostrarValores ? formatar(economia) : valorMascarado(economia)}
                    </Text>
                </View>

                <View style={styles.border} />

                <View style={styles.col}>
                    <Text style={styles.label}>Maior Gasto:</Text>
                    <View style={styles.gastoRow}>
                        <Text style={styles.subValor}>{maiorGasto}</Text>
                        <View style={styles.iconeWrapper}>
                            <FontAwesome name={iconeMaiorGasto} size={getResponsiveFontSize(18)} color={corMaiorGasto || "#f1c40f"} />
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
        marginTop: width * 0.025,
    },
    label: {
        fontFamily: "Poppins-Regular",
        color: "#ffffff",
        textAlign: "center",
        fontSize: getResponsiveFontSize(14),
    },
    total: {
        fontFamily: "Poppins-Bold",
        color: "#ffffff",
        fontSize: getResponsiveFontSize(22),
    },
    valorComOlho: {
        flexDirection: "row",
        gap: width * 0.025,
        alignItems: "center",
    },
    bottom: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: width * 0.04,
        alignItems: "center",
    },
    col: {
        alignItems: "center",
        flex: 1,
    },
    border: {
        height: '80%',
        width: 1,
        backgroundColor: '#fff',
        opacity: 0.5
    },
    subValor: {
        fontFamily: "Poppins-Bold",
        color: "#ffffff",
        fontSize: getResponsiveFontSize(16),
        marginTop: width * 0.01,
    },
    gastoRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: width * 0.02,
    },
    iconeWrapper: {
        padding: width * 0.015,
        borderRadius: width * 0.05,
        backgroundColor: "#393939",
    },
});
