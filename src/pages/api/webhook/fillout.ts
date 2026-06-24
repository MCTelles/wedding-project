import type { NextApiRequest, NextApiResponse } from 'next'
import { claimGift } from '@/utils/gifts'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const body = req.body
    const submission = body?.submission ?? body

    // URL params (gift id comes from here)
    const urlParams: { id: string; value: string }[] = submission?.urlParameters ?? []
    const questions: { name: string; value: string }[] = submission?.questions ?? []

    // Log para ver o payload exato do Fillout
    console.log('Gift webhook payload:', JSON.stringify({ urlParams, questions }, null, 2))

    const getParam = (key: string) =>
      urlParams.find((p) => p.id?.toLowerCase() === key.toLowerCase())?.value ?? ''

    const getField = (...names: string[]) => {
      for (const name of names) {
        const v = questions.find((q) => q.name?.toLowerCase().includes(name.toLowerCase()))?.value
        if (v) return v
      }
      return ''
    }

    const giftId = getParam('id')
    const claimedByName = getField('nome', 'name', 'full name', 'nome completo')
    const claimedByEmail = getField('email')

    console.log('Gift parsed:', { giftId, claimedByName, claimedByEmail })

    if (!giftId) {
      console.error('Missing gift id. urlParams:', urlParams)
      return res.status(400).json({ error: 'Missing gift id', urlParams })
    }

    await claimGift(giftId, claimedByName, claimedByEmail)
    return res.status(200).json({
      ok: true,
      debug: {
        urlParams,
        questions: questions.map((q) => ({ name: q.name, value: q.value })),
        parsed: { giftId, claimedByName, claimedByEmail },
      },
    })
  } catch (err: any) {
    console.error('Gift webhook error:', err)
    return res.status(500).json({ error: err.message })
  }
}
