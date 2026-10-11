import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface FieldProps {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}

// Componente simple para envolver cada campo de un formulario.
// En React Web usábamos <label> y <div className="field">.
// En React Native no hay HTML, así que usamos <View> (como un div) y <Text> (para el texto).
export function Field({ label, error, hint, children }: FieldProps) {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      {children}
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 6,
  },
  hint: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  error: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
    fontWeight: '500',
  },
});
