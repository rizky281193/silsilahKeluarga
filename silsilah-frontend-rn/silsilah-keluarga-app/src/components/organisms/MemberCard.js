import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '../atoms/AppText';
import { colors, radius, spacing } from '../../theme/tokens';

export default function MemberCard({ member }) {
  // Gabungkan semua nama pasangan jika ada
  const spouseNames = member.spouses && member.spouses.length > 0
    ? member.spouses.map(s => s.name).join(', ')
    : null;

  return (
    <View style={[styles.card, member.gender === 'F' ? styles.borderFemale : styles.borderMale]}>
      <View style={styles.headerRow}>
        {/* Nama Anggota Inti */}
        <AppText variant="bodyStrong" style={styles.mainName}>
          {member.name}
        </AppText>
        
        {/* Badge Status Hidup/Wafat */}
        <View style={[styles.badge, member.is_alive ? styles.badgeAlive : styles.badgeDead]}>
          <AppText variant="caption" style={styles.badgeText}>
            {member.is_alive ? '🟢 Hidup' : '⚫ Wafat'}
          </AppText>
        </View>
      </View>

      {/* RENDER PASANGAN (Mendukung Poligami) */}
      {spouseNames && (
        <View style={styles.spouseContainer}>
          <AppText variant="body" style={styles.spouseText}>
            ❤️ Pasangan: <AppText variant="bodyStrong" style={styles.spouseNamesText}>{spouseNames}</AppText>
          </AppText>
        </View>
      )}

      {/* Deskripsi / Biografi Pendek */}
      {member.biografi && (
        <AppText variant="subtitle" style={styles.biografi}>
          {member.biografi}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderLeftWidth: 5,
    marginVertical: spacing.xs,
    marginHorizontal: spacing.sm,
    // Efek bayangan halus (Shadow)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  borderMale: { borderLeftColor: '#007aff' },
  borderFemale: { borderLeftColor: '#ff2d55' },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'between',
    alignItems: 'center',
    width: '100%',
  },
  mainName: {
    fontSize: 16,
    flex: 1,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  badgeAlive: { backgroundColor: '#e5fbe5' },
  badgeDead: { backgroundColor: '#ffe5e5' },
  badgeText: { fontSize: 11 },
  spouseContainer: {
    marginTop: spacing.xs,
    backgroundColor: '#fafafa',
    padding: spacing.xs,
    borderRadius: radius.xs,
  },
  spouseText: {
    fontSize: 13,
    color: '#48484a',
  },
  spouseNamesText: {
    color: '#1c1c1e',
  },
  biografi: {
    fontSize: 12,
    color: '#8e8e93',
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
});