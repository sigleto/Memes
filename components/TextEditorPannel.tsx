import Slider from "@react-native-community/slider";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function TextEditorPanel({
  visible,
  fontSize,
  setFontSize,
  textColor,
  setTextColor,
}: any) {
  if (!visible) return null;

  const colors = ["white", "#f1c40f", "#e74c3c", "#2ecc71", "#9b59b6", "black"];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tamaño</Text>

      <Slider
        minimumValue={15}
        maximumValue={80}
        value={fontSize}
        onValueChange={setFontSize}
      />

      <View style={styles.colors}>
        {colors.map((c) => (
          <View
            key={c}
            onTouchEnd={() => setTextColor(c)}
            style={[
              styles.color,
              { backgroundColor: c },
              textColor === c && styles.selected,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 100,
    left: 16,
    right: 16,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 16,
    elevation: 5,
  },
  label: { fontWeight: "600" },
  colors: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  color: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  selected: {
    borderWidth: 3,
    borderColor: "#2196F3",
  },
});