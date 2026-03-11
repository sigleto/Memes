import { Anton_400Regular, useFonts } from "@expo-google-fonts/anton";
import Slider from "@react-native-community/slider";
import * as ImagePicker from "expo-image-picker";
import * as Sharing from "expo-sharing";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Image,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { captureRef } from "react-native-view-shot";

const { width } = Dimensions.get("window");

// Componente para el Texto Arrastrable
const DraggableText = ({ label, fontSize, color }: any) => {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          // @ts-ignore
          x: pan.x._value,
          // @ts-ignore
          y: pan.y._value,
        });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    }),
  ).current;

  return (
    <Animated.View
      style={{
        transform: [{ translateX: pan.x }, { translateY: pan.y }],
        position: "absolute",
        zIndex: 10,
      }}
      {...panResponder.panHandlers}
    >
      <Text style={[styles.memeText, { fontSize, color }]}>
        {label.toUpperCase()}
      </Text>
    </Animated.View>
  );
};

export default function HomeScreen() {
  let [fontsLoaded] = useFonts({ MemeFont: Anton_400Regular });

  const [image, setImage] = useState<string | null>(null);
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [fontSize, setFontSize] = useState(35);
  const [textColor, setTextColor] = useState("white");

  const viewRef = useRef<View>(null);
  const colors = ["white", "#f1c40f", "#e74c3c", "#2ecc71", "#9b59b6", "black"];

  if (!fontsLoaded) return <ActivityIndicator style={{ flex: 1 }} />;

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const shareMeme = async () => {
    if (!image) return Alert.alert("Error", "Selecciona una imagen primero");
    try {
      const uri = await captureRef(viewRef, { format: "png", quality: 0.9 });
      await Sharing.shareAsync(uri);
    } catch (e) {
      Alert.alert("Error", "No se pudo generar");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Meme Maker Movible 🕹️</Text>

      <View style={styles.memeWrapper}>
        <View ref={viewRef} collapsable={false} style={styles.captureZone}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <TouchableOpacity onPress={pickImage} style={styles.placeholder}>
              <Text style={styles.placeholderIcon}>🖼️</Text>
              <Text>Toca para añadir imagen</Text>
            </TouchableOpacity>
          )}

          {/* TEXTOS ARRASTRABLES */}
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
        </View>
      </View>

      <View style={styles.controls}>
        <TextInput
          style={styles.input}
          placeholder="Escribe aquí..."
          onChangeText={setTopText}
        />
        <TextInput
          style={styles.input}
          placeholder="Y aquí..."
          onChangeText={setBottomText}
        />

        <Text style={styles.label}>Tamaño: {Math.round(fontSize)}</Text>
        <Slider
          style={{ width: "100%", height: 40 }}
          minimumValue={15}
          maximumValue={80}
          value={fontSize}
          onValueChange={setFontSize}
          minimumTrackTintColor="#007AFF"
        />

        <View style={styles.colorPicker}>
          {colors.map((c) => (
            <TouchableOpacity
              key={c}
              style={[
                styles.colorOption,
                {
                  backgroundColor: c,
                  borderColor: textColor === c ? "#007AFF" : "#ddd",
                  borderWidth: textColor === c ? 3 : 1,
                },
              ]}
              onPress={() => setTextColor(c)}
            />
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={shareMeme}>
        <Text style={styles.buttonText}>🚀 COMPARTIR</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={pickImage} style={{ marginTop: 15 }}>
        <Text style={{ color: "#007AFF" }}>Cambiar imagen</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 50,
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  title: { fontSize: 24, fontFamily: "MemeFont", marginBottom: 20 },
  memeWrapper: {
    width: width * 0.9,
    height: width * 0.9,
    backgroundColor: "white",
    elevation: 5,
  },
  captureZone: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  image: { width: "100%", height: "100%" },
  placeholder: { alignItems: "center", justifyContent: "center", flex: 1 },
  placeholderIcon: { fontSize: 50 },
  memeText: {
    fontFamily: "MemeFont",
    textAlign: "center",
    textShadowColor: "black",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
    padding: 5,
  },
  controls: { width: "90%", marginTop: 20 },
  input: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
  },
  label: { fontSize: 14, fontWeight: "bold" },
  colorPicker: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  colorOption: { width: 35, height: 35, borderRadius: 17.5 },
  button: {
    backgroundColor: "#2ecc71",
    padding: 15,
    borderRadius: 12,
    width: "90%",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
});
