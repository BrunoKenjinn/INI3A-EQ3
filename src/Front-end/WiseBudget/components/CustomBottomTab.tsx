import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { NavigationProp, useNavigation } from '@react-navigation/native';

type RootStackParamList = {
  TelaHome: undefined;
  TelaPerfil: undefined;
};

export default function CustomBottomTab() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate('TelaHome')}>
        <FontAwesome name="home" size={24} color="#f1c40f" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabButton}>
        <FontAwesome name="search" size={24} color="#f1c40f" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabButton}>
        <FontAwesome name="bell" size={24} color="#f1c40f" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate('TelaPerfil')}>
        <FontAwesome name="user" size={24} color="#f1c40f" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#2c2c2c',
    height: 60,
    justifyContent: 'space-around',
    alignItems: 'center',   
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 101,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
