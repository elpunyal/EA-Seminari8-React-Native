import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import type { Author } from '../../../../models';
import { authorService } from '../../../../services/author.service';
import { errorMessage, isAbort } from '../../../../utils/api-error';
import { formatDate, initials } from '../../../../utils/format';
import { RoleBadge } from '../../../../components/RoleBadge';

export default function AuthorDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [author, setAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();

    authorService
      .getAuthor(id, controller.signal)
      .then((data) => {
        setAuthor(data);
        setLoading(false);
      })
      .catch((err) => {
        if (!isAbort(err)) {
          setError(errorMessage(err));
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Cargando autor...</Text>
      </View>
    );
  }

  if (error || !author) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
        <Text style={styles.errorTitle}>Error al cargar autor</Text>
        <Text style={styles.errorText}>{error || 'Autor no encontrado'}</Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials(author.name)}</Text>
        </View>
        <Text style={styles.name}>{author.name}</Text>
        <Text style={styles.email}>{author.email}</Text>

        <View style={styles.badgeRow}>
          <RoleBadge role={author.role} />
          <View style={[styles.statusBadge, author.active ? styles.statusActive : styles.statusInactive]}>
            <Text style={styles.statusText}>{author.active ? 'Activo' : 'Inactivo'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Datos Personales</Text>
        <View style={styles.infoRow}>
          <Ionicons name="flag-outline" size={18} color="#64748B" />
          <Text style={styles.infoLabel}>Nacionalidad:</Text>
          <Text style={styles.infoValue}>{author.nationality || 'No especificada'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={18} color="#64748B" />
          <Text style={styles.infoLabel}>Nacimiento:</Text>
          <Text style={styles.infoValue}>{formatDate(author.birthDate) || 'No especificado'}</Text>
        </View>
        {author.website ? (
          <View style={styles.infoRow}>
            <Ionicons name="globe-outline" size={18} color="#64748B" />
            <Text style={styles.infoLabel}>Web:</Text>
            <Text style={styles.infoValue}>{author.website}</Text>
          </View>
        ) : null}
      </View>

      {author.biography ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Biografía</Text>
          <Text style={styles.bioText}>{author.biography}</Text>
        </View>
      ) : null}

      <View style={styles.actions}>
        <Pressable
          style={styles.editAction}
          onPress={() =>
            router.push({
              pathname: '/(tabs)/authors/[id]/edit',
              params: { id: author._id },
            })
          }
        >
          <Ionicons name="create-outline" size={18} color="#FFFFFF" />
          <Text style={styles.editActionText}>Editar Autor</Text>
        </Pressable>
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
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#4F46E5',
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: '#DCFCE7',
  },
  statusInactive: {
    backgroundColor: '#F1F5F9',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#166534',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
    gap: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
    flex: 1,
  },
  bioText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
  },
  actions: {
    marginTop: 10,
  },
  editAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
  },
  editActionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#64748B',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    textAlign: 'center',
  },
  backButton: {
    marginTop: 12,
    backgroundColor: '#F1F5F9',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#475569',
    fontWeight: '600',
  },
});
