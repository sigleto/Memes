import React, { useState } from "react";
import { View } from "react-native";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";

const adUnitId = __DEV__
  ? TestIds.BANNER
  : "ca-app-pub-6921150380725872/9988282294";

export default function AdBanner() {
  const [loaded, setLoaded] = useState(false);

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 5,
      }}
    >
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.BANNER} // 👈 Cambiado a BANNER estándar
        onAdLoaded={() => setLoaded(true)}
        onAdFailedToLoad={(error) => {
          console.log("Banner error:", error);
        }}
      />
    </View>
  );
}
