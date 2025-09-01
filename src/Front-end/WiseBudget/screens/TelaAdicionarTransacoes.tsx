import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Switch,
  ScrollView,
} from "react-native";
import { Header } from "../components/header";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import useApi from "../hooks/useApi";

type Categoria = {
  id: number;
  nome: string;
};

export default function TelaAdicionarTransacoes({ navigation }) {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [fonte, setFonte] = useState("");
  const [selectedValue, setSelectedValue] = useState("entrada");
  const [valor, setValor] = useState("");
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [recorrente, setRecorrente] = useState(false);
  const [frequencia, setFrequencia] = useState("");

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

        if (response.data.length > 0) {
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

      const ano = date.getFullYear();
      const mes = String(date.getMonth() + 1).padStart(2, "0");
      const dia = String(date.getDate()).padStart(2, "0");

      const dataFormatada = `${ano}-${mes}-${dia}`;

      const response = await axios.post(
        url + "/api/transacoes",
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
      console.log("Transação criada:", response.data);
      navigation.navigate("TelaHome");
    } catch (error) {
      console.error(
        "Erro ao salvar transação:",
        error.response?.data || error.message
      );
      Alert.alert("Erro", "Não foi possível salvar a transação.");
    }
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
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Header
        leftIconName="times"
        leftIconColor="#f1c40f"
        leftIconSize={24}
        leftIconComponent={FontAwesome5}
        title="Adicionar Transação"
        rightIconName=""
        rightIconColor=""
        rightIconSize={0}
        rightIconComponent={FontAwesome5}
      />

      <View style={{ paddingHorizontal: 20 }}>
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              textAlign: "center",
              fontFamily: "Poppins-Regular",
              color: "#fdfdfd",
            }}
          >
            Qual o valor da transação?
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                color: "#fdfdfd",
                fontSize: 45,
                opacity: 0.5,
                fontFamily: "Poppins-Bold",
                marginRight: 5,
              }}
            >
              R$
            </Text>
            <TextInput
              placeholder="0,00"
              placeholderTextColor={"#393939"}
              style={{
                height: 150,
                fontSize: 80,
                fontFamily: "Poppins-Bold",
                color: "#fdfdfd",
                flex: 1,
                textAlignVertical: "center",
              }}
              value={valor}
              onChangeText={setValor}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View>
          <Text style={styles.textInput}>Qual a fonte da transação?</Text>
          <View style={styles.inputAreaCor}>
            <TextInput
              placeholder="Fonte da transação"
              placeholderTextColor="#ccc"
              style={styles.input}
              value={fonte}
              onChangeText={setFonte}
            />
          </View>

          <Text style={styles.textInput}>
            A transação é uma entrada ou saída?
          </Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedValue}
              onValueChange={(itemValue) => setSelectedValue(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Entrada/Crédito" value="entrada" />
              <Picker.Item label="Saída/Débito" value="saida" />
            </Picker>
          </View>

          <Text style={styles.textInput}>Qual a data</Text>
          <View style={styles.inputAreaCor}>
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
          </View>

          <Text style={styles.textInput}>Categoria</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={categoriaId}
              onValueChange={(itemValue) => setCategoriaId(itemValue)}
              style={styles.picker}
            >
              {categorias.map((cat) => (
                <Picker.Item key={cat.id} label={cat.nome} value={cat.id} />
              ))}
            </Picker>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 10,
            marginBottom: 20,
          }}
        >
          <Text style={{ color: "#fff", marginRight: 10 }}>É recorrente?</Text>
          <Switch
            value={recorrente}
            onValueChange={setRecorrente}
            thumbColor={recorrente ? "#f1c40f" : "#fff"}
            trackColor={{ false: "#767577", true: "#f1c40f" }}
          />
        </View>

        {recorrente && (
          <>
            <Text style={styles.textInput}>Frequência</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={frequencia}
                onValueChange={(itemValue) => setFrequencia(itemValue)}
                style={styles.picker}
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

        <View style={{ alignItems: "center", marginTop: 20 }}>
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.textButton}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2c2c2c",
  },
  input: {
    backgroundColor: "#393939",
    padding: 10,
    borderRadius: 10,
    width: "100%",
    color: "#ffffff",
    height: 45,
  },
  inputAreaCor: {
    width: "100%",
    marginTop: 8,
    marginBottom: 20,
  },
  textInput: {
    color: "#ffffff",
  },
  buttonDate: {
    height: 45,
    backgroundColor: "#393939",
    borderRadius: 10,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  textButtonDate: {
    color: "#ffffff",
  },
  pickerContainer: {
    backgroundColor: "#393939",
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 20,
    width: "100%",
  },

  picker: {
    height: 70,
    width: "100%",
    color: "#ffffff",
  },
  button: {
    backgroundColor: "#f1c40f",
    paddingVertical: 12,
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
  },
  textButton: {
    fontSize: 20,
    color: "#2c2c2c",
  },
});
