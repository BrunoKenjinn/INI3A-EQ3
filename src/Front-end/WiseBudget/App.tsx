import './global.css'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator} from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import TelaInicial from './screens/TelaInicial';
import TelaCadastro from './screens/TelaCadastro';
import TelaCategorias from './screens/TelaCategorias';
import TelaAdicionarCategoria from './screens/TelaAdicionarCategoria';
import TelaEditarCategoria from './screens/TelaEditarCategoria';
import TelaLogin from './screens/TelaLogin';
import TelaHome from './screens/TelaHome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const Stack = createNativeStackNavigator();



export default function App() {

  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
    ...FontAwesome5.font
  });

  if (!fontsLoaded) {
    return null; // ou um splash screen
  }
  
  return (
      <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name="TelaHome" component={TelaHome} options={{headerShown: false}}/>
            <Stack.Screen name="TelaInicial" component={TelaInicial} option s={{headerShown: false}}/>
            <Stack.Screen name="TelaLogin" component={TelaLogin} options={{headerShown: false}}/>
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
