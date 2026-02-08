import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Ensure URL is valid to prevent crash
const isValidUrl = (url: string) => {
  try {
    return !!new URL(url);
  } catch (e) {
    return false;
  }
};

const finalUrl = isValidUrl(supabaseUrl) ? supabaseUrl : 'https://placeholder.supabase.co';
const finalKey = supabaseAnonKey || 'placeholder-key';

if (!isValidUrl(supabaseUrl) || !supabaseAnonKey) {
  console.error(
    '%c[DOKY] Supabase não configurado!',
    'color: red; font-weight: bold',
    '\nConfigure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no ficheiro .env.local'
  );
}

export const supabase = createClient(finalUrl, finalKey);
