import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Editor",
        }}
      />

      <Tabs.Screen
        name="stickers"
        options={{
          title: "Stickers",
        }}
      />

      <Tabs.Screen
        name="templates"
        options={{
          title: "Plantillas",
        }}
      />

      <Tabs.Screen
        name="generator"
        options={{
          title: "Ideas",
        }}
      />
    </Tabs>
  );
}