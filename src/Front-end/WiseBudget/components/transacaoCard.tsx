import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const { width } = Dimensions.get("window");

const getResponsiveFontSize = (size: number) => {
    const scale = width / 375;
    return Math.round(size * scale);
};

type Props = {
  descricao: string;
  valor: number | string;
  hora: string;
  icone: React.ComponentProps<typeof FontAwesome>["name"];
  cor: string;
  data?: string;
  onPress?: () => void;
};

export function TransacaoCard({
  descricao,
  valor,
  hora,
  icone,
  cor,
  data,
  onPress,
}: Props) {
  const valorNumerico = parseFloat(String(valor)) || 0;

  const formatarValor = (num: number) => {
    return num.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={styles.card}>
        <View style={styles.leftContainer}>
          <View style={styles.iconContainer}>
            <FontAwesome name={icone} size={width * 0.06} color={cor} />
          </View>
          <View style={{ flexShrink: 1 }}>
            <Text style={styles.descricaoText}>{descricao}</Text>
            <View style={styles.subtitleContainer}>
              {data && (
                <>
                  <Text style={styles.subtitleText}>{data}</Text>
                  <Text style={styles.subtitleText}>•</Text>
                </>
              )}
              <Text style={styles.subtitleText}>{hora}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.valorText}>
          R$ {formatarValor(valorNumerico)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#393939",
    borderRadius: width * 0.05,
    marginTop: width * 0.02,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: width * 0.05,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: width * 0.03,
    flex: 1, 
    marginRight: width * 0.02,
  },
  iconContainer: {
    height: width * 0.1,
    width: width * 0.1,
    borderRadius: width * 0.03,
    backgroundColor: "#2c2c2c",
    justifyContent: "center",
    alignItems: "center",
  },
  descricaoText: {
    fontFamily: 'Poppins-Bold',
    color: '#ffffff',
    fontSize: getResponsiveFontSize(12),
  },
  subtitleContainer: {
    flexDirection: 'row',
    gap: width * 0.01,
    alignItems: 'center',
  },
  subtitleText: {
    fontFamily: 'Poppins-Regular',
    color: '#A9A9A9',
    fontSize: getResponsiveFontSize(12),
  },
  valorText: {
    fontFamily: "Poppins-Bold",
    color: "#ffffff",
    fontSize: getResponsiveFontSize(12),
  },
});
