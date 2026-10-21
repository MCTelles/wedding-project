export type PublicFormFields = { name: string; email: string }

const cleanText = (value: unknown, max: number): string | null => {
  if (typeof value !== 'string') return null
  const text = value.trim().replace(/\s+/g, ' ')
  return text.length <= max ? text : null
}

export const parsePerson = (body: unknown): PublicFormFields | null => {
  if (!body || typeof body !== 'object') return null
  const data = body as Record<string, unknown>
  const name = cleanText(data.name, 120)
  const email = cleanText(data.email, 254)?.toLowerCase()
  if (!name || name.length < 2 || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null
  return { name, email }
}

export type RsvpInput = PublicFormFields & {
  attending: boolean
  adults: number
  children: number
  dietary: string
  song: string
  editToken: string
}

export const parseRsvp = (body: unknown): RsvpInput | null => {
  const person = parsePerson(body)
  if (!person) return null
  const data = body as Record<string, unknown>
  if (typeof data.attending !== 'boolean') return null
  if (typeof data.editToken !== 'string' || !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(data.editToken)) return null
  const adults = Number(data.adults)
  const children = Number(data.children)
  if (!Number.isInteger(adults) || !Number.isInteger(children) || adults < 0 || children < 0 || adults > 20 || children > 20) return null
  if (data.attending && adults + children < 1) return null
  const dietary = cleanText(data.dietary ?? '', 500)
  const song = cleanText(data.song ?? '', 200)
  if (dietary === null || song === null) return null
  return {
    ...person,
    attending: data.attending,
    adults: data.attending ? adults : 0,
    children: data.attending ? children : 0,
    dietary: data.attending ? dietary : '',
    song: data.attending ? song : '',
    editToken: data.editToken,
  }
}
