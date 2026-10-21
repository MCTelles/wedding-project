import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!

export const getSupabaseServerKey = (): string => {
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) throw new Error('Configure SUPABASE_SECRET_KEY no ambiente do servidor.')
  return key
}

export const supabaseAdmin = () =>
  createClient(supabaseUrl, getSupabaseServerKey(), {
    auth: { persistSession: false },
  })
