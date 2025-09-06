import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { NavigationProp, useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get("window");

type RootStackParamList = {
    TelaHome: undefined;
    TelaPerfil: undefined;
};

export default function CustomBottomTab() {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const iconSize = width * 0.065;

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate('TelaHome')}>
                <FontAwesome name="home" size={iconSize} color="#f1c40f" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.tabButton}>
                <FontAwesome name="search" size={iconSize} color="#f1c40f" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.tabButton}>
                <FontAwesome name="bell" size={iconSize} color="#f1c40f" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate('TelaPerfil')}>
                <FontAwesome name="user" size={iconSize} color="#f1c40f" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#2c2c2c',
        justifyContent: 'space-around',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 101,
        paddingVertical: width * 0.03,
        borderTopWidth: 1,
        borderTopColor: '#393939'
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
