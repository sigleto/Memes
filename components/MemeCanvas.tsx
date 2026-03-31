import { useMeme } from "@/context/MemeContext";
import { shareImageAndAudio } from "@/utils/shareMemeAssets"; // Importante: recuperado
import { Anton_400Regular, useFonts } from "@expo-google-fonts/anton";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import Slider from "@react-native-community/slider";
import * as FileSystem from "expo-file-system/legacy";
import { router } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
  const [fontSize, setFontSize] = useState(45);
  const [textColor, setTextColor] = useState("#fff");
  const [selectedStickerId, setSelectedStickerId] = useState<number | null>(
    null,
  );
  const [isSharing, setIsSharing] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isEditingText, setIsEditingText] = useState(false);

  const viewRef = useRef<View>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const imageScale = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const neonColors = [
    "#fff",
    "#ffeb3b",
    "#ff5722",
    "#4caf50",
    "#9c27b0",
    "#00bcd4",
  ];

  useEffect(() => {
    loadInterstitial();
    const lId = pulseAnim.addListener(() => {});
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    ).start();
    return () => pulseAnim.removeListener(lId);
  }, []);

  if (!fontsLoaded)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffeb3b" />
      </View>
    );

  const handleMenuAction = (action: () => void) => {
    bottomSheetRef.current?.close();
    setTimeout(action, 300);
  };

  const addText = () =>
    setTexts((prev) => [...prev, { id: Date.now(), text: "" }]);

  const shareMeme = async () => {
    try {
      if (!image && stickers.length === 0 && texts.length === 0) {
        Alert.alert("😅", "¡Añade algo primero!");
        return;
      }

      showInterstitial();
      setIsSharing(true);

      // Lógica de detección de GIF único (para que no se mande como imagen fija)
      const onlyGifSticker =
        stickers.length === 1 &&
        stickers[0].isGif &&
        !image &&
        texts.length === 0;

      if (audioUri) {
        // CASO 1: Meme con Audio
        let assetUri = "";
        if (onlyGifSticker) {
          assetUri = FileSystem.cacheDirectory + `temp_${Date.now()}.gif`;
          await FileSystem.downloadAsync(stickers[0].image, assetUri);
        } else {
          setIsCapturing(true);
          await new Promise((r) => setTimeout(r, 200));
          assetUri = await captureRef(viewRef, { format: "png", quality: 0.8 });
          setIsCapturing(false);
        }
        await shareImageAndAudio(assetUri, audioUri, "Meme viral con sonido");
      } else if (onlyGifSticker) {
        // CASO 2: Solo un GIF (sin audio)
        const fileUri = FileSystem.cacheDirectory + `temp_${Date.now()}.gif`;
        await FileSystem.downloadAsync(stickers[0].image, fileUri);
        await Sharing.shareAsync(fileUri, {
          mimeType: "image/gif",
          UTI: "com.compuserve.gif",
        });
      } else {
        // CASO 3: Imagen estática (Canvas compuesto)
        setIsCapturing(true);
        await new Promise((r) => setTimeout(r, 200));
        const uri = await captureRef(viewRef, { format: "png", quality: 0.8 });
        setIsCapturing(false);
        await Sharing.shareAsync(uri);
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "No se pudo compartir");
    } finally {
      setIsSharing(false);
      setIsCapturing(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.mainContainer}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>😂 MEME FACTORY</Text>
            <Text style={styles.subtitle}>
              {audioUri ? "🎵 Con sonido listo" : "¡Hazlo viral!"}
            </Text>
          </View>
          <View style={styles.canvasContainer}>
            <View ref={viewRef} collapsable={false} style={styles.canvas}>
              {image && typeof image === "string" && image.length > 0 ? (
                <>
                  <Animated.Image
                    source={{ uri: image }}
                    style={styles.image}
                  />
                  {!isCapturing && (
                    <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={() => setImage(null)}
                    >
                      <Text style={styles.deleteText}>✕</Text>
                    </TouchableOpacity>
                  )}
                </>
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyEmoji}>🚀</Text>
                  <Text style={styles.emptyTitle}>Lienzo Vacío</Text>
                </View>
              )}

              {stickers.map((s) => (
                <DraggableSticker
                  key={s.id}
                  source={s.image}
                  isGif={s.isGif}
                  isSelected={selectedStickerId === s.id}
                  onSelect={() => setSelectedStickerId(s.id)}
                  onRemove={() => removeSticker(s.id)}
                  isCapturing={isCapturing}
                />
              ))}
              {texts.map((t) => (
                <DraggableText
                  key={t.id}
                  text={t.text}
                  onChangeText={(txt) =>
                    setTexts((prev) =>
                      prev.map((i) =>
                        i.id === t.id ? { ...i, text: txt } : i,
                      ),
                    )
                  }
                  onRemove={() =>
                    setTexts((prev) => prev.filter((i) => i.id !== t.id))
                  }
                  fontSize={fontSize}
                  color={textColor}
                  isCapturing={isCapturing}
                  onFocus={() => setIsEditingText(true)}
                  onBlur={() => setIsEditingText(false)}
                />
              ))}
            </View>
          </View>
          {texts.length > 0 && (
            <View style={styles.controlsBar}>
              <Slider
                minimumValue={20}
                maximumValue={100}
                value={fontSize}
                onValueChange={setFontSize}
                minimumTrackTintColor="#ffeb3b"
                style={styles.slider}
              />
              <ScrollView horizontal style={styles.colorsRow}>
                {neonColors.map((c) => (
                  <TouchableOpacity
                    key={c}
                    onPress={() => setTextColor(c)}
                    style={[
                      styles.colorBtn,
                      { backgroundColor: c },
                      textColor === c && styles.colorActive,
                    ]}
                  />
                ))}
              </ScrollView>
            </View>
          )}
          <TouchableOpacity
            style={styles.fabMain}
            onPress={() => bottomSheetRef.current?.snapToIndex(0)}
          >
            <Animated.Text
              style={[styles.fabIcon, { transform: [{ scale: pulseAnim }] }]}
            >
              🎨
            </Animated.Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.fabShare, isSharing && { opacity: 0.5 }]}
            onPress={shareMeme}
            disabled={isSharing}
          >
            <Text style={styles.shareIcon}>{isSharing ? "⏳" : "🚀"}</Text>
          </TouchableOpacity>

          <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={["50%"]}
            enablePanDownToClose
          >
            <BottomSheetView style={styles.sheet}>
              <ScrollView style={styles.menuGrid}>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleMenuAction(addText)}
                >
                  <Text style={styles.menuEmoji}>📝</Text>
                  <Text style={styles.menuLabel}>Añadir Texto</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    bottomSheetRef.current?.close();
                    setTimeout(() => {
                      router.push("/upload");
                    }, 300);
                  }}
                >
                  <Text style={styles.menuEmoji}>🖼️</Text>
                  <Text style={styles.menuLabel}>Subir Imagen</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    bottomSheetRef.current?.close();
                    setTimeout(() => {
                      router.push("/(tabs)/sounds");
                    }, 300);
                  }}
                >
                  <Text style={styles.menuEmoji}>🔊</Text>
                  <Text style={styles.menuLabel}>Cambiar Sonido</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    bottomSheetRef.current?.close();
                    setTimeout(() => {
                      router.push("/(tabs)/stickers");
                    }, 300);
                  }}
                >
                  <Text style={styles.menuEmoji}>😂</Text>
                  <Text style={styles.menuLabel}>Stickers</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    bottomSheetRef.current?.close();
                    setTimeout(() => {
                      router.push("/(tabs)/templates");
                    }, 300);
                  }}
                >
                  <Text style={styles.menuEmoji}>🎬</Text>
                  <Text style={styles.menuLabel}>Plantillas</Text>
                </TouchableOpacity>
              </ScrollView>
            </BottomSheetView>
          </BottomSheet>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#0a0a0a" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0a0a0a",
  },
  container: { flex: 1, paddingTop: 50, paddingHorizontal: 16 },
  header: { alignItems: "center", marginBottom: 20 },
  title: { fontSize: 28, fontWeight: "900", color: "#fff" },
  subtitle: { fontSize: 14, color: "#aaa" },
  canvasContainer: {
    width: width - 32,
    aspectRatio: 1,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#333",
  },
  canvas: {
    flex: 1,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
  },
  image: { width: "100%", height: "100%", position: "absolute" },
  emptyState: { alignItems: "center" },
  emptyEmoji: { fontSize: 50 },
  emptyTitle: { color: "#555", fontWeight: "bold" },
  deleteBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255,0,0,0.6)",
    padding: 8,
    borderRadius: 20,
  },
  deleteText: { color: "#fff", fontWeight: "bold" },
  controlsBar: {
    position: "absolute",
    bottom: 160,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.9)",
    borderRadius: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ffeb3b",
  },
  slider: { width: "100%", height: 40 },
  colorsRow: { flexDirection: "row", marginTop: 10 },
  colorBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#444",
  },
  colorActive: { borderColor: "#fff", borderWidth: 2 },
  fabMain: {
    position: "absolute",
    bottom: 50,
    right: 30,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#ffeb3b",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
  },
  fabIcon: { fontSize: 30 },
  fabShare: {
    position: "absolute",
    bottom: 50,
    left: 30,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#00e676",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
  },
  shareIcon: { fontSize: 30 },
  sheet: { flex: 1, backgroundColor: "#111" },
  menuGrid: { padding: 20 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  menuEmoji: { fontSize: 24, marginRight: 15 },
  menuLabel: { fontSize: 16, color: "#fff", fontWeight: "bold" },
});
