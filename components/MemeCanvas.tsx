import { useMeme } from "@/context/Memecontext";
import { Anton_400Regular, useFonts } from "@expo-google-fonts/anton";
import Slider from "@react-native-community/slider";
import * as ImagePicker from "expo-image-picker";
import * as Sharing from "expo-sharing";
import React, { useRef, useState } from "react";

import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { captureRef } from "react-native-view-shot";

import DraggableSticker from "./DraggableSticker";
import DraggableText from "./DraggableText";

const { width } = Dimensions.get("window");

export default function MemeCanvas() {
  const [fontsLoaded] = useFonts({ MemeFont: Anton_400Regular });

  // 🔹 datos globales
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
  const [selectedStickerId, setSelectedStickerId] = useState<number | null>(null);

  const viewRef = useRef<View>(null);

  const colors = ["white", "#f1c40f", "#e74c3c", "#2ecc71", "#9b59b6", "black"];

  if (!fontsLoaded) return <ActivityIndicator style={{ flex: 1 }} />;

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const shareMeme = async () => {
    if (!image) return Alert.alert("Selecciona una imagen");

    const uri = await captureRef(viewRef, {
      format: "png",
      quality: 0.9,
    });

    await Sharing.shareAsync(uri);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Meme Maker</Text>

      <View style={styles.memeWrapper}>
        <View ref={viewRef} collapsable={false} style={styles.captureZone}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <TouchableOpacity onPress={pickImage} style={styles.placeholder}>
              <Text style={{ fontSize: 40 }}>🖼️</Text>
              <Text>Añadir imagen</Text>
            </TouchableOpacity>
          )}

          {topText !== "" && (
            <DraggableText
              label={topText}
              fontSize={fontSize}
              color={textColor}
            />
          )}

          {bottomText !== "" && (
            <DraggableText
              label={bottomText}
              fontSize={fontSize}
              color={textColor}
            />
          )}

          {stickers.map((s) => (
            <DraggableSticker
              key={s.id}
              source={s.image}
              isSelected={s.id === selectedStickerId}
              onSelect={() =>
                setSelectedStickerId((prev) => (prev === s.id ? null : s.id))
              }
              onRemove={() => removeSticker(s.id)}
            />
          ))}
        </View>
      </View>

      <View style={styles.controls}>
        <TextInput
          style={styles.input}
          placeholder="Texto superior"
          value={topText}
          onChangeText={setTopText}
        />

        <TextInput
          style={styles.input}
          placeholder="Texto inferior"
          value={bottomText}
          onChangeText={setBottomText}
        />

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
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 50,
    alignItems: "center",
  },

  title: {
    fontSize: 26,
    fontFamily: "MemeFont",
    marginBottom: 20,
  },

  memeWrapper: {
    width: width * 0.9,
    height: width * 0.9,
    backgroundColor: "white",
  },

  captureZone: {
    flex: 1,
    position: "relative",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  controls: {
    width: "90%",
    marginTop: 20,
  },

  input: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },

  colors: {
    flexDirection: "row",
    marginTop: 10,
  },

  color: {
    width: 35,
    height: 35,
    borderRadius: 20,
    marginRight: 10,
  },

  button: {
    marginTop: 20,
    backgroundColor: "#2ecc71",
    padding: 15,
    borderRadius: 10,
  },
});