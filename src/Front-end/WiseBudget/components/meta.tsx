import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const { width } = Dimensions.get("window");

const getResponsiveFontSize = (size: number) => {
  const scale = width / 375;
  return Math.round(size * scale);
};

type MetaProps = {
  progress?: number;
  goalAmount?: string;
  subtitle?: string;
  date?: string | null;
  valorAtualFormatado?: string;
  isCompleted?: boolean;
};

export function Meta({
  progress = 0,
  goalAmount,
  subtitle,
  date,
  valorAtualFormatado,
  isCompleted = false,
}: MetaProps) {
  const clampedProgress = Math.min(progress, 100);
  const progressWidth = `${clampedProgress}%`;

  return (
    <View style={[styles.card, isCompleted && styles.completedCard]}>
      <View style={styles.cardTopContent}>
        <View style={styles.trophyIconContainer}>
          <FontAwesome
            name="trophy"
            size={width * 0.1}
            color={isCompleted ? "#7f8c8d" : "#f1c40f"}
          />
        </View>

        <View style={styles.mainInfo}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={[styles.title, isCompleted && styles.completedText]}>
              Progresso
            </Text>
            <Text
              style={[
                styles.progressPercentText,
                isCompleted && styles.completedText,
              ]}
            >
              {clampedProgress}%
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View />
            <View
              style={[
                styles.progressBarFill,
                { width: progressWidth },
                isCompleted && styles.progressBarCompleted,
              ]}
            />
          </View>
          <View style={styles.progressBarTextContainer}>
            <Text
              style={[
                styles.progressAmountText,
                isCompleted && styles.completedText,
              ]}
            >
              {valorAtualFormatado || "R$ 0,00"}
            </Text>
            <Text
              style={[
                styles.progressAmountText,
                isCompleted && styles.completedText,
              ]}
            >
              {goalAmount}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Text style={[styles.subtitle, isCompleted && styles.completedText]}>
            {subtitle}
          </Text>
          {isCompleted && (
            <View style={styles.completedBadge}>
              <FontAwesome5
                name="check-circle"
                size={getResponsiveFontSize(11)}
                color="#2ecc71"
              />
              <Text style={styles.completedBadgeText}>Concluída!</Text>
            </View>
          )}
        </View>
        {date && (
          <Text style={[styles.date, isCompleted && styles.completedText]}>
            {date}
          </Text>
        )}
      </View>
      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#393939",
    borderRadius: width * 0.04,
    maxWidth: 400,
    width: "100%",
    marginBottom: width * 0.04,
    padding: width * 0.04,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  completedCard: {
    opacity: 0.75,
    backgroundColor: "#2c2c2c",
  },
  cardTopContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: width * 0.04,
    marginBottom: width * 0.02,
  },
  trophyIconContainer: {
    backgroundColor: "#2c2c2c",
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.075,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  mainInfo: {
    flex: 1,
  },
  title: {
    fontSize: getResponsiveFontSize(14),
    fontFamily: "Poppins-Medium",
    color: "#ecf0f1",
    marginBottom: width * 0.01,
  },
  progressBarContainer: {
    height: width * 0.02,
    width: "100%",
    position: "relative",
    justifyContent: "center",
    backgroundColor: "#4a545e",
    borderRadius: 5,
    overflow: "hidden",
    marginTop: width * 0.01,
    marginBottom: width * 0.015,
  },
  progressBarFill: {
    backgroundColor: "#f1c40f",
    height: "100%",
    borderRadius: 5,
    position: "absolute",
  },
  progressBarCompleted: {
    backgroundColor: "#2ecc71",
  },
  progressBarTextContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 3,
  },
  progressPercentText: {
    color: "#bdc3c7",
    fontFamily: "Poppins-Medium",
    fontSize: getResponsiveFontSize(13),
  },
  progressAmountText: {
    color: "#bdc3c7",
    fontFamily: "Poppins-Regular",
    fontSize: getResponsiveFontSize(11),
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: width * 0.03,
    borderTopWidth: 1,
    borderTopColor: "#4a545e",
    paddingTop: width * 0.02,
  },
  footerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
    marginRight: 10,
  },
  subtitle: {
    color: "#ecf0f1",
    fontSize: getResponsiveFontSize(14),
    fontFamily: "Poppins-Regular",
  },
  date: {
    color: "#bdc3c7",
    fontSize: getResponsiveFontSize(11),
    fontFamily: "Poppins-Regular",
    flexShrink: 0,
  },
  completedText: {
    color: "#7f8c8d",
  },
  completedBadge: {
    backgroundColor: "rgba(46, 204, 113, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  completedBadgeText: {
    color: "#2ecc71",
    fontFamily: "Poppins-Bold",
    fontSize: getResponsiveFontSize(10),
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#4a545e",
    marginTop: width * 0.05,
  },
});
