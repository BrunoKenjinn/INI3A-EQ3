import FontAwesome from '@expo/vector-icons/FontAwesome';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

type Props = {
    iconName: string;
    text: string;
    onPress: () => void;
};

export function Atalho({iconName, text, onPress} : Props) {
    return <View className='mb-3 mt-5'>
                <TouchableOpacity style={styles.atalhoItem}>
                    <FontAwesome name={iconName} size={32} color="#f1c40f" />
                    <Text style={styles.atalhoText}>{text}</Text>
                </TouchableOpacity>
        </View>
}

const styles = StyleSheet.create({
    atalhosTitle: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Poppins-Regular',  
    marginBottom: 10,
  },
  atalhoItem: {
    backgroundColor: '#393939',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 19,
    width: 110, 
    height: 110, 
  },
  atalhoText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginTop: 8,
    textAlign: 'center',
  },
});