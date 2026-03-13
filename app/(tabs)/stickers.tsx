import { useMeme } from "@/context/MemeContext";
import { Image, ScrollView, StyleSheet, TouchableOpacity } from "react-native";

// 🔹 GIFs de Giphy
const stickerList = [
  {
    image:
      "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3NmVweXFzdWJvanMyejdnaXh0amI2NnIyNXZwenRxOWg5cWdmcHU1aSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/qlIaevmUNBmufFHCrr/giphy.gif",
    isGif: true,
  },
  {
    image:
      "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmZlYXB6bW9hMTVldDduOWVwcHR6enNlNmUzcmtyeWxuNXk0MnhtZyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/ueoUc3gJ5E6Fa/giphy.gif",
    isGif: true,
  },
  {
    image:
      "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaTVjaDNnNmx1eDhhbjcyZmU1cjlieGpuN3dhMmsyM3VxMHdvcWN0dCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Rfwlp9c5bA7R3s7Y5D/giphy.gif",
    isGif: true,
  },
  {
    image:
      "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3cHJyb2s4djFjYXB4OHRqNWY5bzljY2E2cmxxOXEyanA5cmZ6MzU1bSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/8j3CTd8YJtAv6/giphy.gif",
    isGif: true,
  },
  {
    image:
      "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeHBlc28xZW01OTZ6OGJueXN2Mm16cDRieTh1aDJvNDJraWJieGo5cCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/zH72yAqrMuczC/giphy.gif",
    isGif: true,
  },
  {
    image:
      "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExY3dnbjhib2ZzMGI4b2Flb29hMnZ2OGEwNm05cWpneWFkc3g1cWpoNiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/ycagKBYEmaili/giphy.gif",
    isGif: true,
  },
  {
    image:
      "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMm1ieTR3ZmRocXR4eHZqeWNzN3FhNTc3cXkzNmJqOWd2YWlsZzJudCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/xUA7aOLkviIdZ7UK40/giphy.gif",
    isGif: true,
  },
  {
    image:
      "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaTJtcDFqaXB4em5kNnhlOXAxeWtpYWV5YTY1c211eW1vZ3dsMTJ1dCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/KeWimTRIT6tdshf6G0/giphy.gif",
    isGif: true,
  },
  {
    image:
      "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdDN5anVzaWt4aG9qOWw2cnlzdTY5MmN6MXY4OWxidTFqOGUyempjeSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/mIZ9rPeMKefm0/giphy.gif",
    isGif: true,
  },
  {
    image:
      "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdHN6dmZ0MDFlZWEyaWQ3b3F1dWcweGlsNnZpczdwc2dmeHl1cGpjNyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/fmeTX8AURI4co/giphy.gif",
    isGif: true,
  },
  {
    image:
      "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdHN6dmZ0MDFlZWEyaWQ3b3F1dWcweGlsNnZpczdwc2dmeHl1cGpjNyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Nf8vX5K7AHcAg/giphy.gif",
    isGif: true,
  },
  {
    image:
      "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2ltODFsa2t6MmRuZjc0bmhqOTJidHU0cDZsd3kzbHo2bWJkYjR4YyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/UjYw9fdCEPwU8/giphy.gif",
    isGif: true,
  },
  
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
