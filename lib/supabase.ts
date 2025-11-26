// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Usa ENV se existir, senão usa os valores reais como fallback
const supabaseUrl =
  (import.meta as any).env?.VITE_SUPABASE_URL ??
  'https://nyneuuvcdmtqjyaqrztz.supabase.co';

const supabaseAnonKey =
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY ??
  'sb_publishable_AvXDj4U1pRJP-8PxMxRpvQ_RIbDcA-W';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[APP] Supabase env vars missing', {
    supabaseUrl,
    hasKey: !!supabaseAnonKey,
  });
}

// Cria o client Supabase que o app inteiro vai usar
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
