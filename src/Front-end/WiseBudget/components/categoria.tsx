import FontAwesome from '@expo/vector-icons/FontAwesome';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

type Props = {
    iconName: string;
    text: string;
    color?: string;
    onPress: () => void;
};

export function Categoria({ iconName, text, color, onPress }: Props) {
    const displayColor = color || '#f1c40f'
    return <View className='mb-3 mt-5'>
            <View  className='w-[100px] h-[105px] '>
                <TouchableOpacity style={styles.categoria} className=' w-[100px] h-[105px] flex items-center justify-center rounded-2xl' onPress={onPress} >
                    <FontAwesome name={iconName} size={50} color={displayColor} />
                </TouchableOpacity>
                <Text style={[styles.text, { color: displayColor }]} className='text-center text-x1 mt-2'>{text}</Text>
            </View>
    </View>
}

const styles = StyleSheet.create({
    categoria: {
        backgroundColor: '#393939',
    },

    text: {
        fontFamily: 'Poppins-Regular'
    }
});