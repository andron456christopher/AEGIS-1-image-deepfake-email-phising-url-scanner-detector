import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gxeawfpkwddpfxydruuc.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder_key_to_prevent_crash'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
