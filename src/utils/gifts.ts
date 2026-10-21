import { Gift, GiftStatus } from '@/interfaces/gifts'
import { supabaseAdmin } from '@/utils/supabase'

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

export const getGifts = async (): Promise<Gift[]> => {
  const { data, error } = await supabaseAdmin()
    .from('gifts')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) throw new Error(error.message)
  return (data ?? []).map(toGift)
}

export const getPublicGifts = async (): Promise<Gift[]> => {
  const { data, error } = await supabaseAdmin()
    .from('gifts')
    .select('id,name,description,cost,picture_url,link,status,created_at')
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

export const reserveGift = async (
  id: string,
  claimedByName: string,
  claimedByEmail: string
): Promise<'reserved' | 'unavailable' | 'not_found'> => {
  const admin = supabaseAdmin()
  const { data, error } = await admin
    .rpc('reserve_gift', {
      p_gift_id: id,
      p_name: claimedByName,
      p_email: claimedByEmail,
    })
  if (error) throw new Error(error.message)
  return data as 'reserved' | 'unavailable' | 'not_found'
}

export const releaseGift = async (id: string): Promise<void> => {
  const { error } = await supabaseAdmin()
    .from('gifts')
    .update({
      status: GiftStatus.NotClaimed,
      claimed_by_name: null,
      claimed_by_email: null,
      claimed_at: null,
    })
    .eq('id', id)
  if (error) throw new Error(error.message)
}
