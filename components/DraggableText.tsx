import React, { useRef } from "react";
import { Animated, PanResponder, StyleSheet, Text } from "react-native";

export default function DraggableText({ label, fontSize, color }: any) {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,

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
      <Text style={[styles.text, { fontSize, color }]}>
        {label.toUpperCase()}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: "MemeFont",
    textShadowColor: "black",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
});