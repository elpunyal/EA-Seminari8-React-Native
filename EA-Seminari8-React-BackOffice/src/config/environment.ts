import { Platform } from 'react-native';

const envApiUrl = process.env.EXPO_PUBLIC_API_URL;

const getDefaultApiUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:1337';
  }
  return 'http://localhost:1337';
};

export const environment = {
  apiUrl: envApiUrl || getDefaultApiUrl(),
};