import type { NextApiRequest, NextApiResponse } from 'next'
import { clearAdminCookie } from '@/utils/adminAuth'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  clearAdminCookie(res)
  res.status(200).json({ ok: true })
}
