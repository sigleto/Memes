// utils/soundPlayer.ts
import { Audio } from "expo-av";

let sound: Audio.Sound | null = null;

export const playSound = async (file: any) => {
  try {
    if (sound) {
      await sound.unloadAsync(); // libera sonido anterior
      sound = null;
    }

    const { sound: newSound } = await Audio.Sound.createAsync(file);
    sound = newSound;
    await sound.playAsync();
  } catch (e) {
    console.log("Error reproduciendo sonido:", e);
  }
};

export const stopSound = async () => {
  if (sound) {
    await sound.stopAsync();
    await sound.unloadAsync();
    sound = null;
  }
};