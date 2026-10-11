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
import type { Author } from '../../../models';
import { authorService } from '../../../services/author.service';
import { errorMessage } from '../../../utils/api-error';
import { AuthorCard } from '../../../components/AuthorCard';
import { ConfirmModal } from '../../../components/ConfirmModal';
import { SearchBar } from '../../../components/SearchBar';
import { ViewToggle, ViewMode } from '../../../components/ViewToggle';

function matchesAuthor(author: Author, text: string) {
  const query = text.toLowerCase();
  return author.name.toLowerCase().includes(query) || author.email.toLowerCase().includes(query);
}

export default function AuthorsScreen() {
  const router = useRouter();
  const { showToast } = useToast();

  const { items: authors, loading, error: loadError, removeItem, onRefresh, refreshing } =
    useApiList(authorService.getAuthors);

  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [authorToDelete, setAuthorToDelete] = useState<Author | null>(null);
  const [actionError, setActionError] = useState('');

  const filteredAuthors = useMemo(() => {
    if (!search.trim()) return authors;
    return authors.filter((a) => matchesAuthor(a, search.trim()));
  }, [authors, search]);

  const confirmDelete = async () => {
    if (!authorToDelete) return;
    setActionError('');
    try {
      await authorService.deleteAuthor(authorToDelete._id);
      removeItem(authorToDelete._id);
      showToast(`Autor "${authorToDelete.name}" borrado correctamente`);
    } catch (err) {
      setActionError(errorMessage(err));
      showToast(errorMessage(err));
    }
    setAuthorToDelete(null);
  };

  const handleEdit = (author: Author) => {
    router.push({
      pathname: '/(tabs)/authors/[id]/edit',
      params: { id: author._id },
    });
  };

  const handleDetail = (author: Author) => {
    router.push({
      pathname: '/(tabs)/authors/[id]',
      params: { id: author._id },
    });
  };

  const error = loadError || actionError;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Directorio de Autores</Text>
          <Text style={styles.subtitle}>
            {authors.length} {authors.length === 1 ? 'autor' : 'autores'} registrados
          </Text>
        </View>
        <Pressable
          style={({ pressed }) => [styles.newButton, pressed && styles.pressed]}
          onPress={() => router.push('/(tabs)/authors/new')}
        >
          <Ionicons name="person-add" size={18} color="#FFFFFF" />
          <Text style={styles.newButtonText}>Nuevo</Text>
        </Pressable>
      </View>

      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Buscar por nombre o correo electrónico..."
        onClear={() => setSearch('')}
      />

      <ViewToggle mode={viewMode} onChange={setViewMode} />

      {error ? (
        <View style={styles.errorBanner}>
          <Ionicons name="alert-circle-outline" size={18} color="#EF4444" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {loading && !refreshing ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Cargando autores...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredAuthors}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <AuthorCard
              author={item}
              viewMode={viewMode}
              onEdit={handleEdit}
              onDelete={setAuthorToDelete}
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
          contentContainerStyle={filteredAuthors.length === 0 ? styles.emptyList : styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={48} color="#94A3B8" />
              <Text style={styles.emptyTitle}>
                {search ? `Sin resultados para "${search}"` : 'No hay autores registrados'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {search ? 'Intenta buscar con otros términos' : 'Crea un autor con el botón "Nuevo"'}
              </Text>
            </View>
          }
        />
      )}

      <ConfirmModal
        open={authorToDelete !== null}
        title="Confirmar Borrado"
        message={`¿Borrar al autor "${authorToDelete?.name}"? Sus libros asociados no se borrarán, pero quedarán sin este autor.`}
        confirmText="Borrar"
        onConfirm={confirmDelete}
        onCancel={() => setAuthorToDelete(null)}
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
    gap: 6,
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
