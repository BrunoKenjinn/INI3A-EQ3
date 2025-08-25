import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState } from "react";

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
                    <Text style={styles.text2}>{mostrarValores ? formatar(saldo) : valorMascarado(saldo)}</Text>
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
                    <Text style={styles.text2}>{mostrarValores ? formatar(debito) : valorMascarado(debito)}</Text>
                </View>
                <Text style={styles.border}>|</Text>
                <View style={styles.bottom2}>
                    <Text style={styles.text1}>Crédito</Text>
                    <Text style={styles.text2}>{mostrarValores ? formatar(credito) : valorMascarado(credito)}</Text>
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
