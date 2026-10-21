import type { NextApiRequest, NextApiResponse } from 'next'
import { allowFormAttempt } from '@/utils/formRateLimit'
import { parsePerson } from '@/utils/formValidation'
import { reserveGift } from '@/utils/gifts'

export const config = { api: { bodyParser: { sizeLimit: '8kb' } } }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  if (req.body?.website) return res.status(400).json({ error: 'Solicitação inválida.' })

  const id = req.query.id
  const person = parsePerson(req.body)
  if (typeof id !== 'string' || !/^[a-zA-Z0-9_-]{1,80}$/.test(id) || !person) {
    return res.status(400).json({ error: 'Confira o nome e o email.' })
  }

  try {
    if (!(await allowFormAttempt(req, 'gift'))) {
      return res.status(429).json({ error: 'Muitas tentativas. Tente novamente em uma hora.' })
    }
    const result = await reserveGift(id, person.name, person.email)
    if (result === 'not_found') return res.status(404).json({ error: 'Presente não encontrado.' })
    if (result === 'unavailable') return res.status(409).json({ error: 'Este presente já foi escolhido.' })
    return res.status(200).json({ ok: true })
  } catch (error) {
    console.error('Failed to reserve gift:', error)
    return res.status(500).json({ error: 'Não foi possível escolher o presente agora.' })
  }
}
