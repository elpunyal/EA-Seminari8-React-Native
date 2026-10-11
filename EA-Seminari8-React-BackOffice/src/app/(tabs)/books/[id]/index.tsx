import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import type { Book } from '../../../../models';
import { bookService } from '../../../../services/book.service';
import { errorMessage, isAbort } from '../../../../utils/api-error';
import { formatPrice, languageName } from '../../../../utils/format';

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();

    bookService
      .getBook(id, controller.signal)
      .then((data) => {
        setBook(data);
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
        <Text style={styles.loadingText}>Cargando detalle...</Text>
      </View>
    );
  }

  if (error || !book) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
        <Text style={styles.errorTitle}>Error al cargar el libro</Text>
        <Text style={styles.errorText}>{error || 'Libro no encontrado'}</Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  const coverUrl = `https://picsum.photos/seed/${book._id}/400/500`;
  const authorNames =
    book.authors.length > 0 ? book.authors.map((a) => a.name).join(', ') : 'Sin autores asignados';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image source={{ uri: coverUrl }} style={styles.cover} resizeMode="cover" />

      <View style={styles.body}>
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.authors}>{authorNames}</Text>

        {book.publisher ? (
          <View style={styles.infoBadge}>
            <Ionicons name="business" size={16} color="#4F46E5" />
            <Text style={styles.infoBadgeText}>Editorial: {book.publisher}</Text>
          </View>
        ) : null}

        <View style={styles.metaGrid}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>ISBN</Text>
            <Text style={styles.metaValue}>{book.isbn}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Idioma</Text>
            <Text style={styles.metaValue}>{languageName(book.language)}</Text>
          </View>
          {book.publishedYear ? (
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Año</Text>
              <Text style={styles.metaValue}>{book.publishedYear}</Text>
            </View>
          ) : null}
          {book.pages ? (
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Páginas</Text>
              <Text style={styles.metaValue}>{book.pages}</Text>
            </View>
          ) : null}
        </View>

        {book.price !== undefined ? (
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Precio:</Text>
            <Text style={styles.priceValue}>{formatPrice(book.price)}</Text>
          </View>
        ) : null}

        {book.description ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sinopsis</Text>
            <Text style={styles.descriptionText}>{book.description}</Text>
          </View>
        ) : null}

        {book.tags && book.tags.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Etiquetas</Text>
            <View style={styles.tagsRow}>
              {book.tags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        <View style={styles.actions}>
          <Pressable
            style={styles.editAction}
            onPress={() =>
              router.push({
                pathname: '/(tabs)/books/[id]/edit',
                params: { id: book._id },
              })
            }
          >
            <Ionicons name="create-outline" size={18} color="#FFFFFF" />
            <Text style={styles.editActionText}>Editar Libro</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingBottom: 40,
  },
  cover: {
    width: '100%',
    height: 260,
    backgroundColor: '#E2E8F0',
  },
  body: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  authors: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 12,
  },
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 6,
    marginBottom: 16,
  },
  infoBadgeText: {
    color: '#4F46E5',
    fontWeight: '700',
    fontSize: 13,
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  metaItem: {
    minWidth: '40%',
  },
  metaLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '700',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 16,
  },
  priceLabel: {
    fontSize: 16,
    color: '#64748B',
  },
  priceValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#059669',
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  descriptionText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#475569',
  },
  actions: {
    marginTop: 12,
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
