import { useMeme } from "@/context/MemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Templates() {
  const { setImage, image } = useMeme();

  const [templates, setTemplates] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [favoritesLoading, setFavoritesLoading] = useState(true);
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    fetchTemplates();
    loadFavorites();
  }, []);

  // 🔥 CARGAR DESDE IMGFLIP
  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://api.imgflip.com/get_memes");
      const json = await res.json();
      if (json.success) {
        setTemplates(json.data.memes);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  // ⭐ FAVORITOS
  const loadFavorites = async () => {
    try {
      setFavoritesLoading(true);
      const data = await AsyncStorage.getItem("template_favorites");
      setFavorites(data ? JSON.parse(data) : []);
    } catch (error) {
      console.log(error);
    } finally {
      setFavoritesLoading(false);
    }
  };

  const saveFavorites = async (newFavs: any[]) => {
    await AsyncStorage.setItem("template_favorites", JSON.stringify(newFavs));
    setFavorites([...newFavs]);
  };

  const addToFavorites = (template: any) => {
    const exists = favorites.some((f) => f.id === template.id);
    if (!exists) {
      saveFavorites([template, ...favorites]);
    }
  };

  const removeFromFavorites = (template: any) => {
    const newFavs = favorites.filter((f) => f.id !== template.id);
    saveFavorites(newFavs);
  };

  // 🧠 RENDER ITEM
  const renderItem = ({ item }: any) => {
    const isFav = favorites.some((f) => f.id === item.id);
    const isSelected = image === item.url;

    return (
      <TouchableOpacity
        onPress={() => {
          if (isSelected) return;
          setImage(item.url);
        }}
        style={styles.template}
      >
        <Image source={{ uri: item.url }} style={styles.image} />

        {/* ⭐ BOTÓN ACCIÓN (FAV/BORRAR) */}
        <TouchableOpacity
          style={styles.favButton}
          onPress={(e) => {
            e.stopPropagation();
            showFavorites ? removeFromFavorites(item) : addToFavorites(item);
          }}
        >
          <Text style={{ fontSize: 18 }}>
            {showFavorites ? "❌" : isFav ? "⭐" : "☆"}
          </Text>
        </TouchableOpacity>

        {/* ✅ OVERLAY SELECCIONADO */}
        {isSelected && (
          <View style={styles.selectedOverlay}>
            <Text style={styles.selectedText}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 🔝 TOP BAR */}
      <View style={styles.topBar}>
        {showFavorites ? (
          <View style={styles.row}>
            <TouchableOpacity
              onPress={() => setShowFavorites(false)}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
              <Text style={styles.backText}>← Volver</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Mis Favoritos</Text>
            <View style={{ width: 60 }} />
          </View>
        ) : (
          <View style={styles.row}>
            <Text style={styles.title}>Plantillas</Text>
            <TouchableOpacity
              onPress={() => {
                setShowFavorites(true);
                loadFavorites();
              }}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
              <Text style={styles.tab}>⭐ Favoritos</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* 📦 LISTA */}
      <View style={{ flex: 1 }}>
        {loading || (showFavorites && favoritesLoading) ? (
          <ActivityIndicator
            size="large"
            color="blue"
            style={{ marginTop: 50 }}
          />
        ) : (
          <FlatList
            data={showFavorites ? favorites : templates}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            renderItem={renderItem}
            contentContainerStyle={styles.listPadding}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topBar: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
    marginTop: 20,
    // Estas 3 líneas son vitales para que los botones respondan
    zIndex: 1000,
    elevation: 10,
    position: "relative",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  tab: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "600",
  },
  backText: {
    fontSize: 16,
    color: "#007AFF",
  },
  listPadding: {
    padding: 5,
    paddingBottom: 20,
  },
  template: {
    flex: 1 / 3,
    margin: 5,
    aspectRatio: 1,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  favButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    elevation: 5,
  },
  selectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,122,255,0.4)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  selectedText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
});
