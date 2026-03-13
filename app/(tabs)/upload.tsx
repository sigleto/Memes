import { useMeme } from "@/context/MemeContext";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ImageCropper from "../../components/ImageCropper";

export default function UploadScreen() {
  const { setImage } = useMeme();
  const [loading, setLoading] = useState(false);
  const [cropperVisible, setCropperVisible] = useState(false);
  const [tempImageUri, setTempImageUri] = useState<string | null>(null);

  const pickImage = async () => {
    try {
      setLoading(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false, // Importante: desactivamos el recorte nativo
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setTempImageUri(result.assets[0].uri);
        setCropperVisible(true);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo seleccionar la imagen");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const takePhoto = async () => {
    try {
      setLoading(true);

      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permiso denegado",
          "Necesitamos permiso para usar la cámara",
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false, // Importante: desactivamos el recorte nativo
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setTempImageUri(result.assets[0].uri);
        setCropperVisible(true);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo tomar la foto");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCropConfirm = (croppedUri: string) => {
    setImage(croppedUri);
    setCropperVisible(false);
    setTempImageUri(null);
    router.back();
  };

  const handleCropCancel = () => {
    setCropperVisible(false);
    setTempImageUri(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Añadir imagen</Text>

      <TouchableOpacity
        style={[styles.optionButton, loading && styles.disabledButton]}
        onPress={pickImage}
        disabled={loading}
      >
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

      <TouchableOpacity
        style={[styles.optionButton, loading && styles.disabledButton]}
        onPress={takePhoto}
        disabled={loading}
      >
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
          Arrastra el recuadro azul para seleccionar la parte de la imagen que
          quieres usar.
        </Text>
      </View>

      {tempImageUri && (
        <ImageCropper
          visible={cropperVisible}
          imageUri={tempImageUri}
          onCancel={handleCropCancel}
          onConfirm={handleCropConfirm}
        />
      )}
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
  disabledButton: {
    opacity: 0.5,
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
