import { createHash } from 'crypto'
import type { NextApiRequest } from 'next'
import { getSupabaseServerKey, supabaseAdmin } from '@/utils/supabase'

export const allowFormAttempt = async (req: NextApiRequest, form: string): Promise<boolean> => {
  const forwarded = req.headers['x-forwarded-for']
  const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(',')[0]?.trim()
    || req.socket.remoteAddress || 'unknown'
  const key = createHash('sha256')
    .update(`${getSupabaseServerKey()}:${form}:${ip}`)
    .digest('hex')
  const { data, error } = await supabaseAdmin().rpc('consume_form_attempt', {
    p_key: key,
    p_limit: 30,
  })
  if (error) throw error
  return data === true
}
