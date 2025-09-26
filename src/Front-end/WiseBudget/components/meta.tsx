import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const { width } = Dimensions.get("window");

const getResponsiveFontSize = (size: number) => {
  const scale = width / 375;
  return Math.round(size * scale);
};

type MetaProps = {
  progress?: number;
  goalAmount?: string;
  subtitle?: string;
  date?: string;
  valorAtualFormatado?: string;
};

export function Meta({
  progress,
  goalAmount,
  subtitle,
  date,
  valorAtualFormatado,
}: MetaProps) {
  const progressWidth = `${progress}%`;

  return (
    <View style={styles.card}>
      <View style={styles.cardTopContent}>
        <View style={styles.trophyIconContainer}>
          <FontAwesome name="trophy" size={width * 0.1} color="#f1c40f" />
        </View>

        <View style={styles.mainInfo}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={styles.title}>Progresso</Text>
            <Text style={styles.progressText}>{progress || 0}%</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground} />
            <View style={[styles.progressBarFill, { width: progressWidth }]} />
          </View>
          <View style={styles.progressBarTextContainer}>
            {/* Mostra o valor atual e o valor total */}
            <Text style={styles.progressText}>
              {valorAtualFormatado || "R$ 0,00"}
            </Text>
            <Text style={styles.progressText}>{goalAmount}</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>

      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#2c2c2c",
    borderRadius: width * 0.04,
    maxWidth: 400,
    width: "100%",
    marginBottom: width * 0.03,
    padding: width * 0.04,
  },
  cardTopContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: width * 0.04,
  },
  trophyIconContainer: {
    backgroundColor: "#393939",
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.04,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  mainInfo: {
    flex: 1,
  },
  title: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: "bold",
    marginBottom: width * 0.02,
    color: "#ffffff",
  },
  progressBarContainer: {
    height: width * 0.09,
    width: "100%",
    position: "relative",
    justifyContent: "center",
  },
  progressBarBackground: {
    backgroundColor: "#4a545e",
    height: "100%",
    width: "100%",
    borderRadius: 50,
    position: "absolute",
  },
  progressBarFill: {
    backgroundColor: "#34495E",
    height: "100%",
    borderRadius: 50,
    position: "absolute",
  },
  progressBarTextContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: width * 0.04,
    position: "relative",
    marginTop: 5,
  },
  progressText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: getResponsiveFontSize(12),
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: width * 0.04,
  },
  subtitle: {
    color: "#c5c5c5",
    fontSize: getResponsiveFontSize(11),
  },
  date: {
    color: "#ffffff",
    fontSize: getResponsiveFontSize(11),
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#4a545e",
    marginTop: width * 0.05,
  },
});
