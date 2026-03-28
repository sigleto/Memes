import {
  AdEventType,
  InterstitialAd,
  TestIds,
} from "react-native-google-mobile-ads";

const adUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : "ca-app-pub-6921150380725872/8675200624";

let interstitial: InterstitialAd | null = null;
let isLoaded = false;

export const loadInterstitial = () => {
  interstitial = InterstitialAd.createForAdRequest(adUnitId, {
    requestNonPersonalizedAdsOnly: true,
  });

  interstitial.addAdEventListener(AdEventType.LOADED, () => {
    isLoaded = true;
  });

  interstitial.addAdEventListener(AdEventType.CLOSED, () => {
    isLoaded = false;
    loadInterstitial(); // 🔥 recargar automáticamente
  });

  interstitial.load();
};

export const showInterstitial = () => {
  if (interstitial && isLoaded) {
    interstitial.show();
  } else {
    console.log("Interstitial no listo");
  }
};
