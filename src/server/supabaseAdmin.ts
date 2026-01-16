import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL!
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL) throw new Error('SUPABASE_URL is missing')
if (!SERVICE_ROLE) throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing')

export const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { persistSession: false }
})
