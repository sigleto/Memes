import Slider from "@react-native-community/slider";
import * as ImageManipulator from "expo-image-manipulator";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface ImageCropperProps {
  visible: boolean;
  imageUri: string;
  onCancel: () => void;
  onConfirm: (croppedUri: string) => void;
}

export default function ImageCropper({
  visible,
  imageUri,
  onCancel,
  onConfirm,
}: ImageCropperProps) {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState(0);

  const handleConfirm = async () => {
    try {
      // Obtener dimensiones de la imagen
      const imageInfo = await ImageManipulator.manipulateAsync(imageUri, [], {
        compress: 1,
      });

      // Calcular el recorte basado en zoom y offset
      const cropSize = imageInfo.width / zoom;
      const cropX = offset * (imageInfo.width - cropSize);

      const cropped = await ImageManipulator.manipulateAsync(
        imageUri,
        [
          {
            crop: {
              originX: cropX,
              originY: 0,
              width: cropSize,
              height: imageInfo.height,
            },
          },
          { resize: { width: 800, height: 800 } },
        ],
        { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG },
      );

      onConfirm(cropped.uri);
    } catch (error) {
      console.error("Error al recortar:", error);
      alert("No se pudo recortar la imagen");
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.cropContainer}>
          <Text style={styles.instructions}>
            Ajusta la imagen con los controles
          </Text>

          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: imageUri }}
              style={[
                styles.image,
                {
                  transform: [{ scale: zoom }, { translateX: offset * 100 }],
                },
              ]}
              resizeMode="contain"
            />

            {/* Recuadro fijo que indica el área de recorte */}
            <View style={styles.cropOverlay}>
              <View style={styles.cornerTL} />
              <View style={styles.cornerTR} />
              <View style={styles.cornerBL} />
              <View style={styles.cornerBR} />
            </View>
          </View>

          <View style={styles.controls}>
            <Text style={styles.controlLabel}>Zoom: {zoom.toFixed(1)}x</Text>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={3}
              value={zoom}
              onValueChange={setZoom}
              minimumTrackTintColor="#2196F3"
              maximumTrackTintColor="#666"
            />

            <Text style={styles.controlLabel}>Posición horizontal</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1}
              value={offset}
              onValueChange={setOffset}
              minimumTrackTintColor="#2196F3"
              maximumTrackTintColor="#666"
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onCancel}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={handleConfirm}
            >
              <Text style={[styles.buttonText, styles.confirmText]}>
                Cortar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  cropContainer: {
    flex: 1,
    padding: 20,
  },
  instructions: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  imageWrapper: {
    width: SCREEN_WIDTH - 40,
    height: SCREEN_WIDTH - 40,
    alignSelf: "center",
    position: "relative",
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#2196F3",
    borderRadius: 10,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  cropOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 2,
    borderColor: "#2196F3",
  },
  cornerTL: {
    position: "absolute",
    top: -2,
    left: -2,
    width: 30,
    height: 30,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: "#2196F3",
  },
  cornerTR: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 30,
    height: 30,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: "#2196F3",
  },
  cornerBL: {
    position: "absolute",
    bottom: -2,
    left: -2,
    width: 30,
    height: 30,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: "#2196F3",
  },
  cornerBR: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 30,
    height: 30,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: "#2196F3",
  },
  controls: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  controlLabel: {
    color: "white",
    fontSize: 14,
    marginBottom: 5,
    marginTop: 15,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 30,
    paddingHorizontal: 20,
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.2)",
    minWidth: 130,
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: "#2196F3",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  confirmText: {
    color: "white",
  },
});
