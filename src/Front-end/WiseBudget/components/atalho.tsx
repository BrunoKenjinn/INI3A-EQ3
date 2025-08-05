import FontAwesome from '@expo/vector-icons/FontAwesome';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

type Props = {
    text: string;
    onPress: () => void;
};

export function Atalho({iconName, text, onPress} : Props) {
    return <View className='mb-3 mt-5'>
                <TouchableOpacity style={styles.atalho} className='w-100 h-[105px] rounded-2xl flex items-center justify-center' onPress={onPress}>
                    <FontAwesome name={iconName} size={50} color="#f1c40f" />
                </TouchableOpacity>
                <Text style={styles.text} className='text-center text-lg'>{text}</Text>
        </View>
}

const styles = StyleSheet.create({
    atalho: {
        backgroundColor: '#393939',
    },

    text: {
        color: '#f1c40f',
        fontFamily: 'Poppins-Regular'
    }
});