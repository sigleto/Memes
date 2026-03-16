import { Image } from 'expo-image';
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const STICKER_SIZE = 350; // Tamaño más grande para los stickers

interface DraggableStickerProps {
  source: any;
  isGif?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  onRemove?: () => void;
}
export default function DraggableSticker({
  source,
  isGif = false,
  isSelected = false,
  onSelect,
  onRemove,
}: DraggableStickerProps) {
  const pan = useRef(new Animated.ValueXY()).current;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Calcular posición inicial centrada
  useEffect(() => {
    // La posición inicial será el centro del canvas
    // Asumiendo que el canvas tiene un tamaño de SCREEN_WIDTH - 40
    const canvasSize = SCREEN_WIDTH - 40;
    const initialX = canvasSize / 2 - STICKER_SIZE / 2;
    const initialY = canvasSize / 2 - STICKER_SIZE / 2;

    pan.setValue({ x: initialX, y: initialY });
    setPosition({ x: initialX, y: initialY });
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        onSelect?.();
      },
      onPanResponderMove: (_, gesture) => {
        // Actualizar posición mientras se arrastra
        pan.setValue({
          x: gesture.dx + position.x,
          y: gesture.dy + position.y,
        });
      },
      onPanResponderRelease: (_, gesture) => {
        // Guardar la nueva posición
        const newX = gesture.dx + position.x;
        const newY = gesture.dy + position.y;
        setPosition({ x: newX, y: newY });
        pan.setValue({ x: newX, y: newY });
      },
    }),
  ).current;

  const imageSource = typeof source === "string" ? { uri: source } : source;

  // Precargar la imagen
  useEffect(() => {
    if (typeof source === "string") {
      Image.prefetch(source)
        .then(() => setLoading(false))
        .catch(() => {
          console.log("Error precargando:", source);
          setError(true);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [source]);

  if (error) {
    return null;
  }

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        {
          position: "absolute",
          width: STICKER_SIZE,
          height: STICKER_SIZE,
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
        },
        isSelected && styles.selectedSticker,
      ]}
    >
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
        </View>
      ) : (
       <Image
  source={imageSource}
  style={styles.stickerImage}
  contentFit="contain"
  autoplay={true} // Esto asegura que el GIF se anime
/>
      )}

      {isSelected && !loading && (
        <View style={styles.removeButtonContainer} pointerEvents="box-none">
          <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
            <Text style={styles.removeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  selectedSticker: {
    borderWidth: 2,
    borderColor: "#2196F3",
    borderRadius: 8,
  },
  loadingContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 8,
  },
  stickerImage: {
    width: "100%",
    height: "100%",
  },
  removeButtonContainer: {
    position: "absolute",
    top: -12,
    right: -12,
  },
  removeButton: {
    backgroundColor: "red",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  removeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
})