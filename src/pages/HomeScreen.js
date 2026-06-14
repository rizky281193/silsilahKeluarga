import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import AppText from '../components/atoms/AppText';
import { getMembers } from '../services/memberService.js';
import { spacing, radius, colors } from '../theme/tokens';
import { Users, Heart, Award, Sparkles } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [stats, setStats] = useState({ total: 0, alive: 0, dead: 0 });

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getMembers();
        const total = data.length;
        const alive = data.filter(m => m.is_alive).length;
        const dead = total - alive;
        setStats({ total, alive, dead });
      } catch (error) {
        console.log('Gagal memuat statistik:', error);
      }
    }
    loadStats();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* HERO SECTION / HEADER */}
        <View style={styles.heroSection}>
          <View style={styles.iconBadge}>
            <Sparkles color={colors.primary} size={22} fill={colors.primary} />
          </View>
          <AppText variant="bodyStrong" style={styles.mainTitle}>Bani Moenandar</AppText>
          <AppText variant="body" style={styles.subTitle}>
            Ruang Silaturahmi & Penjaga Sejarah Keluarga Besar
          </AppText>
        </View>

        {/* QUOTE CARD */}
        <View style={styles.quoteCard}>
          <AppText variant="body" style={styles.quoteText}>
            "Silsilah bukan sekadar deretan nama, melainkan jembatan silaturahmi yang menghubungkan doa dari leluhur hingga ke anak cucu cicit."
          </AppText>
          <View style={styles.quoteFooter}>
            <View style={styles.lineDivider} />
          </View>
        </View>

        {/* SECTION TITLE */}
        <AppText variant="bodyStrong" style={styles.sectionTitle}>Ringkasan Data Keluarga</AppText>
        
        {/* DASBOR STATISTIK KEKINIAN */}
        <View style={styles.statsContainer}>
          {/* TOTAL ANGGOTA */}
          <View style={[styles.statsCard, { backgroundColor: colors.primary }]}>
            <View style={[styles.miniIconWrapper, { backgroundColor: 'rgba(255,255,255,0.25)' }]}>
              <Users color={colors.surface} size={18} />
            </View>
            <AppText variant="body" style={[styles.statsLabel, { color: '#e6f7ff' }]}>Anggota</AppText>
            <AppText variant="bodyStrong" style={[styles.statsNumber, { color: colors.surface }]}>{stats.total}</AppText>
          </View>

          {/* ALIVE */}
          <View style={[styles.statsCard, { backgroundColor: '#b7eb8f' }]}>
            <View style={[styles.miniIconWrapper, { backgroundColor: 'rgba(255,255,255,0.3)' }]}>
              <Heart color={colors.aliveText} size={18} fill={colors.aliveText} />
            </View>
            <AppText variant="body" style={[styles.statsLabel, { color: colors.aliveText, opacity: 0.8 }]}>Hidup</AppText>
            <AppText variant="bodyStrong" style={[styles.statsNumber, { color: colors.aliveText }]}>{stats.alive}</AppText>
          </View>

          {/* DEAD */}
          <View style={[styles.statsCard, { backgroundColor: '#ffa39e' }]}>
            <View style={[styles.miniIconWrapper, { backgroundColor: 'rgba(255,255,255,0.3)' }]}>
              <Award color="#5c0011" size={18} />
            </View>
            <AppText variant="body" style={[styles.statsLabel, { color: '#5c0011', opacity: 0.8 }]}>Wafat</AppText>
            <AppText variant="bodyStrong" style={[styles.statsNumber, { color: '#5c0011' }]}>{stats.dead}</AppText>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  heroSection: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  iconBadge: {
    backgroundColor: colors.primaryLight,
    padding: spacing.sm,
    borderRadius: 50,
    marginBottom: spacing.sm,
  },
  mainTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: colors.primaryDeep,
    letterSpacing: -0.8,
  },
  subTitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: spacing.xs,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
    lineHeight: 22,
    fontWeight: '500',
  },
  quoteCard: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.xl,
    marginBottom: spacing.xl,
    shadowColor: colors.primaryDeep,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 4,
  },
  quoteText: {
    fontStyle: 'italic',
    color: colors.textMain,
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 14,
    fontWeight: '500',
  },
  quoteFooter: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  lineDivider: {
    width: 35,
    height: 4,
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#001d66',
    marginBottom: spacing.md,
    letterSpacing: -0.2,
    textTransform: 'uppercase',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  statsCard: {
    width: (width - 48) / 3 - 3,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: 22,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  miniIconWrapper: {
    padding: spacing.xs,
    borderRadius: 12,
    marginBottom: spacing.xs,
  },
  statsLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  statsNumber: {
    fontSize: 28,
    fontWeight: '900',
    marginTop: 2,
    letterSpacing: -0.5,
  },
});