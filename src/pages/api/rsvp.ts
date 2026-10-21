import { createHash } from 'crypto'
import type { NextApiRequest, NextApiResponse } from 'next'
import { allowFormAttempt } from '@/utils/formRateLimit'
import { parseRsvp } from '@/utils/formValidation'
import { getSupabaseServerKey, supabaseAdmin } from '@/utils/supabase'

export const config = { api: { bodyParser: { sizeLimit: '8kb' } } }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  if (req.body?.website) return res.status(400).json({ error: 'Solicitação inválida.' })
  const input = parseRsvp(req.body)
  if (!input) return res.status(400).json({ error: 'Confira os dados informados.' })

  try {
    if (!(await allowFormAttempt(req, 'rsvp'))) {
      return res.status(429).json({ error: 'Muitas tentativas. Tente novamente em uma hora.' })
    }
    const tokenHash = createHash('sha256')
      .update(`${getSupabaseServerKey()}:${input.editToken}`)
      .digest('hex')
    const { data, error } = await supabaseAdmin().rpc('save_rsvp', {
      p_name: input.name,
      p_email: input.email,
      p_attending: input.attending,
      p_adults: input.adults,
      p_children: input.children,
      p_dietary: input.dietary || null,
      p_song: input.song || null,
      p_edit_token_hash: tokenHash,
    })
    if (error) throw error
    if (!data) return res.status(409).json({ error: 'Este email já foi usado em outra resposta. Fale com os noivos para alterá-la.' })
    return res.status(200).json({ ok: true })
  } catch (error) {
    console.error('Failed to save RSVP:', error)
    return res.status(500).json({ error: 'Não foi possível salvar sua resposta agora.' })
  }
}
