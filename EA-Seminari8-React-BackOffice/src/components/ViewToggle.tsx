import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type ViewMode = 'list' | 'cards';

interface ViewToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export function ViewToggle({ mode, onChange }: ViewToggleProps) {
  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.button, mode === 'list' && styles.activeButton]}
        onPress={() => onChange('list')}
      >
        <Ionicons
          name="list-outline"
          size={18}
          color={mode === 'list' ? '#3B82F6' : '#64748B'}
        />
        <Text style={[styles.text, mode === 'list' && styles.activeText]}>Lista</Text>
      </Pressable>

      <Pressable
        style={[styles.button, mode === 'cards' && styles.activeButton]}
        onPress={() => onChange('cards')}
      >
        <Ionicons
          name="grid-outline"
          size={18}
          color={mode === 'cards' ? '#3B82F6' : '#64748B'}
        />
        <Text style={[styles.text, mode === 'cards' && styles.activeText]}>Tarjetas</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 3,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  activeButton: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  text: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  activeText: {
    color: '#1E293B',
    fontWeight: '600',
  },
});
