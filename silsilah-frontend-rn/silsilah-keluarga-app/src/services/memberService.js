import { supabase, supabaseConfigError } from '../config/supabase';

export async function getMembers() {
  if (supabaseConfigError) {
    throw new Error(supabaseConfigError);
  }

  if (!supabase) {
    throw new Error('Koneksi Supabase tidak tersedia. Cek file .env lalu restart Expo.');
  }

  const { data, error } = await supabase
    .from('members')
    .select(`
        id, 
        name, 
        gender,
        is_alive,
        biografi,
        father:father_id(name),
        mother:mother_id(name),
        spouse:spouse_id(name)
      `);

  if (error) {
    throw error;
  }

  // SILAKAN LIHAT TERMINAL VS CODE ANDA UNTUK CARA MELIHAT LOG:
  console.log('--- DATA ASLI DARI SUPABASE ---');
  console.log(JSON.stringify(data, null, 2));

  return data ?? [];
}