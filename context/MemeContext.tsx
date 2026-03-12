import React, { createContext, useContext, useState } from "react";

export type Sticker = {
  id: number;
  image: any; // require(...) o URL
  isGif?: boolean; // indicador de GIF
};

type MemeContextType = {
  image: string | null;
  setImage: (img: string | null) => void;

  topText: string;
  bottomText: string;
  setTopText: (text: string) => void;
  setBottomText: (text: string) => void;

  stickers: Sticker[];
  addSticker: (sticker: { image: any; isGif?: boolean }) => void;
  removeSticker: (id: number) => void;
};

const MemeContext = createContext<MemeContextType | null>(null);

export const MemeProvider = ({ children }: any) => {
  const [image, setImage] = useState<string | null>(null);
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [stickers, setStickers] = useState<Sticker[]>([]);

  const addSticker = (sticker: { image: any; isGif?: boolean }) => {
    setStickers((prev) => [
      ...prev,
      {
        id: Date.now(),
        image: sticker.image,
        isGif: sticker.isGif || false,
      },
    ]);
  };

  const removeSticker = (id: number) => {
    setStickers((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <MemeContext.Provider
      value={{
        image,
        setImage,
        topText,
        bottomText,
        setTopText,
        setBottomText,
        stickers,
        addSticker,
        removeSticker,
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
