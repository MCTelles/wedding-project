import { Gift, GiftStatus } from '@/interfaces/gifts'
import { supabase, supabaseAdmin } from '@/utils/supabase'

const toGift = (row: any): Gift => ({
  id: row.id,
  name: row.name,
  description: row.description || '',
  cost: row.cost || 0,
  picture: row.picture_url || '/luaDeMel.jpeg',
  link: row.link || '',
  status: row.status as GiftStatus,
  claimedByName: row.claimed_by_name || null,
  claimedByEmail: row.claimed_by_email || null,
})

export const getGifts = async (adminAccess = false): Promise<Gift[]> => {
  const client = adminAccess ? supabaseAdmin() : supabase
  const { data, error } = await client
    .from('gifts')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) throw new Error(error.message)
  return (data ?? []).map(toGift)
}

export const createGift = async (
  gift: Omit<Gift, 'id' | 'status' | 'claimedByName' | 'claimedByEmail'>
): Promise<Gift> => {
  const admin = supabaseAdmin()
  const { data, error } = await admin
    .from('gifts')
    .insert({
      name: gift.name,
      description: gift.description,
      cost: gift.cost,
      picture_url: gift.picture,
      link: gift.link,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return toGift(data)
}

export const updateGift = async (id: string, gift: Partial<Gift>): Promise<Gift> => {
  const admin = supabaseAdmin()
  const { data, error } = await admin
    .from('gifts')
    .update({
      name: gift.name,
      description: gift.description,
      cost: gift.cost,
      picture_url: gift.picture,
      link: gift.link,
      status: gift.status,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return toGift(data)
}

export const deleteGift = async (id: string): Promise<void> => {
  const admin = supabaseAdmin()
  const { error } = await admin.from('gifts').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export const claimGift = async (
  id: string,
  claimedByName: string,
  claimedByEmail: string
): Promise<Gift> => {
  const admin = supabaseAdmin()
  const { data, error } = await admin
    .from('gifts')
    .update({
      claimed_by_name: claimedByName || null,
      claimed_by_email: claimedByEmail || null,
    })
    .eq('id', id)
    .select()
    .maybeSingle()

  if (error) throw new Error(error.message)
  if (!data) throw new Error(`Gift not found for id: ${id}`)

  return toGift(data)
}
