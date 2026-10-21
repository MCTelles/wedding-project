import type { NextApiRequest, NextApiResponse } from 'next'
import { requireAdmin } from '@/utils/adminAuth'
import { releaseGift } from '@/utils/gifts'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireAdmin(req, res)) return
  if (req.method !== 'DELETE') return res.status(405).end()
  const { id } = req.query
  if (typeof id !== 'string') return res.status(400).json({ error: 'ID inválido' })
  try {
    await releaseGift(id)
    return res.status(204).end()
  } catch (error) {
    console.error('Failed to release gift:', error)
    return res.status(500).json({ error: 'Não foi possível liberar o presente.' })
  }
}
