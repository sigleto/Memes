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

/** Reproduce un clip desde una ruta local (file://) o remota */
export const playSoundFromUri = async (uri: string) => {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    });
    if (sound) {
      await sound.unloadAsync();
      sound = null;
    }
    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: true },
    );
    sound = newSound;
  } catch (e) {
    console.log("Error reproduciendo URI:", e);
  }
};

export const stopSound = async () => {
  if (sound) {
    await sound.stopAsync();
    await sound.unloadAsync();
    sound = null;
  }
};
