import { Slot } from "expo-router";
import { MemeProvider } from "../context/MemeContext";

export default function RootLayout() {
  return (
    <MemeProvider>
      <Slot />
    </MemeProvider>
  );
}
