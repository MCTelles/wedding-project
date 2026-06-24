import type { NextApiRequest, NextApiResponse } from 'next'
import { claimGift } from '@/utils/gifts'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const body = req.body

    // Fillout sends submissions under `submission` or directly as fields array
    const responses: { field: { name: string }; value: string }[] =
      body?.submission?.responses ?? body?.responses ?? []

    const get = (name: string) =>
      responses.find((r) => r.field?.name?.toLowerCase() === name.toLowerCase())?.value ?? ''

    // The gift id is passed as a URL param to the Fillout form
    const giftId: string =
      body?.submission?.urlParameters?.find((p: any) => p.id === 'id')?.value ??
      body?.urlParameters?.find((p: any) => p.id === 'id')?.value ??
      get('id')

    const claimedByName = get('name') || get('nome') || get('full name') || get('nome completo')
    const claimedByEmail = get('email')

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
