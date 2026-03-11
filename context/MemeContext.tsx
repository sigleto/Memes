import React, { createContext, useContext, useState } from "react";

type Sticker = {
  id: number;
  image: any;
};

type MemeContextType = {
  image: string | null;
  setImage: (img: string | null) => void;

  topText: string;
  bottomText: string;
  setTopText: (text: string) => void;
  setBottomText: (text: string) => void;

  stickers: Sticker[];
  addSticker: (img: any) => void;
  removeSticker: (id: number) => void;
};

const MemeContext = createContext<MemeContextType | null>(null);

export const MemeProvider = ({ children }: any) => {
  const [image, setImage] = useState<string | null>(null);

  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");

  const [stickers, setStickers] = useState<Sticker[]>([]);

  const addSticker = (img: any) => {
    setStickers((prev) => [
      ...prev,
      {
        id: Date.now(),
        image: img,
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

  if (!context) {
    throw new Error("useMeme debe usarse dentro de MemeProvider");
  }

  return context;
};