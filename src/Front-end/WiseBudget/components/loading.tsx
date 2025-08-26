import React, { useRef, useEffect } from 'react';
import { Animated, View, Image, Text, StyleSheet, SafeAreaView } from 'react-native';

export function Loading() {
    const animations = [useRef(new Animated.Value(0)).current,
                        useRef(new Animated.Value(0)).current,
                        useRef(new Animated.Value(0)).current];

    useEffect(() => {
        const createAnimation = (animatedValue: Animated.Value, delay: number) => {
            return Animated.loop(
                Animated.sequence([
                    Animated.timing(animatedValue, {
                        toValue: -10, 
                        duration: 800,
                        delay,
                        useNativeDriver: true,
                    }),
                    Animated.timing(animatedValue, {
                        toValue: 0, 
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ])
            );
        };

        const animationsLoop = animations.map((anim, i) => createAnimation(anim, i * 200));
        animationsLoop.forEach(anim => anim.start());

        return () => {
            animationsLoop.forEach(anim => anim.stop());
        };
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Image source={require('../assets/Logo.png')} style={styles.logo} />
            <View style={styles.dotsContainer}>
                {animations.map((anim, i) => (
                    <Animated.View
                        key={i}
                        style={[
                            styles.dot,
                            { transform: [{ translateY: anim }] }
                        ]}
                    />
                ))}
            </View>
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
    logo: {
        width: 200,
        height: 200,
        marginBottom: 10,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginTop: 20,
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#f1c40f',
        marginHorizontal: 6,
    },
});
