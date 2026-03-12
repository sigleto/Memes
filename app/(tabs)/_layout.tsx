import { FontAwesome } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#2196F3",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarStyle: {
          position: "absolute",
          bottom: 25,
          left: 15,
          right: 15,
          borderRadius: 40,
          height: 80,
          backgroundColor: "#ffffff",
          elevation: 15,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.1,
          shadowRadius: 16,
          paddingBottom: 12,
          paddingTop: 12,
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: "rgba(33, 150, 243, 0.15)",
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
          marginTop: 6,
          letterSpacing: 0.5,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Editor",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="paint-brush" size={26} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="upload" // Nueva pestaña para subir imágenes
        options={{
          title: "Subir",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="upload" size={26} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="stickers"
        options={{
          title: "Stickers",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="smile-o" size={26} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="templates"
        options={{
          title: "Plantillas",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="clone" size={26} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
