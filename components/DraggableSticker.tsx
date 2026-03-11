import React, { useRef } from "react";
import { Animated, Image, PanResponder } from "react-native";

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
      style={{
        position: "absolute",
        transform: [{ translateX: pan.x }, { translateY: pan.y }],
      }}
    >
      <Image source={source} style={{ width: 80, height: 80 }} />
    </Animated.View>
  );
}