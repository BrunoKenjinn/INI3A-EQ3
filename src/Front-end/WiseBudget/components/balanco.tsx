import { Text, View } from "react-native"

type Props = {
    saldo: string;
    gasto: string;
};

export function Balanço({saldo, gasto}: Props) {
    return <View className='w-full flex flex-row justify-around mt-[50px] mb-[50px]'>
        <View className="flex items-center w-50 border-r border-white pr-9">
            <Text className="text-white text-2xl font-light ">Saldo</Text>
            <Text className="text-white text-2xl font-light ">Total</Text>
            <Text className="text-white text-2xl font-extrabold ">R$ {saldo}</Text>
        </View>
        <View className="flex items-center w-50">
            <Text className="text-white text-2xl font-light ">Gasto</Text>
            <Text className="text-white text-2xl font-light ">Total</Text>
            <Text className="text-white text-2xl font-extrabold ">R$ {gasto}</Text>
        </View>
    </View>
}