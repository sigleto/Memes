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
      "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeHBlc28xZW01OTZ6OGJueXN2Mm16cDRieTh1aDJvNDJraWJieGo5cCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/wWue0rCDOphOE/giphy.gif",
    isGif: true,
  },
  {
    image:
      "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNmxsOGdnZDJsa2w4ZG04emlsb3YzdWY0dDZocWRnMmY1ZGd1bWJzcyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/WmtTa52BN4zTdDdyV7/giphy.gif",
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
