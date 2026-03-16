import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface DraggableTextProps {
  text: string;
  onChangeText: (text: string) => void;
  onRemove: () => void;
  fontSize: number;
  color: string;
  autoFocus?: boolean;
}

export default function DraggableText({
  text,
  onChangeText,
  onRemove,
  fontSize,
  color,
  autoFocus = false,
}: DraggableTextProps) {
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (autoFocus && text === "") {
      setTimeout(() => {
        inputRef.current?.focus();
        setIsEditing(true);
      }, 100);
    }
  }, [autoFocus]);

  // Mostrar el botón de borrar SOLO cuando está en modo edición
  const showDelete = isEditing && text.length > 0;

  // PanResponder - solo activo cuando NO estamos editando
  const panResponder = useRef(
    PanResponder.create({
      // Solo activar el pan responder si NO estamos editando
      onStartShouldSetPanResponder: () => !isEditing,
      onMoveShouldSetPanResponder: () => !isEditing,
      
      onPanResponderGrant: () => {
        pan.setOffset({
          x: (pan as any).__getValue().x,
          y: (pan as any).__getValue().y,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    })
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.container,
        { transform: [{ translateX: pan.x }, { translateY: pan.y }] },
      ]}
    >
      <View style={styles.wrapper}>
        <TextInput
          ref={inputRef}
          value={text}
          onChangeText={onChangeText}
          style={[
            styles.text,
            { fontSize, color, fontFamily: "MemeFont" },
          ]}
          placeholder={text.length === 0 ? "Escribe aquí..." : ""}
          placeholderTextColor="rgba(255,255,255,0.5)"
          multiline
          textAlign="center"
          onFocus={() => setIsEditing(true)}
          onBlur={() => setIsEditing(false)}
          onTouchStart={(e) => e.stopPropagation()}
        />

        {showDelete && (
          <TouchableOpacity 
            style={styles.delete} 
            onPress={onRemove}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
  },
  wrapper: {
    alignItems: "center",
  },
  text: {
    padding: 10,
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.75)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    minWidth: 100,
  },
  delete: {
    position: "absolute",
    top: -15,
    right: -15,
    backgroundColor: "red",
    width: 25,
    height: 25,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
});