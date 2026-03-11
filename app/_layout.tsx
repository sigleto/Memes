import { MemeProvider } from "@/context/Memecontext";
import { Slot } from "expo-router";

export default function RootLayout() {
  return (
    <MemeProvider>
      <Slot />
    </MemeProvider>
  );
}