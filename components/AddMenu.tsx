import BottomSheet from "@gorhom/bottom-sheet";
import React, { forwardRef, useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  onAddText: () => void;
  onGoStickers: () => void;
  onGoSounds: () => void;
  onGoUpload: () => void;
};

const AddMenu = forwardRef<BottomSheet, Props>(
  ({ onAddText, onGoStickers, onGoSounds, onGoUpload }, ref) => {
    const snapPoints = useMemo(() => ["30%"], []);

    return (
      <BottomSheet ref={ref} index={-1} snapPoints={snapPoints}>
        <View style={styles.container}>
          <MenuButton title="➕ Texto" onPress={onAddText} />
          <MenuButton title="😂 Stickers" onPress={onGoStickers} />
          <MenuButton title="🔊 Sonido" onPress={onGoSounds} />
          <MenuButton title="📁 Subir imagen" onPress={onGoUpload} />
        </View>
      </BottomSheet>
    );
  }
);

function MenuButton({ title, onPress }: any) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  button: {
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#f1f1f1",
    marginBottom: 10,
  },
  text: { fontSize: 16, fontWeight: "600" },
});

export default AddMenu;