import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Dimensions, TouchableOpacity, Alert, TextInput } from 'react-native';
import AppText from '../components/atoms/AppText';
import { getMembers } from '../services/memberService.js';
import { spacing, radius, colors } from '../theme/tokens';
import { Users, Heart, Award, Sparkles, ShieldCheck, LogOut, ShieldAlert, Edit2, Check, X } from 'lucide-react-native'; // <-- Tambah ikon Edit, Check, X
import { supabase } from '../config/supabase';
import { useIsFocused } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const isFocused = useIsFocused();
  const [stats, setStats] = useState({ total: 0, alive: 0, dead: 0 });
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState(''); // <-- Simpan email admin yang login

  // State untuk manajemen Quote Dinamis
  const [quote, setQuote] = useState('"Silsilah bukan sekadar deretan nama, melainkan jembatan silaturahmi..."');
  const [isEditingQuote, setIsEditingQuote] = useState(false);
  const [inputQuote, setInputQuote] = useState('');
  const [loadingQuote, setLoadingQuote] = useState(false);

  const loadStats = async () => {
    try {
      const data = await getMembers();
      const total = data.length;
      const alive = data.filter(m => m.is_alive).length;
      const dead = total - alive;
      setStats({ total, alive, dead });
    } catch (error) {
      console.log('Gagal memuat statistik:', error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      loadStats(); // Pemicu otomatis ambil data terbaru ke cloud setiap kali Beranda di-klik
    }
  }, [isFocused]);

  useEffect(() => {
    // Sisa logic pengecekan sesi admin Anda yang lama tetap biarkan di sini
    async function checkAdminSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data } = await supabase
          .from('user_roles')
          .select('role')
          .eq('email', session.user.email.toLowerCase())
          .single();
        
        if (data?.role === 'ADMIN') {
          setIsAdmin(true);
        }
      }
    }

    checkAdminSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data } = await supabase.from('user_roles').select('role').eq('email', session.user.email.toLowerCase()).single();
        setIsAdmin(data?.role === 'ADMIN');
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fungsi menyimpan perubahan quote ke Supabase Cloud
  const handleSaveQuote = async () => {
    if (!inputQuote.trim()) {
      Alert.alert('Eror', 'Teks quote tidak boleh kosong ya, Bos!');
      return;
    }

    setLoadingQuote(true);
    try {
      const { error } = await supabase
        .from('app_settings')
        .update({ value: inputQuote.trim() })
        .eq('id', 'home_quote');

      if (error) throw error;

      setQuote(inputQuote.trim());
      setIsEditingQuote(false);
      Alert.alert('Sukses', 'Quote silsilah berhasil diperbarui di cloud! ✨');
    } catch (error) {
      Alert.alert('Gagal Mengubah', error.message);
    } finally {
      setLoadingQuote(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Keluar', 'Apakah Anda ingin keluar dari sistem Admin Silsilah, Bos?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Ya, Keluar',
        onPress: async () => {
          await supabase.auth.signOut();
          setIsAdmin(false);
          setIsEditingQuote(false);
          Alert.alert('Sukses', 'Anda telah kembali menjadi pengunjung biasa.');
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, isAdmin && { backgroundColor: '#f0f5ff' }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* HERO SECTION / HEADER */}
        <View style={[styles.heroSection, isAdmin && styles.heroSectionAdmin]}>

          <View style={styles.headerTopRow}>
            <View style={{ width: 36 }} />

            <View style={[styles.iconBadge, isAdmin && { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
              <Sparkles color={isAdmin ? '#ffd666' : colors.primary} size={22} fill={isAdmin ? '#ffd666' : colors.primary} />
            </View>

            {isAdmin ? (
              <TouchableOpacity
                style={[styles.adminSecretButton, { backgroundColor: 'rgba(255, 77, 79, 0.2)' }]}
                onPress={handleLogout}
                activeOpacity={0.6}
              >
                <LogOut color="#ff4d4f" size={18} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.adminSecretButton}
                onPress={() => navigation.navigate('Login')}
                activeOpacity={0.6}
              >
                <ShieldCheck color={colors.primary} size={18} style={styles.adminIconOpacity} />
              </TouchableOpacity>
            )}
          </View>

          <AppText variant="bodyStrong" style={[styles.mainTitle, isAdmin && { color: '#ffffff' }]}>
            {isAdmin ? 'Dashboard Pengelola' : 'Bani Moenandar'}
          </AppText>
          <AppText variant="body" style={[styles.subTitle, isAdmin && { color: '#adc6ff' }]}>
            {isAdmin ? 'Sistem Manajemen Data Silsilah Keluarga' : 'Ruang Silaturahmi & Penjaga Sejarah Keluarga Besar'}
          </AppText>

          {/* Indikator Lencana Admin + Detail Siapa yang Login */}
          {isAdmin && (
            <View style={{ alignItems: 'center', marginTop: 14 }}>
              <View style={styles.adminBadgeKapsul}>
                <ShieldAlert color="#ffd666" size={14} style={{ marginRight: 6 }} />
                <AppText variant="body" style={styles.adminBadgeText}>Super Admin Aktif</AppText>
              </View>
              {/* Teks penunjuk email user login */}
              <AppText variant="body" style={styles.adminEmailSub}>
                ID: {adminEmail}
              </AppText>
            </View>
          )}
        </View>

        {/* DYNAMIC QUOTE CARD (BISA DIEDIT) */}
        <View style={styles.quoteCard}>
          {isEditingQuote ? (
            // Form Editor Teks saat Tombol Edit Ditekan
            <View>
              <TextInput
                style={styles.quoteInputBox}
                value={inputQuote}
                onChangeText={setInputQuote}
                multiline
                maxLength={200}
                placeholder="Tulis quote silsilah baru di sini..."
              />
              <View style={styles.editActionRow}>
                <TouchableOpacity
                  style={[styles.miniActionBtn, { backgroundColor: '#ff4d4f' }]}
                  onPress={() => { setIsEditingQuote(false); setInputQuote(quote); }}
                  disabled={loadingQuote}
                >
                  <X color="#ffffff" size={16} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.miniActionBtn, { backgroundColor: '#52c41a' }]}
                  onPress={handleSaveQuote}
                  disabled={loadingQuote}
                >
                  <Check color="#ffffff" size={16} />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            // Tampilan Standar Teks Quote
            // PERBAIKAN: Kita berikan padding kanan (pr: 30) agar teks tidak menubruk tombol pensil
            <View style={{ width: '100%', paddingRight: isAdmin ? 25 : 0 }}>
              {isAdmin && (
                // PERBAIKAN: Mengubah tombol menjadi benar-benar di atas lapisan dengan zIndex
                <TouchableOpacity
                  style={styles.quoteEditFloatingButton}
                  onPress={() => {
                    setInputQuote(quote); // Pastikan input terisi teks saat ini
                    setIsEditingQuote(true); // Pemicu buka editor
                  }}
                  activeOpacity={0.5}
                >
                  <Edit2 color={colors.primary} size={14} />
                </TouchableOpacity>
              )}
              <AppText variant="body" style={styles.quoteText}>
                {quote}
              </AppText>
            </View>
          )}
          <View style={styles.quoteFooter}>
            <View style={styles.lineDivider} />
          </View>
        </View>

        {/* SECTION TITLE */}
        <AppText variant="bodyStrong" style={styles.sectionTitle}>Ringkasan Data Keluarga</AppText>

        {/* DASBOR STATISTIK */}
        <View style={styles.statsContainer}>
          <View style={[styles.statsCard, { backgroundColor: colors.primary }]}>
            <View style={[styles.miniIconWrapper, { backgroundColor: 'rgba(255,255,255,0.25)' }]}>
              <Users color={colors.surface} size={18} />
            </View>
            <AppText variant="body" style={[styles.statsLabel, { color: '#e6f7ff' }]}>Anggota</AppText>
            <AppText variant="bodyStrong" style={[styles.statsNumber, { color: colors.surface }]}>{stats.total}</AppText>
          </View>

          <View style={[styles.statsCard, { backgroundColor: '#b7eb8f' }]}>
            <View style={[styles.miniIconWrapper, { backgroundColor: 'rgba(255,255,255,0.3)' }]}>
              <Heart color={colors.aliveText} size={18} fill={colors.aliveText} />
            </View>
            <AppText variant="body" style={[styles.statsLabel, { color: colors.aliveText, opacity: 0.8 }]}>Hidup</AppText>
            <AppText variant="bodyStrong" style={[styles.statsNumber, { color: colors.aliveText }]}>{stats.alive}</AppText>
          </View>

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
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  heroSection: { alignItems: 'center', marginTop: spacing.sm, marginBottom: spacing.lg, width: '100%' },
  heroSectionAdmin: {
    backgroundColor: colors.primaryDeep,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: radius.xl,
    marginTop: spacing.md,
    elevation: 4,
    shadowColor: colors.primaryDeep,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingHorizontal: spacing.sm, marginBottom: spacing.xs },
  iconBadge: { backgroundColor: colors.primaryLight, padding: spacing.sm, borderRadius: 50, marginBottom: spacing.sm },
  adminSecretButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primaryLight, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.sm },
  adminIconOpacity: { opacity: 0.65 },
  mainTitle: { fontSize: 34, fontWeight: '900', color: colors.primaryDeep, letterSpacing: -0.8, textAlign: 'center' },
  subTitle: { fontSize: 14, color: colors.textMuted, marginTop: spacing.xs, textAlign: 'center', paddingHorizontal: spacing.md, lineHeight: 22, fontWeight: '500' },
  adminBadgeKapsul: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)'
  },
  adminBadgeText: { color: '#ffd666', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  adminEmailSub: { color: '#ffffff', fontSize: 11, marginTop: 6, opacity: 0.6, fontWeight: '600' }, // Style teks email login
  quoteCard: { backgroundColor: colors.surface, padding: spacing.lg, borderRadius: radius.xl, marginBottom: spacing.xl, shadowColor: colors.primaryDeep, shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.06, shadowRadius: 20, elevation: 4, position: 'relative' },
  quoteText: { fontStyle: 'italic', color: colors.textMain, textAlign: 'center', lineHeight: 24, fontSize: 14, fontWeight: '500', paddingHorizontal: 10 },
  quoteFooter: { alignItems: 'center', marginTop: spacing.md },
  lineDivider: { width: 35, height: 4, backgroundColor: colors.primary, borderRadius: 10 },

  quoteEditFloatingButton: {
    position: 'absolute',
    right: -10, // Digeser sedikit ke kanan agar pas di pojok kartu
    top: -10,   // Digeser sedikit ke atas
    padding: 12, // Diperluas padding-nya agar mudah ditekan oleh jempol
    backgroundColor: '#f0f5ff',
    borderRadius: 50,
    zIndex: 99, // <--- KUNCI UTAMA: Memaksa tombol berada di lapisan paling atas layar agar bisa diklik
    elevation: 2, // Tambah sedikit bayangan di Android
  },
  quoteInputBox: { borderWidth: 1, borderColor: '#d9d9d9', borderRadius: 12, padding: 12, fontSize: 14, color: '#1f1f1f', textAlign: 'center', minHeight: 60, backgroundColor: '#fafafa', fontStyle: 'italic' },
  editActionRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10, gap: 8 },
  miniActionBtn: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', elevation: 2 },

  sectionTitle: { fontSize: 14, fontWeight: '800', color: '#001d66', marginBottom: spacing.md, letterSpacing: -0.2, textTransform: 'uppercase' },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  statsCard: { width: (width - 48) / 3 - 3, paddingVertical: spacing.lg, paddingHorizontal: spacing.md, borderRadius: 22, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  miniIconWrapper: { padding: spacing.xs, borderRadius: 12, marginBottom: spacing.xs },
  statsLabel: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4 },
  statsNumber: { fontSize: 28, fontWeight: '900', marginTop: 2, letterSpacing: -0.5 },
});