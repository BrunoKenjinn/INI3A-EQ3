import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState } from "react";

type Props = {
    debito: string;
    credito: string;
};

export function Balanço({ debito, credito }: Props) {
    const [mostrarValores, setMostrarValores] = useState(true);

    const parseValor = (valor: string) =>
        parseFloat(valor.replace('.', '').replace(',', '.'));

    const saldo = (parseValor(debito) + parseValor(credito)).toFixed(2);

    const formatar = (valor: string) => {
        const num = parseFloat(valor);
        return num.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const valorVisivel = (valor: string) =>
        mostrarValores ? formatar(valor) : 'XX.XXX,XX';

    return (
        <View>
            <View style={styles.top}>
                <Text style={styles.text1}>Saldo</Text>
                <View style={styles.valorComOlho}>
                    <Text style={styles.text2}>R$ {valorVisivel(saldo)}</Text>
                    <TouchableOpacity onPress={() => setMostrarValores(!mostrarValores)}>
                        <FontAwesome
                            name={mostrarValores ? "eye" : "eye-slash"}
                            size={15}
                            color="white"
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.bottom}>
                <View style={styles.bottom1}>
                    <Text style={styles.text1}>Débito</Text>
                    <Text style={styles.text2}>R$ {valorVisivel(debito)}</Text>
                </View>
                <Text style={styles.border}>|</Text>
                <View style={styles.bottom2}>
                    <Text style={styles.text1}>Crédito</Text>
                    <Text style={styles.text2}>R$ {valorVisivel(credito)}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    text1: {
        fontFamily: 'Poppins-Regular',
        color: "#ffffff",
        textAlign: 'center'
    },

    text2: {
        fontFamily: 'Poppins-Bold',
        color: "#ffffff",
        fontSize: 22
    },

    top: {
        width: '100%',
        alignItems: 'center'
    },

    valorComOlho: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center'
    },

    bottom: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around'
    },

    bottom1: {},

    bottom2: {},

    border: {
        color: "#ffffff",
        fontSize: 50,
        fontWeight: "100"
    }
});
