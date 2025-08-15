import React, { useRef, useState, useEffect } from "react";
import {
  Animated,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
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
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Valor animado para a opacidade do botão
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  // Efeito para animar o botão quando chegar na última tela
  useEffect(() => {
    if (currentIndex === slides.length - 1) {
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 500, // Duração da animação em milissegundos
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
    // Adicione a lógica para o que acontece ao concluir
    // Por exemplo, navegar para a tela principal do app
    console.log("Onboarding concluído!");
  };

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false,
      listener: (event: { nativeEvent: { contentOffset: { x: any; }; }; }) => {
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
            <View style={styles.circle}>
              <Image source={images[index]} style={{ width: '100%', height: '100%' }} />
            </View>
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
              style={[styles.dot, { width: dotWidth, opacity }]}
            />
          );
        })}
      </View>

      {/* Renderização condicional: mostra setas ou o botão "Concluir" */}
      {currentIndex === slides.length - 1 ? (
        <Animated.View style={[styles.buttonContainer, { opacity: buttonOpacity }]}>
          <TouchableOpacity style={styles.button} onPress={handleFinish} activeOpacity={0.7}>
            <Text style={styles.buttonText}>Concluir</Text>
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <View style={styles.arrowsContainer}>
          <TouchableOpacity onPress={handlePrev} disabled={currentIndex === 0}>
            <Text style={[styles.arrow, currentIndex === 0 && styles.arrowDisabled]}>{"<"}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNext} disabled={currentIndex === slides.length - 1}>
            <Text style={[styles.arrow, currentIndex === slides.length - 1 && styles.arrowDisabled]}>{">"}</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e1e",
  },
  slide: {
    width: width,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    marginTop: 50,
    width: 230,
    height: 230,
    // A cor de fundo é desnecessária se a imagem preenche o círculo
    borderRadius: 115, // Metade da largura/altura para ser um círculo perfeito
    marginBottom: 20,
    overflow: 'hidden', // Garante que a imagem não saia dos limites do círculo
  },
  title: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    marginTop: 30,
    textAlign: "left",
    width: "90%",
  },
  text: {
    fontFamily: 'Poppins-Regular',
    marginTop: 20,
    fontSize: 14,
    color: "#fff",
    textAlign: "left",
    lineHeight: 23,
    width: "90%",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
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
    paddingHorizontal: 40,
    paddingBottom: 30,
    height: 50, // Altura fixa para evitar pulos na interface
    alignItems: 'center',
  },
  arrow: {
    fontSize: 28,
    color: "#f1c40f",
    fontWeight: "bold",
  },
  arrowDisabled: {
    opacity: 0.3,
  },
  // NOVOS ESTILOS PARA O BOTÃO
  buttonContainer: {
    paddingHorizontal: 40,
    paddingBottom: 30,
    height: 50, // Mesma altura das setas para consistência
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#f1c40f',
    paddingVertical: 6,
    paddingHorizontal: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#1e1e1e',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Regular',
  },
});