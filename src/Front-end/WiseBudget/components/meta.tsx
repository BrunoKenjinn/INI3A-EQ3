import React from 'react';
import { View, Text, StyleSheet } from "react-native";

export function Meta({ progress = 30, goalAmount = "R$20.000", subtitle = "Alcance A Meta Para Concluir.", date = "Abril 25" }) {

  const progressWidth = `${progress}%`;

  return (
    <View style={styles.card}>
      <View style={styles.cardTopContent}>
        <View style={styles.trophyIconContainer}>
          <Text style={styles.trophyIconText}>🏆</Text>
        </View>

        <View style={styles.mainInfo}>
          <Text style={styles.title}>
            Progresso
          </Text>

          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground} />
            
            <View style={[styles.progressBarFill, { width: progressWidth }]} />

            <View style={styles.progressBarTextContainer}>
              <Text style={styles.progressText}>{progress}%</Text>
              <Text style={styles.progressText}>{goalAmount}</Text>
            </View>
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
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#2c2c2c',
    borderRadius: 12,
    maxWidth: 400,
    width: '100%',
    marginBottom: 10
  },
  cardTopContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 15,
  },
  trophyIconContainer: {
    backgroundColor: '#BDC3C7',
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  trophyIconText: {
    fontSize: 24,
  },
  mainInfo: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#ffffff',
  },
  progressBarContainer: {
    height: 35,
    width: '100%',
    position: 'relative',
    justifyContent: 'center',
  },
  progressBarBackground: {
    backgroundColor: '#4a545e',
    height: 35,
    width: '100%',
    borderRadius: 50,
    position: 'absolute',
  },
  progressBarFill: {
    backgroundColor: '#34495E',
    height: 35,
    borderRadius: 50,
    position: 'absolute',
  },
  progressBarTextContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15, 
    position: 'relative',
  },
  progressText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  subtitle: {
    color: '#c5c5c5',
    fontSize: 13,
  },
  date: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#4a545e',
    marginTop: 20,
  }
});