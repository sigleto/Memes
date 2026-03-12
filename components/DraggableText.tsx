import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Keyboard,
  PanResponder,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";

interface Props {
  text: string;
  fontSize: number;
  color: string;
  onChangeText: (t: string) => void;
  initialOffsetY?: number;
  onEditingChange?: (editing: boolean) => void;
}

export default function DraggableText(props: Props) {
  const {
    text,
    fontSize,
    color,
    onChangeText,
    initialOffsetY = 0,
    onEditingChange,
  } = props;
  const [editing, setEditing] = useState(text === " " ? true : false);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(initialOffsetY);
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    // Si el texto es solo un espacio (recién creado), auto-focus
    if (text === " " && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, []);

  const startEditing = () => {
    setEditing(true);
    onEditingChange?.(true);
    // Pequeño retraso para asegurar que el input está montado
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const stopEditing = () => {
    Keyboard.dismiss();
    setEditing(false);
    onEditingChange?.(false);
    // Si el texto está vacío después de editar, restaurar placeholder
    if (text.trim() === "") {
      onChangeText("");
    }
  };

  // PanResponder para arrastrar el texto cuando NO está en modo edición
  const panResponder = useRef(
    PanResponder.create({
      // 1. Decirle al sistema: "Sí, yo quiero capturar este toque"
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      // 2. IMPORTANTE: Impedir que el ScrollView robe el movimiento
      onPanResponderTerminationRequest: () => false,

      onPanResponderGrant: () => {
        // Opcional: podrías poner setEditing(false) aquí para asegurar
        pan.setOffset({
          x: (pan.x as any)._value,
          y: (pan.y as any)._value,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        pan.flattenOffset(); // Esto simplifica mucho el manejo de la posición final
      },
    }),
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.container,
        {
          transform: [
            { translateX: offsetX },
            { translateY: offsetY },
            { translateX: pan.x },
            { translateY: pan.y },
          ],
        },
      ]}
    >
      {editing ? (
        <TextInput
          ref={inputRef}
          value={text === " " ? "" : text}
          onChangeText={(newText) => {
            // Evitar que el texto sea solo espacios
            onChangeText(newText);
          }}
          onBlur={stopEditing}
          style={[styles.text, { fontSize, color }]}
          multiline
          blurOnSubmit={true}
          onSubmitEditing={stopEditing}
          scrollEnabled={false}
          textAlignVertical="center"
          textAlign="center"
          maxLength={50}
        />
      ) : (
        <Text style={[styles.text, { fontSize, color }]} onPress={startEditing}>
          {text.toUpperCase()}
        </Text>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    alignSelf: "center",
    minWidth: 100,
    maxWidth: "90%",
    // Añadir un pequeño área táctil para facilitar el arrastre
    padding: 10,
    zIndex: 10,
  },
  text: {
    fontFamily: "MemeFont",
    textShadowColor: "black",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
    textAlign: "center",
    includeFontPadding: false, // Mejorar el padding del texto
    paddingVertical: 0,
  },
});
