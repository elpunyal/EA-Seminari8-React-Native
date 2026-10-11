import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { AuthorRole } from '../models';

interface RoleBadgeProps {
  role?: AuthorRole;
}

export function RoleBadge({ role = 'author' }: RoleBadgeProps) {
  const isAdmin = role === 'admin';
  return (
    <View style={[styles.badge, isAdmin ? styles.adminBadge : styles.authorBadge]}>
      <Text style={[styles.text, isAdmin ? styles.adminText : styles.authorText]}>
        {isAdmin ? 'Administrador' : 'Autor'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  adminBadge: {
    backgroundColor: '#FEF3C7',
  },
  authorBadge: {
    backgroundColor: '#E0E7FF',
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
  },
  adminText: {
    color: '#B45309',
  },
  authorText: {
    color: '#4338CA',
  },
});
