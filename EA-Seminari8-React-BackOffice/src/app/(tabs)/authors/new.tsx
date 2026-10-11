import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Switch,
  Image,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useToast } from '../../../context/ToastContext';
import { useForm } from '../../../hooks/useForm';
import { usePermissions } from '../../../hooks/usePermissions';
import type { AuthorRole, CreateAuthor } from '../../../models';
import { authorService } from '../../../services/author.service';
import { errorMessage } from '../../../utils/api-error';
import { removeEmpty } from '../../../utils/remove-empty';
import { Field } from '../../../components/Field';

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
    errors.password = 'La contraseña es obligatoria';
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

export default function NewAuthorScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const { takePhoto, pickImage } = usePermissions();

  const form = useForm<AuthorFormValues>(INITIAL_VALUES, validate);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleTakePhoto = async () => {
    const uri = await takePhoto();
    if (uri) setAvatarUri(uri);
  };

  const handlePickImage = async () => {
    const uri = await pickImage();
    if (uri) setAvatarUri(uri);
  };

  const handleSubmit = async () => {
    form.touchAll();
    if (!form.isValid) {
      showToast('Por favor, revisa los errores');
      return;
    }

    const { confirmPassword: _cp, ...formData } = form.values;
    const payload = removeEmpty(formData) as CreateAuthor;

    setSaving(true);
    setError('');

    try {
      await authorService.createAuthor(payload);
      showToast('¡Autor creado con éxito!');
      router.back();
    } catch (err) {
      setError(errorMessage(err));
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.screenTitle}>Nuevo Autor</Text>
      <Text style={styles.screenSubtitle}>Registra los datos del autor en la plataforma</Text>

      {error ? (
        <View style={styles.errorBanner}>
          <Ionicons name="alert-circle" size={18} color="#EF4444" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {/* Foto del autor con Permisos */}
      <View style={styles.avatarSection}>
        <Text style={styles.sectionLabel}>Foto de Perfil (Permisos Nativos)</Text>
        <View style={styles.avatarPickerRow}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatarPreview} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person-outline" size={32} color="#94A3B8" />
            </View>
          )}
          <View style={styles.imageButtons}>
            <Pressable style={styles.pickerButton} onPress={handleTakePhoto}>
              <Ionicons name="camera-outline" size={16} color="#2563EB" />
              <Text style={styles.pickerButtonText}>Tomar con Cámara</Text>
            </Pressable>
            <Pressable style={styles.pickerButton} onPress={handlePickImage}>
              <Ionicons name="images-outline" size={16} color="#2563EB" />
              <Text style={styles.pickerButtonText}>Galería de Fotos</Text>
            </Pressable>
            {avatarUri ? (
              <Pressable style={styles.removeImageButton} onPress={() => setAvatarUri(null)}>
                <Text style={styles.removeImageText}>Quitar foto</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </View>

      <Field label="Nombre *" error={form.errorOf('name')}>
        <TextInput
          style={[styles.input, form.errorOf('name') && styles.inputError]}
          value={form.values.name}
          onChangeText={form.handleChangeText('name')}
          onBlur={form.handleBlur('name')}
          placeholder="Nombre y apellidos"
        />
      </Field>

      <Field label="Correo Electrónico *" error={form.errorOf('email')}>
        <TextInput
          style={[styles.input, form.errorOf('email') && styles.inputError]}
          value={form.values.email}
          onChangeText={form.handleChangeText('email')}
          onBlur={form.handleBlur('email')}
          placeholder="autor@ejemplo.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </Field>

      <Field label="Contraseña *" error={form.errorOf('password')}>
        <TextInput
          style={[styles.input, form.errorOf('password') && styles.inputError]}
          value={form.values.password}
          onChangeText={form.handleChangeText('password')}
          onBlur={form.handleBlur('password')}
          placeholder="Mínimo 8 caracteres"
          secureTextEntry
        />
      </Field>

      <Field label="Confirmar Contraseña *" error={form.errorOf('confirmPassword')}>
        <TextInput
          style={[styles.input, form.errorOf('confirmPassword') && styles.inputError]}
          value={form.values.confirmPassword}
          onChangeText={form.handleChangeText('confirmPassword')}
          onBlur={form.handleBlur('confirmPassword')}
          placeholder="Repite la contraseña"
          secureTextEntry
        />
      </Field>

      <Field label="Nacionalidad">
        <TextInput
          style={styles.input}
          value={form.values.nationality}
          onChangeText={form.handleChangeText('nationality')}
          placeholder="Ej. Española, Colombiana..."
        />
      </Field>

      <Field label="Fecha de Nacimiento (AAAA-MM-DD)">
        <TextInput
          style={styles.input}
          value={form.values.birthDate}
          onChangeText={form.handleChangeText('birthDate')}
          placeholder="1970-05-15"
        />
      </Field>

      <Field label="Sitio Web" error={form.errorOf('website')}>
        <TextInput
          style={[styles.input, form.errorOf('website') && styles.inputError]}
          value={form.values.website}
          onChangeText={form.handleChangeText('website')}
          onBlur={form.handleBlur('website')}
          placeholder="https://..."
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
            <Text style={styles.submitButtonText}>Guardar Autor</Text>
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
  avatarSection: {
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
  avatarPickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarPreview: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E2E8F0',
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
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
});
