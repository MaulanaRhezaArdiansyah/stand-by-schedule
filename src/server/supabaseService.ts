export interface Developer {
  id: string;
  name: string;
  role: string;
  email: string;
  whatsapp: string;
}

export interface Schedule {
  id: string;
  month: string;
  year: number;
  date: number;
  day: string;
  frontOffice: string;
  middleOffice: string;
  backOffice: string;
  notes?: string;
}

export interface Backup {
  backOffice: string;
  frontOffice: string;
}

export interface ScheduleData {
  developers: Developer[];
  schedules: Schedule[];
  backup: Backup;
  monthNotes: string[];
}

// Raw data types from Supabase REST API
interface RawMonthNote {
  note: string;
}

interface RawSchedule {
  id: number | string;
  month: string;
  year: number;
  date: number;
  day: string;
  front_office_id: string;
  middle_office_id: string;
  back_office_id: string;
  notes?: string;
}

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';

let cachedData: ScheduleData | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function ensureSupabaseConfig() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY.');
  }
}

export async function fetchSupabaseData(): Promise<ScheduleData> {
  const now = Date.now();

  if (cachedData && (now - lastFetchTime) < CACHE_DURATION) {
    console.log('📦 Using cached Supabase data');
    return cachedData;
  }

  ensureSupabaseConfig();

  try {
    console.log('🌐 Fetching data from Supabase tables...');

    const headers = {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json'
    };

    // Fetch schedules
    const schedulesUrl = `${SUPABASE_URL}/rest/v1/schedules?select=*&order=year.asc,month.asc,date.asc`;
    const schedulesRes = await fetch(schedulesUrl, { headers });

    if (!schedulesRes.ok) {
      const errorText = await schedulesRes.text();
      throw new Error(`Failed to fetch schedules: ${schedulesRes.statusText} - ${errorText}`);
    }

    const schedulesRaw = await schedulesRes.json();

    // Fetch developers
    const developersUrl = `${SUPABASE_URL}/rest/v1/developers?select=*`;
    const developersRes = await fetch(developersUrl, { headers });

    if (!developersRes.ok) {
      const errorText = await developersRes.text();
      throw new Error(`Failed to fetch developers: ${developersRes.statusText} - ${errorText}`);
    }

    const developers: Developer[] = await developersRes.json();

    // Fetch month notes
    const monthNotesUrl = `${SUPABASE_URL}/rest/v1/month_notes?select=*&order=year.asc,month.asc`;
    const monthNotesRes = await fetch(monthNotesUrl, { headers });

    if (!monthNotesRes.ok) {
      const errorText = await monthNotesRes.text();
      throw new Error(`Failed to fetch month_notes: ${monthNotesRes.statusText} - ${errorText}`);
    }

    const monthNotesRaw: RawMonthNote[] = await monthNotesRes.json();
    const monthNotes = monthNotesRaw.map(mn => mn.note || '');

    // Fetch backup config (just get the first one or default)
    const backupUrl = `${SUPABASE_URL}/rest/v1/backup_config?select=*&limit=1`;
    const backupRes = await fetch(backupUrl, { headers });

    let backup: Backup = { backOffice: '', frontOffice: '' };
    if (backupRes.ok) {
      const backupRaw = await backupRes.json();
      if (backupRaw.length > 0) {
        backup = {
          backOffice: backupRaw[0].back_office_id || '',
          frontOffice: backupRaw[0].front_office_id || ''
        };
      }
    }

    // Map schedules with office IDs to office names
    const schedulesTyped: RawSchedule[] = schedulesRaw;
    const schedules: Schedule[] = schedulesTyped.map(s => ({
      id: String(s.id),
      month: s.month,
      year: s.year,
      date: s.date,
      day: s.day,
      frontOffice: s.front_office_id || '',
      middleOffice: s.middle_office_id || '',
      backOffice: s.back_office_id || '',
      notes: s.notes || ''
    }));

    const data: ScheduleData = {
      developers,
      schedules,
      backup,
      monthNotes
    };

    // Update cache
    cachedData = data;
    lastFetchTime = now;

    console.log('✅ Supabase data fetched and cached');
    return data;
  } catch (error) {
    console.error('❌ Error fetching Supabase data:', error);

    // Return cached data if available, even if expired
    if (cachedData) {
      console.warn('⚠️ Using expired cache due to fetch error');
      return cachedData;
    }

    throw error;
  }
}

export function invalidateCache(): void {
  cachedData = null;
  lastFetchTime = 0;
  console.log('🗑️ Supabase cache invalidated');
}

export async function getDevelopers(): Promise<Developer[]> {
  const data = await fetchSupabaseData();
  return data.developers;
}

export async function getSchedules(): Promise<Schedule[]> {
  const data = await fetchSupabaseData();
  return data.schedules;
}

export async function getBackup(): Promise<Backup> {
  const data = await fetchSupabaseData();
  return data.backup;
}

export async function getMonthNotes(): Promise<string[]> {
  const data = await fetchSupabaseData();
  return data.monthNotes;
}

export async function getDeveloperByName(name: string): Promise<Developer | undefined> {
  const developers = await getDevelopers();
  return developers.find(dev => dev.name === name);
}
