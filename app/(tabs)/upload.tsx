import { useMeme } from "@/context/MemeContext";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function UploadScreen() {
  const { setImage } = useMeme();

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setImage(result.assets[0].uri);
        // Volver al editor después de seleccionar la imagen
        router.back();
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo seleccionar la imagen");
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permiso denegado",
          "Necesitamos permiso para usar la cámara",
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setImage(result.assets[0].uri);
        router.back();
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo tomar la foto");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Añadir imagen</Text>

      <TouchableOpacity style={styles.optionButton} onPress={pickImage}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🖼️</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.optionTitle}>Galería</Text>
          <Text style={styles.optionDescription}>
            Selecciona una imagen de tu biblioteca
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionButton} onPress={takePhoto}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>📸</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.optionTitle}>Cámara</Text>
          <Text style={styles.optionDescription}>
            Toma una foto ahora mismo
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          Las imágenes se ajustarán automáticamente a formato cuadrado (1:1)
          para crear tu meme.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 30,
    color: "#333",
  },
  optionButton: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  icon: {
    fontSize: 30,
  },
  textContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  optionDescription: {
    fontSize: 14,
    color: "#666",
  },
  infoBox: {
    backgroundColor: "#e3f2fd",
    padding: 20,
    borderRadius: 15,
    marginTop: 30,
    borderWidth: 1,
    borderColor: "#2196F3",
  },
  infoText: {
    fontSize: 14,
    color: "#1976D2",
    textAlign: "center",
    lineHeight: 20,
  },
});
