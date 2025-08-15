import { View, Text } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';

type Props = {
  descricao: string;
  valor: number | string; 
  hora: string;
  icone: React.ComponentProps<typeof FontAwesome>['name'];
  cor: string;
};

export function TransacaoCard({ descricao, valor, hora, icone,  cor}: Props) {
  const valorNumerico = parseFloat(String(valor)) || 0;

  return (
    <View style={{
      width: '100%',
      backgroundColor: '#EAE3C9',
      borderRadius: 20,
      marginTop: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20
    }}>
      <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
        <View style={{ 
            height: 50, 
            width: 50, 
            borderRadius: 10, 
            backgroundColor: '#393939',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <FontAwesome name={icone} size={24} color={cor} />
        </View>
        <View>
          <Text style={{ fontFamily: 'Poppins-Bold' }}>{descricao}</Text>
          <Text style={{ fontFamily: 'Poppins-Regular', color: '#B7B7B7' }}>{hora}</Text>
        </View>
      </View>
      <Text style={{ fontFamily: 'Poppins-Bold' }}>R${valorNumerico.toFixed(2).replace('.', ',')}</Text>
    </View>
  );
}