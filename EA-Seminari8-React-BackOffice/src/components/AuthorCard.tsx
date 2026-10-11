import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Author } from '../models';
import { formatDate, initials } from '../utils/format';
import { RoleBadge } from './RoleBadge';

interface AuthorCardProps {
  author: Author;
  viewMode: 'list' | 'cards';
  onEdit: (author: Author) => void;
  onDelete: (author: Author) => void;
  onPress?: () => void;
}

export function AuthorCard({ author, viewMode, onEdit, onDelete, onPress }: AuthorCardProps) {
  const isCard = viewMode === 'cards';

  if (!isCard) {
    // Modo Fila / Lista compacta
    return (
      <Pressable style={styles.listRow} onPress={onPress}>
        <View style={styles.avatarMini}>
          <Text style={styles.avatarMiniText}>{initials(author.name)}</Text>
        </View>
        <View style={styles.listContent}>
          <Text style={styles.listTitle}>{author.name}</Text>
          <Text style={styles.listSubtitle}>{author.email}</Text>
          <View style={styles.metaRow}>
            <RoleBadge role={author.role} />
            {author.nationality ? (
              <Text style={styles.metaText}>{author.nationality}</Text>
            ) : null}
          </View>
        </View>
        <View style={styles.listActions}>
          <Pressable
            style={({ pressed }) => [styles.actionButton, styles.editButton, pressed && styles.pressed]}
            onPress={() => onEdit(author)}
          >
            <Ionicons name="create-outline" size={18} color="#2563EB" />
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.actionButton, styles.deleteButton, pressed && styles.pressed]}
            onPress={() => onDelete(author)}
          >
            <Ionicons name="trash-outline" size={18} color="#EF4444" />
          </Pressable>
        </View>
      </Pressable>
    );
  }

  // Modo Tarjeta destacada
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarLargeText}>{initials(author.name)}</Text>
        </View>
        <View style={styles.cardHeaderText}>
          <Text style={styles.cardTitle}>{author.name}</Text>
          <Text style={styles.cardEmail}>{author.email}</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.badgeRow}>
          <RoleBadge role={author.role} />
          <View style={[styles.activeIndicator, author.active ? styles.activeYes : styles.activeNo]}>
            <Text style={styles.activeText}>{author.active ? 'Activo' : 'Inactivo'}</Text>
          </View>
        </View>

        {author.nationality ? (
          <View style={styles.detailRow}>
            <Ionicons name="flag-outline" size={14} color="#64748B" />
            <Text style={styles.detailText}>{author.nationality}</Text>
          </View>
        ) : null}

        {author.birthDate ? (
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={14} color="#64748B" />
            <Text style={styles.detailText}>Nacimiento: {formatDate(author.birthDate)}</Text>
          </View>
        ) : null}

        {author.website ? (
          <View style={styles.detailRow}>
            <Ionicons name="globe-outline" size={14} color="#64748B" />
            <Text style={styles.detailText}>{author.website}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.cardFooter}>
        <Pressable
          style={({ pressed }) => [styles.footerButton, styles.footerEdit, pressed && styles.pressed]}
          onPress={() => onEdit(author)}
        >
          <Ionicons name="create-outline" size={16} color="#2563EB" />
          <Text style={styles.footerEditText}>Editar</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.footerButton, styles.footerDelete, pressed && styles.pressed]}
          onPress={() => onDelete(author)}
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
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  avatarMini: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarMiniText: {
    color: '#4F46E5',
    fontWeight: '700',
    fontSize: 16,
  },
  listContent: {
    flex: 1,
  },
  listTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  listSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginVertical: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  metaText: {
    fontSize: 12,
    color: '#64748B',
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
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarLarge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarLargeText: {
    color: '#4F46E5',
    fontWeight: '700',
    fontSize: 18,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  cardEmail: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  cardBody: {
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
    gap: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  activeIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  activeYes: {
    backgroundColor: '#DCFCE7',
  },
  activeNo: {
    backgroundColor: '#F1F5F9',
  },
  activeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#166534',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: '#475569',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 12,
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
