import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator} from '@react-navigation/native-stack';
import { TelaInicial } from './screens/TelaInicial';
import { TelaCadastro } from './screens/TelaCadastro';
import { TelaCategorias } from './screens/TelaCategorias';
import './global.css'
import TelaAdicionarCategoria from './screens/TelaAdicionarCategoria';
import TelaEditarCategoria from './screens/TelaEditarCategoria';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name="TelaCategorias" component={TelaCategorias} options={{headerShown: false}}/>
            <Stack.Screen name="TelaAdicionarCategoria" component={TelaAdicionarCategoria} options={{headerShown: false}}/>
            <Stack.Screen name="TelaInicial" component={TelaInicial} options={{headerShown: false}}/>
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
