import { View, StyleSheet, Text, TextInput, TouchableOpacity, Alert } from "react-native"
import { SafeAreaView } from 'react-native-safe-area-context'
import { Header } from "../components/header";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Picker } from "@react-native-picker/picker";
import DatePicker from 'react-native-date-picker'
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import useApi from "../hooks/useApi";

type Categoria = {
  id: number;
  nome: string;
};

export default function TelaAdicionarTransação({navigation}) {
    const [date, setDate] = useState(new Date());
    const [open, setOpen] = useState(false);
    const [fonte,setFonte] = useState('');
    const [selectedValue, setSelectedValue] = useState('entrada');
    const [valor, setValor] = useState('');
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [categoriaId, setCategoriaId] = useState(1);

        useEffect(() => {
        const fetchCategorias = async () => {
            let {url} = useApi();
            try {
                const token = await AsyncStorage.getItem("auth_token");
                const response = await axios.get(url + "/api/categorias", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });
                setCategorias(response.data);

                if (response.data.length > 0) {
                    setCategoriaId(response.data[0].id);
                }
            } catch (error) {
                console.error("Erro ao carregar categorias:", error.response?.data || error.message);
                Alert.alert("Erro", "Não foi possível carregar as categorias.");
            }
        };

        fetchCategorias();
    }, []);

    const handleSave = async () => {
        if (!categoriaId) {
            Alert.alert("Aviso", "Selecione uma categoria.");
            return;
        }

        try {
            let {url} = useApi();
            const token = await AsyncStorage.getItem("auth_token");

            const response = await axios.post(url + "/api/transacoes", {
                fonte: fonte,
                valor: parseFloat(valor.replace(",", ".")),
                tipo: selectedValue,
                data: date.toISOString().split("T")[0],
                recorrente: false,
                frequencia: null,
                proxima_execucao: null,
                categoria_id: categoriaId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json"
                }
            });

            console.log("Transação criada:", response.data);
            navigation.navigate("TelaHome");

        } catch (error) {
            console.error("Erro ao salvar transação:", error.response?.data || error.message);
            Alert.alert("Erro", "Não foi possível salvar a transação.");
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'right', 'bottom', 'left']}>
            <Header leftIconName="times"
                    leftIconColor="#f1c40f"
                    leftIconSize={24}
                    leftIconComponent={FontAwesome5}
                    title="Adicionar Transação"
                    rightIconName=""
                    rightIconColor=""
                    rightIconSize={0}
                    rightIconComponent={FontAwesome5}/>

            <View style={{paddingHorizontal: 20}}>
                <View style={{display: 'flex'}}>
                    <Text style={{textAlign: 'center', fontFamily: 'Poppins-Regular', color: '#fdfdfd'}}>Qual o valor da transação?</Text>
                    <View style={{display: 'flex', flexDirection: 'row'}}>
                        <Text style={{color: '#fdfdfd', fontSize: 45, opacity: 0.5, fontFamily:'Poppins-Bold', marginTop: 20}}>R$</Text>
                        <TextInput 
                            placeholder="0,00" 
                            placeholderTextColor={'#393939'} 
                            style={{height: 100, fontSize: 80, fontFamily: 'Poppins-Bold', color: '#fdfdfd', width: 332}}
                            value={valor}
                            onChangeText={valor => setValor(valor)}
                         />
                    </View>
                </View>
                <View>
                    <View>
                        <Text style={styles.textInput}>Qual a fonte da transação?</Text>
                        <View style={styles.inputAreaCor}>
                            <TextInput
                                placeholder='Fonte da transação'
                                style={styles.input}
                                value={fonte}
                                onChangeText={fonte => setFonte(fonte)}
                            />
                        </View>

                        <Text style={styles.textInput}>A transação é uma entrada ou saída?</Text>
                        <View style={styles.inputAreaCor}>
                            <Picker
                                selectedValue={selectedValue}
                                onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                                style={{ height: 40, backgroundColor: '#393939', borderRadius: 20, color: '#ffffff' }}
                                >
                                <Picker.Item label="Entrada/Crédito" value="entrada" />
                                <Picker.Item label="Saída/Débito" value="saida" />
                            </Picker>
                        </View>

                        <Text style={styles.textInput}>Qual a data</Text>
                        <View style={styles.inputAreaCor}>
                            <TouchableOpacity style={styles.buttonDate} onPress={() => setOpen(true)}>
                                <Text style={styles.textButtonDate}>Selecionar data</Text>
                            </TouchableOpacity>
                            <DatePicker
                                modal
                                open={open}
                                date={date}
                                onConfirm={(date) => {
                                setOpen(false)
                                setDate(date)
                                }}
                                onCancel={() => {
                                setOpen(false)
                                }}
                            />
                        </View>

                        <Text style={styles.textInput}>Categoria</Text>
                        <View style={styles.inputAreaCor}>
                        <Picker
                            selectedValue={categoriaId}
                            onValueChange={(itemValue) => setCategoriaId(itemValue)}
                            style={{ height: 40, backgroundColor: '#393939', borderRadius: 20, color: '#ffffff' }}
                        >
                            {categorias.map((cat) => (
                                <Picker.Item key={cat.id} label={cat.nome} value={cat.id} />
                            ))}
                        </Picker>
                        </View>

                    </View>
                </View>
                <View style={{alignItems: 'center'}}>
                    <TouchableOpacity style={styles.button} onPress={handleSave}>
                        <Text style={styles.textButton}>Salvar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2c2c2c',
    },
    input: {
        backgroundColor: '#393939',
        padding: 10,
        borderRadius: 20,
        width: '100%',
        color: '#ffffff'
    },
    inputAreaCor: {
        width: '90%',
        margin:20,
    },
    textInput: {
        color: '#ffffff',
        marginLeft: 15,
        marginBottom: 5
    },
    buttonDate:{
        height: 40,
        backgroundColor: '#393939',
        borderRadius: 20,
        justifyContent: 'center',    
    },
    textButtonDate:{
        color: '#ffffff',
    },
    button: {
        backgroundColor: '#f1c40f',
        padding: 5,
        width: 120,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        marginTop: 20
    },
    textButton: {
        fontSize: 20,
        fontWeight: 'bold'
    }
});