import type { NextApiRequest, NextApiResponse } from 'next'
import { getPublicGifts } from '@/utils/gifts'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()
  try {
    const gifts = await getPublicGifts()
    res.setHeader('Cache-Control', 'no-store')
    return res.status(200).json(gifts)
  } catch (error) {
    console.error('Failed to load gifts:', error)
    return res.status(500).json({ error: 'Não foi possível carregar os presentes.' })
  }
}
