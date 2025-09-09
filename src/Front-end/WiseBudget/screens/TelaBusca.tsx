import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Switch, ScrollView, Dimensions, SafeAreaView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import RangeSlider from "rn-range-slider";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import useApi from "../hooks/useApi";
import { Header } from "../components/header";
import { TransacaoCard } from "../components/transacaoCard";
import CustomBottomTab from "../components/CustomBottomTab";

const { width, height } = Dimensions.get("window");

const getResponsiveFontSize = (size) => {
    const scale = width / 375;
    return Math.round(size * scale);
};

const Thumb = () => <View style={styles.thumb} />;
const Rail = () => <View style={styles.rail} />;
const RailSelected = () => <View style={styles.railSelected} />;

interface Categoria {
    id: number;
    nome: string;
}

interface Transacao {
    id: number;
    descricao: string;
    valor: number;
    data: string;
    tipo: "receita" | "despesa";
    recorrente: boolean;
    created_at: string;
    icone: React.ComponentProps<typeof FontAwesome5>["name"];
    cor: string;
}

export default function TelaBusca({navigation}) {
    const { url } = useApi();
    const [nome, setNome] = useState("");
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [categoriaId, setCategoriaId] = useState<number | null>(null);
    const [tipo, setTipo] = useState<"todos" | "entrada" | "saida">("todos");
    const [valorMin, setValorMin] = useState(0);
    const [valorMax, setValorMax] = useState(5000);
    const [filtroValorAtivo, setFiltroValorAtivo] = useState(false);
    const [resultados, setResultados] = useState<Transacao[]>([]);
    const [pesquisado, setPesquisado] = useState(false);

    const [dataInicio, setDataInicio] = useState<Date | null>(null);
    const [dataFim, setDataFim] = useState<Date | null>(null);
    const [pickerInicioVisivel, setPickerInicioVisivel] = useState(false);
    const [pickerFimVisivel, setPickerFimVisivel] = useState(false);

    const renderThumb = useCallback(() => <Thumb />, []);
    const renderRail = useCallback(() => <Rail />, []);
    const renderRailSelected = useCallback(() => <RailSelected />, []);
    const handleValueChange = useCallback((low, high) => {
        setValorMin(low);
        setValorMax(high);
    }, []);

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const token = await AsyncStorage.getItem("auth_token");
                const response = await axios.get(`${url}/api/categorias`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCategorias(response.data);
            } catch (error) {
                Alert.alert("Erro", "Não foi possível carregar as categorias.");
            }
        };
        fetchCategorias();
    }, [url]);

    const handleBuscar = async () => {
        try {
            const token = await AsyncStorage.getItem("auth_token");
            const params: any = {};

            if (nome) params.nome = nome;
            if (categoriaId !== null) params.categoria_id = categoriaId;
            if (tipo !== 'todos') params.tipo = tipo;

            if (filtroValorAtivo) {
                params.valor_min = valorMin;
                params.valor_max = valorMax;
            }

            if (dataInicio) params.data_inicio = dataInicio.toISOString().split("T")[0];
            if (dataFim) params.data_fim = dataFim.toISOString().split("T")[0];

            const response = await axios.get(`${url}/api/busca-transacoes`, {
                headers: { Authorization: `Bearer ${token}` },
                params,
            });

            setResultados(response.data);
            setPesquisado(true);
        } catch (error) {
            Alert.alert("Erro", "Não foi possível buscar as transações.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header
                leftIconName="arrow-left"
                leftIconColor="#f1c40f"
                leftIconSize={width * 0.06}
                leftIconComponent={FontAwesome5}
                title="Busca"
                rightIconName="bell"
                rightIconColor="#f1c40f"
                rightIconSize={width * 0.06}
                rightIconComponent={FontAwesome5}
            />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.form}>
                    <Text style={styles.label}>Nome</Text>
                    <TextInput
                        style={styles.input}
                        value={nome}
                        onChangeText={setNome}
                        placeholder="Digite um nome para a busca"
                        placeholderTextColor="#888"
                    />

                    <Text style={styles.label}>Categoria</Text>
                    <View style={styles.pickerContainer}>
                        <Picker selectedValue={categoriaId} onValueChange={setCategoriaId} style={styles.picker} dropdownIconColor="#f1c40f">
                            <Picker.Item label="Todas as categorias" value={null} />
                            {categorias.map((cat) => (
                                <Picker.Item key={cat.id} label={cat.nome} value={cat.id} />
                            ))}
                        </Picker>
                    </View>

                    <Text style={styles.label}>Tipo</Text>
                    <View style={styles.pickerContainer}>
                        <Picker selectedValue={tipo} onValueChange={setTipo} style={styles.picker} dropdownIconColor="#f1c40f">
                            <Picker.Item label="Todos os tipos" value="todos" />
                            <Picker.Item label="Entrada/Crédito" value="entrada" />
                            <Picker.Item label="Saída/Débito" value="saida" />
                            <Picker.Item label="Recorrente" value="recorrente" />
                        </Picker>
                    </View>

                    <View style={styles.switchRow}>
                        <Text style={styles.label}>Filtrar por valor</Text>
                        <Switch value={filtroValorAtivo} onValueChange={setFiltroValorAtivo} thumbColor={filtroValorAtivo ? "#f1c40f" : "#fff"} trackColor={{ false: "#767577", true: "#f1c40f" }} />
                    </View>

                    {filtroValorAtivo && (
                        <>
                            <Text style={styles.valorLabel}>Intervalo: R$ {valorMin} - R$ {valorMax}</Text>
                            <RangeSlider
                                style={styles.slider}
                                min={0}
                                max={5000}
                                step={10}
                                low={valorMin}
                                high={valorMax}
                                renderThumb={renderThumb}
                                renderRail={renderRail}
                                renderRailSelected={renderRailSelected}
                                onValueChanged={handleValueChange}
                            />
                        </>
                    )}

                    <View style={styles.row}>
                        <View style={styles.datePickerWrapper}>
                            <Text style={styles.label}>De</Text>
                            <TouchableOpacity style={styles.input} onPress={() => setPickerInicioVisivel(true)}>
                                <Text style={styles.textButtonDate}>
                                    {dataInicio ? dataInicio.toLocaleDateString("pt-BR") : "Data inicial"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.datePickerWrapper}>
                            <Text style={styles.label}>Até</Text>
                            <TouchableOpacity style={styles.input} onPress={() => setPickerFimVisivel(true)}>
                                <Text style={styles.textButtonDate}>
                                    {dataFim ? dataFim.toLocaleDateString("pt-BR") : "Data final"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <DateTimePickerModal
                        isVisible={pickerInicioVisivel}
                        mode="date"
                        onConfirm={(date) => { setDataInicio(date); setPickerInicioVisivel(false); }}
                        onCancel={() => setPickerInicioVisivel(false)}
                    />
                    <DateTimePickerModal
                        isVisible={pickerFimVisivel}
                        mode="date"
                        onConfirm={(date) => { setDataFim(date); setPickerFimVisivel(false); }}
                        onCancel={() => setPickerFimVisivel(false)}
                    />
                    <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity style={styles.searchButton} onPress={handleBuscar}>
                            <Text style={styles.textButton}>Buscar</Text>
                        </TouchableOpacity>
                    </View>

                    {pesquisado && (
                        <View style={styles.resultsContainer}>
                            <Text style={styles.label}>Resultados</Text>
                            {resultados.length === 0 ? (
                                <Text style={styles.placeholderText}>Nenhuma transação encontrada.</Text>
                            ) : (
                                resultados.map((item) => (
                                    <TransacaoCard
                                        key={item.id}
                                        descricao={item.descricao}
                                        data={new Date(item.data).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
                                        hora={new Date(item.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                        valor={item.valor}
                                        icone={item.icone}
                                        cor={item.cor}
                                        onPress={() =>
                                            navigation.navigate("TelaEditarTransacoes", { transacao: item })
                                        }
                                    />
                                ))
                            )}
                        </View>
                    )}
                </View>
            </ScrollView>
            <CustomBottomTab />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#2c2c2c"
    },
    scrollContainer: {
        paddingHorizontal: width * 0.05,
        paddingBottom: height * 0.1
    },
    form: {
        marginTop: height * 0.02,
    },
    label: {
        color: "#f1c40f",
        fontSize: getResponsiveFontSize(14),
        fontFamily: 'Poppins-Regular',
        marginBottom: height * 0.01,
        marginTop: height * 0.015,
    },
    valorLabel: {
        color: "#ffffff",
        textAlign: 'center',
        marginBottom: height * 0.01,
    },
    input: {
        backgroundColor: '#393939',
        color: '#ffffff',
        paddingHorizontal: width * 0.04,
        borderRadius: 10,
        height: height * 0.055,
        fontSize: getResponsiveFontSize(14),
        justifyContent: 'center',
    },
    pickerContainer: {
        backgroundColor: '#393939',
        borderRadius: 10,
        height: height * 0.055,
        justifyContent: 'center',
    },
    picker: {
        color: '#ffffff',
        backgroundColor: '#393939',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    datePickerWrapper: {
        width: '48%',
    },
    textButtonDate: {
        color: "#ffffff",
        fontSize: getResponsiveFontSize(14),
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: height * 0.02,
    },
    slider: {
        marginTop: height * 0.01,
        marginBottom: height * 0.01,
    },
    searchButton: {
        backgroundColor: "#f1c40f",
        paddingVertical: height * 0.01,
        width: "60%",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 15,
        marginTop: height * 0.03,
    },
    textButton: {
        fontSize: getResponsiveFontSize(18),
        color: "#2c2c2c",
        fontFamily: 'Poppins-Bold',
    },
    resultsContainer: {
        marginTop: height * 0.03,
    },
    placeholderText: {
        color: "#a3a3a3",
        fontSize: getResponsiveFontSize(14),
        textAlign: 'center',
        marginTop: 20,
    },
    thumb: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#f1c40f',
        borderColor: '#2c2c2c',
        borderWidth: 2,
    },
    rail: {
        flex: 1,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#393939',
    },
    railSelected: {
        height: 4,
        backgroundColor: '#f1c40f',
        borderRadius: 2,
    },
});

