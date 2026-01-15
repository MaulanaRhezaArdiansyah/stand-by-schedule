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

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const SUPABASE_DATA_ID = import.meta.env.VITE_SUPABASE_DATA_ID || 'default';

let cachedData: ScheduleData | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function ensureSupabaseConfig() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }
}

function buildSupabaseUrl() {
  return `${SUPABASE_URL}/rest/v1/standby_data?select=data&id=eq.${SUPABASE_DATA_ID}&limit=1`;
}

export async function fetchSupabaseData(): Promise<ScheduleData> {
  const now = Date.now();

  // Return cached data if still valid
  if (cachedData && (now - lastFetchTime) < CACHE_DURATION) {
    return cachedData;
  }

  ensureSupabaseConfig();

  try {
    const response = await fetch(buildSupabaseUrl(), {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Supabase data: ${response.statusText}`);
    }

    const payload: Array<{ data: ScheduleData }> = await response.json();
    const data = payload[0]?.data;

    if (!data) {
      throw new Error('Supabase data is empty. Ensure standby_data has a row with matching id.');
    }

    // Update cache
    cachedData = data;
    lastFetchTime = now;

    return data;
  } catch (error) {
    console.error('Error fetching Supabase data:', error);

    // Return cached data if available, even if expired
    if (cachedData) {
      console.warn('Using expired cache due to fetch error');
      return cachedData;
    }

    throw error;
  }
}

export function invalidateCache(): void {
  cachedData = null;
  lastFetchTime = 0;
}

// Helper functions
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
