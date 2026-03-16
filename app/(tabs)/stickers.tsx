import { useMeme } from "@/context/MemeContext";
import { Image, ScrollView, StyleSheet, TouchableOpacity } from "react-native";

// GIFs directos de Giphy
const stickerList = [
  { image: "https://i.giphy.com/media/qlIaevmUNBmufFHCrr/giphy.gif", isGif: true },
  { image: "https://i.giphy.com/media/ueoUc3gJ5E6Fa/giphy.gif", isGif: true },
  { image: "https://i.giphy.com/media/Rfwlp9c5bA7R3s7Y5D/giphy.gif", isGif: true },
  { image: "https://i.giphy.com/media/8j3CTd8YJtAv6/giphy.gif", isGif: true },
  { image: "https://i.giphy.com/media/zH72yAqrMuczC/giphy.gif", isGif: true },
  { image: "https://i.giphy.com/media/ycagKBYEmaili/giphy.gif", isGif: true },
  { image: "https://i.giphy.com/media/xUA7aOLkviIdZ7UK40/giphy.gif", isGif: true },
  { image: "https://i.giphy.com/media/KeWimTRIT6tdshf6G0/giphy.gif", isGif: true },
  { image: "https://i.giphy.com/media/mIZ9rPeMKefm0/giphy.gif", isGif: true },
  { image: "https://i.giphy.com/media/fmeTX8AURI4co/giphy.gif", isGif: true },
  { image: "https://i.giphy.com/media/Nf8vX5K7AHcAg/giphy.gif", isGif: true },
  { image: "https://i.giphy.com/media/UjYw9fdCEPwU8/giphy.gif", isGif: true },
];

export default function Stickers() {
  const { addSticker } = useMeme();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {stickerList.map((s, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => addSticker(s)}
          style={styles.sticker}
        >
          <Image source={{ uri: s.image }} style={styles.image} />
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