import { Gift, GiftStatus } from "@/interfaces/gifts";
import Airtable, { Attachment } from "airtable";

const getAirtableBase = () => {
  return new Airtable({ apiKey: process.env.AIRTABLE_TOKEN }).base(process.env.AIRTABLE_BASE || '')
}

const giftsTable = process.env.NEXT_PUBLIC_AIRTABLE_GIFTS_TABLE || 'Gifts'
const giftsView = process.env.NEXT_PUBLIC_AIRTABLE_GIFTS_VIEW || 'Master List'
const guestsTable = process.env.NEXT_PUBLIC_AIRTABLE_GUESTS_TABLE || 'Guests'
const guestsView = process.env.NEXT_PUBLIC_AIRTABLE_GUESTS_VIEW

export const submitGiftToAirtable = async (gift: Gift, email: string): Promise<string | void> => {
  if (process.env.NEXT_PUBLIC_AIRTABLE_DISABLED) return
  const base = getAirtableBase()

  let userID: string
  try {
    userID = await getUserIDByEmail(email)
  } catch (err) {
    return new Promise<string>((_, reject) => reject('Error getting user by email, make sure you RSVPd!'))
  }

  if (!userID) {
    return new Promise<string>((_, reject) => reject('Guest not found, make sure you RSVPd!'))
  }

  return new Promise<void>((resolve, reject) => {
    base(giftsTable).update([
      {
        'id': gift.id,
        'fields': {
          'Status': GiftStatus.Claimed,
          'Claimed By': [userID],
        },
      },
    ], function(err) {
      if (err) {
        reject('Error updating gift');
        return;
      }
      resolve();
    });
  })
}

export const getGiftsFromAirtable = async (): Promise<Gift[]> => {
  if (process.env.NEXT_PUBLIC_AIRTABLE_DISABLED) return [
    {
      id: '1',
      name: 'Toaster',
      description: "A nice toaster that shows the demo",
      cost: 19.98,
      picture: "https://www.kitchenaid.ca/is/image/content/dam/global/kitchenaid/countertop-appliance/toaster/images/hero-KMT2115SX.tif?$PRODUCT-FEATURE$&fmt=webp-alpha",
      link: "https://www.kitchenaid.ca/en_ca/countertop-appliances/toasters/two-slice/p.2-slice-toaster-with-manual-lift-lever.kmt2115sx.html",
      status: GiftStatus.NotClaimed
    }
  ]

  const token = process.env.AIRTABLE_TOKEN
  const baseId = process.env.AIRTABLE_BASE

  if (!token || !baseId) {
    console.error('Airtable credentials not configured (AIRTABLE_TOKEN or AIRTABLE_BASE missing)')
    return []
  }

  const gifts: Gift[] = []
  let offset: string | undefined

  do {
    const params = new URLSearchParams({ view: giftsView })
    if (offset) params.set('offset', offset)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 25000)

    let data: { records: any[]; offset?: string }
    try {
      const res = await fetch(
        `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(giftsTable)}?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        }
      )
      clearTimeout(timeoutId)

      if (!res.ok) {
        console.error(`Airtable API error: ${res.status} ${res.statusText}`)
        break
      }

      data = await res.json()
    } catch (err) {
      clearTimeout(timeoutId)
      console.error('Airtable fetch error:', err)
      break
    }

    for (const record of data.records) {
      gifts.push({
        id: record.id,
        name: record.fields['Gift Name'] || 'Presente',
        description: record.fields['Description'] || '',
        cost: record.fields['Cost'] || 0,
        picture: record.fields['Picture']?.[0]?.url || '/luaDeMel.jpeg',
        link: record.fields['Link'] || '',
        status: record.fields['Status'] || GiftStatus.NotClaimed,
      })
    }

    offset = data.offset
  } while (offset)

  return gifts
}

const getUserIDByEmail = async (email: string): Promise<string> => {
  if (process.env.NEXT_PUBLIC_AIRTABLE_DISABLED) return ''

  const base = getAirtableBase()

  return new Promise<string>((resolve, reject) => {
    base(guestsTable)
      .select({
        maxRecords: 1,
        ...(guestsView ? { view: guestsView } : {}),
        filterByFormula: `{Email}='${email}'`,
      })
      .eachPage(
        function page(records, fetchNextPage) {
          if (!records) {
            return
          }

          records.forEach(function (record) {
            resolve(record.id)
          })

          fetchNextPage()
        },
        function done(err) {
          if (err) {
            reject(err)
            return
          }
          resolve('')
        }
      )
  })
}
