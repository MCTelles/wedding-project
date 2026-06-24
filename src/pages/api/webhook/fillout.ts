import type { NextApiRequest, NextApiResponse } from 'next'
import { claimGift } from '@/utils/gifts'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const body = req.body
    const submission = body?.submission ?? body

    // URL params (gift id comes from here)
    const urlParams: { id: string; value: string }[] = submission?.urlParameters ?? []
    const getParam = (key: string) =>
      urlParams.find((p) => p.id?.toLowerCase() === key.toLowerCase())?.value ?? ''

    // Form questions (name, email, etc.)
    const questions: { name: string; value: string }[] = submission?.questions ?? []
    const getField = (...names: string[]) => {
      for (const name of names) {
        const v = questions.find((q) => q.name?.toLowerCase() === name.toLowerCase())?.value
        if (v) return v
      }
      return ''
    }

    const giftId = getParam('id')
    const claimedByName = getField('name', 'nome', 'full name', 'nome completo')
    const claimedByEmail = getField('email')

    if (!giftId) {
      return res.status(400).json({ error: 'Missing gift id' })
    }

    await claimGift(giftId, claimedByName, claimedByEmail)
    return res.status(200).json({ ok: true })
  } catch (err: any) {
    console.error('Webhook error:', err)
    return res.status(500).json({ error: err.message })
  }
}
