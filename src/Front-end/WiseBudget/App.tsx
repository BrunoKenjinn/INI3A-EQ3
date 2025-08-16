import './global.css'
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator} from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TelaInicial from './screens/TelaInicial';
import TelaCadastro from './screens/TelaCadastro';
import TelaCategorias from './screens/TelaCategorias';
import TelaAdicionarCategoria from './screens/TelaAdicionarCategoria';
import TelaEditarCategoria from './screens/TelaEditarCategoria';
import TelaLogin from './screens/TelaLogin';
import TelaHome from './screens/TelaHome';
import TelaOrientacao from './screens/TelaOrientacao';
import TelaTransacoes from './screens/TelaTransacoes';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import TelaAdicionarAtalho from './screens/TalaAdicionarAtalho';
import TelaPerfil from './screens/TelaPerfil';
import TelaEditarPerfil from './screens/TelaEditarPerfil';
import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import TelaAdicionarTransação from './screens/TeleAdicionarTransação';

const Stack = createNativeStackNavigator();
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="TelaInicial" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TelaOrientacao" component={TelaOrientacao} />
      <Stack.Screen name="TelaInicial" component={TelaInicial} />
      <Stack.Screen name="TelaLogin" component={TelaLogin} />
      <Stack.Screen name="TelaCadastro" component={TelaCadastro} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
      
    <Stack.Navigator initialRouteName="TelaHome" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TelaHome" component={TelaHome} />
      <Stack.Screen name="TelaCategorias" component={TelaCategorias} />
      <Stack.Screen name="TelaAdicionarCategoria" component={TelaAdicionarCategoria} />
      <Stack.Screen name="TelaEditarCategoria" component={TelaEditarCategoria} />
      <Stack.Screen name="TelaAdicionarAtalho" component={TelaAdicionarAtalho} />
      <Stack.Screen name="TelaPerfil" component={TelaPerfil} />
      <Stack.Screen name="TelaEditarPerfil" component={TelaEditarPerfil} />
      <Stack.Screen name ="TelaTransacoes" component = {TelaTransacoes} />
      <Stack.Screen name="TelaAdicionarTransação" component={TelaAdicionarTransação} />
    </Stack.Navigator>
  );
}

function OnboardingStack() {
    return (
        <Stack.Navigator initialRouteName="TelaOrientacao" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="TelaOrientacao" component={TelaOrientacao} />
            <Stack.Screen name="Auth" component={AuthStack} />
        </Stack.Navigator>
    )
}

function AuthProvider({ children }) {
  const [userToken, setUserToken] = useState(null);
  const [hasSeenOrientations, setHasSeenOrientations] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const signIn = async (token) => {
    try {
      await AsyncStorage.setItem('auth_token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUserToken(token);
    } catch (e) {
      console.error("Erro ao salvar token", e);
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('auth_token');
      delete axios.defaults.headers.common['Authorization'];
      setUserToken(null);
    } catch (e) {
      console.error("Erro ao remover token", e);
    }
  };

  const isLoggedIn = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUserToken(token);
      }
    } catch (e) {
      console.error("Erro ao buscar token", e);
    }
    setIsLoading(false);
  };
  
  const markOrientationsAsSeen = async () => {
    await AsyncStorage.setItem('hasSeenOrientations', 'true');
    setHasSeenOrientations(true);
  };

  useEffect(() => {
    const checkInitialState = async () => {
      try {
        const token = await AsyncStorage.getItem('auth_token');
        const seen = await AsyncStorage.getItem('hasSeenOrientations');
        
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          setUserToken(token);
        }
        if (seen === 'true') {
          setHasSeenOrientations(true);
        }
      } catch (e) {
        console.error("Erro ao buscar estado inicial", e);
      }
      setIsLoading(false);
    };
    checkInitialState();
  }, []);

  return (
    <AuthContext.Provider value={{ userToken, hasSeenOrientations, isLoading, signIn, signOut, markOrientationsAsSeen }}>
      {children}
    </AuthContext.Provider>
  );
}

function AppNavigator() {
  const { userToken, hasSeenOrientations, isLoading } = useAuth();

  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
    ...FontAwesome5.font
  });

  if (isLoading || !fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#2c2c2c' }}>
        <ActivityIndicator size="large" color="#f1c40f" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!hasSeenOrientations ? (
          <Stack.Screen name="Onboarding" component={OnboardingStack} />
        ) : userToken == null ? (
          <Stack.Screen name="Auth" component={AuthStack} />
        ) : (
          <Stack.Screen name="App" component={AppStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}



export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

