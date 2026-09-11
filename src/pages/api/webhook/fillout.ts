import type { NextApiRequest, NextApiResponse } from 'next'
import { claimGift } from '@/utils/gifts'

type FilloutEntry = {
  id?: string
  key?: string
  name?: string
  label?: string
  value?: unknown
  type?: string
}

const normalize = (value: unknown): string => String(value ?? '').toLowerCase().trim()

const entryLabel = (entry: FilloutEntry): string =>
  [entry.id, entry.key, entry.name, entry.label].filter(Boolean).join(' ')

const collectEntries = (...sources: unknown[]): FilloutEntry[] => {
  const entries: FilloutEntry[] = []

  for (const source of sources) {
    if (!source) continue

    if (Array.isArray(source)) {
      for (const item of source) {
        if (item && typeof item === 'object') entries.push(item as FilloutEntry)
      }
      continue
    }

    if (typeof source === 'object') {
      for (const [key, value] of Object.entries(source)) {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          entries.push({ key, ...(value as Record<string, unknown>) })
        } else {
          entries.push({ id: key, key, name: key, value })
        }
      }
    }
  }

  return entries
}

const stringifyValue = (value: unknown): string => {
  if (value === undefined || value === null || value === '') return ''
  if (['string', 'number', 'boolean'].includes(typeof value)) return String(value).trim()

  if (Array.isArray(value)) {
    return value.map(stringifyValue).filter(Boolean).join(', ')
  }

  if (typeof value === 'object') {
    const record = value as Record<string, unknown>
    for (const key of ['Name', 'name', 'Email', 'email', 'label', 'value']) {
      const stringValue = stringifyValue(record[key])
      if (stringValue) return stringValue
    }
  }

  return ''
}

const findNestedValue = (value: unknown, ...names: string[]): string => {
  if (value === undefined || value === null) return ''

  if (Array.isArray(value)) {
    for (const item of value) {
      const match = findNestedValue(item, ...names)
      if (match) return match
    }
    return ''
  }

  if (typeof value !== 'object') return ''

  const record = value as Record<string, unknown>
  for (const [key, nestedValue] of Object.entries(record)) {
    if (names.some((name) => normalize(key).includes(normalize(name)))) {
      const stringValue = stringifyValue(nestedValue)
      if (stringValue) return stringValue
    }
  }

  for (const nestedValue of Object.values(record)) {
    const match = findNestedValue(nestedValue, ...names)
    if (match) return match
  }

  return ''
}

const findValue = (entries: FilloutEntry[], ...names: string[]): string => {
  for (const entry of entries) {
    if (names.some((name) => normalize(entryLabel(entry)).includes(normalize(name)))) {
      const stringValue = stringifyValue(entry.value)
      if (stringValue) return stringValue
    }
  }

  for (const entry of entries) {
    const nestedValue = findNestedValue(entry.value, ...names)
    if (nestedValue) return nestedValue
  }

  return ''
}

const findParam = (entries: FilloutEntry[], ...names: string[]): string => {
  for (const entry of entries) {
    const labels = [entry.id, entry.key, entry.name, entry.label].map(normalize)
    const exactMatch = names.some((name) => labels.includes(normalize(name)))
    if (exactMatch) {
      const stringValue = stringifyValue(entry.value)
      if (stringValue) return stringValue
    }
  }

  return ''
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const body = req.body
    const submission = body?.submission ?? body

    const urlParams = collectEntries(
      submission?.urlParameters,
      submission?.urlParams,
      submission?.url_parameters,
      submission?.queryParameters,
      submission?.hiddenFields,
      body?.urlParameters,
      body?.urlParams,
      body?.url_parameters,
      body?.queryParameters,
      body?.hiddenFields
    )
    const questions = collectEntries(submission?.questions, submission?.answers, body?.questions, body?.answers)

    // Log para ver o payload exato do Fillout
    console.log('Gift webhook payload:', JSON.stringify({ urlParams, questions }, null, 2))

    const giftId = findParam(urlParams, 'giftId', 'gift_id', 'gift id', 'id')
    const claimedByName = findValue(questions, 'nome completo', 'full name', 'nome', 'name')
    const claimedByEmail = findValue(questions, 'email', 'e-mail')

    console.log('Gift parsed:', { giftId, claimedByName, claimedByEmail })

    if (!giftId) {
      console.error('Missing gift id. urlParams:', urlParams)
      return res.status(400).json({ error: 'Missing gift id', urlParams })
    }

    const gift = await claimGift(giftId, claimedByName, claimedByEmail)
    return res.status(200).json({
      ok: true,
      gift,
      debug: {
        urlParams,
        questions: questions.map((q) => ({ name: q.name, value: q.value })),
        parsed: { giftId, claimedByName, claimedByEmail },
      },
    })
  } catch (err: any) {
    console.error('Gift webhook error:', err)
    return res.status(500).json({ error: err.message })
  }
}
