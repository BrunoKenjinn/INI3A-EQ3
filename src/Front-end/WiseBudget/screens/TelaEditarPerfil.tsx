import { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from "react-native";
import axios from "axios";
import { MaskedTextInput } from "react-native-mask-text";
import { Header } from "../components/header";
import { useAuth } from "../App";
import useApi from "../hooks/useApi";
import * as ImagePicker from "expo-image-picker";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const { width, height } = Dimensions.get("window");

const getResponsiveFontSize = (size: number) => {
  const scale = width / 375;
  return Math.round(size * scale);
};

export default function TelaEditarPerfil({ navigation, route }) {
  const { usuario } = route.params;
  const { signOut, setUser } = useAuth();
  const [foto, setFoto] = useState(usuario?.foto || null);
  const [nome, setNome] = useState(usuario?.nome || "");
  const [email, setEmail] = useState(usuario?.email || "");
  const [cpf, setCpf] = useState(usuario?.cpf || "");
  const [celular, setCelular] = useState(usuario?.celular || "");

  const formatarDataParaInput = (data?: string) => {
    if (!data) return "";
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  const [dataNascimento, setDataNascimento] = useState(
    formatarDataParaInput(usuario?.data_nascimento)
  );

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled) {
      setFoto("data:image/jpeg;base64," + result.assets[0].base64);
    }
  };

  const handleUpdate = async () => {

    const dadosParaEnviar: any = {
      nome,
      email,
      cpf: cpf.replace(/\D/g, ""),
      celular: celular.replace(/\D/g, ""),
      data_nascimento: dataNascimento,
    };
    if (foto && !foto.startsWith("http")) {
      dadosParaEnviar.foto = foto;
    }

    try {
      let { url } = useApi();
      const response = await axios.put(url + `/api/usuario`, dadosParaEnviar, {
        headers: {
          Accept: "application/json",
        },
      });
      setUser(response.data);
      Alert.alert("Sucesso", "Perfil atualizado com sucesso.");
      navigation.goBack();
    } catch (error) {
      console.log("Erro ao atualizar perfil:", error.response?.data);
      const errors = error.response?.data?.errors;
      if (errors) {
        const messages = Object.values(errors).flat().join("\n");
        Alert.alert("Erro de Validação", messages);
      } else {
        const errorMessage =
          error.response?.data?.message ||
          "Não foi possível atualizar. Tente novamente.";
        Alert.alert("Erro", errorMessage);
      }
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Excluir Conta",
      "Tem a certeza de que deseja excluir a sua conta? Esta ação é irreversível.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              let { url } = useApi();
              await axios.delete(url + `/api/usuario`);
              Alert.alert("Sucesso", "A sua conta foi excluída.");
              signOut();
            } catch (error) {
              console.error("Erro ao excluir conta:", error.response?.data);
              Alert.alert("Erro", "Não foi possível excluir a sua conta.");
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        leftIconName="arrow-left"
        leftIconSize={width * 0.06}
        leftIconColor="#f1c40f"
        leftIconComponent={FontAwesome5}
        title="Editar Perfil"
        onLeftPress={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
          <Image
            source={
              foto ? { uri: foto } : require("../assets/images/FotoPerfil.png")
            }
            style={styles.avatar}
          />
          <View style={styles.cameraIcon}>
            <FontAwesome5
              name="camera"
              size={getResponsiveFontSize(18)}
              color="#2c2c2c"
            />
          </View>
        </TouchableOpacity>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome Completo</Text>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholderTextColor="#a3a3a3"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholderTextColor="rgba(100, 100, 100, 0.7)"
            editable={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>CPF</Text>
          <MaskedTextInput
            style={styles.input}
            value={cpf}
            onChangeText={(text) => setCpf(text)}
            mask="999.999.999-99"
            keyboardType="numeric"
            editable={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Celular</Text>
          <MaskedTextInput
            style={styles.input}
            value={celular}
            onChangeText={(text) => setCelular(text)}
            mask="(99) 99999-9999"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Data de Nascimento</Text>
          <MaskedTextInput
            style={styles.input}
            value={dataNascimento}
            onChangeText={(text) => setDataNascimento(text)}
            mask="99/99/9999"
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.textButton}>Salvar Alterações</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Text style={[styles.textButton, styles.deleteButtonText]}>
            Excluir Conta
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#2c2c2c",
  },
  container: {
    alignItems: "center",
    paddingBottom: height * 0.05,
  },
  avatarContainer: {
    alignItems: "center",
    marginVertical: height * 0.03,
  },
  avatar: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: (width * 0.3) / 2,
    borderWidth: 3,
    borderColor: "#f1c40f",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#f1c40f",
    padding: width * 0.02,
    borderRadius: (width * 0.1) / 2,
  },
  inputGroup: {
    width: "90%",
    marginBottom: height * 0.02,
  },
  label: {
    color: "#ffffff",
    marginBottom: height * 0.01,
    fontSize: getResponsiveFontSize(14),
    fontFamily: "Poppins-Regular",
  },
  input: {
    backgroundColor: "#393939",
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.04,
    borderRadius: 15,
    color: "#ffffff",
    width: "100%",
    fontSize: getResponsiveFontSize(14),
    fontFamily: "Poppins-Regular",
  },
  button: {
    backgroundColor: "#f1c40f",
    paddingVertical: height * 0.02,
    width: "90%",
    alignItems: "center",
    borderRadius: 15,
    marginTop: height * 0.02,
  },
  textButton: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: "bold",
    color: "#2c2c2c",
    fontFamily: "Poppins-Bold",
  },
  deleteButton: {
    backgroundColor: "transparent",
    borderColor: "#E74C3C",
    borderWidth: 2,
  },
  deleteButtonText: {
    color: "#E74C3C",
  },
});
