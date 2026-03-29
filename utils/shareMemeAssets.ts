import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";
import Share from "react-native-share";

/**
 * Garantiza una ruta local file:// utilizable por el sistema de compartir.
 * Descarga HTTPS o copia content:// a caché.
 */
export async function ensureLocalFileUri(
  uri: string,
  fileName: string,
): Promise<string> {
  if (uri.startsWith("file://")) {
    return uri;
  }
  if (/^https?:\/\//i.test(uri)) {
    const dest = `${FileSystem.cacheDirectory}${fileName}`;
    const { uri: out } = await FileSystem.downloadAsync(uri, dest);
    return out;
  }
  if (uri.startsWith("content://")) {
    const dest = `${FileSystem.cacheDirectory}${fileName}`;
    await FileSystem.copyAsync({ from: uri, to: dest });
    if (dest.startsWith("file://")) return dest;
    return `file://${dest}`;
  }
  return uri;
}

/**
 * Comparte imagen (PNG/GIF) + audio en una sola acción cuando la plataforma lo permite.
 * En la web solo comparte la imagen.
 */
function guessExtension(uri: string, fallback: string): string {
  try {
    const base = uri.split("?")[0] ?? uri;
    const part = base.split(".").pop();
    if (part && part.length <= 5 && /^[a-z0-9]+$/i.test(part)) {
      return part.toLowerCase();
    }
  } catch {
    /* ignore */
  }
  return fallback;
}

export async function shareImageAndAudio(
  visualUri: string,
  audioUri: string,
  title: string,
): Promise<void> {
  const audioExt = guessExtension(audioUri, "mp3");
  const audioName = `meme-audio-${Date.now()}.${audioExt}`;
  const localAudio = await ensureLocalFileUri(audioUri, audioName);

  const ext = visualUri.toLowerCase().endsWith(".gif") ? "gif" : "png";
  const visualName = `meme-visual-${Date.now()}.${ext}`;
  const localVisual = visualUri.startsWith("file://")
    ? visualUri
    : await ensureLocalFileUri(visualUri, visualName);

  if (Platform.OS === "web") {
    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(
        localVisual.startsWith("file://") ? localVisual : visualUri,
        {
          mimeType: ext === "gif" ? "image/gif" : "image/png",
          dialogTitle: title,
        },
      );
    }
    return;
  }

  try {
    await Share.open({
      title,
      urls: [localVisual, localAudio],
      failOnCancel: false,
    });
  } catch (e) {
    console.log("Share.open fallback:", e);
    await Sharing.shareAsync(
      localVisual.startsWith("file://") ? localVisual : visualUri,
      {
        mimeType: ext === "gif" ? "image/gif" : "image/png",
        dialogTitle: title,
      },
    );
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(localAudio, {
        mimeType: "audio/mpeg",
        dialogTitle: "Compartir audio",
      });
    }
  }
}
