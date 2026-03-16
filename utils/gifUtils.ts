// utils/gifUtils.ts
import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { Alert, Platform } from 'react-native';

export const downloadAndShareGif = async (gifUrl: string) => {
  try {
    // Verificar si Sharing está disponible
    const isSharingAvailable = await Sharing.isAvailableAsync();
    if (!isSharingAvailable) {
      Alert.alert('Error', 'Compartir no está disponible en este dispositivo');
      return;
    }

    // Solicitar permisos solo en Android (en iOS no es necesario para compartir)
    if (Platform.OS === 'android') {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso necesario', 'Se necesita permiso para acceder a los archivos');
        return;
      }
    }

    // Obtener nombre del archivo de la URL
    const fileName = gifUrl.split('/').pop()?.split('?')[0] || 'meme.gif';
    // Asegurar que tenga extensión .gif
    const finalFileName = fileName.endsWith('.gif') ? fileName : `${fileName}.gif`;
    
    // Crear la ruta completa usando documentDirectory (es una propiedad, no una función)
    const fileUri = FileSystem.documentDirectory + finalFileName;
    
    console.log('Descargando GIF a:', fileUri);

    // Descargar el GIF
    const downloadResult = await FileSystem.downloadAsync(gifUrl, fileUri);
    
    if (downloadResult.status === 200) {
      console.log('GIF descargado correctamente');
      
      // Compartir el GIF
      await Sharing.shareAsync(fileUri, {
        mimeType: 'image/gif',
        dialogTitle: 'Compartir GIF',
        UTI: 'com.compuserve.gif' // Para iOS
      });
    } else {
      throw new Error('Error en la descarga');
    }
  } catch (error) {
    console.error('Error al compartir GIF:', error);
    Alert.alert('Error', 'No se pudo compartir el GIF');
  }
};

// Función adicional para guardar el GIF en la galería
export const saveGifToGallery = async (gifUrl: string) => {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso necesario', 'Se necesita permiso para guardar en la galería');
      return;
    }

    const fileName = gifUrl.split('/').pop()?.split('?')[0] || 'meme.gif';
    const finalFileName = fileName.endsWith('.gif') ? fileName : `${fileName}.gif`;
    const fileUri = FileSystem.documentDirectory + finalFileName;
    
    const downloadResult = await FileSystem.downloadAsync(gifUrl, fileUri);
    
    if (downloadResult.status === 200) {
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.createAlbumAsync('MemeMaker', asset, false);
      Alert.alert('Éxito', 'GIF guardado en la galería');
    }
  } catch (error) {
    console.error('Error al guardar GIF:', error);
    Alert.alert('Error', 'No se pudo guardar el GIF');
  }
};