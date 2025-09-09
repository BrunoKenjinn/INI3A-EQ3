import { Image, SafeAreaView, Text, TouchableOpacity, View, StyleSheet } from 'react-native'
import { Header } from '../components/header'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useAuth } from '../App';
import CustomBottomTab from '../components/CustomBottomTab';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import useApi from '../hooks/useApi';
import { Icon } from 'react-native-elements'


export default function TelaConfigs({navigation}) {
return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#2c2c2c', height:'100%', width:'100%'}}>
            <View style={{ flex: 1, position: 'relative' }}>
                <Header
                    leftIconName="arrow-left"
                    leftIconColor="#f1c40f"
                    leftIconSize={24}
                    leftIconComponent={FontAwesome5}
                    title="Configs"
                    rightIconName="sliders-h"
                    rightIconColor="#f1c40f"
                    rightIconSize={24}
                    rightIconComponent={FontAwesome5}
                />
                

                <View style={{ position: 'center', bottom: 0, left: 0, right: 0, backgroundColor: '#2c2c2c'}}>
                   <View style={styles.botoes}>
                    <TouchableOpacity style={styles.botao}>
                        <View style={styles.iconContainer}>
                        <FontAwesome5 name="user" size={20} color="#f1c40f" />
                        </View>
                        <Text style={styles.text}>Editar Perfil</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.botao}>
                        <View style={styles.iconContainer}>
                        <FontAwesome5 name="key" size={20} color="#f1c40f" />
                        </View>
                        <Text style={styles.text}>Alterar Senha</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.botao}>
                        <View style={styles.iconContainer}>
                        <FontAwesome5 name="bell" size={20} color="#f1c40f" />
                        </View>
                        <Text style={styles.text}>Configs De Notificacoes</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.botao}>
                        <View style={styles.iconContainer}>
                        <FontAwesome5 name="trash-alt" size={20} color="#f1c40f" />
                        </View>
                        <Text style={styles.text}>Deletar Conta</Text>
                    </TouchableOpacity>
                    </View>
                </View>

                <CustomBottomTab />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  botoes: {
    flexDirection: "column",
    paddingTop: 90,
    padding: 50,
    gap: 20,
  },
  botao: {
    flexDirection: "row",          // ícone e texto lado a lado
    alignItems: "center",          // centraliza verticalmente
    paddingVertical: 12,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,              // círculo
    borderWidth: 1.5,
    borderColor: "#f1c40f",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginLeft: 15,
    fontSize: 18,
    color: "#f1c40f",
    fontFamily: "Poppins-Regular",
  },
});

