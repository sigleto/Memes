import { FontAwesome } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "#d1d5db",
        tabBarStyle: {
          position: "absolute",
          bottom: 44,
          left: 16,
          right: 16,
          borderRadius: 28,
          height: 68,
          backgroundColor: "#5b0707",
          elevation: 12,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.12,
          shadowRadius: 14,
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.08)",
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "700",
          marginTop: 4,
          letterSpacing: 0.3,
        },
        tabBarIconStyle: {
          marginTop: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Editor",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="paint-brush" size={23} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="upload"
        options={{
          title: "Subir",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="upload" size={23} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="stickers"
        options={{
          title: "Stickers",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="smile-o" size={23} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="sounds"
        options={{
          title: "Sonido",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="volume-up" size={23} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="templates"
        options={{
          title: "Plantillas",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="clone" size={23} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
