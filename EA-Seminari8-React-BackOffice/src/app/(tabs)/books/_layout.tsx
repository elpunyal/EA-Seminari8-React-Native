import { Stack } from 'expo-router';

export default function BooksStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#FFFFFF' },
        headerTitleStyle: { fontWeight: '700', fontSize: 18, color: '#0F172A' },
        headerTintColor: '#2563EB',
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Libros' }} />
      <Stack.Screen name="new" options={{ title: 'Nuevo Libro', presentation: 'card' }} />
      <Stack.Screen name="[id]/edit" options={{ title: 'Editar Libro', presentation: 'card' }} />
      <Stack.Screen name="[id]/index" options={{ title: 'Detalle del Libro' }} />
    </Stack>
  );
}
