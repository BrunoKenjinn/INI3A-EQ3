import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';

interface LoadingProps {
    message?: string; 
}

export function Loading({ message = "Carregando..." }: LoadingProps) {
    return (
        <SafeAreaView style={styles.container}>
            <ActivityIndicator size="large" color="#f1c40f" />
            <Text style={styles.text}>{message}</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c2c2c',
    },
    text: {
        marginTop: 10,
        color: 'white',
        fontSize: 16,
        fontFamily: 'Poppins-Regular' 
    }
});