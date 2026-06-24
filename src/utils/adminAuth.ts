import { createHash } from 'crypto'
import { NextApiRequest, NextApiResponse } from 'next'
import { serialize, parse } from 'cookie'

const COOKIE_NAME = 'admin_session'
const COOKIE_MAX_AGE = 60 * 60 * 24 // 24h

export const hashPassword = (password: string) =>
  createHash('sha256').update(password + process.env.SUPABASE_SERVICE_ROLE_KEY).digest('hex')

export const setAdminCookie = (res: NextApiResponse, password: string) => {
  res.setHeader(
    'Set-Cookie',
    serialize(COOKIE_NAME, hashPassword(password), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    })
  )
}

export const clearAdminCookie = (res: NextApiResponse) => {
  res.setHeader(
    'Set-Cookie',
    serialize(COOKIE_NAME, '', { httpOnly: true, maxAge: 0, path: '/' })
  )
}

export const isAdminAuthenticated = (req: NextApiRequest): boolean => {
  const cookies = parse(req.headers.cookie || '')
  const session = cookies[COOKIE_NAME]
  if (!session) return false
  return session === hashPassword(process.env.ADMIN_PASSWORD || '')
}

export const requireAdmin = (
  req: NextApiRequest,
  res: NextApiResponse
): boolean => {
  if (!isAdminAuthenticated(req)) {
    res.status(401).json({ error: 'Unauthorized' })
    return false
  }
  return true
}
