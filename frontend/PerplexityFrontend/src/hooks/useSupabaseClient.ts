import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { useMemo } from 'react';

function getSupabase(): SupabaseClient {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY');
  }
 return createClient(url, key);
}

export default function useSupabaseClient(): { supabase: SupabaseClient } {
  const supabase = useMemo(() => getSupabase(), []);
  return { supabase };
}
