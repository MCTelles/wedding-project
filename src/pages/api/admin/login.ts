import type { NextApiRequest, NextApiResponse } from 'next'
import { setAdminCookie } from '@/utils/adminAuth'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { password } = req.body
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Senha incorreta' })
  }

  setAdminCookie(res, password)
  res.status(200).json({ ok: true })
}
