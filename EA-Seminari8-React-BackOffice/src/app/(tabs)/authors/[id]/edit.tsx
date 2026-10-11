import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Switch,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useToast } from '../../../../context/ToastContext';
import { useForm } from '../../../../hooks/useForm';
import type { Author, AuthorRole, UpdateAuthor } from '../../../../models';
import { authorService } from '../../../../services/author.service';
import { errorMessage, isAbort } from '../../../../utils/api-error';
import { removeEmpty } from '../../../../utils/remove-empty';
import { Field } from '../../../../components/Field';

type AuthorFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  birthDate: string;
  nationality: string;
  website: string;
  active: boolean;
  role: AuthorRole;
};

const INITIAL_VALUES: AuthorFormValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  birthDate: '',
  nationality: '',
  website: '',
  active: true,
  role: 'author',
};

function validate(values: AuthorFormValues) {
  const errors: Partial<Record<keyof AuthorFormValues, string>> = {};

  if (!values.name.trim()) errors.name = 'El nombre es obligatorio';
  if (!values.email.trim()) {
    errors.email = 'El email es obligatorio';
  } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
    errors.email = 'Email no válido';
  }

  if (!values.password) {
    errors.password = 'La contraseña es obligatoria para actualizar';
  } else if (values.password.length < 8) {
    errors.password = 'Mínimo 8 caracteres';
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Repite la contraseña';
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Las contraseñas no coinciden';
  }

  if (values.website && !/^https?:\/\/\S+$/.test(values.website)) {
    errors.website = 'Debe empezar por http:// o https://';
  }

  return errors;
}

export default function EditAuthorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { showToast } = useToast();

  const form = useForm<AuthorFormValues>(INITIAL_VALUES, validate);
  const { fill } = form;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();
    authorService
      .getAuthor(id, controller.signal)
      .then((author: Author) => {
        fill({
          name: author.name,
          email: author.email,
          birthDate: author.birthDate?.slice(0, 10) ?? '',
          nationality: author.nationality ?? '',
          website: author.website ?? '',
          active: author.active ?? true,
          role: author.role ?? 'author',
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

  const handleSubmit = async () => {
    if (!id) return;
    form.touchAll();
    if (!form.isValid) {
      showToast('Por favor, revisa los campos requeridos');
      return;
    }

    const { confirmPassword: _cp, ...formData } = form.values;
    const payload = removeEmpty(formData) as UpdateAuthor;

    setSaving(true);
    setError('');

    try {
      await authorService.updateAuthor(id, payload);
      showToast('Autor actualizado correctamente');
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
        <Text style={styles.loadingText}>Cargando datos del autor...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.screenTitle}>Editar Autor</Text>

      {error ? (
        <View style={styles.errorBanner}>
          <Ionicons name="alert-circle" size={18} color="#EF4444" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <Field label="Nombre *" error={form.errorOf('name')}>
        <TextInput
          style={[styles.input, form.errorOf('name') && styles.inputError]}
          value={form.values.name}
          onChangeText={form.handleChangeText('name')}
          onBlur={form.handleBlur('name')}
        />
      </Field>

      <Field label="Correo Electrónico *" error={form.errorOf('email')}>
        <TextInput
          style={[styles.input, form.errorOf('email') && styles.inputError]}
          value={form.values.email}
          onChangeText={form.handleChangeText('email')}
          onBlur={form.handleBlur('email')}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </Field>

      <Field
        label="Contraseña *"
        error={form.errorOf('password')}
        hint="La API requiere reenviar la contraseña al editar el autor."
      >
        <TextInput
          style={[styles.input, form.errorOf('password') && styles.inputError]}
          value={form.values.password}
          onChangeText={form.handleChangeText('password')}
          onBlur={form.handleBlur('password')}
          placeholder="Escribe la contraseña..."
          secureTextEntry
        />
      </Field>

      <Field label="Confirmar Contraseña *" error={form.errorOf('confirmPassword')}>
        <TextInput
          style={[styles.input, form.errorOf('confirmPassword') && styles.inputError]}
          value={form.values.confirmPassword}
          onChangeText={form.handleChangeText('confirmPassword')}
          onBlur={form.handleBlur('confirmPassword')}
          placeholder="Repite la contraseña..."
          secureTextEntry
        />
      </Field>

      <Field label="Nacionalidad">
        <TextInput
          style={styles.input}
          value={form.values.nationality}
          onChangeText={form.handleChangeText('nationality')}
        />
      </Field>

      <Field label="Fecha de Nacimiento (AAAA-MM-DD)">
        <TextInput
          style={styles.input}
          value={form.values.birthDate}
          onChangeText={form.handleChangeText('birthDate')}
        />
      </Field>

      <Field label="Sitio Web" error={form.errorOf('website')}>
        <TextInput
          style={[styles.input, form.errorOf('website') && styles.inputError]}
          value={form.values.website}
          onChangeText={form.handleChangeText('website')}
          onBlur={form.handleBlur('website')}
          keyboardType="url"
          autoCapitalize="none"
        />
      </Field>

      <Field label="Rol en el sistema">
        <View style={styles.rolesRow}>
          <Pressable
            style={[styles.roleChip, form.values.role === 'author' && styles.roleChipActive]}
            onPress={() => form.setFieldValue('role', 'author')}
          >
            <Text
              style={[styles.roleChipText, form.values.role === 'author' && styles.roleChipTextActive]}
            >
              Autor
            </Text>
          </Pressable>
          <Pressable
            style={[styles.roleChip, form.values.role === 'admin' && styles.roleChipActive]}
            onPress={() => form.setFieldValue('role', 'admin')}
          >
            <Text
              style={[styles.roleChipText, form.values.role === 'admin' && styles.roleChipTextActive]}
            >
              Administrador
            </Text>
          </Pressable>
        </View>
      </Field>

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Estado Activo</Text>
        <Switch
          value={form.values.active}
          onValueChange={(val) => form.setFieldValue('active', val)}
          trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
          thumbColor={form.values.active ? '#2563EB' : '#94A3B8'}
        />
      </View>

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
  rolesRow: {
    flexDirection: 'row',
    gap: 10,
  },
  roleChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  roleChipActive: {
    backgroundColor: '#2563EB',
  },
  roleChipText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '600',
  },
  roleChipTextActive: {
    color: '#FFFFFF',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
  actions: {
    marginTop: 20,
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
