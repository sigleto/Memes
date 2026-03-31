/**
 * Sonidos en Firebase Storage (misma carpeta raíz que en la consola).
 * Requiere reglas de lectura pública (o token en la URL) para que la app pueda
 * reproducir y descargar sin login.
 *
 * Si las URLs fallan, comprueba en Firebase Console el nombre exacto del bucket
 * (a veces es `tu-proyecto.appspot.com` en lugar de `*.firebasestorage.app`).
 */
export const FIREBASE_STORAGE_BUCKET =
  process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ??
  "audiomeme-139ad.firebasestorage.app";

/** URL de descarga pública REST de un objeto en el bucket */
export function buildFirebaseStorageFileUrl(objectName: string): string {
  const encoded = encodeURIComponent(objectName);
  return `https://firebasestorage.googleapis.com/v0/b/${FIREBASE_STORAGE_BUCKET}/o/${encoded}?alt=media`;
}

export type LibrarySound = {
  id: string;
  label: string;
  /** Nombre del archivo tal cual en Storage (p. ej. Faah.mp3) */
  file: string;
};

export const LIBRARY_SOUNDS: LibrarySound[] = [
  { id: "faah", label: "Faah", file: "Faah.mp3" },
  { id: "hanky", label: "Hanky Panky", file: "HankyPanky.mp3" },
  { id: "latigo1", label: "Látigo 1", file: "Latigo1.mp3" },
  { id: "latigo2", label: "Látigo 2", file: "Latigo2.mp3" },
  { id: "locura", label: "Locura", file: "Loocura.mp3" },
  { id: "omg", label: "Oh my God", file: "OhMyGod.mp3" },
  { id: "omg2", label: "Oh my God 2", file: "OhMyGod2.mp3" },
  { id: "pedo1", label: "Pedo 1", file: "Pedo1.mp3" },
  { id: "pedo2", label: "Pedo 2", file: "Pedo2.mp3" },
  { id: "risas", label: "Risas", file: "Risas.mp3" },
  { id: "suspense", label: "Suspense", file: "Suspense.mp3" },
];

export function getLibrarySoundUrl(sound: LibrarySound): string {
  return buildFirebaseStorageFileUrl(sound.file);
}
