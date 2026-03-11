import { useMeme } from "@/context/Memecontext";
import { Image, ScrollView, StyleSheet, TouchableOpacity } from "react-native";

const stickerList = [
  require("../../assets/stickers/gato.png"),
  require("../../assets/stickers/leon.png"),
  require("../../assets/stickers/mono.png"),
  require("../../assets/stickers/oso.png"),
];

export default function Stickers() {

  // 🔹 usamos la función del contexto
  const { addSticker } = useMeme();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {stickerList.map((s, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => addSticker(s)}   // 🔹 añade el sticker al editor
          style={styles.sticker}
        >
          <Image source={s} style={styles.image} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },

  sticker: {
    margin: 10,
  },

  image: {
    width: 80,
    height: 80,
  },
});