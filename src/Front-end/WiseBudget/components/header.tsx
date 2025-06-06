import { View, StyleSheet, Text } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';

type Props = {
    title: string;
    leftIconName?: keyof typeof AntDesign.glyphMap;
    leftIconSize?: number;
    leftIconColor?: string;
    rightIconName?: keyof typeof AntDesign.glyphMap;
    rightIconSize?: number;
    rightIconColor?: string;
};

export function Header({ title, leftIconName, leftIconSize, leftIconColor, rightIconName, rightIconSize, rightIconColor}: Props) {
    return <View style={styles.header} className="mt-7">
        {leftIconName && <AntDesign name={leftIconName} size={leftIconSize} color={leftIconColor} />}
        <Text style={styles.title} className="text-2xl font-bold">{title}</Text>
        {rightIconName && <AntDesign name={rightIconName} size={rightIconSize} color={rightIconColor} />}
    </View>
}

const styles = StyleSheet.create({
    header: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        color: '#f1c40f',
        fontFamily: 'Poppins-Bold',
    }
});