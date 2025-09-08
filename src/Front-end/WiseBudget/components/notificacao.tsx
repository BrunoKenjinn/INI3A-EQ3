import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const { width, height } = Dimensions.get('window');

const getResponsiveFontSize = (size: number) => {
    const scale = width / 375;
    return Math.round(size * scale);
};

type NotificationCardProps = {
  iconName: React.ComponentProps<typeof FontAwesome>['name']; 
  title: string;
  description: string;
  date: string;
};

export function NotificationCard({ iconName, title, description, date }: NotificationCardProps) {
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.iconContainer}>
        <FontAwesome name={iconName} size={width * 0.06} color="#2c2c2c" />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#393939',
    padding: width * 0.04,
    borderRadius: width * 0.04,
    alignItems: 'center',
    marginBottom: height * 0.015,
  },
  iconContainer: {
    width: width * 0.13,
    height: width * 0.13,
    borderRadius: width * 0.065,
    backgroundColor: '#f1c40f',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: width * 0.04,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
    fontSize: getResponsiveFontSize(15),
    marginBottom: height * 0.005,
  },
  description: {
    color: '#E0E0E0',
    fontFamily: 'Poppins-Regular',
    fontSize: getResponsiveFontSize(13),
    lineHeight: getResponsiveFontSize(18),
  },
  date: {
    color: '#A0A0E0',
    fontFamily: 'Poppins-Regular',
    fontSize: getResponsiveFontSize(11),
    textAlign: 'right',
    marginTop: height * 0.01,
  },
});