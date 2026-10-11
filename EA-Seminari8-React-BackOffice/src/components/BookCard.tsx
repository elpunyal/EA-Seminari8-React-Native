import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Book } from '../models';
import { formatPrice, languageName, truncate } from '../utils/format';

interface BookCardProps {
  book: Book;
  viewMode: 'list' | 'cards';
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
  onPress?: () => void;
}

// Componente para pintar un libro, ya sea en fila compacta (lista) o en tarjeta con portada grande.
// Incluye la editorial (publisher) que nos pedía el ejercicio.
export function BookCard({ book, viewMode, onEdit, onDelete, onPress }: BookCardProps) {
  const isCard = viewMode === 'cards';
  // Obtenemos los nombres de los autores separados por coma
  const authorNames = book.authors.length > 0 ? book.authors.map((a) => a.name).join(', ') : 'Sin autores';
  // Generamos una portada aleatoria de prueba con el id del libro
  const coverUrl = `https://picsum.photos/seed/${book._id}/200/300`;

  if (!isCard) {
    // Modo Lista: fila horizontal con portada pequeña a la izquierda
    return (
      <Pressable style={styles.listRow} onPress={onPress}>
        <Image source={{ uri: coverUrl }} style={styles.listCover} />
        <View style={styles.listContent}>
          <Text style={styles.listTitle} numberOfLines={1}>
            {book.title}
          </Text>
          <Text style={styles.listAuthor} numberOfLines={1}>
            {authorNames}
          </Text>
          {/* Si tiene editorial, la mostramos aquí */}
          {book.publisher ? (
            <Text style={styles.publisherText} numberOfLines={1}>
              Editorial: {book.publisher}
            </Text>
          ) : null}
          <View style={styles.listMeta}>
            <Text style={styles.metaBadge}>{languageName(book.language)}</Text>
            {book.publishedYear ? (
              <Text style={styles.metaText}>{book.publishedYear}</Text>
            ) : null}
            {book.price !== undefined ? (
              <Text style={styles.priceText}>{formatPrice(book.price)}</Text>
            ) : null}
          </View>
        </View>
        {/* Botones de acción: editar y borrar */}
        <View style={styles.listActions}>
          <Pressable
            style={({ pressed }) => [styles.actionButton, styles.editButton, pressed && styles.pressed]}
            onPress={() => onEdit(book)}
          >
            <Ionicons name="create-outline" size={18} color="#2563EB" />
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.actionButton, styles.deleteButton, pressed && styles.pressed]}
            onPress={() => onDelete(book)}
          >
            <Ionicons name="trash-outline" size={18} color="#EF4444" />
          </Pressable>
        </View>
      </Pressable>
    );
  }

  // Modo Tarjeta: portada grande arriba y detalles abajo
  return (
    <View style={styles.card}>
      <Image source={{ uri: coverUrl }} style={styles.cardCover} />
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{book.title}</Text>
        <Text style={styles.cardAuthor}>{authorNames}</Text>

        {/* Mostramos la editorial en la tarjeta */}
        {book.publisher ? (
          <View style={styles.publisherRow}>
            <Ionicons name="business-outline" size={14} color="#6366F1" />
            <Text style={styles.publisherCardText}>Editorial: {book.publisher}</Text>
          </View>
        ) : null}

        {book.description ? (
          <Text style={styles.cardDescription}>{truncate(book.description, 90)}</Text>
        ) : null}

        <View style={styles.cardDetails}>
          <Text style={styles.metaBadge}>{languageName(book.language)}</Text>
          {book.publishedYear ? (
            <Text style={styles.metaText}>{book.publishedYear}</Text>
          ) : null}
          {book.pages ? (
            <Text style={styles.metaText}>{book.pages} págs.</Text>
          ) : null}
          {book.price !== undefined ? (
            <Text style={styles.priceText}>{formatPrice(book.price)}</Text>
          ) : null}
        </View>

        {book.tags && book.tags.length > 0 ? (
          <View style={styles.tagsContainer}>
            {book.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>

      <View style={styles.cardFooter}>
        <Pressable
          style={({ pressed }) => [styles.footerButton, styles.footerEdit, pressed && styles.pressed]}
          onPress={() => onEdit(book)}
        >
          <Ionicons name="create-outline" size={16} color="#2563EB" />
          <Text style={styles.footerEditText}>Editar</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.footerButton, styles.footerDelete, pressed && styles.pressed]}
          onPress={() => onDelete(book)}
        >
          <Ionicons name="trash-outline" size={16} color="#EF4444" />
          <Text style={styles.footerDeleteText}>Borrar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  listCover: {
    width: 50,
    height: 70,
    borderRadius: 6,
    backgroundColor: '#E2E8F0',
    marginRight: 12,
  },
  listContent: {
    flex: 1,
  },
  listTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  listAuthor: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  publisherText: {
    fontSize: 12,
    color: '#6366F1',
    fontWeight: '500',
    marginTop: 2,
  },
  listMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  metaBadge: {
    backgroundColor: '#F1F5F9',
    fontSize: 11,
    color: '#475569',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    fontWeight: '600',
  },
  metaText: {
    fontSize: 12,
    color: '#64748B',
  },
  priceText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#059669',
  },
  listActions: {
    flexDirection: 'row',
    gap: 6,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
  },
  editButton: {
    backgroundColor: '#EFF6FF',
  },
  deleteButton: {
    backgroundColor: '#FEF2F2',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardCover: {
    width: '100%',
    height: 180,
    backgroundColor: '#E2E8F0',
  },
  cardBody: {
    padding: 14,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  cardAuthor: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 6,
  },
  publisherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  publisherCardText: {
    fontSize: 13,
    color: '#4F46E5',
    fontWeight: '600',
  },
  cardDescription: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginVertical: 4,
  },
  cardDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  tag: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 11,
    color: '#4F46E5',
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  footerEdit: {
    backgroundColor: '#EFF6FF',
  },
  footerEditText: {
    color: '#2563EB',
    fontSize: 13,
    fontWeight: '600',
  },
  footerDelete: {
    backgroundColor: '#FEF2F2',
  },
  footerDeleteText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.7,
  },
});
