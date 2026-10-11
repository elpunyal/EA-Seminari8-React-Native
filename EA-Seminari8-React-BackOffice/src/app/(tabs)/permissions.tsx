import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePermissions } from '../../hooks/usePermissions';

// Pantalla para probar y entender cómo funcionan los permisos nativos y el Bridge en React Native
export default function PermissionsScreen() {
  const {
    cameraStatus,
    mediaLibraryStatus,
    requestCameraPermission,
    requestMediaLibraryPermission,
    takePhoto,
    pickImage,
  } = usePermissions();

  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // Probar hacer foto con la cámara
  const handleCamera = async () => {
    const uri = await takePhoto();
    if (uri) setCapturedImage(uri);
  };

  // Probar elegir imagen de la galería
  const handleGallery = async () => {
    const uri = await pickImage();
    if (uri) setCapturedImage(uri);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Permisos Nativos y el Bridge</Text>
      <Text style={styles.subtitle}>
        Explicación sencilla de cómo React Native interactúa con el móvil para pedir permisos.
      </Text>

      {/* Tarjeta explicativa nivel estudiante */}
      <View style={styles.infoCard}>
        <View style={styles.infoHeader}>
          <Ionicons name="hardware-chip-outline" size={20} color="#2563EB" />
          <Text style={styles.infoTitle}>¿Qué es el Bridge y por qué pedimos permisos?</Text>
        </View>
        <Text style={styles.infoBody}>
          En una web normal, el navegador se encarga de todo. Pero en <Text style={styles.bold}>React Native</Text>,
          nuestro código JavaScript se ejecuta en su propio hilo y el móvil (Android o iOS) se ejecuta en el hilo nativo.
        </Text>
        <Text style={styles.infoBody}>
          El <Text style={styles.bold}>Bridge</Text> (puente) es el canal por el que se comunican JavaScript y el móvil.
          Cuando queremos usar la cámara o las fotos, le enviamos un mensaje al móvil a través del Bridge para que
          le pregunte al usuario si nos da permiso.
        </Text>
      </View>

      {/* Estado actual de los permisos */}
      <View style={styles.statusSection}>
        <Text style={styles.sectionHeader}>Estado de los Permisos en tu Teléfono</Text>

        <View style={styles.statusRow}>
          <View style={styles.statusIcon}>
            <Ionicons name="camera" size={20} color="#334155" />
          </View>
          <View style={styles.statusInfo}>
            <Text style={styles.statusName}>Cámara</Text>
            <Text style={styles.statusDesc}>Para hacer fotos de portadas o autores</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              cameraStatus === 'granted'
                ? styles.badgeGranted
                : cameraStatus === 'denied'
                ? styles.badgeDenied
                : styles.badgeUnknown,
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                cameraStatus === 'granted'
                  ? styles.badgeTextGranted
                  : cameraStatus === 'denied'
                  ? styles.badgeTextDenied
                  : styles.badgeTextUnknown,
              ]}
            >
              {cameraStatus === 'granted' ? 'Concedido' : cameraStatus === 'denied' ? 'Denegado' : 'Sin pedir'}
            </Text>
          </View>
        </View>

        <View style={styles.statusRow}>
          <View style={styles.statusIcon}>
            <Ionicons name="images" size={20} color="#334155" />
          </View>
          <View style={styles.statusInfo}>
            <Text style={styles.statusName}>Galería de Fotos</Text>
            <Text style={styles.statusDesc}>Para seleccionar imágenes guardadas</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              mediaLibraryStatus === 'granted'
                ? styles.badgeGranted
                : mediaLibraryStatus === 'denied'
                ? styles.badgeDenied
                : styles.badgeUnknown,
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                mediaLibraryStatus === 'granted'
                  ? styles.badgeTextGranted
                  : mediaLibraryStatus === 'denied'
                  ? styles.badgeTextDenied
                  : styles.badgeTextUnknown,
              ]}
            >
              {mediaLibraryStatus === 'granted' ? 'Concedido' : mediaLibraryStatus === 'denied' ? 'Denegado' : 'Sin pedir'}
            </Text>
          </View>
        </View>
      </View>

      {/* Botones para probar en vivo */}
      <View style={styles.actionsSection}>
        <Text style={styles.sectionHeader}>Botones de Prueba</Text>

        <View style={styles.buttonsGrid}>
          <Pressable style={styles.actionBtn} onPress={requestCameraPermission}>
            <Ionicons name="shield-checkmark-outline" size={18} color="#2563EB" />
            <Text style={styles.actionBtnText}>1. Pedir Permiso de Cámara</Text>
          </Pressable>

          <Pressable style={styles.actionBtn} onPress={requestMediaLibraryPermission}>
            <Ionicons name="shield-checkmark-outline" size={18} color="#2563EB" />
            <Text style={styles.actionBtnText}>2. Pedir Permiso de Galería</Text>
          </Pressable>

          <Pressable style={[styles.actionBtn, styles.primaryBtn]} onPress={handleCamera}>
            <Ionicons name="camera-outline" size={18} color="#FFFFFF" />
            <Text style={styles.primaryBtnText}>3. Abrir Cámara y Hacer Foto</Text>
          </Pressable>

          <Pressable style={[styles.actionBtn, styles.primaryBtn]} onPress={handleGallery}>
            <Ionicons name="images-outline" size={18} color="#FFFFFF" />
            <Text style={styles.primaryBtnText}>4. Abrir Galería y Elegir Foto</Text>
          </Pressable>
        </View>
      </View>

      {/* Si hemos hecho una foto, la enseñamos aquí */}
      {capturedImage ? (
        <View style={styles.previewSection}>
          <Text style={styles.sectionHeader}>Foto Obtenida Correctamente</Text>
          <Image source={{ uri: capturedImage }} style={styles.previewImage} resizeMode="contain" />
          <Pressable style={styles.clearBtn} onPress={() => setCapturedImage(null)}>
            <Text style={styles.clearBtnText}>Borrar foto de prueba</Text>
          </Pressable>
        </View>
      ) : null}

      <View style={styles.platformBadge}>
        <Ionicons
          name={Platform.OS === 'android' ? 'logo-android' : 'logo-apple'}
          size={16}
          color="#64748B"
        />
        <Text style={styles.platformText}>
          Sistema operativo detectado: {Platform.OS.toUpperCase()}
        </Text>
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
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E40AF',
  },
  infoBody: {
    fontSize: 13,
    color: '#1E3A8A',
    lineHeight: 19,
    marginBottom: 6,
  },
  bold: {
    fontWeight: '700',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  statusSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  statusIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statusInfo: {
    flex: 1,
  },
  statusName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  statusDesc: {
    fontSize: 12,
    color: '#64748B',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeGranted: {
    backgroundColor: '#DCFCE7',
  },
  badgeDenied: {
    backgroundColor: '#FEE2E2',
  },
  badgeUnknown: {
    backgroundColor: '#F1F5F9',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  badgeTextGranted: {
    color: '#166534',
  },
  badgeTextDenied: {
    color: '#991B1B',
  },
  badgeTextUnknown: {
    color: '#64748B',
  },
  actionsSection: {
    marginBottom: 20,
  },
  buttonsGrid: {
    gap: 10,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
  },
  primaryBtn: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  primaryBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  previewSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  previewImage: {
    width: '100%',
    height: 220,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    marginBottom: 10,
  },
  clearBtn: {
    paddingVertical: 6,
  },
  clearBtnText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '600',
  },
  platformBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8,
  },
  platformText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
});
