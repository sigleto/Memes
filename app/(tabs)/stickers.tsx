import { useMeme } from "@/context/MemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const API_KEY = "jYTJri4TcIFaXNrlx7WRkYpTFZerGQbQ";
const categories = ["divertido", "reaccion", "memes", "deportes"];

export default function Stickers() {
  const { addSticker, stickers } = useMeme();

  const [gifs, setGifs] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favoritesLoading, setFavoritesLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
    fetchTrending(true);
  }, []);

  const loadFavorites = async () => {
    try {
      setFavoritesLoading(true);
      const data = await AsyncStorage.getItem("favorites");
      setFavorites(data ? JSON.parse(data) : []);
    } catch (error) {
      console.log(error);
    } finally {
      setFavoritesLoading(false);
    }
  };

  const saveFavorites = async (newFavs: any[]) => {
    await AsyncStorage.setItem("favorites", JSON.stringify(newFavs));
    setFavorites([...newFavs]);
  };

  const addToFavorites = (gif: any) => {
    const exists = favorites.some((f) => f.id === gif.id);
    if (!exists) {
      saveFavorites([gif, ...favorites]);
    }
  };

  const removeFromFavorites = (gif: any) => {
    const newFavs = favorites.filter((f) => f.id !== gif.id);
    saveFavorites(newFavs);
  };

  const fetchTrending = async (reset = false) => {
    if (loading) return;

    setLoading(true);
    const newOffset = reset ? 0 : offset;

    try {
      const res = await fetch(
        `https://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}&limit=24&offset=${newOffset}`,
      );
      const json = await res.json();

      setGifs(reset ? json.data : [...gifs, ...json.data]);
      setOffset(newOffset + 24);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const searchGifs = async (text: string) => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${text}&limit=24`,
      );
      const json = await res.json();
      setGifs(json.data);
      setOffset(24);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: any) => {
    const isFav = favorites.some((f) => f.id === item.id);

    // 🔥 Detectar si este GIF está seleccionado en el canvas
    const isSelected = stickers.some(
      (s) => s.isGif && s.image === item.images.original.url,
    );

    return (
      <TouchableOpacity
        onPress={() => {
          if (isSelected) return;

          addSticker({
            image: item.images.original.url,
            isGif: true,
          });
        }}
        style={styles.sticker}
      >
        <Image
          source={{ uri: item.images.fixed_width.url }}
          style={styles.image}
        />

        {/* ⭐ SOLO AÑADIR (no quitar) */}
        {!showFavorites && (
          <TouchableOpacity
            style={styles.favButton}
            onPress={(e) => {
              e.stopPropagation();
              addToFavorites(item);
            }}
          >
            <Text style={{ fontSize: 18 }}>{isFav ? "⭐" : "☆"}</Text>
          </TouchableOpacity>
        )}

        {/* ❌ SOLO EN FAVORITOS */}
        {showFavorites && (
          <TouchableOpacity
            style={styles.favButton}
            onPress={(e) => {
              e.stopPropagation();
              removeFromFavorites(item);
            }}
          >
            <Text style={{ fontSize: 18 }}>❌</Text>
          </TouchableOpacity>
        )}

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
    <View style={{ flex: 1 }}>
      {/* TOPBAR */}
      <View style={styles.topBar}>
        {showFavorites ? (
          <>
            <TouchableOpacity onPress={() => setShowFavorites(false)}>
              <Text style={styles.backText}>Volver</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Favoritos</Text>
          </>
        ) : (
          <>
            <Text style={styles.title}>GIFs</Text>

            <TouchableOpacity
              onPress={() => {
                setShowFavorites(true);
                loadFavorites();
              }}
            >
              <Text style={styles.tab}>Favoritos</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* CATEGORÍAS */}
      {!showFavorites && (
        <View style={styles.categoriesWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={styles.categoryButton}
                onPress={() => searchGifs(cat)}
              >
                <Text style={styles.categoryText}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* LISTA */}
      {showFavorites && favoritesLoading ? (
        <ActivityIndicator style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={showFavorites ? favorites : gifs}
          keyExtractor={(item) => item.id}
          numColumns={3}
          renderItem={renderItem}
          onEndReached={() => !showFavorites && fetchTrending()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sticker: {
    flex: 1,
    margin: 5,
    aspectRatio: 1,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  favButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 15,
    padding: 5,
  },
  selectedOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  selectedText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  tab: {
    fontSize: 20,
  },
  backText: {
    fontSize: 20,
  },
  categoriesWrapper: {
    height: 60, // Damos una altura fija al contenedor para que el ScrollView respire
    marginVertical: 10,
  },
  categoriesContainer: {
    paddingHorizontal: 10,
    alignItems: "center", // Centra los botones verticalmente dentro del scroll
  },
  categoryButton: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 18,
    height: 40, // Altura fija para el botón
    borderRadius: 20,
    marginRight: 10,
    justifyContent: "center", // CENTRADO VERTICAL REAL
    alignItems: "center", // CENTRADO HORIZONTAL REAL
  },
  categoryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    includeFontPadding: false, // ELIMINA ESPACIO EXTRA EN ANDROID
    textAlignVertical: "center", // FUERZA CENTRADO EN ANDROID
    marginTop: 0, // ASEGÚRATE DE QUE ESTO SEA 0
    padding: 0, // ASEGÚRATE DE QUE ESTO SEA 0
  },
});
