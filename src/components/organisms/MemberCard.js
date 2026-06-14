import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import AppText from '../atoms/AppText';
import { colors, radius, spacing } from '../../theme/tokens';

export default function MemberCard({ member, onPress, level = 0 }) {
  const spouseNames = member.spouses && member.spouses.length > 0
    ? member.spouses.map(s => s.name).join(', ')
    : null;

  const generationLabel = level === 0 ? "Leluhur" : `Generasi ${level}`;

  return (
    <TouchableOpacity 
      activeOpacity={0.7}
      onPress={() => onPress && onPress(member)}
      style={[styles.card, member.gender === 'F' ? styles.borderFemale : styles.borderMale]}
    >
      <View style={styles.headerRow}>
        <AppText variant="bodyStrong" style={styles.mainName}>
          {member.name}
        </AppText>
        
        {/* BADGE GENERASI */}
        <View style={styles.genBadge}>
          <AppText style={styles.genText}>{generationLabel}</AppText>
        </View>
      </View>

      {spouseNames && (
        <View style={styles.spouseContainer}>
          <AppText variant="body" style={styles.spouseText}>
            ❤️ Pasangan: <AppText variant="bodyStrong" style={styles.spouseNamesText}>{spouseNames}</AppText>
          </AppText>
        </View>
      )}

      {/* FOOTER ROW YANG SUDAH DISATUKAN (BADGE STATUS + INFO DETAIL) */}
      <View style={styles.footerRow}>
        <View style={[styles.badge, member.is_alive ? styles.badgeAlive : styles.badgeDead]}>
          <AppText variant="caption" style={[styles.badgeText, { color: member.is_alive ? colors.aliveText : colors.deadText }]}>
            {member.is_alive ? '🟢 Hidup' : '⚫ Wafat'}
          </AppText>
        </View>
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
  hintText: {
    fontSize: 10,
    color: '#bcbcbf',
    fontStyle: 'italic',
  },
  genBadge: {
    backgroundColor: '#f2f2f7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  genText: {
    fontSize: 10,
    color: '#8e8e93',
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
    paddingTop: 6,
  },
});