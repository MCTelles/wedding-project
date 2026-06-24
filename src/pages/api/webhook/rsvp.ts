import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/utils/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const body = req.body
    const submission = body?.submission ?? body

    const questions: { name: string; value: any; type?: string }[] = submission?.questions ?? []

    // Log para ver o payload exato do Fillout
    console.log('RSVP webhook payload:', JSON.stringify({ questions }, null, 2))

    const getField = (...names: string[]) => {
      for (const name of names) {
        const q = questions.find((q) => q.name?.toLowerCase().includes(name.toLowerCase()))
        if (q !== undefined && q.value !== undefined && q.value !== null && q.value !== '') {
          return q.value
        }
      }
      return null
    }

    const name = getField('nome', 'name')

    // attending: aceita boolean, "sim"/"não", "yes"/"no", número 0/1
    const attendingRaw = getField('comparec', 'attending', 'presença', 'presenca', 'irá', 'ira', 'vai')
    console.log('attendingRaw:', attendingRaw, typeof attendingRaw)

    const attending = (() => {
      if (attendingRaw === null) return null
      if (typeof attendingRaw === 'boolean') return attendingRaw
      const s = String(attendingRaw).toLowerCase().trim()
      if (s === 'sim' || s === 'yes' || s === 'true' || s === '1') return true
      if (s === 'não' || s === 'nao' || s === 'no' || s === 'false' || s === '0') return false
      return null
    })()

    const adults = Number(getField('adulto', 'adult')) || 0
    const children = Number(getField('crian', 'child', 'infan')) || 0
    const dietary = getField('alimentar', 'dieta', 'dietary', 'restr')
    const song = getField('música', 'musica', 'music', 'song', 'mús')

    console.log('RSVP parsed:', { name, attending, adults, children, dietary, song })

    if (!name) return res.status(400).json({ error: 'Missing name', questions })

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

    return res.status(200).json({
      ok: true,
      debug: {
        questions: questions.map((q) => ({ name: q.name, value: q.value, type: q.type })),
        parsed: { name, attending, adults, children, dietary, song },
      },
    })
  } catch (err: any) {
    console.error('RSVP webhook error:', err)
    return res.status(500).json({ error: err.message })
  }
}
