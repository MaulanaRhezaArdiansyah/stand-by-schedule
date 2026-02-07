import { IncomingMessage, ServerResponse } from 'node:http'
import { supabaseAdmin } from './supabaseAdmin.js'

export interface AuthRequest extends IncomingMessage {
  user?: { id: string; email?: string }
}

const adminEmails = new Set(
  (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(Boolean)
)

export async function authMiddleware(req: AuthRequest, res: ServerResponse): Promise<boolean> {
  const authHeader = req.headers.authorization || ''
  if (!authHeader.startsWith('Bearer ')) {
    res.writeHead(401, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Unauthorized - No token provided' }))
    return false
  }

  const token = authHeader.slice('Bearer '.length).trim()

  const { data, error } = await supabaseAdmin.auth.getUser(token)

  if (error || !data?.user) {
    res.writeHead(401, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Unauthorized - Invalid token', detail: error?.message }))
    return false
  }

  req.user = { id: data.user.id, email: data.user.email ?? undefined }
  return true
}

export async function requireAdmin(req: AuthRequest, res: ServerResponse): Promise<boolean> {
  const ok = await authMiddleware(req, res)
  if (!ok) return false

  // if (adminEmails.size === 0) {
  //   return true
  // }

  // kalau kamu mau whitelist admin:
  const email = (req.user?.email || '').toLowerCase()
  const hasEmail = adminEmails.has(email)
  console.log({
    email,
    adminEmails,
    hasEmail
  })
  if (!email || !adminEmails.has(email)) {
    res.writeHead(403, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Forbidden - Admin access required' }))
    return false
  }

  return true
}
