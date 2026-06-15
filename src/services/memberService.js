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
        father_id,
        mother_id,
        spouse_id,
        father:father_id(id, name),
        mother:mother_id(id, name),
        spouse:spouse_id(id, name)
      `);

  if (error) {
    throw error;
  }

  // SILAKAN LIHAT TERMINAL VS CODE ANDA UNTUK CARA MELIHAT LOG:
  // console.log('--- DATA ASLI DARI SUPABASE ---');
  // console.log(JSON.stringify(data, null, 2));

  return data ?? [];
}

export async function insertMember(memberData) {
  const { data, error } = await supabase
    .from('members') // <-- Pastikan nama tabel di Supabase Anda adalah 'members'
    .insert([memberData])
    .select();

  if (error) throw error;
  return data;
}