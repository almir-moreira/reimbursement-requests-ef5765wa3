import { createClient } from '@supabase/supabase-js'

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mock.supabase.co'
export const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'mock-key'

export const isSupabaseConfigured =
  supabaseUrl !== 'https://mock.supabase.co' &&
  supabaseUrl !== 'https://mock-project.supabase.co' &&
  !supabaseUrl.includes('mock')

export const supabase = createClient(supabaseUrl, supabaseKey)
