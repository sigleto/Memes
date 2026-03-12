import { useMeme } from "@/context/MemeContext";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const memeIdeas = [
  { top: "CUANDO ABRES LA NEVERA", bottom: "Y SOLO HAY LUZ" },
  { top: "YO DICIENDO", bottom: "MAÑANA EMPIEZO LA DIETA" },
  { top: "CUANDO COBRAS", bottom: "Y AL DÍA SIGUIENTE YA NO HAY NADA" },
  { top: "CUANDO ES LUNES", bottom: "Y EL FINDE SE FUE EN 3 SEGUNDOS" },
  { top: "YO ESTUDIANDO", bottom: "5 MINUTOS ANTES DEL EXAMEN" },
];

export default function Generator() {
  const [idea, setIdea] = useState<any>(null);

  // 🔹 usamos el contexto
  const { setTopText, setBottomText } = useMeme();

  const generate = () => {
    const random = memeIdeas[Math.floor(Math.random() * memeIdeas.length)];

    // mostrar idea en esta pantalla
    setIdea(random);

    // enviar texto al editor
    setTopText(random.top);
    setBottomText(random.bottom);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={generate}>
        <Text style={styles.buttonText}>🎲 Generar idea</Text>
      </TouchableOpacity>

      {idea && (
        <View style={styles.result}>
          <Text style={styles.text}>{idea.top}</Text>
          <Text style={styles.text}>{idea.bottom}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  button: {
    backgroundColor: "#3498db",
    padding: 15,
    borderRadius: 10,
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },

  result: {
    marginTop: 30,
  },

  text: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});
