import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import MemberCard from './MemberCard';
import AppText from '../atoms/AppText';
import { colors, spacing } from '../../theme/tokens';

export default function MemberListSection({ members }) {
  return (
    <FlatList
      data={members}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <MemberCard member={item} />}
      ListEmptyComponent={
        <AppText style={styles.emptyText}>Belum ada data anggota keluarga.</AppText>
      }
      contentContainerStyle={members.length === 0 ? styles.emptyContainer : null}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    color: colors.textSecondary,
  },
});
