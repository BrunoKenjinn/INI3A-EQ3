import './global.css'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
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
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import TelaAdicionarAtalho from './screens/TalaAdicionarAtalho';
import TelaPerfil from './screens/TelaPerfil';

const Stack = createNativeStackNavigator();



export default function App() {

  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
    ...FontAwesome5.font
  });

  if (!fontsLoaded) {
    return null;
  }
  
  return (
      <NavigationContainer>
        <Stack.Navigator> 
            <Stack.Screen name="TelaPerfil" component={TelaPerfil} options={{headerShown: false}}/>
            <Stack.Screen name="TelaInicial" component={TelaInicial} options={{headerShown: false}}/>
            <Stack.Screen name="TelaLogin" component={TelaLogin} options={{headerShown: false}}/>
            <Stack.Screen name="TelaHome" component={TelaHome} options={{headerShown: false}}/>
            <Stack.Screen name="TelaAdicionarAtalho" component={TelaAdicionarAtalho} options={{headerShown: false}}/>
            <Stack.Screen name="TelaOrientacao" component={TelaOrientacao} options={{headerShown: false}}/>
            <Stack.Screen name="TelaCategorias" component={TelaCategorias} options={{headerShown: false}}/>
            <Stack.Screen name="TelaAdicionarCategoria" component={TelaAdicionarCategoria} options={{headerShown: false}}/>
            <Stack.Screen name="TelaCadastro" component={TelaCadastro} options={{headerShown: false}}/>
            <Stack.Screen name="TelaEditarCategoria" component={TelaEditarCategoria} options={{headerShown: false}}/>    
        </Stack.Navigator>
    </NavigationContainer>
  
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
