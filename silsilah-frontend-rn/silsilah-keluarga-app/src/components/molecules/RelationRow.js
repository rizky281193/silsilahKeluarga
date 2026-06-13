import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '../atoms/AppText';
import { colors, spacing } from '../../theme/tokens';

export default function RelationRow({ icon, label, name }) {
  // Jika nama relasi tidak ada di database, baris ini disembunyikan otomatis
  if (!name) return null;

  return (
    <View style={styles.row}>
      <AppText variant="body" style={styles.labelText}>
        {icon} {label}: <AppText variant="bodyStrong" style={styles.nameText}>{name}</AppText>
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: spacing.xs,
    alignItems: 'center',
  },
  labelText: {
    color: colors.textSecondary,
  },
  nameText: {
    color: colors.textPrimary,
  },
});