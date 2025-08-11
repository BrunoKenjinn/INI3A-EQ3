import FontAwesome from '@expo/vector-icons/FontAwesome';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

type Props = {
    iconName: string;
    text: string;
    color?: string;
    onPress: () => void;
};

export function Categoria({iconName, text, color, onPress} : Props) {
    const displayColor = color || '#f1c40f'
    return <View className='mb-3 mt-5'>
                <TouchableOpacity style={styles.categoria} className='w-100 h-[105px] rounded-2xl flex items-center justify-center' onPress={onPress}>
                    <FontAwesome name={iconName} size={50} color={displayColor} />
                </TouchableOpacity>
                <Text style={[styles.text, {color: displayColor}]}className='text-center text-lg'>{text}</Text>
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