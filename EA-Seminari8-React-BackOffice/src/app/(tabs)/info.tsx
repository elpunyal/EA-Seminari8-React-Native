import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Pantalla teórica con el resumen de conceptos de clase (React Native vs React Web)
export default function InfoScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.mainTitle}>Resumen de Conceptos de Clase</Text>
      <Text style={styles.mainSubtitle}>
        Apuntes explicados de forma sencilla para el Seminario 8 de EA.
      </Text>

      {/* 1. Expo & React Native */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="phone-portrait-outline" size={20} color="#2563EB" />
          <Text style={styles.cardTitle}>1. ¿Qué es React Native y Expo?</Text>
        </View>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>React Native</Text> nos permite programar apps móviles para Android e iOS
          usando React y JavaScript/TypeScript. A diferencia de una web, el móvil dibuja botones y textos reales del sistema operativo.
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Expo</Text> es una herramienta que nos ahorra configurar Android Studio o Xcode a mano:
          nos da las librerías necesarias y nos permite probar la app en el móvil escaneando un código QR con Expo Go.
        </Text>
      </View>

      {/* 2. El Bridge & JSI */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="git-network-outline" size={20} color="#7C3AED" />
          <Text style={styles.cardTitle}>2. El Bridge (El Puente)</Text>
        </View>
        <Text style={styles.paragraph}>
          En React Native hay dos mundos: el código JavaScript por un lado, y el código nativo (Java/Kotlin en Android,
          Swift en iOS) por el otro.
        </Text>
        <Text style={styles.paragraph}>
          El <Text style={styles.bold}>Bridge</Text> es el canal por el que ambos mundos se envían mensajes en formato JSON.
          Por ejemplo, cuando queremos abrir la cámara, JavaScript manda un mensaje por el puente y el móvil responde cuando tiene la foto.
        </Text>
      </View>

      {/* 3. DOM vs Componentes Nativos */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="cube-outline" size={20} color="#059669" />
          <Text style={styles.cardTitle}>3. Adiós al DOM: Componentes Nativos</Text>
        </View>
        <Text style={styles.paragraph}>
          En el móvil <Text style={styles.bold}>no hay navegador ni etiquetas HTML</Text>. Cada elemento web se cambia por uno nativo:
        </Text>
        <View style={styles.table}>
          <View style={styles.tableRowHeader}>
            <Text style={styles.colHeader}>En React Web (HTML)</Text>
            <Text style={styles.colHeader}>En React Native</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.colCell}>&lt;div&gt; o &lt;section&gt;</Text>
            <Text style={[styles.colCell, styles.boldCell]}>&lt;View&gt;</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.colCell}>&lt;p&gt;, &lt;span&gt;, &lt;h1&gt;</Text>
            <Text style={[styles.colCell, styles.boldCell]}>&lt;Text&gt;</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.colCell}>&lt;input type="text"&gt;</Text>
            <Text style={[styles.colCell, styles.boldCell]}>&lt;TextInput&gt;</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.colCell}>&lt;button&gt;</Text>
            <Text style={[styles.colCell, styles.boldCell]}>&lt;Pressable&gt;</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.colCell}>&lt;img&gt;</Text>
            <Text style={[styles.colCell, styles.boldCell]}>&lt;Image&gt;</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.colCell}>&lt;table&gt; o lista</Text>
            <Text style={[styles.colCell, styles.boldCell]}>&lt;FlatList&gt;</Text>
          </View>
        </View>
      </View>

      {/* 4. Eventos */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="flash-outline" size={20} color="#D97706" />
          <Text style={styles.cardTitle}>4. Eventos: onClick vs onPress</Text>
        </View>
        <Text style={styles.paragraph}>
          En el ordenador usamos el ratón y hacemos clic (<Text style={styles.bold}>onClick</Text>).
          En el móvil tocamos con el dedo en la pantalla, por eso los botones usan <Text style={styles.bold}>onPress</Text>.
        </Text>
        <Text style={styles.paragraph}>
          Y en los inputs de texto, en vez de leer <Text style={styles.codeText}>e.target.value</Text>,
          usamos <Text style={styles.bold}>onChangeText</Text> que nos pasa directamente el texto escrito.
        </Text>
      </View>

      {/* 5. Estructura de Pantallas y Expo Router */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="folder-open-outline" size={20} color="#2563EB" />
          <Text style={styles.cardTitle}>5. Pantallas y Router de Expo</Text>
        </View>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Expo Router</Text> funciona creando carpetas y ficheros dentro de <Text style={styles.codeText}>src/app/</Text>:
        </Text>
        <Text style={styles.bullet}>• <Text style={styles.bold}>_layout.tsx</Text>: define si usamos pestañas (Tabs) o pantallas apiladas (Stack).</Text>
        <Text style={styles.bullet}>• <Text style={styles.bold}>index.tsx</Text>: es la pantalla principal de esa carpeta.</Text>
        <Text style={styles.bullet}>• <Text style={styles.bold}>[id]/edit.tsx</Text>: pantalla para editar pasando el id en la ruta.</Text>
        <Text style={styles.bullet}>• Para navegar usamos <Text style={styles.codeText}>router.push()</Text> o <Text style={styles.codeText}>router.back()</Text>.</Text>
      </View>

      {/* 6. Props, Estado y Hooks */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="sync-outline" size={20} color="#DC2626" />
          <Text style={styles.cardTitle}>6. Props, State y Hooks</Text>
        </View>
        <Text style={styles.paragraph}>
          Las bases de React son las mismas en web que en móvil:
        </Text>
        <Text style={styles.bullet}>• <Text style={styles.bold}>Props</Text>: datos que le pasamos a un componente hijo.</Text>
        <Text style={styles.bullet}>• <Text style={styles.bold}>useState</Text>: guardar datos que cuando cambian vuelven a pintar la pantalla.</Text>
        <Text style={styles.bullet}>• <Text style={styles.bold}>useEffect</Text>: ejecutar código al cargar la pantalla (por ejemplo pedir los libros a la API).</Text>
      </View>

      {/* 7. HTTP y Conexión con la API */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="cloud-outline" size={20} color="#0284C7" />
          <Text style={styles.cardTitle}>7. Llamadas a la API (Fetch / Backend)</Text>
        </View>
        <Text style={styles.paragraph}>
          Seguimos usando <Text style={styles.bold}>fetch</Text> igual que en la web.
          El único detalle importante es la dirección IP:
        </Text>
        <Text style={styles.bullet}>• En el <Text style={styles.bold}>emulador de Android</Text>, usamos <Text style={styles.codeText}>http://10.0.2.2:1337</Text> para llegar al backend de nuestro ordenador.</Text>
        <Text style={styles.bullet}>• En la web o iOS, usamos <Text style={styles.codeText}>http://localhost:1337</Text>.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  mainSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 18,
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  paragraph: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 21,
    marginBottom: 8,
  },
  bullet: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
    marginLeft: 4,
    marginBottom: 4,
  },
  bold: {
    fontWeight: '700',
    color: '#1E293B',
  },
  codeText: {
    fontFamily: 'monospace',
    color: '#0F172A',
    backgroundColor: '#F1F5F9',
  },
  table: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableRowHeader: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  colHeader: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  colCell: {
    flex: 1,
    fontSize: 12,
    color: '#64748B',
  },
  boldCell: {
    fontWeight: '700',
    color: '#2563EB',
  },
});
