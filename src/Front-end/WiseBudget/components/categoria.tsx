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
    color?: string;
    onPress: () => void;
};

export function Categoria({ iconName, text, color, onPress }: Props) {
    const displayColor = color || '#f1c40f';
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.touchable} onPress={onPress} activeOpacity={0.7}>
                <FontAwesome name={iconName} size={width * 0.12} color={displayColor} />
            </TouchableOpacity>
            <Text style={[styles.text, { color: displayColor }]}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: width * 0.03,
        marginTop: width * 0.05,
        alignItems: 'center',
        width: width * 0.26, 
    },
    touchable: {
        width: width * 0.26,
        height: width * 0.28,
        backgroundColor: '#393939',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: width * 0.04,
    },
    text: {
        fontFamily: 'Poppins-Regular',
        textAlign: 'center',
        fontSize: getResponsiveFontSize(13),
        marginTop: width * 0.02,
    }
});
