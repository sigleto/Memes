import AdBanner from "@/components/AdBanner";
import { useMeme } from "@/context/MemeContext";
import { router } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ImagePicker from "react-native-image-crop-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function UploadScreen() {
  const { setImage } = useMeme();
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const pickImage = async () => {
    try {
      setLoading(true);

      const image = await ImagePicker.openPicker({
        width: 1024,
        height: 1024,
        cropping: true,
        compressImageQuality: 0.9,
        mediaType: "photo",
      });

      setImage(image.path);
      router.back();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const takePhoto = async () => {
    try {
      setLoading(true);

      const image = await ImagePicker.openCamera({
        width: 1024,
        height: 1024,
        cropping: true,
        compressImageQuality: 0.9,
        mediaType: "photo",
      });

      setImage(image.path);
      router.back();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          {
            // Espacio para el banner + el menú inferior
            paddingBottom: 120 + insets.bottom,
          },
        ]}
      >
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
      </ScrollView>

      {/* Banner fijo - ahora posicionado ENCIMA del menú inferior */}
      <View
        style={[
          styles.bannerContainer,
          {
            paddingBottom: insets.bottom,
            // Posicionar justo encima del menú inferior
            bottom: 130, // 80 (altura del menú) + 50 (bottom del menú)
            zIndex: 1000,
            elevation: 1000,
          },
        ]}
      >
        <AdBanner />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flexGrow: 1,
    padding: 20,
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
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#2196F3",
  },
  infoText: {
    fontSize: 14,
    color: "#1976D2",
    textAlign: "center",
    lineHeight: 20,
  },
  bannerContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingVertical: 5,
  },
});
