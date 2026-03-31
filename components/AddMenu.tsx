import BottomSheet from "@gorhom/bottom-sheet";
import React, { forwardRef, useMemo, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ImagePicker from "react-native-image-crop-picker";
import TextEditorPanel from "./TextEditorPannel";

type Props = {
  onAddText: () => void;
  onGoStickers: () => void;
  onGoSounds: () => void;
  onGoUpload: (imagePath: string) => void;
  onGoTemplates: (imagePath: string) => void;
};

const AddMenu = forwardRef<BottomSheet, Props>(
  ({ onAddText, onGoStickers, onGoSounds, onGoUpload, onGoTemplates }, ref) => {
    const snapPoints = useMemo(() => ["35%"], []);

    const [showTextEditor, setShowTextEditor] = useState(false);
    const [tempImagePath, setTempImagePath] = useState<string | null>(null);
    const [fontSize, setFontSize] = useState(45);
    const [textColor, setTextColor] = useState("#fff");

    // 📁 GALERÍA
    const handleGalleryImage = async () => {
      try {
        const image = await ImagePicker.openPicker({
          width: 1024,
          height: 1024,
          cropping: true,
          compressImageQuality: 0.9,
          mediaType: "photo",
        });

        setTempImagePath(image.path);
        setShowTextEditor(true);

        if (ref && typeof ref !== "function" && ref.current) {
          ref.current.close();
        }
      } catch (error: unknown) {
        // 👈 Especificamos el tipo unknown
        console.log(error);
        // Verificamos si es un objeto con propiedad code
        if (typeof error === "object" && error !== null && "code" in error) {
          const err = error as { code: string };
          if (err.code !== "E_PICKER_CANCELLED") {
            Alert.alert("Error", "No se pudo seleccionar la imagen");
          }
        } else {
          Alert.alert("Error", "No se pudo seleccionar la imagen");
        }
      }
    };

    // 📸 CÁMARA
    const handleCameraImage = async () => {
      try {
        const image = await ImagePicker.openCamera({
          width: 1024,
          height: 1024,
          cropping: true,
          compressImageQuality: 0.9,
          mediaType: "photo",
        });

        setTempImagePath(image.path);
        setShowTextEditor(true);

        if (ref && typeof ref !== "function" && ref.current) {
          ref.current.close();
        }
      } catch (error: unknown) {
        // 👈 Especificamos el tipo unknown
        console.log(error);
        if (typeof error === "object" && error !== null && "code" in error) {
          const err = error as { code: string };
          if (err.code !== "E_PICKER_CANCELLED") {
            Alert.alert("Error", "No se pudo tomar la foto");
          }
        } else {
          Alert.alert("Error", "No se pudo tomar la foto");
        }
      }
    };

    const confirmImageWithText = () => {
      if (tempImagePath) {
        onGoUpload(tempImagePath);
        setShowTextEditor(false);
        setTempImagePath(null);
      }
    };

    const cancelTextEditor = () => {
      setShowTextEditor(false);
      setTempImagePath(null);
    };

    const templates = [
      "https://i.imgflip.com/1ur9b0.jpg",
      "https://i.imgflip.com/26am.jpg",
      "https://i.imgflip.com/30b1gx.jpg",
    ];

    const handleTemplate = () => {
      const random = templates[Math.floor(Math.random() * templates.length)];
      onGoTemplates(random);
    };

    return (
      <>
        <BottomSheet ref={ref} index={-1} snapPoints={snapPoints}>
          <View style={styles.container}>
            <MenuButton title="➕ Texto" onPress={onAddText} />
            <MenuButton title="😂 Stickers" onPress={onGoStickers} />
            <MenuButton title="🔊 Sonido" onPress={onGoSounds} />
            <MenuButton title="🖼️ Subir imagen" onPress={handleGalleryImage} />
            <MenuButton title="📸 Tomar foto" onPress={handleCameraImage} />
            <MenuButton
              title="🎬 Plantilla aleatoria"
              onPress={handleTemplate}
            />
          </View>
        </BottomSheet>

        {showTextEditor && (
          <View style={styles.editorOverlay}>
            <View style={styles.editorContainer}>
              <Text style={styles.editorTitle}>🎨 Personaliza tu meme</Text>

              <TextEditorPanel
                visible={true}
                fontSize={fontSize}
                setFontSize={setFontSize}
                textColor={textColor}
                setTextColor={setTextColor}
              />

              <View style={styles.editorButtons}>
                <TouchableOpacity
                  style={[styles.editorButton, styles.cancelButton]}
                  onPress={cancelTextEditor}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.editorButton, styles.confirmButton]}
                  onPress={confirmImageWithText}
                >
                  <Text style={styles.confirmButtonText}>Usar imagen ✨</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </>
    );
  },
);

// Helper para simplificar el manejo de errores
const handleImagePickerError = (error: unknown, defaultMessage: string) => {
  console.log(error);
  if (typeof error === "object" && error !== null && "code" in error) {
    const err = error as { code: string };
    if (err.code !== "E_PICKER_CANCELLED") {
      Alert.alert("Error", defaultMessage);
    }
  } else {
    Alert.alert("Error", defaultMessage);
  }
};

function MenuButton({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  button: {
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#f1f1f1",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
  editorOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    zIndex: 1000,
  },
  editorContainer: {
    backgroundColor: "#1a1a1a",
    margin: 20,
    borderRadius: 20,
    padding: 20,
  },
  editorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  editorButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 10,
  },
  editorButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#444",
  },
  confirmButton: {
    backgroundColor: "#ffeb3b",
  },
  cancelButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  confirmButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
});

export default AddMenu;
