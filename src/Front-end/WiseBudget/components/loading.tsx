import React, { useRef, useEffect } from 'react';
import { Animated, View, Image, StyleSheet, SafeAreaView, Dimensions } from 'react-native';

const { width, height } = Dimensions.get("window");

export function Loading() {
    const animations = [
        useRef(new Animated.Value(0)).current,
        useRef(new Animated.Value(0)).current,
        useRef(new Animated.Value(0)).current
    ];

    useEffect(() => {
        const createAnimation = (animatedValue: Animated.Value, delay: number) => {
            return Animated.loop(
                Animated.sequence([
                    Animated.timing(animatedValue, {
                        toValue: - (height * 0.015),
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
        width: width * 0.7,
        height: width * 0.7,
        marginBottom: height * 0.02,
        resizeMode: 'contain',
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginTop: height * 0.02,
    },
    dot: {
        width: width * 0.03,
        height: width * 0.03,
        borderRadius: (width * 0.03) / 2,
        backgroundColor: '#f1c40f',
        marginHorizontal: width * 0.015,
    },
});
