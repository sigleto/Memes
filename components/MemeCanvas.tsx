import { useMeme } from "@/context/MemeContext";
import { Anton_400Regular, useFonts } from "@expo-google-fonts/anton";
import Slider from "@react-native-community/slider";
import * as Sharing from "expo-sharing";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { captureRef } from "react-native-view-shot";
import DraggableSticker from "./DraggableSticker";
import DraggableText from "./DraggableText";

const { width } = Dimensions.get("window");

export default function MemeCanvas() {
  const [fontsLoaded] = useFonts({ MemeFont: Anton_400Regular });

  const { image, setImage, stickers, removeSticker } = useMeme();

  const [texts, setTexts] = useState<
    { id: number; text: string }[]
  >([]);

  const [fontSize, setFontSize] = useState(35);
  const [textColor, setTextColor] = useState("white");

  const [selectedStickerId, setSelectedStickerId] = useState<number | null>(
    null
  );

  const viewRef = useRef<View>(null);

  const colors = ["white", "#f1c40f", "#e74c3c", "#2ecc71", "#9b59b6", "black"];

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  const addText = () => {
    const newText = {
      id: Date.now(),
      text: "",
    };

    setTexts((prev) => [...prev, newText]);
  };

  const updateText = (id: number, newText: string) => {
    setTexts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: newText } : t))
    );
  };

  const removeText = (id: number) => {
    setTexts((prev) => prev.filter((t) => t.id !== id));
  };

  const shareMeme = async () => {
    try {
      const uri = await captureRef(viewRef, {
        format: "png",
        quality: 0.9,
      });

      await Sharing.shareAsync(uri);
    } catch (error) {
      Alert.alert("Error", "No se pudo generar o compartir el meme");
    }
  };

  const removeBackgroundImage = () => {
    Alert.alert("Eliminar imagen", "¿Eliminar la imagen de fondo?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => setImage(null),
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.mainContainer}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.title}>Meme Maker</Text>

          <View style={styles.memeWrapper}>
            <View ref={viewRef} collapsable={false} style={styles.captureZone}>
              {!image ? (
                <View style={styles.emptyCanvas}>
                  <Text style={styles.emptyIcon}>🎨</Text>
                  <Text style={styles.emptyText}>
                    Usa la pestaña "Subir" para añadir imagen
                  </Text>
                </View>
              ) : (
                <>
                  <Image source={{ uri: image }} style={styles.image} />
                  <TouchableOpacity
                    style={styles.imageDeleteButton}
                    onPress={removeBackgroundImage}
                  >
                    <Text style={styles.imageDeleteText}>✕</Text>
                  </TouchableOpacity>
                </>
              )}

              {stickers.map((sticker) => (
                <DraggableSticker
                  key={sticker.id}
                  source={sticker.image}
                  isGif={sticker.isGif}
                  isSelected={selectedStickerId === sticker.id}
                  onSelect={() => setSelectedStickerId(sticker.id)}
                  onRemove={() => removeSticker(sticker.id)}
                />
              ))}

              {texts.map((t) => (
                <DraggableText
                  key={t.id}
                  text={t.text}
                  onChangeText={(txt: string) => updateText(t.id, txt)}
                  onRemove={() => removeText(t.id)}
                  fontSize={fontSize}
                  color={textColor}
                  autoFocus={texts.length > 0 && t.id === texts[texts.length - 1].id && t.text === ""}
                />
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.addTextButton} onPress={addText}>
            <Text style={styles.addTextButtonText}>➕ Añadir texto</Text>
          </TouchableOpacity>

          <View style={styles.controls}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Tamaño: {Math.round(fontSize)}</Text>
            </View>

            <Slider
              style={styles.slider}
              minimumValue={15}
              maximumValue={80}
              value={fontSize}
              onValueChange={setFontSize}
              minimumTrackTintColor="#2196F3"
              maximumTrackTintColor="#ccc"
            />

            <View style={styles.colors}>
              {colors.map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setTextColor(c)}
                  style={[
                    styles.color,
                    { backgroundColor: c },
                    textColor === c && styles.selectedColor,
                  ]}
                />
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={shareMeme}>
            <Text style={styles.buttonText}>Compartir meme 🚀</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },

  memeWrapper: {
    width: width - 40,
    aspectRatio: 1,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "#ddd",
    elevation: 5,
  },

  captureZone: {
    width: "100%",
    height: "100%",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
  },

  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    position: "absolute",
  },

  imageDeleteButton: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "rgba(231, 76, 60, 0.9)",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },

  imageDeleteText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  emptyCanvas: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  emptyIcon: {
    fontSize: 50,
    marginBottom: 10,
  },

  emptyText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },

  addTextButton: {
    marginTop: 15,
    backgroundColor: "#2ecc71",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
  },

  addTextButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },

  controls: {
    marginTop: 20,
    width: width - 40,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 15,
    elevation: 2,
  },

  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
  },

  slider: {
    width: "100%",
    height: 40,
  },

  colors: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
  },

  color: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    borderWidth: 1,
    borderColor: "#eee",
  },

  selectedColor: {
    borderWidth: 3,
    borderColor: "#2196F3",
    transform: [{ scale: 1.1 }],
  },

  button: {
    marginTop: 20,
    backgroundColor: "#2196F3",
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});