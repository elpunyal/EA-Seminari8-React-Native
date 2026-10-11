import { Platform } from 'react-native';

// En el emulador de Android, 'localhost' apunta al propio teléfono.
// Para conectarnos al servidor de nuestra máquina (el backend en el puerto 1337),
// Android usa la IP especial 10.0.2.2. En iOS o en la web sí funciona localhost directo.
const getApiUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:1337';
  }
  return 'http://localhost:1337';
};

export const environment = {
  apiUrl: getApiUrl(),
};
