import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from './AppText';
import { radius, spacing } from '../../theme/tokens';

export default function LiveBadge({ isAlive }) {
  return (
    <View style={[styles.badge, isAlive ? styles.badgeAlive : styles.badgeDead]}>
      <AppText 
        variant="bodyStrong" 
        style={[styles.badgeText, isAlive ? styles.textAlive : styles.textDead]}
      >
        {isAlive ? '🔥 Hidup' : '🪦 Wafat'}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: spacing.xs / 2,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.lg || 20, // Menggunakan token radius jika ada, atau fallback ke 20
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 12,
  },
  badgeAlive: {
    backgroundColor: '#e5fbe5', // Background hijau soft
  },
  textAlive: {
    color: '#34c759', // Teks hijau
  },
  badgeDead: {
    backgroundColor: '#ffe5e5', // Background merah soft
  },
  textDead: {
    color: '#ff3b30', // Teks merah
  },
});