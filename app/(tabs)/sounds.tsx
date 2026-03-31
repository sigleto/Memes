import AdBanner from "@/components/AdBanner";
import { getLibrarySoundUrl, LIBRARY_SOUNDS } from "@/constants/firebaseSounds";
import { useMeme } from "@/context/MemeContext";
import { playSoundFromUri, stopSound } from "@/utils/soundPlayer";
import { Audio } from "expo-av";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SoundsScreen() {
  const { audioUri, setAudioUri } = useMeme();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const recordTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (recordTimer.current) clearTimeout(recordTimer.current);
    };
  }, []);

  const pickAudioFile = async () => {
    try {
      setLoading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: ["audio/*"],
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets?.[0]) {
        return;
      }

      const asset = result.assets[0];
      setAudioUri(asset.uri);
      router.back();
    } catch (e) {
      console.log(e);
      Alert.alert("Error", "No se pudo cargar el audio.");
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (!perm.granted) {
        Alert.alert(
          "Permiso",
          "Se necesita acceso al micrófono para grabar audio.",
        );
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );
      await rec.startAsync();
      recordingRef.current = rec;
      setIsRecording(true);

      if (recordTimer.current) clearTimeout(recordTimer.current);
      recordTimer.current = setTimeout(async () => {
        await stopRecordingInternal();
        Alert.alert(
          "Límite",
          "Se alcanzó el máximo de 2 minutos de grabación.",
        );
      }, 120_000);
    } catch (e) {
      console.log(e);
      Alert.alert("Error", "No se pudo iniciar la grabación.");
    }
  };

  const stopRecordingInternal = async () => {
    if (recordTimer.current) {
      clearTimeout(recordTimer.current);
      recordTimer.current = null;
    }

    const rec = recordingRef.current;
    recordingRef.current = null;
    if (!rec) {
      setIsRecording(false);
      return;
    }

    try {
      setIsRecording(false);
      await rec.stopAndUnloadAsync();
      const uri = rec.getURI();
      if (uri) {
        setAudioUri(uri);
        router.back();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const stopRecording = async () => {
    await stopRecordingInternal();
  };

  const previewAudio = async () => {
    if (!audioUri) return;
    await playSoundFromUri(audioUri);
  };

  const clearAudio = () => {
    void stopSound();
    setAudioUri(null);
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingBottom: 120 + insets.bottom },
        ]}
      >
        <Text style={styles.title}>Sonido del meme</Text>
        <Text style={styles.hint}>
          Elige un clip de la biblioteca (Firebase) o un archivo propio. Al
          compartir, se envían la imagen del meme y el audio; la otra persona
          puede reproducirlos en WhatsApp u otra app sin instalar Memes.
        </Text>

        <Text style={styles.sectionTitle}>Biblioteca</Text>
        <View style={styles.soundGrid}>
          {LIBRARY_SOUNDS.map((s) => {
            const url = getLibrarySoundUrl(s);
            const selected = audioUri === url;
            return (
              <TouchableOpacity
                key={s.id}
                style={[styles.soundChip, selected && styles.soundChipSelected]}
                onPress={async () => {
                  try {
                    await playSoundFromUri(url); // 👈 preview
                  } catch (e) {
                    console.log(e);
                  }
                }}
                onLongPress={() => {
                  setAudioUri(url); // 👈 seleccionar
                  router.back();
                }}
                disabled={loading || isRecording}
              >
                <Text
                  style={[
                    styles.soundChipText,
                    selected && styles.soundChipTextSelected,
                  ]}
                  numberOfLines={1}
                >
                  {s.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[styles.optionButton, loading && styles.disabledButton]}
          onPress={pickAudioFile}
          disabled={loading || isRecording}
        >
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>📁</Text>
          </View>
          <View style={styles.optionTextWrap}>
            <Text style={styles.optionTitle}>Elegir archivo de audio</Text>
            <Text style={styles.optionSubtitle}>MP3, M4A, etc.</Text>
          </View>
        </TouchableOpacity>

        {!isRecording ? (
          <TouchableOpacity
            style={[styles.optionButton, styles.recordButton]}
            onPress={startRecording}
            disabled={loading}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>🎙️</Text>
            </View>
            <View style={styles.optionTextWrap}>
              <Text style={styles.optionTitle}>Grabar voz o efecto</Text>
              <Text style={styles.optionSubtitle}>Máx. 2 minutos</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.optionButton, styles.stopButton]}
            onPress={stopRecording}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>⏹️</Text>
            </View>
            <View style={styles.optionTextWrap}>
              <Text style={styles.optionTitle}>Detener y usar grabación</Text>
            </View>
          </TouchableOpacity>
        )}

        {loading && (
          <ActivityIndicator
            style={{ marginTop: 16 }}
            size="large"
            color="#2196F3"
          />
        )}

        {audioUri ? (
          <View style={styles.statusBox}>
            <Text style={styles.statusText}>✓ Audio asignado al meme</Text>
            <View style={styles.row}>
              <TouchableOpacity style={styles.smallBtn} onPress={previewAudio}>
                <Text style={styles.smallBtnText}>▶ Escuchar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.smallBtnDanger}
                onPress={clearAudio}
              >
                <Text style={styles.smallBtnText}>Quitar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <Text style={styles.emptyNote}>Ningún audio seleccionado aún.</Text>
        )}
      </ScrollView>

      <View
        style={[
          styles.bannerWrapper,
          {
            paddingBottom: insets.bottom,
            bottom: 150,
            zIndex: 1000,
            elevation: 1000,
          },
        ]}
      >
        <AdBanner />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f5f5f5" },
  container: {
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  hint: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
  },
  soundGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  soundChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#ede7f6",
    borderWidth: 1,
    borderColor: "transparent",
    maxWidth: "48%",
  },
  soundChipSelected: {
    backgroundColor: "#d1c4e9",
    borderColor: "#7e57c2",
  },
  soundChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4527a0",
  },
  soundChipTextSelected: {
    color: "#311b92",
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  disabledButton: { opacity: 0.5 },
  recordButton: { borderWidth: 1, borderColor: "rgba(33, 150, 243, 0.35)" },
  stopButton: {
    backgroundColor: "#ffeaea",
    borderWidth: 1,
    borderColor: "#e74c3c",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#eef6ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  icon: { fontSize: 22 },
  optionTextWrap: { flex: 1 },
  optionTitle: { fontSize: 17, fontWeight: "700", color: "#222" },
  optionSubtitle: { fontSize: 13, color: "#888", marginTop: 4 },
  statusBox: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#e8f5e9",
    borderRadius: 12,
  },
  statusText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2e7d32",
    marginBottom: 12,
  },
  row: { flexDirection: "row", gap: 12 },
  smallBtn: {
    flex: 1,
    backgroundColor: "#2196F3",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  smallBtnDanger: {
    flex: 1,
    backgroundColor: "#e74c3c",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  smallBtnText: { color: "#fff", fontWeight: "700" },
  emptyNote: {
    marginTop: 12,
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  bannerWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingVertical: 5,
    marginBottom: -40,
  },
});
