import FontAwesome from '@expo/vector-icons/FontAwesome';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

type Props = {
    iconName: string;
    text: string;
    onPress: () => void;
    onLongPress?: () => void;
    rota?: string;
};

export function Atalho({iconName, text, onPress, onLongPress} : Props) {
    return <View style={{ marginBottom: 12, marginTop: 20 }}>
                <TouchableOpacity style={styles.atalhoItem} onPress={onPress} onLongPress={onLongPress} delayLongPress={500}>
                    <FontAwesome name={iconName} size={32} color="#f1c40f" />
                    <Text style={styles.atalhoText}>{text}</Text>
                </TouchableOpacity>
        </View>
}

const styles = StyleSheet.create({
  atalhoItem: {
    backgroundColor: '#393939',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
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