import type { NextApiRequest, NextApiResponse } from 'next'
import { requireAdmin } from '@/utils/adminAuth'
import { updateGift, deleteGift } from '@/utils/gifts'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireAdmin(req, res)) return

  const { id } = req.query as { id: string }

  if (req.method === 'PUT') {
    try {
      const gift = await updateGift(id, req.body)
      return res.status(200).json(gift)
    } catch (err: any) {
      return res.status(500).json({ error: err.message })
    }
  }

  if (req.method === 'DELETE') {
    try {
      await deleteGift(id)
      return res.status(204).end()
    } catch (err: any) {
      return res.status(500).json({ error: err.message })
    }
  }

  res.status(405).end()
}
