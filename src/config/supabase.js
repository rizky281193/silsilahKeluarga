import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js'; 

// Mengambil variabel URL dan KEY dari pengaturan cloud Expo / .env Anda
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Membuat koneksi resmi ke Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,    // <--- KUNCI UTAMA: Menyuruh Supabase menyimpan sesi login di memori HP
    autoRefreshToken: true,   // Otomatis memperbarui token login jika sudah kedaluwarsa
    persistSession: true,     // Menjaga sesi login tetap aktif meskipun aplikasi ditutup
    detectSessionInUrl: false,
  },
});