import type { NextApiRequest, NextApiResponse } from 'next'
import { requireAdmin } from '@/utils/adminAuth'
import { supabaseAdmin } from '@/utils/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireAdmin(req, res)) return

  if (req.method !== 'GET') return res.status(405).end()

  const admin = supabaseAdmin()
  const { data, error } = await admin
    .from('rsvps')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json(data ?? [])
}
