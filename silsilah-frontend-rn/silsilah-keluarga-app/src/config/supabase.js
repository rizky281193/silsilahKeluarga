import { createClient } from '@supabase/supabase-js';

// Mengambil variabel lingkungan dari file .env
const rawSupabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

let supabaseConfigError = null;

if (!rawSupabaseUrl) {
	supabaseConfigError = 'EXPO_PUBLIC_SUPABASE_URL belum diisi pada file .env';
} else if (!supabaseAnonKey) {
	supabaseConfigError = 'EXPO_PUBLIC_SUPABASE_ANON_KEY belum diisi pada file .env';
}

let supabase = null;

if (!supabaseConfigError) {
	// Supabase JS membutuhkan base URL project (tanpa /rest/v1)
	const supabaseUrl = rawSupabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
	supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
	console.error('Supabase config error:', supabaseConfigError);
}

export { supabase, supabaseConfigError };