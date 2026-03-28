import AdBanner from "@/components/AdBanner";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";

const API_KEY = "jYTJri4TcIFaXNrlx7WRkYpTFZerGQbQ";

const categories = [
  { label: "Divertido", query: "funny" },
  { label: "Reacción", query: "reaction" },
  { label: "Memes", query: "memes" },
  { label: "Deportes", query: "sports" },
  { label: "Animales", query: "animals" },
  { label: "Amor", query: "love" },
  { label: "Fail", query: "fail" },
  { label: "Retro", query: "retro" },
];

export default function Stickers() {
  const { addSticker, stickers } = useMeme();
  const insets = useSafeAreaInsets();

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

        {isSelected && (
          <View style={styles.selectedOverlay}>
            <Text style={styles.selectedText}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.screen}>
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
                key={cat.query}
                style={styles.categoryButton}
                onPress={() => searchGifs(cat.query)}
              >
                <Text style={styles.categoryText}>{cat.label}</Text>
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
          contentContainerStyle={{
            paddingBottom: 140 + insets.bottom, // Espacio para el banner y menú
          }}
        />
      )}

      {/* Banner fijo - posicionado encima del menú inferior */}
      <View
        style={[
          styles.bannerContainer,
          {
            paddingBottom: insets.bottom,
            bottom: 130, // Altura del menú (80) + bottom del menú (50)
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
  screen: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
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
    height: 60,
    marginVertical: 10,
  },
  categoriesContainer: {
    paddingHorizontal: 10,
    alignItems: "center",
  },
  categoryButton: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 18,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    includeFontPadding: false,
    textAlignVertical: "center",
    marginTop: 0,
    padding: 0,
  },
  bannerContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingVertical: 3,
  },
});
