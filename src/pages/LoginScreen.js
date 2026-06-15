import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { supabase } from '../config/supabase'; // <-- Pastikan path/alamat file supabase Anda sudah benar
import { LogIn, Mail, Lock } from 'lucide-react-native';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Eror', 'Email dan password wajib diisi ya, Bos!');
      return;
    }

    setLoading(true);
    try {
      // 1. Jalankan pemeriksaan email & password ke Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (authError) throw authError;

      // 2. Jika password benar, cek apakah email ini terdaftar sebagai ADMIN di tabel 'user_roles'
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('email', email.trim().toLowerCase())
        .single();

      if (roleError || !roleData || roleData.role !== 'ADMIN') {
        // Jika password benar tapi ternyata BUKAN admin, paksa logout demi keamanan
        await supabase.auth.signOut();
        Alert.alert('Akses Ditolak', 'Maaf, Bos! Email Anda tidak terdaftar sebagai Admin Silsilah.');
        setLoading(false);
        return;
      }

      // 3. Sukses Login sebagai Admin!
      Alert.alert('Sukses', 'Selamat Datang, Admin Bani Moenandar! 🦅');
      
      // Kembali ke halaman Beranda setelah sukses login
      navigation.navigate('MainTabs');

    } catch (error) {
      Alert.alert('Gagal Login', error.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Header Atas */}
        <View style={styles.iconHeader}>
          <View style={styles.iconCircle}>
            <LogIn color="#2f54eb" size={32} />
          </View>
          <Text style={styles.title}>Dinding Admin</Text>
          <Text style={styles.subtitle}>Khusus Pengelola Data Silsilah Bani Moenandar</Text>
        </View>

        {/* Kartu Form Input */}
        <View style={styles.formCard}>
          
          {/* Input Email */}
          <Text style={styles.label}>Email Admin</Text>
          <View style={styles.inputContainer}>
            <Mail color="#a2a2a7" size={20} style={styles.inputIcon} />
            <TextInput 
              style={styles.input}
              placeholder="Masukkan email resmi admin..."
              placeholderTextColor="#a2a2a7"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Input Password */}
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputContainer}>
            <Lock color="#a2a2a7" size={20} style={styles.inputIcon} />
            <TextInput 
              style={styles.input}
              placeholder="Masukkan password rahasia..."
              placeholderTextColor="#a2a2a7"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Tombol Login */}
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Masuk Sistem Admin</Text>
            )}
          </TouchableOpacity>

          {/* Tombol Kembali */}
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.navigate('MainTabs')}
            disabled={loading}
          >
            <Text style={styles.backButtonText}>Kembali Lihat Silsilah</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f5ff', // Warna es biru muda pastel sejuk
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  iconHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#002c8c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#001d66',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: '#595959',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    elevation: 8,
    shadowColor: '#002c8c',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#002c8c',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 48,
    color: '#1f1f1f',
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#2f54eb', // Warna Royal Blue Premium Anda
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
    shadowColor: '#2f54eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  buttonDisabled: {
    backgroundColor: '#adc6ff',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  backButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#595959',
    fontSize: 13,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});