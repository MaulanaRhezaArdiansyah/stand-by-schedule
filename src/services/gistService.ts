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

export interface GistData {
  developers: Developer[];
  schedules: Schedule[];
  backup: Backup;
  monthNotes: string[];
}

const GIST_URL = import.meta.env.VITE_GIST_URL || 'https://gist.githubusercontent.com/YOUR_USERNAME/YOUR_GIST_ID/raw/gist-data.json';

let cachedData: GistData | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function fetchGistData(): Promise<GistData> {
  const now = Date.now();

  // Return cached data if still valid
  if (cachedData && (now - lastFetchTime) < CACHE_DURATION) {
    return cachedData;
  }

  try {
    const response = await fetch(GIST_URL);

    if (!response.ok) {
      throw new Error(`Failed to fetch gist data: ${response.statusText}`);
    }

    const data: GistData = await response.json();

    // Update cache
    cachedData = data;
    lastFetchTime = now;

    return data;
  } catch (error) {
    console.error('Error fetching gist data:', error);

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
  const data = await fetchGistData();
  return data.developers;
}

export async function getSchedules(): Promise<Schedule[]> {
  const data = await fetchGistData();
  return data.schedules;
}

export async function getBackup(): Promise<Backup> {
  const data = await fetchGistData();
  return data.backup;
}

export async function getMonthNotes(): Promise<string[]> {
  const data = await fetchGistData();
  return data.monthNotes;
}

export async function getDeveloperByName(name: string): Promise<Developer | undefined> {
  const developers = await getDevelopers();
  return developers.find(dev => dev.name === name);
}
