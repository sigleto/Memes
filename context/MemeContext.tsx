import React, { createContext, useContext, useState } from "react";

export type Sticker = {
  id: number;
  image: string | any; // puede ser URL o require(...)
  isGif?: boolean;
};

type MemeContextType = {
  image: string | null;
  setImage: (img: string | null) => void;
  clearStickers: () => void;

  topText: string;
  bottomText: string;
  setTopText: (text: string) => void;
  setBottomText: (text: string) => void;

  stickers: Sticker[];
  addSticker: (sticker: { image: string | any; isGif?: boolean }) => void;
  removeSticker: (id: number) => void;

  /** Ruta local (file://) del audio del meme; se combina en vídeo MP4 al compartir */
  audioUri: string | null;
  setAudioUri: (uri: string | null) => void;
};

const MemeContext = createContext<MemeContextType | null>(null);

export const MemeProvider = ({ children }: any) => {
  const [image, setImage] = useState<string | null>(null);
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [audioUri, setAudioUriState] = useState<string | null>(null);

  const addSticker = (sticker: { image: string | any; isGif?: boolean }) => {
    setStickers((prev) => {
      if (sticker.isGif) {
        const withoutGifs = prev.filter((s) => !s.isGif);
        return [
          ...withoutGifs,
          { id: Date.now(), image: sticker.image, isGif: true },
        ];
      }
      return [...prev, { id: Date.now(), image: sticker.image, isGif: false }];
    });
  };

  const removeSticker = (id: number) => {
    setStickers((prev) => prev.filter((s) => s.id !== id));
  };

  const clearStickers = () => setStickers([]);

  const setAudioUri = (uri: string | null) => setAudioUriState(uri);

  // 🔹 Acepta null para compatibilidad TypeScript
  const selectTemplate = (img: string | null) => {
    setImage(img);
    if (img !== null) {
      clearStickers();
      setAudioUriState(null);
    }
  };

  return (
    <MemeContext.Provider
      value={{
        image,
        setImage: selectTemplate,
        clearStickers,
        topText,
        bottomText,
        setTopText,
        setBottomText,
        stickers,
        addSticker,
        removeSticker,
        audioUri,
        setAudioUri,
      }}
    >
      {children}
    </MemeContext.Provider>
  );
};

export const useMeme = () => {
  const context = useContext(MemeContext);
  if (!context) throw new Error("useMeme debe usarse dentro de MemeProvider");
  return context;
};
