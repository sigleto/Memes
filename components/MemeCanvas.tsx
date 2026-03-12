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
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { captureRef } from "react-native-view-shot";

import DraggableSticker from "./DraggableSticker";
import DraggableText from "./DraggableText";

const { width } = Dimensions.get("window");

export default function MemeCanvas() {
  const [fontsLoaded] = useFonts({ MemeFont: Anton_400Regular });

  const {
    image,
    setImage,
    topText,
    bottomText,
    setTopText,
    setBottomText,
    stickers,
    removeSticker,
  } = useMeme();

  const [fontSize, setFontSize] = useState(35);
  const [textColor, setTextColor] = useState("white");
  const [selectedStickerId, setSelectedStickerId] = useState<number | null>(
    null,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isImageSelected, setIsImageSelected] = useState(false);

  const viewRef = useRef<View>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const colors = ["white", "#f1c40f", "#e74c3c", "#2ecc71", "#9b59b6", "black"];

  // Manejadores para el teclado
  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => setKeyboardHeight(e.endCoordinates.height),
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setKeyboardHeight(0),
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  if (!fontsLoaded) return <ActivityIndicator style={{ flex: 1 }} />;

  const shareMeme = async () => {
    if (!image && stickers.length === 0) {
      return Alert.alert(
        "Sin contenido",
        "Añade una imagen desde la pestaña 'Subir' o algún sticker",
      );
    }

    try {
      const uri = await captureRef(viewRef, { format: "png", quality: 0.9 });
      await Sharing.shareAsync(uri);
    } catch (error) {
      Alert.alert("Error", "No se pudo compartir el meme");
    }
  };

  const handleTextPress = (textPosition: "top" | "bottom") => {
    setIsEditing(true);
    if (textPosition === "top") {
      setTopText(" ");
      setTimeout(
        () => scrollViewRef.current?.scrollTo({ y: 0, animated: true }),
        100,
      );
    } else {
      setBottomText(" ");
      setTimeout(
        () => scrollViewRef.current?.scrollTo({ y: 200, animated: true }),
        100,
      );
    }
  };

  const removeBackgroundImage = () => {
    Alert.alert(
      "Eliminar imagen",
      "¿Estás seguro de que quieres eliminar la imagen de fondo?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: () => {
            setImage(null);
            setIsImageSelected(false);
          },
          style: "destructive",
        },
      ],
    );
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={[
          styles.container,
          { paddingBottom: keyboardHeight },
        ]}
        scrollEnabled={!isEditing}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Meme Maker</Text>

        <View style={styles.memeWrapper}>
          <View
            ref={viewRef}
            collapsable={false}
            style={[
              styles.captureZone,
              !image && stickers.length > 0 && { backgroundColor: "white" },
            ]}
          >
            {image ? (
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => setIsImageSelected(true)}
                onLongPress={() => setIsImageSelected(true)}
                style={styles.imageContainer}
              >
                <Image source={{ uri: image }} style={styles.image} />
                {isImageSelected && (
                  <View
                    style={styles.imageRemoveButton}
                    pointerEvents="box-none"
                  >
                    <TouchableOpacity
                      onPress={removeBackgroundImage}
                      style={styles.removeButton}
                    >
                      <Text style={styles.removeButtonText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            ) : (
              <View style={styles.emptyCanvas}>
                <Text style={styles.emptyIcon}>🎨</Text>
                <Text style={styles.emptyText}>
                  Usa la pestaña "Subir" para añadir una imagen
                </Text>
              </View>
            )}

            {/* Texto superior */}
            {topText !== "" && (
              <View style={styles.draggableWrapper} pointerEvents="box-none">
                <DraggableText
                  text={topText}
                  fontSize={fontSize}
                  color={textColor}
                  onChangeText={setTopText}
                  initialOffsetY={-120}
                  onEditingChange={setIsEditing}
                />
              </View>
            )}

            {/* Texto inferior */}
            {bottomText !== "" && (
              <View style={styles.draggableWrapper} pointerEvents="box-none">
                <DraggableText
                  text={bottomText}
                  fontSize={fontSize}
                  color={textColor}
                  onChangeText={setBottomText}
                  initialOffsetY={120}
                  onEditingChange={setIsEditing}
                />
              </View>
            )}

            {/* Placeholders de texto (solo cuando no hay texto) */}
            {topText === "" && (
              <TouchableOpacity
                style={[styles.textPlaceholderTop, { zIndex: 1000 }]}
                onPress={() => handleTextPress("top")}
              >
                <Text style={styles.placeholderText}>+ Texto arriba</Text>
              </TouchableOpacity>
            )}

            {bottomText === "" && (
              <TouchableOpacity
                style={[styles.textPlaceholderBottom, { zIndex: 1000 }]}
                onPress={() => handleTextPress("bottom")}
              >
                <Text style={styles.placeholderText}>+ Texto abajo</Text>
              </TouchableOpacity>
            )}

            {/* Stickers */}
            {stickers.map((s) => (
              <DraggableSticker
                key={s.id}
                source={s.image}
                isGif={s.isGif}
                isSelected={s.id === selectedStickerId}
                onSelect={() => {
                  setSelectedStickerId((prev) => (prev === s.id ? null : s.id));
                  setIsImageSelected(false);
                }}
                onRemove={() => removeSticker(s.id)}
              />
            ))}
          </View>
        </View>

        <View style={styles.controls}>
          <Text>Tamaño texto: {Math.round(fontSize)}</Text>
          <Slider
            minimumValue={15}
            maximumValue={80}
            value={fontSize}
            onValueChange={setFontSize}
          />
          <View style={styles.colors}>
            {colors.map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => setTextColor(c)}
                style={[styles.color, { backgroundColor: c }]}
              />
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={shareMeme}>
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Compartir meme 🚀
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    alignItems: "center",
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  memeWrapper: {
    width: width - 40,
    aspectRatio: 1,
    borderRadius: 10,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  captureZone: {
    width: "100%",
    height: "100%",
    backgroundColor: "#e0e0e0",
  },
  imageContainer: {
    width: "100%",
    height: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  emptyCanvas: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 20,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  textPlaceholderTop: {
    position: "absolute",
    top: 20,
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.8)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#999",
    borderStyle: "dashed",
  },
  textPlaceholderBottom: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.8)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#999",
    borderStyle: "dashed",
  },
  placeholderText: {
    fontSize: 14,
    color: "#666",
  },
  draggableWrapper: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  controls: {
    marginTop: 20,
    width: width - 40,
    padding: 15,
    backgroundColor: "white",
    borderRadius: 10,
  },
  colors: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  color: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#2196F3",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3,
  },
  imageRemoveButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 2000,
  },
  removeButton: {
    backgroundColor: "red",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  removeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
