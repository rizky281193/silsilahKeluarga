import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import AppText from '../atoms/AppText';
import { colors, radius, spacing } from '../../theme/tokens';

export default function MemberCard({ member, onPress }) {
  const spouseNames = member.spouses && member.spouses.length > 0
    ? member.spouses.map(s => s.name).join(', ')
    : null;

  return (
    // PERBAIKAN: Membungkus kartu dengan TouchableOpacity agar bisa diklik secara interaktif
    <TouchableOpacity 
      activeOpacity={0.7}
      onPress={() => onPress && onPress(member)}
      style={[styles.card, member.gender === 'F' ? styles.borderFemale : styles.borderMale]}
    >
      <View style={styles.headerRow}>
        <AppText variant="bodyStrong" style={styles.mainName}>
          {member.name}
        </AppText>
        
        <View style={[styles.badge, member.is_alive ? styles.badgeAlive : styles.badgeDead]}>
          <AppText variant="caption" style={[styles.badgeText, { color: member.is_alive ? colors.aliveText : colors.deadText }]}>
            {member.is_alive ? '🟢 Hidup' : '⚫ Wafat'}
          </AppText>
        </View>
      </View>

      {spouseNames && (
        <View style={styles.spouseContainer}>
          <AppText variant="body" style={styles.spouseText}>
            ❤️ Pasangan: <AppText variant="bodyStrong" style={styles.spouseNamesText}>{spouseNames}</AppText>
          </AppText>
        </View>
      )}

      {/* Catatan kecil indikator klip di pojok bawah kartu */}
      <View style={styles.footerRow}>
        <AppText variant="caption" style={styles.hintText}>ℹ️ Ketuk untuk detail biografi</AppText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderLeftWidth: 5,
    marginVertical: spacing.xs,
    marginHorizontal: spacing.sm,
    shadowColor: colors.primaryDeep,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  borderMale: { borderLeftColor: colors.male },
  borderFemale: { borderLeftColor: colors.female },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  mainName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textMain,
    flex: 1,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  badgeAlive: { backgroundColor: colors.aliveBg },
  badgeDead: { backgroundColor: colors.deadBg },
  badgeText: { fontSize: 10, fontWeight: '700' },
  spouseContainer: {
    marginTop: spacing.xs,
    backgroundColor: colors.background,
    padding: spacing.xs,
    borderRadius: radius.sm,
  },
  spouseText: {
    fontSize: 12,
    color: '#555555',
  },
  spouseNamesText: {
    color: colors.textMain,
  },
  footerRow: {
    marginTop: spacing.sm,
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
    paddingTop: 4,
  },
  hintText: {
    fontSize: 10,
    color: '#bcbcbf',
    fontStyle: 'italic',
  }
});