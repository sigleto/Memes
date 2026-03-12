import React, { useRef } from "react";
import {
  Animated,
  Image,
  PanResponder,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function DraggableSticker({
  source,
  isSelected,
  onSelect,
  onRemove,
}: any) {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        onSelect();
      },

      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),

      onPanResponderRelease: () => {},
    }),
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={{
        position: "absolute",
        transform: [{ translateX: pan.x }, { translateY: pan.y }],
      }}
    >
      <Image source={source} style={{ width: 80, height: 80 }} />

      {isSelected && (
        <View
          style={{
            position: "absolute",
            top: -12,
            right: -12,
          }}
          pointerEvents="box-none"
        >
          <TouchableOpacity
            onPress={onRemove}
            style={{
              backgroundColor: "red",
              width: 28,
              height: 28,
              borderRadius: 14,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>✕</Text>
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  );
}
