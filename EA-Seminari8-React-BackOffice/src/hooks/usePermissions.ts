import { useState } from 'react';
import { Alert, Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

// Hook sencillo para pedir permisos de cámara y galería de fotos.
// En React Native, para acceder a la cámara o fotos del teléfono móvil,
// JavaScript tiene que pedir permiso al sistema operativo (Android o iOS) a través del Bridge/JSI.
export function usePermissions() {
  const [cameraStatus, setCameraStatus] = useState<ImagePicker.PermissionStatus | null>(null);
  const [mediaLibraryStatus, setMediaLibraryStatus] = useState<ImagePicker.PermissionStatus | null>(null);

  // Pedir permiso para usar la cámara
  const requestCameraPermission = async (): Promise<boolean> => {
    try {
      const { status, canAskAgain } = await ImagePicker.requestCameraPermissionsAsync();
      setCameraStatus(status);

      // Si el usuario no nos da permiso, mostramos una alerta
      if (status !== ImagePicker.PermissionStatus.GRANTED) {
        Alert.alert(
          'Permiso de Cámara Denegado',
          canAskAgain
            ? 'Necesitamos permiso de la cámara para hacer la foto del libro o autor.'
            : 'Los permisos están bloqueados en los ajustes de tu teléfono. Puedes activarlos en Ajustes.',
          canAskAgain
            ? [{ text: 'Entendido' }]
            : [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Abrir Ajustes', onPress: () => Linking.openSettings() },
              ],
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error al pedir permiso de cámara:', error);
      return false;
    }
  };

  // Pedir permiso para acceder a la galería de imágenes
  const requestMediaLibraryPermission = async (): Promise<boolean> => {
    try {
      const { status, canAskAgain } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setMediaLibraryStatus(status);

      if (status !== ImagePicker.PermissionStatus.GRANTED) {
        Alert.alert(
          'Permiso de Galería Denegado',
          canAskAgain
            ? 'Necesitamos permiso para elegir una imagen de tu galería.'
            : 'Permiso desactivado. Puedes activarlo en los ajustes del dispositivo.',
          canAskAgain
            ? [{ text: 'Entendido' }]
            : [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Abrir Ajustes', onPress: () => Linking.openSettings() },
              ],
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error al pedir permiso de galería:', error);
      return false;
    }
  };

  // Abrir la cámara para hacer una foto
  const takePhoto = async (): Promise<string | null> => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return null;

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      return result.assets[0].uri;
    }
    return null;
  };

  // Abrir la galería para seleccionar una foto existente
  const pickImage = async (): Promise<string | null> => {
    const hasPermission = await requestMediaLibraryPermission();
    if (!hasPermission) return null;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      return result.assets[0].uri;
    }
    return null;
  };

  return {
    cameraStatus,
    mediaLibraryStatus,
    requestCameraPermission,
    requestMediaLibraryPermission,
    takePhoto,
    pickImage,
  };
}
