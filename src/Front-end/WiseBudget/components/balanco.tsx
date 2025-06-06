import { Text, View, StyleSheet } from "react-native"

type Props = {
    saldo: string;
    gasto: string;
};

export function Balanço({saldo, gasto}: Props) {
    return <View className='w-full flex flex-row justify-around mt-[50px] mb-[50px]'>
        <View className="flex items-center w-50 border-r border-white pr-9">
            <Text className="text-white text-2xl font-light " style={styles.text1}>Saldo</Text>
            <Text className="text-white text-2xl font-light " style={styles.text1}>Total</Text>
            <Text className="text-white text-2xl font-extrabold " style={styles.text2}>R$ {saldo}</Text>
        </View>
        <View className="flex items-center w-50">
            <Text className="text-white text-2xl font-light " style={styles.text1}>Gasto</Text>
            <Text className="text-white text-2xl font-light " style={styles.text1}>Total</Text>
            <Text className="text-white text-2xl font-extrabold " style={styles.text2}>R$ {gasto}</Text>
        </View>
    </View>
}
const styles = StyleSheet.create({
    text1: {
        fontFamily: 'Poppins-Regular',
    },
    
    text2: {
        fontFamily: 'Poppins-Bold',
    },
});