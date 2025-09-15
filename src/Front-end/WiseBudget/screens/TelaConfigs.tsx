import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
  Pressable,
  Modal,
} from "react-native";
import { Header } from "../components/header";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import CustomBottomTab from "../components/CustomBottomTab";
import { useState } from "react";

const { width, height } = Dimensions.get("window");

const getResponsiveFontSize = (size: number) => {
  const scale = width / 375;
  return Math.round(size * scale);
};

export default function TelaConfigs({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<"ajuda" | "sobre" | null>(null);

  const abrirModal = (tipo: "ajuda" | "sobre") => {
    setModalType(tipo);
    setModalVisible(true);
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#2c2c2c",
        height: "100%",
        width: "100%",
      }}
    >
      <View style={{ flex: 1, position: "relative" }}>
        <Header
          leftIconName="arrow-left"
          leftIconColor="#f1c40f"
          leftIconSize={24}
          leftIconComponent={FontAwesome5}
          title="Configs"
          rightIconName="sliders-h"
          rightIconColor="#f1c40f"
          rightIconSize={24}
          rightIconComponent={FontAwesome5}
        />

        <View
          style={{
            position: "center",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "#2c2c2c",
          }}
        >
          <View style={styles.botoes}>
            <TouchableOpacity style={styles.botao}>
              <View style={styles.iconContainer}>
                <FontAwesome5
                  name="adjust"
                  size={width * 0.05}
                  color="#f1c40f"
                />
              </View>
              <Text style={styles.text}>Tema</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botao}
              onPress={() => navigation.navigate("TelaConfigsNotificacoes")}
            >
              <View style={styles.iconContainer}>
                <FontAwesome5 name="bell" size={width * 0.05} color="#f1c40f" />
              </View>
              <Text style={styles.text}>Configs De Notificacoes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botao}
              onPress={() => abrirModal("ajuda")}
            >
              <View style={styles.iconContainer}>
                <FontAwesome5
                  name="question-circle"
                  size={width * 0.05}
                  color="#f1c40f"
                />
              </View>
              <Text style={styles.text}>Ajuda e Suporte</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botao}
              onPress={() => abrirModal("sobre")}
            >
              <View style={styles.iconContainer}>
                <FontAwesome5
                  name="info-circle"
                  size={width * 0.05}
                  color="#f1c40f"
                />
              </View>
              <Text style={styles.text}>Sobre o App</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Modal
          transparent
          visible={modalVisible}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {modalType === "ajuda" && (
                <>
                  <Text style={styles.modalTitle}>Ajuda e Suporte</Text>
                  <Text style={styles.modalText}>
                    <b>📧 Email: </b> suporte@meuapp.com
                  </Text>
                  <Text style={styles.modalText}>
                    <b>📞 Telefone: </b> (11) 99999-9999
                  </Text>
                  <Text style={styles.modalText}>
                   <b> 💬 WhatsApp: </b>(11) 98888-8888
                  </Text>
                </>
              )}
              {modalType === "sobre" && (
                <>
                  <Text style={styles.modalTitle}>Sobre o Aplicativo</Text>
                  <Text style={styles.modalText}><b>Versão:</b> 1.0.0</Text>
                  <Text style={styles.modalText}><b>Criado em: </b> 2025</Text>
                  <Text style={styles.modalText}>
                    <b>Desenvolvido por: </b>
                  </Text>
                  <Text style={styles.modalText}>Bruno Kenji Nomura</Text>
                  <Text style={styles.modalText}>Murilo Yuki Kasama Nakata</Text>
                  <Text style={styles.modalText}>Thomaz Ferreira De Godoi Bueno</Text>
                  <Text style={styles.modalText}>Pedro Benjamin Mattar Damiance</Text>
                  <Text style={styles.modalText}>Gabriel Alejandro Castillo Medina</Text>
                  <Text style={styles.modalText}>Raul Garbulho Cury</Text>
                </>
              )}

              <Pressable
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Fechar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        <CustomBottomTab />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  botoes: {
    flexDirection: "column",
    paddingTop: height * 0.05,
    paddingHorizontal: width * 0.08,
    gap: height * 0.03,
  },
  botao: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: height * 0.02,
  },
  iconContainer: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: (width * 0.12) / 2,
    borderWidth: 1.5,
    borderColor: "#f1c40f",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginLeft: width * 0.04,
    fontSize: getResponsiveFontSize(16),
    color: "#f1c40f",
    fontFamily: "Poppins-Regular",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: width * 0.8,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  modalText: {
    fontSize: getResponsiveFontSize(14),
    marginBottom: 6,
    color: "#444",
  },
  modalButton: {
    marginTop: 15,
    backgroundColor: "#f1c40f",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalButtonText: {
    fontSize: getResponsiveFontSize(14),
    fontWeight: "bold",
    color: "#2c2c2c",
  },
});
