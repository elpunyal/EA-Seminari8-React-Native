import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useToast } from '../../../context/ToastContext';
import { useApiList } from '../../../hooks/useApiList';
import type { Book } from '../../../models';
import { bookService } from '../../../services/book.service';
import { errorMessage } from '../../../utils/api-error';
import { BookCard } from '../../../components/BookCard';
import { ConfirmModal } from '../../../components/ConfirmModal';
import { SearchBar } from '../../../components/SearchBar';
import { ViewToggle, ViewMode } from '../../../components/ViewToggle';

// Comprobamos si un libro coincide con el texto escrito en el buscador.
// Siguiendo el ejercicio, ahora también buscamos por editorial (publisher).
function matchesBook(book: Book, text: string) {
  const query = text.toLowerCase();
  return (
    book.title.toLowerCase().includes(query) ||
    book.isbn.toLowerCase().includes(query) ||
    (book.publisher?.toLowerCase().includes(query) ?? false) ||
    (book.description?.toLowerCase().includes(query) ?? false)
  );
}

export default function BooksScreen() {
  const router = useRouter();
  const { showToast } = useToast();

  // Pedimos los libros a la API usando nuestro hook personalizado
  const { items: books, loading, error: loadError, removeItem, onRefresh, refreshing } =
    useApiList(bookService.getBooks);

  // Estados locales para el buscador y el modo de vista (lista o tarjetas)
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [actionError, setActionError] = useState('');

  // Filtramos la lista según lo que escribe el usuario
  const filteredBooks = useMemo(() => {
    if (!search.trim()) return books;
    return books.filter((b) => matchesBook(b, search.trim()));
  }, [books, search]);

  // Función para borrar un libro tras confirmar en el modal
  const confirmDelete = async () => {
    if (!bookToDelete) return;
    setActionError('');
    try {
      await bookService.deleteBook(bookToDelete._id);
      removeItem(bookToDelete._id);
      showToast(`Libro "${bookToDelete.title}" borrado correctamente`);
    } catch (err) {
      setActionError(errorMessage(err));
      showToast(errorMessage(err));
    }
    setBookToDelete(null);
  };

  // Navegar a la pantalla de edición
  const handleEdit = (book: Book) => {
    router.push({
      pathname: '/(tabs)/books/[id]/edit',
      params: { id: book._id },
    });
  };

  // Navegar al detalle del libro
  const handleDetail = (book: Book) => {
    router.push({
      pathname: '/(tabs)/books/[id]',
      params: { id: book._id },
    });
  };

  const error = loadError || actionError;

  return (
    <View style={styles.container}>
      {/* Cabecera con título y botón para crear nuevo libro */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Catálogo de Libros</Text>
          <Text style={styles.subtitle}>
            {books.length} {books.length === 1 ? 'libro' : 'libros'} en total
          </Text>
        </View>
        <Pressable
          style={({ pressed }) => [styles.newButton, pressed && styles.pressed]}
          onPress={() => router.push('/(tabs)/books/new')}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.newButtonText}>Nuevo</Text>
        </Pressable>
      </View>

      {/* Buscador en tiempo real */}
      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Buscar por título, ISBN, editorial..."
        onClear={() => setSearch('')}
      />

      {/* Botones para alternar entre lista y tarjetas */}
      <ViewToggle mode={viewMode} onChange={setViewMode} />

      {error ? (
        <View style={styles.errorBanner}>
          <Ionicons name="alert-circle-outline" size={18} color="#EF4444" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {/* Si está cargando por primera vez, mostramos el spinner */}
      {loading && !refreshing ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Cargando libros...</Text>
        </View>
      ) : (
        /* FlatList en vez de <table> de HTML: optimiza la memoria en móviles */
        <FlatList
          data={filteredBooks}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <BookCard
              book={item}
              viewMode={viewMode}
              onEdit={handleEdit}
              onDelete={setBookToDelete}
              onPress={() => handleDetail(item)}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#2563EB']}
              tintColor="#2563EB"
            />
          }
          contentContainerStyle={filteredBooks.length === 0 ? styles.emptyList : styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="book-outline" size={48} color="#94A3B8" />
              <Text style={styles.emptyTitle}>
                {search ? `Sin resultados para "${search}"` : 'No hay libros registrados'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {search ? 'Prueba con otro término de búsqueda' : 'Pulsa "Nuevo" para crear uno'}
              </Text>
            </View>
          }
        />
      )}

      {/* Modal para confirmar antes de eliminar */}
      <ConfirmModal
        open={bookToDelete !== null}
        title="Confirmar Borrado"
        message={`¿Estás seguro de que deseas eliminar el libro "${bookToDelete?.title}"?`}
        confirmText="Borrar"
        onConfirm={confirmDelete}
        onCancel={() => setBookToDelete(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    gap: 4,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  newButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    gap: 8,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
    flex: 1,
  },
  list: {
    paddingBottom: 24,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#94A3B8',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#64748B',
  },
  pressed: {
    opacity: 0.8,
  },
});
