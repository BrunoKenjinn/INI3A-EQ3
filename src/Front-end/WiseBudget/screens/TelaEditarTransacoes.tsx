import {
    View,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    Switch,
    ScrollView,
    Dimensions,
    SafeAreaView
} from "react-native";
import { Header } from "../components/header";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import useApi from "../hooks/useApi";
import CustomBottomTab from "../components/CustomBottomTab";

const { width, height } = Dimensions.get("window");

const getResponsiveFontSize = (size: number) => {
    const scale = width / 375;
    return Math.round(size * scale);
};


type Categoria = {
    id: number;
    nome: string;
};

export default function TelaEditarTransacoes({ navigation, route }) {
    const { transacao } = route.params;
    const [date, setDate] = useState(new Date(transacao.data));
    const [show, setShow] = useState(false);
    const [fonte, setFonte] = useState(transacao.descricao);
    const [selectedValue, setSelectedValue] = useState(transacao.tipo);
    const [valor, setValor] = useState(String(transacao.valor));
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [categoriaId, setCategoriaId] = useState<number | null>(transacao.categoria_id || null);
    const [recorrente, setRecorrente] = useState(!!transacao.recorrente);
    const [frequencia, setFrequencia] = useState(transacao.frequencia || "");

    useEffect(() => {
        const fetchCategorias = async () => {
            let { url } = useApi();
            try {
                const token = await AsyncStorage.getItem("auth_token");
                const response = await axios.get(url + "/api/categorias", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });
                setCategorias(response.data);

                if (!categoriaId && response.data.length > 0) {
                    setCategoriaId(response.data[0].id);
                }
            } catch (error) {
                console.error(
                    "Erro ao carregar categorias:",
                    error.response?.data || error.message
                );
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
            let { url } = useApi();
            const token = await AsyncStorage.getItem("auth_token");
            const dataFormatada = date.toISOString().split('T')[0];

            await axios.put(
                `${url}/api/transacoes/${transacao.id}`,
                {
                    fonte: fonte,
                    valor: parseFloat(valor.replace(",", ".")),
                    tipo: selectedValue,
                    data: dataFormatada,
                    recorrente: recorrente,
                    frequencia: recorrente ? frequencia : null,
                    categoria_id: categoriaId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            );

            Alert.alert("Sucesso", "Transação atualizada com sucesso!");
            navigation.navigate("TelaHome");
        } catch (error) {
            console.error(
                "Erro ao atualizar transação:",
                error.response?.data || error.message
            );
            Alert.alert("Erro", "Não foi possível atualizar a transação.");
        }
    };

    const handleDelete = async () => {
        try {
            let { url } = useApi();
            const token = await AsyncStorage.getItem("auth_token");
            await axios.delete(`${url}/api/transacoes/${transacao.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });
            Alert.alert("Sucesso", "Transação excluída!");
            navigation.navigate("TelaHome");
        } catch (error) {
            console.error(
                "Erro ao excluir transação:",
                error.response?.data || error.message
            );
            Alert.alert("Erro", "Não foi possível excluir a transação.");
        }
    };

    const confirmDelete = () => {
        Alert.alert("Confirmação", "Deseja realmente excluir esta transação?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Excluir",
                style: "destructive",
                onPress: handleDelete,
            },
        ]);
    };


    const onChange = (event: any, selectedDate?: Date) => {
        setShow(false);
        if (selectedDate) {
            selectedDate.setHours(12, 0, 0, 0);
            setDate(selectedDate);
        }
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("pt-BR");
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header
                leftIconName="times"
                leftIconColor="#f1c40f"
                leftIconSize={width * 0.06}
                leftIconComponent={FontAwesome5}
                title="Editar Transação"
            />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.valorContainer}>
                    <Text style={styles.labelValor}>
                        Qual o valor da transação?
                    </Text>
                    <View style={styles.valorInputContainer}>
                        <Text style={styles.currencySymbol}>
                            R$
                        </Text>
                        <TextInput
                            placeholder="0,00"
                            placeholderTextColor={"#cccccc"}
                            style={styles.valorInput}
                            value={valor}
                            onChangeText={setValor}
                            keyboardType="numeric"
                        />
                    </View>
                </View>

                <View style={styles.formContainer}>
                    <Text style={styles.textInputLabel}>Qual a fonte da transação?</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            placeholder="Ex: Salário, Aluguel"
                            placeholderTextColor="#ccc"
                            style={styles.input}
                            value={fonte}
                            onChangeText={setFonte}
                        />
                    </View>

                    <Text style={styles.textInputLabel}>
                        A transação é uma entrada ou saída?
                    </Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={selectedValue}
                            onValueChange={setSelectedValue}
                            style={styles.picker}
                            dropdownIconColor="#ffffff"
                        >
                            <Picker.Item label="Entrada/Crédito" value="entrada" />
                            <Picker.Item label="Saída/Débito" value="saida" />
                        </Picker>
                    </View>

                    <Text style={styles.textInputLabel}>Qual a data</Text>
                    <TouchableOpacity
                        style={styles.buttonDate}
                        onPress={() => setShow(true)}
                    >
                        <Text style={styles.textButtonDate}>{formatDate(date)}</Text>
                    </TouchableOpacity>
                    {show && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display="default"
                            onChange={onChange}
                        />
                    )}

                    <Text style={styles.textInputLabel}>Categoria</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={categoriaId}
                            onValueChange={(itemValue) => setCategoriaId(itemValue)}
                            style={styles.picker}
                            dropdownIconColor="#ffffff"
                        >
                            {categorias.map((cat) => (
                                <Picker.Item key={cat.id} label={cat.nome} value={cat.id} />
                            ))}
                        </Picker>
                    </View>

                    <View style={styles.switchContainer}>
                        <Text style={styles.switchLabel}>É recorrente?</Text>
                        <Switch
                            value={recorrente}
                            onValueChange={setRecorrente}
                            thumbColor={recorrente ? "#f1c40f" : "#fff"}
                            trackColor={{ false: "#767577", true: "#f1c40f" }}
                        />
                    </View>

                    {recorrente && (
                        <>
                            <Text style={styles.textInputLabel}>Frequência</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={frequencia}
                                    onValueChange={setFrequencia}
                                    style={styles.picker}
                                    dropdownIconColor="#ffffff"
                                >
                                    <Picker.Item label="Selecione a frequência" value="" />
                                    <Picker.Item label="Diária" value="diaria" />
                                    <Picker.Item label="Semanal" value="semanal" />
                                    <Picker.Item label="Mensal" value="mensal" />
                                    <Picker.Item label="Anual" value="anual" />
                                </Picker>
                            </View>
                        </>
                    )}
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.button} onPress={handleSave}>
                            <Text style={styles.textButton}>Salvar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={confirmDelete}>
                            <Text style={styles.textButton}>Excluir</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            <CustomBottomTab />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#2c2c2c",
    },
    scrollContainer: {
        paddingBottom: height * 0.1,
    },
    valorContainer: {
        alignItems: "center",
        paddingHorizontal: width * 0.05,
    },
    labelValor: {
        textAlign: "center",
        fontFamily: "Poppins-Regular",
        color: "#fdfdfd",
        fontSize: getResponsiveFontSize(14),
    },
    valorInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: '100%',
    },
    currencySymbol: {
        color: "#fdfdfd",
        fontSize: getResponsiveFontSize(45),
        opacity: 0.5,
        fontFamily: "Poppins-Bold",
        marginRight: width * 0.02,
    },
    valorInput: {
        minHeight: height * 0.15,
        fontSize: getResponsiveFontSize(80),
        fontFamily: "Poppins-Bold",
        color: "#fdfdfd",
    },
    formContainer: {
        paddingHorizontal: width * 0.05,
    },
    input: {
        backgroundColor: "#393939",
        padding: width * 0.03,
        borderRadius: 10,
        width: "100%",
        color: "#ffffff",
        height: height * 0.06,
        fontSize: getResponsiveFontSize(14),
    },
    inputWrapper: {
        width: "100%",
    },
    textInputLabel: {
        color: "#ffffff",
        fontSize: getResponsiveFontSize(14),
        fontFamily: 'Poppins-Regular',
        marginBottom: height * 0.01,
        marginTop: height * 0.02,
    },
    buttonDate: {
        height: height * 0.06,
        backgroundColor: "#393939",
        borderRadius: 10,
        justifyContent: "center",
        paddingHorizontal: width * 0.03,
    },
    textButtonDate: {
        color: "#ffffff",
        fontSize: getResponsiveFontSize(14),
    },
    pickerContainer: {
        backgroundColor: "#393939",
        borderRadius: 10,
        height: height * 0.06,
        justifyContent: "center",
        width: "100%",
        overflow: 'hidden',
    },
    picker: {
        height: '100%',
        width: "100%",
        color: "#ffffff",
        backgroundColor: "#393939",
        fontSize: getResponsiveFontSize(14),
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: height * 0.03,
    },
    button: {
        backgroundColor: "#f1c40f",
        paddingVertical: height * 0.018,
        width: "48%",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 15,
    },
    textButton: {
        fontSize: getResponsiveFontSize(18),
        color: "#393939",
        fontFamily: 'Poppins-Bold',
    },
    switchContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between',
        marginTop: height * 0.03,
        marginBottom: height * 0.01,
    },
    switchLabel: {
        color: '#fff',
        fontSize: getResponsiveFontSize(14),
        fontFamily: 'Poppins-Regular',
    },
});
