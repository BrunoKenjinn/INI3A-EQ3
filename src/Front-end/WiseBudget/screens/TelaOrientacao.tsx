import React, { useRef, useState, useEffect } from "react";
import {
  Animated,
  useWindowDimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import FontAwesome from "@expo/vector-icons/FontAwesome";


const slides = [
  {
    title: "Bem-vindo ao WiseBudget!",
    text: `Aqui você encontra uma forma prática e inteligente de controlar suas finanças pessoais. Nosso objetivo é ajudar você a acompanhar seus ganhos, despesas e metas financeiras de maneira clara e organizada.\n\nCom o WiseBudget, você registra suas movimentações financeiras de forma simples e rápida, garantindo uma visão precisa da sua situação econômica. Aproveite nossas ferramentas para manter o controle das suas finanças e tomar decisões mais conscientes!`,
  },
  {
    title: "Organize e Visualize seus Dados Financeiros",
    text: `O WiseBudget permite que você registre todas as suas entradas e saídas financeiras em poucos cliques. Utilize categorias personalizadas para separar seus gastos e ganhos, garantindo um acompanhamento detalhado.\n\nOs gráficos interativos facilitam a visualização dos dados de suas finanças, mostrando padrões de consumo e evolução das economias. Além disso, você pode acessar relatórios completos para entender melhor onde está economizando ou gastando mais.`,
  },
  {
    title: "Acompanhe seu Progresso",
    text: `Com o WiseBudget, você pode estabelecer metas financeiras e acompanhar seu progresso de forma contínua. Defina objetivos como poupar para uma viagem, quitar dívidas ou criar um fundo de emergência.\n\nO aplicativo monitora o cumprimento dessas metas, alertando você quando estiver perto de alcançar seus objetivos ou quando precisar ajustar algum planejamento. Dessa forma, você mantém sua vida financeira sob controle, sempre ciente de como está avançando.`,
  },
];

const useAuth = () => ({
  markOrientationsAsSeen: () => console.log("Marked orientations as seen"),
  dismissOrientations: () => console.log("Dismissed orientations"),
});


export default function TelaOrientacao({ navigation }) {
  const { width, height } = useWindowDimensions();


  const getResponsiveFontSize = (size) => {
    const scale = width / 375;
    return Math.round(size * scale);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#1e1e1e",
    },
    slide: {
      width: width,
      paddingHorizontal: width * 0.08,
      justifyContent: "flex-start",
      alignItems: "center",
      paddingTop: height * 0.02,
    },
    imageContainer: {
      width: width * 0.5,
      height: width * 0.5,
      borderRadius: width * 0.25,
      marginBottom: height * 0.02,
      overflow: 'hidden',
      alignSelf: 'center',
    },
    circleImage: {
      width: '100%',
      height: '100%',
    },
    title: {
      fontFamily: 'Poppins-Regular',
      fontSize: getResponsiveFontSize(20),
      color: "#fff",
      fontWeight: "bold",
      textAlign: "left",
      width: "100%",
      marginBottom: 15,
    },
    text: {
      fontFamily: 'Poppins-Regular',
      fontSize: getResponsiveFontSize(14),
      color: "#d3d3d3",
      textAlign: "left",
      width: "100%",
    },
    controlsWrapper: {
      paddingBottom: height * 0.06,
      paddingHorizontal: width * 0.10,
      height: height * 0.2,
      justifyContent: 'flex-end',
    },
    dot: {
      height: 10,
      borderRadius: 5,
      backgroundColor: "#f1c40f",
      marginHorizontal: 5,
    },
    arrowsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: 'center',
    },
    arrow: {
      fontSize: getResponsiveFontSize(28),
      color: "#f1c40f",
      fontWeight: "bold",
    },
    arrowDisabled: {
      opacity: 0.3,
    },
    buttonContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    button: {
      backgroundColor: '#f1c40f',
      paddingVertical: height * 0.018,
      width: '80%',
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
    buttonText: {
      color: '#1e1e1e',
      fontSize: getResponsiveFontSize(16),
      fontWeight: 'bold',
      fontFamily: 'Poppins-Regular',
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 20,
    },
    skipButtonText: {
      color: '#a3a3a3',
      fontSize: getResponsiveFontSize(14),
      fontFamily: 'Poppins-Regular',
      marginLeft: 12,
    },
    navigationContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    dotsContainer: {
      flexDirection: "row",
      alignItems: "center",
    },

  });

  const { markOrientationsAsSeen, dismissOrientations } = useAuth();
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const buttonOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (currentIndex === slides.length - 1) {
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(buttonOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < slides.length - 1 && scrollRef.current) {
      scrollRef.current.scrollTo({ x: (currentIndex + 1) * width, animated: true });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0 && scrollRef.current) {
      scrollRef.current.scrollTo({ x: (currentIndex - 1) * width, animated: true });
    }
  };

  const handleFinish = () => {
    if (dontShowAgain) {
      markOrientationsAsSeen();
    } else {
      dismissOrientations();
    }
  };

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false,
      listener: (event) => {
        const x = event.nativeEvent.contentOffset.x;
        setCurrentIndex(Math.round(x / width));
      },
    }
  );

  const images = [
    require("../assets/images/circle-1.png"),
    require("../assets/images/circle-2.png"),
    require("../assets/images/circle-3.png"),
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <Animated.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        ref={scrollRef}
      >
        {slides.map((slide, index) => (
          <View key={index} style={styles.slide}>
            <View style={styles.imageContainer}>
              <Image source={images[index]} style={styles.circleImage} resizeMode="cover" />
            </View>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.text}>{slide.text}</Text>
          </View>
        ))}
      </Animated.ScrollView>

      <View style={styles.controlsWrapper}>
        {currentIndex === slides.length - 1 ? (
          // Último slide: botão Concluir + checkbox
          <Animated.View style={[styles.buttonContainer, { opacity: buttonOpacity }]}>
            <TouchableOpacity style={styles.button} onPress={handleFinish} activeOpacity={0.7}>
              <Text style={styles.buttonText}>Concluir</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setDontShowAgain(!dontShowAgain)}
            >
              <FontAwesome
                name={dontShowAgain ? "check-square" : "square-o"}
                size={24}
                color="#a3a3a3"
              />
              <Text style={styles.skipButtonText}>Não mostrar novamente</Text>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          // Slides anteriores: setas + pontos
          <View style={styles.navigationContainer}>
            <TouchableOpacity onPress={handlePrev} disabled={currentIndex === 0}>
              <Text style={[styles.arrow, currentIndex === 0 && styles.arrowDisabled]}>
                {"<"}
              </Text>
            </TouchableOpacity>

            <View style={styles.dotsContainer}>
              {slides.map((_, index) => {
                const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
                const dotWidth = scrollX.interpolate({
                  inputRange,
                  outputRange: [10, 20, 10],
                  extrapolate: "clamp",
                });
                const opacity = scrollX.interpolate({
                  inputRange,
                  outputRange: [0.3, 1, 0.3],
                  extrapolate: "clamp",
                });
                return (
                  <Animated.View key={index} style={[styles.dot, { width: dotWidth, opacity }]} />
                );
              })}
            </View>

            <TouchableOpacity onPress={handleNext} disabled={currentIndex === slides.length - 1}>
              <Text
                style={[
                  styles.arrow,
                  currentIndex === slides.length - 1 && styles.arrowDisabled,
                ]}
              >
                {">"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

    </SafeAreaView>
  );
}

