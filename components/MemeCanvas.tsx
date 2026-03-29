import { useMeme } from "@/context/MemeContext";
import { shareImageAndAudio } from "@/utils/shareMemeAssets";
import { Anton_400Regular, useFonts } from "@expo-google-fonts/anton";
import Slider from "@react-native-community/slider";
import * as FileSystem from "expo-file-system/legacy";
import { router, type Href } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Easing,
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
import { loadInterstitial, showInterstitial } from "./AdInterstitial";
import DraggableSticker from "./DraggableSticker";
import DraggableText from "./DraggableText";

const { width } = Dimensions.get("window");

export default function MemeCanvas() {
  const [fontsLoaded] = useFonts({ MemeFont: Anton_400Regular });
  const { image, setImage, stickers, removeSticker, audioUri } = useMeme();

  const [texts, setTexts] = useState<{ id: number; text: string }[]>([]);
  const [fontSize, setFontSize] = useState(35);
  const [textColor, setTextColor] = useState("white");
  const [selectedStickerId, setSelectedStickerId] = useState<number | null>(
    null,
  );
  const [isSharing, setIsSharing] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  const viewRef = useRef<View>(null);
  const imageScale = useRef(new Animated.Value(1)).current;

  const colors = ["white", "#f1c40f", "#e74c3c", "#2ecc71", "#9b59b6", "black"];

  useEffect(() => {
    loadInterstitial();
  }, []);

  useEffect(() => {
    if (!image) return;

    imageScale.setValue(0.9);

    Animated.sequence([
      Animated.timing(imageScale, {
        toValue: 1.05,
        duration: 140,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(imageScale, {
        toValue: 1,
        duration: 120,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [image, imageScale]);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  const addText = () => {
    setTexts((prev) => [...prev, { id: Date.now(), text: "" }]);
  };

  const updateText = (id: number, newText: string) => {
    setTexts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: newText } : t)),
    );
  };

  const removeText = (id: number) => {
    setTexts((prev) => prev.filter((t) => t.id !== id));
  };

  const removeBackgroundImage = () => {
    Alert.alert("Eliminar imagen", "¿Eliminar la imagen de fondo?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: () => setImage(null) },
    ]);
  };

  const shareMeme = async () => {
    try {
      if (!image && stickers.length === 0 && texts.length === 0) {
        Alert.alert("Error", "No hay nada para compartir");
        return;
      }

      showInterstitial();
      setIsSharing(true);

      const onlyGifSticker =
        stickers.length === 1 &&
        stickers[0].isGif &&
        !image &&
        texts.length === 0;

      if (audioUri) {
        if (onlyGifSticker) {
          const fileName = `sticker-${stickers[0].id}.gif`;
          const fileUri = FileSystem.cacheDirectory + fileName;
          await FileSystem.downloadAsync(stickers[0].image, fileUri);
          await shareImageAndAudio(
            fileUri,
            audioUri,
            "Compartir meme con imagen y audio",
          );
        } else {
          if (!viewRef.current) {
            Alert.alert("Error", "No se pudo capturar la imagen");
            return;
          }

          setIsCapturing(true);
          setSelectedStickerId(null);
          await new Promise((resolve) => setTimeout(resolve, 150));

          const pngUri = await captureRef(viewRef, {
            format: "png",
            quality: 1,
            result: "tmpfile",
          });

          setIsCapturing(false);
          await shareImageAndAudio(
            pngUri,
            audioUri,
            "Compartir meme con imagen y audio",
          );
        }
        return;
      }

      if (onlyGifSticker) {
        const fileName = `sticker-${stickers[0].id}.gif`;
        const fileUri = FileSystem.cacheDirectory + fileName;
        await FileSystem.downloadAsync(stickers[0].image, fileUri);

        await Sharing.shareAsync(fileUri, {
          mimeType: "image/gif",
          dialogTitle: "Compartir GIF",
          UTI: "com.compuserve.gif",
        });
      } else {
        if (!viewRef.current) {
          Alert.alert("Error", "No se pudo capturar la imagen");
          return;
        }

        setIsCapturing(true);
        setSelectedStickerId(null);
        await new Promise((resolve) => setTimeout(resolve, 150));

        const uri = await captureRef(viewRef, {
          format: "png",
          quality: 1,
          result: "tmpfile",
        });

        setIsCapturing(false);

        await Sharing.shareAsync(uri, {
          mimeType: "image/png",
          dialogTitle: "Compartir meme",
          UTI: "public.png",
        });
      }
    } catch (error) {
      console.log("Error al compartir:", error);
      setIsCapturing(false);
      Alert.alert("Error", "No se pudo generar o compartir el meme.");
    } finally {
      setIsSharing(false);
    }
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
                    Usa el menú inferior para añadir imagen
                  </Text>
                </View>
              ) : (
                <>
                  <Animated.Image
                    source={{ uri: image }}
                    style={[
                      styles.image,
                      { transform: [{ scale: imageScale }] },
                    ]}
                  />

                  {!isCapturing && (
                    <TouchableOpacity
                      style={styles.imageDeleteButton}
                      onPress={removeBackgroundImage}
                    >
                      <Text style={styles.imageDeleteText}>✕</Text>
                    </TouchableOpacity>
                  )}
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
                  isCapturing={isCapturing}
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
                  isCapturing={isCapturing}
                  autoFocus={
                    texts.length > 0 &&
                    t.id === texts[texts.length - 1].id &&
                    t.text === ""
                  }
                />
              ))}
            </View>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionButton} onPress={addText}>
              <Text style={styles.actionButtonText}>➕ Texto</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButtonSecondary}
              onPress={() => router.push("/(tabs)/sounds" as Href)}
            >
              <Text style={styles.actionButtonText}>🔊 Sonido</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.controls}>
            <Text style={styles.label}>Tamaño: {Math.round(fontSize)}</Text>
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

          <TouchableOpacity
            style={[styles.button, isSharing && styles.buttonDisabled]}
            onPress={shareMeme}
            disabled={isSharing}
          >
            <Text style={styles.buttonText}>
              {isSharing
                ? "Compartiendo..."
                : audioUri
                  ? "Compartir meme + audio 🚀"
                  : "Compartir meme 🚀"}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#f5f5f5" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 12,
    paddingBottom: 18,
  },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 12, color: "#333" },
  memeWrapper: {
    width: width - 32,
    aspectRatio: 1,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#ddd",
    elevation: 4,
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
  emptyIcon: { fontSize: 50, marginBottom: 10 },
  emptyText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
  actionsRow: {
    marginTop: 14,
    flexDirection: "row",
    width: width - 32,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#2ecc71",
    paddingVertical: 12,
    borderRadius: 22,
  },
  actionButtonSecondary: {
    flex: 1,
    backgroundColor: "#9b59b6",
    paddingVertical: 12,
    borderRadius: 22,
  },
  actionButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "center",
  },
  controls: {
    marginTop: 10,
    width: width - 32,
    padding: 12,
    backgroundColor: "white",
    borderRadius: 15,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
  },
  slider: { width: "100%", height: 30 },
  colors: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
  },
  color: {
    width: 28,
    height: 28,
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
    marginTop: 12,
    backgroundColor: "#2196F3",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  buttonDisabled: { backgroundColor: "#cccccc" },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
