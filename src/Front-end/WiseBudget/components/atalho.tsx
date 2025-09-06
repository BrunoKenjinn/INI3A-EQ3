import { View, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const { width } = Dimensions.get("window");

const getResponsiveFontSize = (size: number) => {
    const scale = width / 375;
    return Math.round(size * scale);
};

type Props = {
    iconName: React.ComponentProps<typeof FontAwesome>["name"];
    text: string;
    onPress: () => void;
    onLongPress?: () => void;
};

export function Atalho({ iconName, text, onPress, onLongPress }: Props) {
    return (
        <View style={styles.container}>
            <TouchableOpacity 
                style={styles.atalhoItem} 
                onPress={onPress} 
                onLongPress={onLongPress} 
                delayLongPress={500}
                activeOpacity={0.7}
            >
                <FontAwesome name={iconName} size={width * 0.08} color="#f1c40f" />
                <Text style={styles.atalhoText}>{text}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: width * 0.03,
        marginTop: width * 0.05,
    },
    atalhoItem: {
        backgroundColor: '#393939',
        borderRadius: width * 0.04,
        padding: width * 0.05,
        alignItems: 'center',
        justifyContent: 'center',
        width: width * 0.28,
        height: width * 0.28,
    },
    atalhoText: {
        color: 'white',
        fontSize: getResponsiveFontSize(12),
        fontFamily: 'Poppins-Regular',
        marginTop: width * 0.02,
        textAlign: 'center',
    },
});