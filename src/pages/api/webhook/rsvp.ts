import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/utils/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const body = req.body
    const submission = body?.submission ?? body

    const questions: { name: string; value: any }[] = submission?.questions ?? []
    const getField = (...names: string[]) => {
      for (const name of names) {
        const q = questions.find((q) => q.name?.toLowerCase().includes(name.toLowerCase()))
        if (q?.value !== undefined && q?.value !== null && q?.value !== '') return q.value
      }
      return null
    }

    const name = getField('nome', 'name')
    const attending = (() => {
      const v = getField('comparec', 'attending', 'presença', 'presenca', 'irá', 'ira')
      if (v === null) return null
      if (typeof v === 'boolean') return v
      const s = String(v).toLowerCase()
      return s === 'sim' || s === 'yes' || s === 'true' || s === '1'
    })()
    const adults = Number(getField('adulto', 'adult')) || 0
    const children = Number(getField('crian', 'child', 'infan')) || 0
    const dietary = getField('alimentar', 'dieta', 'dietary', 'restr')
    const song = getField('música', 'musica', 'music', 'song')

    if (!name) return res.status(400).json({ error: 'Missing name' })

    const admin = supabaseAdmin()
    const { error } = await admin.from('rsvps').insert({
      name,
      attending,
      adults,
      children,
      dietary_restrictions: dietary,
      song,
    })

    if (error) throw new Error(error.message)

    return res.status(200).json({ ok: true })
  } catch (err: any) {
    console.error('RSVP webhook error:', err)
    return res.status(500).json({ error: err.message })
  }
}
