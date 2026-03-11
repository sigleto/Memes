import { useMeme } from "@/context/Memecontext";
import { Image, ScrollView, StyleSheet, TouchableOpacity } from "react-native";

const templates = [
  require("../../assets/memes/alegre.webp"),
  require("../../assets/memes/simpsons.jpg"),
  require("../../assets/memes/yoda.webp"),
];

export default function Templates() {

  // 🔹 usamos el contexto
  const { setImage } = useMeme();

  const loadTemplate = (template: any) => {
    // convierte la imagen local en URI
    const uri = Image.resolveAssetSource(template).uri;

    // cambia la imagen del editor
    setImage(uri);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {templates.map((t, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => loadTemplate(t)}
          style={styles.template}
        >
          <Image source={t} style={styles.image} />
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

  template: {
    margin: 10,
  },

  image: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
});