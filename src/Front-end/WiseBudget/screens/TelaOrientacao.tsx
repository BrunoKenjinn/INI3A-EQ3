import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";

const { width } = Dimensions.get("window");

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
    title: "Defina Metas e Acompanhe seu Progresso",
    text: `Com o WiseBudget, você pode estabelecer metas financeiras e acompanhar seu progresso de forma contínua. Defina objetivos como poupar para uma viagem, quitar dívidas ou criar um fundo de emergência.\n\nO aplicativo monitora o cumprimento dessas metas, alertando você quando estiver perto de alcançar seus objetivos ou quando precisar ajustar algum planejamento. Dessa forma, você mantém sua vida financeira sob controle, sempre ciente de como está avançando.`,
  },
];

export default function OnboardingScreen() {
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false,
      listener: (event) => {
        const x = event.nativeEvent.contentOffset.x;
        const index = Math.round(x / width);
        setCurrentIndex(index);
      },
    }
  );

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
            <View style={styles.circle}></View>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.text}>{slide.text}</Text>
          </View>
        ))}
      </Animated.ScrollView>

      <View style={styles.dotsContainer}>
        {slides.map((_, index) => {
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 16, 8],
            extrapolate: "clamp",
          });
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          });
          return (
            <Animated.View
              key={index}
              style={[styles.dot, { width: dotWidth, opacity }]} />
          );
        })}
      </View>

      <View style={styles.arrowsContainer}>
        <TouchableOpacity onPress={handlePrev} disabled={currentIndex === 0}>
          <Text style={[styles.arrow, currentIndex === 0 && styles.arrowDisabled]}>{"<"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext} disabled={currentIndex === slides.length - 1}>
          <Text style={[styles.arrow, currentIndex === slides.length - 1 && styles.arrowDisabled]}>{">"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e1e",
  },
  slide: {
    width,
    paddingHorizontal: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    margin: '20%',
    width: 220,
    height: 220,
    backgroundColor: "#f1c40f",
    borderRadius: '100%',
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    color: "#fff",
    fontFamily: 'Poppins-Bold',
    marginBottom: 16,
  },
  text: {
    marginTop: 10,
    fontSize: 13,
    color: "#fff",
    textAlign: "justify",
    fontFamily: 'Poppins-Regular',
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#f1c40f",
    marginHorizontal: 4,
  },
  arrowsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    paddingBottom: '20%',
  },
  arrow: {
    fontSize: 24,
    color: "#f1c40f",
    fontWeight: "bold",
  },
  arrowDisabled: {
    opacity: 0.3,
  },
}); 