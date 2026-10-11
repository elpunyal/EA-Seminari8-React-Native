import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Image,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useToast } from '../../../context/ToastContext';
import { useForm } from '../../../hooks/useForm';
import { usePermissions } from '../../../hooks/usePermissions';
import { useApiList } from '../../../hooks/useApiList';
import { BOOK_LANGUAGES, BOOK_TAGS, BookLanguage, CreateBook } from '../../../models';
import { authorService } from '../../../services/author.service';
import { bookService } from '../../../services/book.service';
import { errorMessage } from '../../../utils/api-error';
import { languageName } from '../../../utils/format';
import { removeEmpty } from '../../../utils/remove-empty';
import { Field } from '../../../components/Field';

// Tipos de valores para el formulario de libro
type BookFormValues = {
  title: string;
  isbn: string;
  publisher: string; // Campo añadido según el ejercicio
  authors: string[];
  description: string;
  publishedYear: string;
  pages: string;
  language: BookLanguage;
  tags: string[];
  price: string;
};

// Valores iniciales en blanco
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

// Validación sencilla en el cliente antes de enviar a la API
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

export default function NewBookScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  // Hook para pedir permisos de cámara y galería nativos
  const { takePhoto, pickImage } = usePermissions();

  // Cargamos los autores disponibles para poder asignarlos al libro
  const { items: authors, loading: loadingAuthors } = useApiList(authorService.getAuthors);

  const form = useForm<BookFormValues>(INITIAL_VALUES, validate);
  const [coverUri, setCoverUri] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Seleccionar o deseleccionar un autor
  const toggleAuthor = (authorId: string) => {
    const current = form.values.authors;
    if (current.includes(authorId)) {
      form.setFieldValue('authors', current.filter((id) => id !== authorId));
    } else {
      form.setFieldValue('authors', [...current, authorId]);
    }
  };

  // Seleccionar o deseleccionar una etiqueta (tag)
  const toggleTag = (tag: string) => {
    const current = form.values.tags;
    if (current.includes(tag)) {
      form.setFieldValue('tags', current.filter((t) => t !== tag));
    } else {
      form.setFieldValue('tags', [...current, tag]);
    }
  };

  // Hacer una foto con la cámara (pide permiso primero)
  const handleTakePhoto = async () => {
    const uri = await takePhoto();
    if (uri) setCoverUri(uri);
  };

  // Elegir foto de la galería (pide permiso primero)
  const handlePickImage = async () => {
    const uri = await pickImage();
    if (uri) setCoverUri(uri);
  };

  // Enviar el formulario a la API
  const handleSubmit = async () => {
    form.touchAll();
    if (!form.isValid) {
      showToast('Por favor, revisa los errores del formulario');
      return;
    }

    const { values } = form;
    // Quitamos los campos vacíos con removeEmpty para que la API (Joi) no dé error 422
    const payload = removeEmpty({
      ...values,
      publisher: values.publisher.trim() ? values.publisher.trim() : undefined,
      publishedYear: values.publishedYear === '' ? undefined : Number(values.publishedYear),
      pages: values.pages === '' ? undefined : Number(values.pages),
      price: values.price === '' ? undefined : Number(values.price),
    }) as CreateBook;

    setSaving(true);
    setError('');

    try {
      await bookService.createBook(payload);
      showToast('¡Libro creado con éxito!');
      router.back(); // Volvemos atrás a la lista
    } catch (err) {
      setError(errorMessage(err));
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.screenTitle}>Nuevo Libro</Text>
      <Text style={styles.screenSubtitle}>Rellena los campos para añadir un libro al catálogo</Text>

      {error ? (
        <View style={styles.errorBanner}>
          <Ionicons name="alert-circle" size={18} color="#EF4444" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {/* Sección para probar permisos de cámara y fotos del dispositivo */}
      <View style={styles.imageSection}>
        <Text style={styles.sectionLabel}>Foto de Portada (Permisos de Cámara/Galería)</Text>
        <View style={styles.imagePickerRow}>
          {coverUri ? (
            <Image source={{ uri: coverUri }} style={styles.previewImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <Ionicons name="image-outline" size={32} color="#94A3B8" />
              <Text style={styles.placeholderText}>Sin portada</Text>
            </View>
          )}
          <View style={styles.imageButtons}>
            <Pressable style={styles.pickerButton} onPress={handleTakePhoto}>
              <Ionicons name="camera-outline" size={16} color="#2563EB" />
              <Text style={styles.pickerButtonText}>Tomar Foto (Cámara)</Text>
            </Pressable>
            <Pressable style={styles.pickerButton} onPress={handlePickImage}>
              <Ionicons name="images-outline" size={16} color="#2563EB" />
              <Text style={styles.pickerButtonText}>Elegir de Galería</Text>
            </Pressable>
            {coverUri ? (
              <Pressable style={styles.removeImageButton} onPress={() => setCoverUri(null)}>
                <Text style={styles.removeImageText}>Quitar imagen</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </View>

      <Field label="Título *" error={form.errorOf('title')}>
        <TextInput
          style={[styles.input, form.errorOf('title') && styles.inputError]}
          value={form.values.title}
          onChangeText={form.handleChangeText('title')}
          onBlur={form.handleBlur('title')}
          placeholder="Ej. Don Quijote de la Mancha"
        />
      </Field>

      <Field label="ISBN *" error={form.errorOf('isbn')}>
        <TextInput
          style={[styles.input, form.errorOf('isbn') && styles.inputError]}
          value={form.values.isbn}
          onChangeText={form.handleChangeText('isbn')}
          onBlur={form.handleBlur('isbn')}
          placeholder="Ej. 978-84-376-0494-7"
          autoCapitalize="characters"
        />
      </Field>

      {/* Campo Editorial añadido por el Ejercicio */}
      <Field label="Editorial (Publisher)" error={form.errorOf('publisher')} hint="Nombre de la casa editorial">
        <TextInput
          style={styles.input}
          value={form.values.publisher}
          onChangeText={form.handleChangeText('publisher')}
          onBlur={form.handleBlur('publisher')}
          placeholder="Ej. Editorial Cátedra / Planeta"
        />
      </Field>

      <Field label="Autores *" error={form.errorOf('authors')} hint="Toca los autores para seleccionarlos">
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
          placeholder="Breve sinopsis o descripción del libro..."
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
              placeholder="1605"
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
              placeholder="450"
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
          placeholder="19.99"
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
            <Text style={styles.submitButtonText}>Guardar Libro</Text>
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
    marginBottom: 4,
  },
  screenSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 20,
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
  imageSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  imagePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  previewImage: {
    width: 60,
    height: 80,
    borderRadius: 6,
    backgroundColor: '#E2E8F0',
  },
  placeholderImage: {
    width: 60,
    height: 80,
    borderRadius: 6,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 9,
    color: '#94A3B8',
    marginTop: 2,
  },
  imageButtons: {
    flex: 1,
    gap: 6,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    gap: 6,
  },
  pickerButtonText: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '600',
  },
  removeImageButton: {
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  removeImageText: {
    fontSize: 11,
    color: '#EF4444',
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
});
