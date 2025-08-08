import { Image, SafeAreaView, Text, View } from 'react-native'
import { Header } from '../components/header'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function TelaPerfil() {
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#2c2c2c'}}>
            <View style={{flex: 1}}>
                <Header 
                    leftIconName="arrow-left"
                    leftIconColor="#f1c40f"
                    leftIconSize={24}
                    leftIconComponent={FontAwesome5}
                    title=""
                    rightIconName="bell"
                    rightIconColor="#f1c40f"
                    rightIconSize={24}
                    rightIconComponent={FontAwesome5}
                />

                <Image source={require('../assets/images/FotoPerfil.png')}/>

                <View style={{position: 'absolute', bottom: 0, left: 0,right: 0,backgroundColor: '#', borderTopLeftRadius: 20, borderTopRightRadius: 20, zIndex: 99}}>
                    
                </View>
            </View>  
        </SafeAreaView>
    )
}