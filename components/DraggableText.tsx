// DraggableText.tsx
import React, { useRef, useState } from "react";
import {
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

interface DraggableTextProps {
  text: string;
  fontSize: number;
  color: string;
  onChangeText: (text: string) => void;
  initialOffsetY?: number;
  placeholder?: string;
}

export default function DraggableText({
  text,
  fontSize,
  color,
  onChangeText,
  initialOffsetY = 0,
  placeholder = "",
}: DraggableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const pan = useRef(new Animated.ValueXY({ x: 0, y: initialOffsetY })).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isEditing,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return (
          !isEditing &&
          (Math.abs(gestureState.dx) > 2 || Math.abs(gestureState.dy) > 2)
        );
      },
      onPanResponderGrant: () => {
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
        pan.flattenOffset();
      },
    }),
  ).current;

  // Estilos dinámicos para el texto con borde
  const textStyle = {
    fontSize,
    color,
    fontFamily: "MemeFont",
    // Si el texto es negro, ponemos borde blanco. Si no, borde negro.
    textShadowColor: color === "black" ? "white" : "black",
  };

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.container,
        { transform: [{ translateX: pan.x }, { translateY: pan.y }] },
      ]}
    >
      {isEditing ? (
        <TextInput
          style={[styles.input, textStyle]}
          defaultValue={text}
          onChangeText={onChangeText}
          onBlur={() => setIsEditing(false)}
          onSubmitEditing={() => setIsEditing(false)}
          autoFocus
          multiline
          textAlign="center"
          placeholder={placeholder}
          placeholderTextColor="gray"
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setIsEditing(true)}
        >
          <Text style={[styles.text, textStyle]}>{text || placeholder}</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    alignSelf: "center",
    maxWidth: "90%",
    zIndex: 10,
  },
  text: {
    textAlign: "center",
    padding: 10,
    // Este "truco" crea un borde definido alrededor del texto
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  input: {
    textAlign: "center",
    padding: 5,
    minWidth: 150,
    backgroundColor: "rgba(255,255,255,0.15)", // Muy discreto
    borderRadius: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
});
