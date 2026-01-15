import type { ScheduleData } from './supabaseService.js';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const SUPABASE_DATA_ID = process.env.SUPABASE_DATA_ID || 'default';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('⚠️ SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set. Supabase updates will fail.');
}

export async function updateSupabaseData(data: ScheduleData): Promise<boolean> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Cannot update Supabase: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not configured');
    return false;
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/schedules?id=eq.${SUPABASE_DATA_ID}`, {
      method: 'PATCH',
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
      },
      body: JSON.stringify({ data })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Failed to update Supabase:', response.status, errorText);
      return false;
    }

    console.log('✅ Supabase updated successfully');
    return true;
  } catch (error) {
    console.error('❌ Error updating Supabase:', error);
    return false;
  }
}
