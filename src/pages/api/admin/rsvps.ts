import type { NextApiRequest, NextApiResponse } from 'next'
import { requireAdmin } from '@/utils/adminAuth'
import { supabaseAdmin } from '@/utils/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireAdmin(req, res)) return

  if (req.method === 'DELETE') {
    const id = req.query.id
    if (typeof id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
      return res.status(400).json({ error: 'Identificador de RSVP inválido.' })
    }

    const admin = supabaseAdmin()
    const { data, error } = await admin
      .from('rsvps')
      .delete()
      .eq('id', id)
      .select('id')

    if (error) return res.status(500).json({ error: error.message })
    if (!data?.length) return res.status(404).json({ error: 'Resposta não encontrada.' })
    return res.status(200).json({ ok: true })
  }

  if (req.method !== 'GET') return res.status(405).end()

  const admin = supabaseAdmin()
  const { data, error } = await admin
    .from('rsvps')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json(data ?? [])
}
