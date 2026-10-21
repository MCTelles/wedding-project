import type { NextApiRequest, NextApiResponse } from 'next'
import { requireAdmin } from '@/utils/adminAuth'
import { getGifts, createGift } from '@/utils/gifts'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireAdmin(req, res)) return

  if (req.method === 'GET') {
    try {
      const gifts = await getGifts()
      return res.status(200).json(gifts)
    } catch (err: any) {
      return res.status(500).json({ error: err.message })
    }
  }

  if (req.method === 'POST') {
    try {
      const gift = await createGift(req.body)
      return res.status(201).json(gift)
    } catch (err: any) {
      return res.status(500).json({ error: err.message })
    }
  }

  res.status(405).end()
}
