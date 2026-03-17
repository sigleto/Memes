import { useMeme } from "@/context/MemeContext";
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const API_KEY = "jYTJri4TcIFaXNrlx7WRkYpTFZerGQbQ";

const categories = ["funny", "reactions", "memes", "love", "sports"];

export default function Stickers() {
  const { addSticker } = useMeme();

  const [gifs, setGifs] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);

  const debounceRef = useRef<any>(null);

  // 🔥 TRENDING
  const fetchTrending = async (reset = false) => {
    if (loading) return;

    setLoading(true);

    const newOffset = reset ? 0 : offset;

    try {
      const res = await fetch(
        `https://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}&limit=24&offset=${newOffset}`
      );

      const json = await res.json();

      setGifs(reset ? json.data : [...gifs, ...json.data]);
      setOffset(newOffset + 24);
    } catch (e) {
      console.log("Error trending:", e);
    }

    setLoading(false);
  };

  // 🔍 SEARCH con debounce
  const searchGifs = (text: string) => {
    setQuery(text);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      if (!text) {
        fetchTrending(true);
        return;
      }

      try {
        setLoading(true);

        const res = await fetch(
          `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${text}&limit=24`
        );

        const json = await res.json();

        setGifs(json.data);
        setOffset(24);
      } catch (e) {
        console.log("Error search:", e);
      }

      setLoading(false);
    }, 400);
  };

  useEffect(() => {
    fetchTrending(true);
  }, []);

  // 📥 Cargar más (scroll infinito)
  const loadMore = () => {
    if (!query) {
      fetchTrending();
    }
  };

  // 🎯 Render item
  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      onPress={() =>
        addSticker({
          image: item.images.original.url,
          isGif: true,
        })
      }
      style={styles.sticker}
    >
      <Image
        source={{ uri: item.images.fixed_width.url }}
        style={styles.image}
      />
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* 🔍 BUSCADOR */}
      <TextInput
        placeholder="Buscar GIF..."
        value={query}
        onChangeText={searchGifs}
        style={styles.input}
      />

      {/* 🟡 CATEGORÍAS */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 10 }}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={styles.categoryButton}
            onPress={() => searchGifs(cat)}
          >
            <Text>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 🔥 LISTADO */}
      <FlatList
        data={gifs}
        keyExtractor={(item) => item.id}
        numColumns={3}
        renderItem={renderItem}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.container}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#fff",
    padding: 12,
    margin: 10,
    borderRadius: 10,
    fontSize: 16,
  },
  container: {
    paddingHorizontal: 5,
  },
  sticker: {
    flex: 1,
    margin: 5,
    alignItems: "center",
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: 10,
  },
  categoryButton: {
    backgroundColor: "#eee",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginHorizontal: 5,
    marginLeft: 10,
  },
});