import { supabase } from '../lib/supabase'

export interface Developer {
  id: string
  name: string
  role: string
  email: string
  whatsapp: string
}

export interface Schedule {
  id: string
  month: string
  year: number
  date: number
  day: string
  frontOffice: string
  middleOffice: string
  backOffice: string
  notes?: string
}

export interface Backup {
  backOffice: string
  frontOffice: string
}

// Raw data types from Supabase
interface RawViewSchedule {
  id: number | string
  month: string
  year: number
  date: number
  day: string
  front_office: string
  middle_office: string
  back_office: string
  notes?: string
}

interface RawSchedule {
  id: number | string
  month: string
  year: number
  date: number
  day: string
  front_office_id: string
  middle_office_id: string
  back_office_id: string
  notes?: string
}

interface RawBackupConfig {
  year: number
  month: string
  back_office_id: string
  front_office_id: string
}

interface RawMonthNote {
  note: string
  year: number
  month: string
}

export interface ScheduleData {
  developers: Developer[]
  schedules: Schedule[]
  backup: Backup
  monthNotes: string[]
}

let cachedData: ScheduleData | null = null
let lastFetchTime = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

const MONTH_ORDER = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

function monthIndex(month: string): number {
  const idx = MONTH_ORDER.indexOf(month)
  return idx === -1 ? 999 : idx
}

function pickLatestYearMonth(rows: Array<{ year: number; month: string }>): { year: number; month: string } | null {
  if (!rows.length) return null
  return rows
    .slice()
    .sort((a, b) => (a.year !== b.year ? b.year - a.year : monthIndex(b.month) - monthIndex(a.month)))[0]
}

/**
 * Fetch data from normalized Supabase tables and return the legacy "ScheduleData" shape
 * used by the UI (names for FO/MO/BO instead of developer IDs).
 */
export async function fetchSupabaseData(): Promise<ScheduleData> {
  const now = Date.now()
  if (cachedData && now - lastFetchTime < CACHE_DURATION) return cachedData

  // 1) Developers
  const { data: devs, error: devErr } = await supabase
    .from('developers')
    .select('id,name,role,email,whatsapp')
    .order('name', { ascending: true })

  if (devErr) throw new Error(`Failed to load developers: ${devErr.message}`)

  const developers: Developer[] = (devs ?? []) as Developer[]
  const devMap = new Map(developers.map(d => [d.id, d.name]))

  // 2) Schedules
  // Prefer view v_schedules if present (it already resolves names). If not, fall back to base table.
  let schedules: Schedule[] = []
  {
    const { data: vs, error: vsErr } = await supabase
      .from('v_schedules')
      .select('id,month,year,date,day,front_office,middle_office,back_office,notes')
      .order('year', { ascending: true })
      .order('month', { ascending: true })
      .order('date', { ascending: true })

    if (!vsErr && vs) {
      schedules = (vs as RawViewSchedule[]).map(r => ({
        id: String(r.id),
        month: r.month,
        year: r.year,
        date: r.date,
        day: r.day,
        frontOffice: r.front_office,
        middleOffice: r.middle_office,
        backOffice: r.back_office,
        notes: r.notes ?? ''
      }))
    } else {
      const { data: ss, error: sErr } = await supabase
        .from('schedules')
        .select('id,month,year,date,day,front_office_id,middle_office_id,back_office_id,notes')
        .order('year', { ascending: true })
        .order('month', { ascending: true })
        .order('date', { ascending: true })

      if (sErr) throw new Error(`Failed to load schedules: ${sErr.message}`)

      schedules = (ss as RawSchedule[]).map(r => ({
        id: String(r.id),
        month: r.month,
        year: r.year,
        date: r.date,
        day: r.day,
        frontOffice: devMap.get(r.front_office_id) ?? r.front_office_id,
        middleOffice: devMap.get(r.middle_office_id) ?? r.middle_office_id,
        backOffice: devMap.get(r.back_office_id) ?? r.back_office_id,
        notes: r.notes ?? ''
      }))
    }
  }

  // Determine "current" year-month from schedules (latest), used for backup + notes selection.
  const latestYM = pickLatestYearMonth(schedules.map(s => ({ year: s.year, month: s.month })))

  // 3) Backup config (per month)
  let backup: Backup = { backOffice: '', frontOffice: '' }
  {
    let q = supabase.from('backup_config').select('year,month,back_office_id,front_office_id')
    if (latestYM) q = q.eq('year', latestYM.year).eq('month', latestYM.month)
    const { data: bc, error: bErr } = await q.limit(1)
    if (bErr) throw new Error(`Failed to load backup config: ${bErr.message}`)
    const row = bc?.[0] as RawBackupConfig | undefined
    if (row) {
      backup = {
        backOffice: devMap.get(row.back_office_id) ?? row.back_office_id ?? '',
        frontOffice: devMap.get(row.front_office_id) ?? row.front_office_id ?? ''
      }
    }
  }

  // 4) Month notes (per month)
  let monthNotes: string[] = []
  {
    let q = supabase.from('month_notes').select('note,year,month')
    if (latestYM) q = q.eq('year', latestYM.year).eq('month', latestYM.month)
    const { data: mn, error: nErr } = await q
    if (nErr) throw new Error(`Failed to load month notes: ${nErr.message}`)
    monthNotes = (mn as RawMonthNote[] ?? []).map(r => r.note)
  }

  const data: ScheduleData = { developers, schedules, backup, monthNotes }

  cachedData = data
  lastFetchTime = now
  return data
}

export function invalidateCache(): void {
  cachedData = null
  lastFetchTime = 0
}

// Helper functions (kept for compatibility)
export async function getDevelopers(): Promise<Developer[]> {
  const data = await fetchSupabaseData()
  return data.developers
}

export async function getSchedules(): Promise<Schedule[]> {
  const data = await fetchSupabaseData()
  return data.schedules
}

export async function getBackup(): Promise<Backup> {
  const data = await fetchSupabaseData()
  return data.backup
}

export async function getMonthNotes(): Promise<string[]> {
  const data = await fetchSupabaseData()
  return data.monthNotes
}

export async function getDeveloperByName(name: string): Promise<Developer | undefined> {
  const developers = await getDevelopers()
  return developers.find(dev => dev.name === name)
}
