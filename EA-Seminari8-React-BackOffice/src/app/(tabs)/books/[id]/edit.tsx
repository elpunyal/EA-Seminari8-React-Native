import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useToast } from '../../../../context/ToastContext';
import { useForm } from '../../../../hooks/useForm';
import { useApiList } from '../../../../hooks/useApiList';
import { BOOK_LANGUAGES, BOOK_TAGS, Book, BookLanguage, UpdateBook } from '../../../../models';
import { authorService } from '../../../../services/author.service';
import { bookService } from '../../../../services/book.service';
import { errorMessage, isAbort } from '../../../../utils/api-error';
import { languageName } from '../../../../utils/format';
import { removeEmpty } from '../../../../utils/remove-empty';
import { Field } from '../../../../components/Field';

type BookFormValues = {
  title: string;
  isbn: string;
  publisher: string; // Editorial que cargaremos del libro existente
  authors: string[];
  description: string;
  publishedYear: string;
  pages: string;
  language: BookLanguage;
  tags: string[];
  price: string;
};

const INITIAL_VALUES: BookFormValues = {
  title: '',
  isbn: '',
  publisher: '',
  authors: [],
  description: '',
  publishedYear: '',
  pages: '',
  language: 'es',
  tags: [],
  price: '',
};

function validate(values: BookFormValues) {
  const errors: Partial<Record<keyof BookFormValues, string>> = {};

  if (!values.title.trim()) errors.title = 'El título es obligatorio';
  if (!values.isbn.trim()) errors.isbn = 'El ISBN es obligatorio';
  if (values.authors.length === 0) errors.authors = 'Elige al menos un autor';

  if (values.publishedYear !== '') {
    const year = Number(values.publishedYear);
    if (year < 1450 || year > 2100) errors.publishedYear = 'Año entre 1450 y 2100';
  }
  if (values.pages !== '' && Number(values.pages) < 1) {
    errors.pages = 'Mínimo 1 página';
  }
  if (values.price !== '' && Number(values.price) < 0) {
    errors.price = 'El precio no puede ser negativo';
  }

  return errors;
}

export default function EditBookScreen() {
  // Obtenemos el id del libro desde los parámetros de la ruta
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { showToast } = useToast();

  const { items: authors, loading: loadingAuthors } = useApiList(authorService.getAuthors);

  const form = useForm<BookFormValues>(INITIAL_VALUES, validate);
  const { fill } = form;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Pedimos el libro a la API para rellenar el formulario (precarga)
  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();
    bookService
      .getBook(id, controller.signal)
      .then((book: Book) => {
        // Rellenamos el formulario, incluyendo publisher tal como pedía el ejercicio
        fill({
          title: book.title,
          isbn: book.isbn,
          publisher: book.publisher ?? '',
          authors: book.authors.map((a) => a._id),
          description: book.description ?? '',
          publishedYear: book.publishedYear?.toString() ?? '',
          pages: book.pages?.toString() ?? '',
          language: book.language ?? 'es',
          tags: book.tags ?? [],
          price: book.price?.toString() ?? '',
        });
        setLoading(false);
      })
      .catch((err) => {
        if (!isAbort(err)) {
          setError(errorMessage(err));
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [id, fill]);

  const toggleAuthor = (authorId: string) => {
    const current = form.values.authors;
    if (current.includes(authorId)) {
      form.setFieldValue('authors', current.filter((i) => i !== authorId));
    } else {
      form.setFieldValue('authors', [...current, authorId]);
    }
  };

  const toggleTag = (tag: string) => {
    const current = form.values.tags;
    if (current.includes(tag)) {
      form.setFieldValue('tags', current.filter((t) => t !== tag));
    } else {
      form.setFieldValue('tags', [...current, tag]);
    }
  };

  // Guardar los cambios en la API
  const handleSubmit = async () => {
    if (!id) return;
    form.touchAll();
    if (!form.isValid) {
      showToast('Revisa los campos obligatorios');
      return;
    }

    const { values } = form;
    const payload = removeEmpty({
      ...values,
      publisher: values.publisher.trim() ? values.publisher.trim() : undefined,
      publishedYear: values.publishedYear === '' ? undefined : Number(values.publishedYear),
      pages: values.pages === '' ? undefined : Number(values.pages),
      price: values.price === '' ? undefined : Number(values.price),
    }) as UpdateBook;

    setSaving(true);
    setError('');

    try {
      await bookService.updateBook(id, payload);
      showToast('Libro actualizado correctamente');
      router.back();
    } catch (err) {
      setError(errorMessage(err));
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Cargando datos del libro...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.screenTitle}>Editar Libro</Text>

      {error ? (
        <View style={styles.errorBanner}>
          <Ionicons name="alert-circle" size={18} color="#EF4444" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <Field label="Título *" error={form.errorOf('title')}>
        <TextInput
          style={[styles.input, form.errorOf('title') && styles.inputError]}
          value={form.values.title}
          onChangeText={form.handleChangeText('title')}
          onBlur={form.handleBlur('title')}
        />
      </Field>

      <Field label="ISBN *" error={form.errorOf('isbn')}>
        <TextInput
          style={[styles.input, form.errorOf('isbn') && styles.inputError]}
          value={form.values.isbn}
          onChangeText={form.handleChangeText('isbn')}
          onBlur={form.handleBlur('isbn')}
        />
      </Field>

      {/* Campo Editorial añadido por el Ejercicio */}
      <Field label="Editorial (Publisher)" error={form.errorOf('publisher')} hint="Casa editorial del libro">
        <TextInput
          style={styles.input}
          value={form.values.publisher}
          onChangeText={form.handleChangeText('publisher')}
          onBlur={form.handleBlur('publisher')}
          placeholder="Nombre de la editorial..."
        />
      </Field>

      <Field label="Autores *" error={form.errorOf('authors')}>
        {loadingAuthors ? (
          <ActivityIndicator size="small" color="#2563EB" />
        ) : (
          <View style={styles.chipsRow}>
            {authors.map((author) => {
              const selected = form.values.authors.includes(author._id);
              return (
                <Pressable
                  key={author._id}
                  style={[styles.chip, selected && styles.chipSelected]}
                  onPress={() => toggleAuthor(author._id)}
                >
                  <Ionicons
                    name={selected ? 'checkbox' : 'square-outline'}
                    size={16}
                    color={selected ? '#FFFFFF' : '#64748B'}
                  />
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                    {author.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </Field>

      <Field label="Descripción">
        <TextInput
          style={[styles.input, styles.textArea]}
          value={form.values.description}
          onChangeText={form.handleChangeText('description')}
          multiline
          numberOfLines={3}
        />
      </Field>

      <View style={styles.row}>
        <View style={styles.halfCol}>
          <Field label="Año de publicación" error={form.errorOf('publishedYear')}>
            <TextInput
              style={[styles.input, form.errorOf('publishedYear') && styles.inputError]}
              value={form.values.publishedYear}
              onChangeText={form.handleChangeText('publishedYear')}
              onBlur={form.handleBlur('publishedYear')}
              keyboardType="number-pad"
            />
          </Field>
        </View>
        <View style={styles.halfCol}>
          <Field label="Páginas" error={form.errorOf('pages')}>
            <TextInput
              style={[styles.input, form.errorOf('pages') && styles.inputError]}
              value={form.values.pages}
              onChangeText={form.handleChangeText('pages')}
              onBlur={form.handleBlur('pages')}
              keyboardType="number-pad"
            />
          </Field>
        </View>
      </View>

      <Field label="Idioma">
        <View style={styles.chipsRow}>
          {BOOK_LANGUAGES.map((lang) => {
            const selected = form.values.language === lang;
            return (
              <Pressable
                key={lang}
                style={[styles.chip, selected && styles.chipSelected]}
                onPress={() => form.setFieldValue('language', lang)}
              >
                <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                  {languageName(lang)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Field>

      <Field label="Etiquetas (Tags)">
        <View style={styles.chipsRow}>
          {BOOK_TAGS.map((tag) => {
            const selected = form.values.tags.includes(tag);
            return (
              <Pressable
                key={tag}
                style={[styles.chip, selected && styles.chipSelected]}
                onPress={() => toggleTag(tag)}
              >
                <Text style={[styles.chipText, selected && styles.chipTextSelected]}>#{tag}</Text>
              </Pressable>
            );
          })}
        </View>
      </Field>

      <Field label="Precio (€)" error={form.errorOf('price')}>
        <TextInput
          style={[styles.input, form.errorOf('price') && styles.inputError]}
          value={form.values.price}
          onChangeText={form.handleChangeText('price')}
          onBlur={form.handleBlur('price')}
          keyboardType="decimal-pad"
        />
      </Field>

      <View style={styles.actions}>
        <Pressable
          style={[styles.submitButton, (!form.isValid || saving) && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!form.isValid || saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>Guardar Cambios</Text>
          )}
        </Pressable>

        <Pressable style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </Pressable>
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
    padding: 20,
    paddingBottom: 40,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 16,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfCol: {
    flex: 1,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 6,
  },
  chipSelected: {
    backgroundColor: '#2563EB',
  },
  chipText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  actions: {
    marginTop: 24,
    gap: 10,
  },
  submitButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#93C5FD',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#64748B',
    fontSize: 15,
    fontWeight: '600',
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
});
