import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '../atoms/AppText';
import LiveBadge from '../atoms/LiveBadge'; // Pastikan Anda sudah membuat LiveBadge di atoms
import RelationRow from '../molecules/RelationRow'; // Pastikan Anda sudah membuat RelationRow di molecules
import { colors, radius, spacing } from '../../theme/tokens';

export default function MemberCard({ member }) {
  // Menentukan warna border kiri berdasarkan jenis kelamin
  const genderBorderColor = member.gender === 'M' ? '#007aff' : '#ff2dbc';
  
  return (
    <View style={[styles.card, { borderLeftColor: genderBorderColor }]}>
      <View style={styles.headerCard}>
        <AppText variant="bodyStrong" style={styles.name}>{member.name}</AppText>
        <LiveBadge isAlive={member.is_alive} />
      </View>
      
      <AppText variant="subtitle" style={styles.gender}>
        Jenis Kelamin: {member.gender === 'M' ? 'Laki-laki' : 'Perempuan'}
      </AppText>

      {/* Menampilkan baris relasi jika datanya berhasil ditarik dari Supabase */}
      <RelationRow icon="❤️" label="Pasangan" name={member.spouse?.name} />
      <RelationRow icon="👨" label="Ayah" name={member.father?.name} />
      <RelationRow icon="👩" label="Ibu" name={member.mother?.name} />

      {member.biografi && (
        <View style={styles.biografiContainer}>
          <AppText variant="body" style={styles.biografiText}>
            📝 {member.biografi}
          </AppText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
    borderRadius: radius.sm,
    borderLeftWidth: 5, // Memberikan aksen garis vertikal di kiri kartu
  },
  headerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
  },
  gender: {
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  biografiContainer: {
    marginTop: spacing.sm,
    backgroundColor: '#f2f2f7',
    padding: spacing.sm,
    borderRadius: radius.sm,
  },
  biografiText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
});