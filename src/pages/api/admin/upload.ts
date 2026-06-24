import type { NextApiRequest, NextApiResponse } from 'next'
import { requireAdmin } from '@/utils/adminAuth'
import { supabaseAdmin } from '@/utils/supabase'

export const config = { api: { bodyParser: { sizeLimit: '5mb' } } }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireAdmin(req, res)) return
  if (req.method !== 'POST') return res.status(405).end()

  const { base64, fileName, mimeType } = req.body as {
    base64: string
    fileName: string
    mimeType: string
  }

  const buffer = Buffer.from(base64, 'base64')
  const path = `${Date.now()}-${fileName}`

  const admin = supabaseAdmin()
  const { error } = await admin.storage
    .from('gift-images')
    .upload(path, buffer, { contentType: mimeType, upsert: false })

  if (error) return res.status(500).json({ error: error.message })

  const { data } = admin.storage.from('gift-images').getPublicUrl(path)
  return res.status(200).json({ url: data.publicUrl })
}
