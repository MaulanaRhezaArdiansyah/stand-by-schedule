import type { Schedule } from './supabaseService.js';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('⚠️ SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set. Supabase updates will fail.');
}

const headers = () => ({
  apikey: SUPABASE_SERVICE_ROLE_KEY,
  Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
  'Content-Type': 'application/json',
  Prefer: 'return=representation'
});

export async function insertSchedule(schedule: Omit<Schedule, 'id'>): Promise<Schedule | null> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Cannot insert schedule: Supabase not configured');
    return null;
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/schedules`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({
        month: schedule.month,
        year: schedule.year,
        date: schedule.date,
        day: schedule.day,
        front_office_id: schedule.frontOffice.toLowerCase(),
        middle_office_id: schedule.middleOffice.toLowerCase(),
        back_office_id: schedule.backOffice.toLowerCase(),
        notes: schedule.notes || null
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Failed to insert schedule:', response.status, errorText);
      return null;
    }

    const result = await response.json();
    const inserted = result[0];

    console.log('✅ Schedule inserted:', inserted.id);
    return {
      id: String(inserted.id),
      month: inserted.month,
      year: inserted.year,
      date: inserted.date,
      day: inserted.day,
      frontOffice: inserted.front_office_id,
      middleOffice: inserted.middle_office_id,
      backOffice: inserted.back_office_id,
      notes: inserted.notes || ''
    };
  } catch (error) {
    console.error('❌ Error inserting schedule:', error);
    return null;
  }
}

export async function updateSchedule(id: string, schedule: Partial<Schedule>): Promise<Schedule | null> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Cannot update schedule: Supabase not configured');
    return null;
  }

  try {
    const updateData: Record<string, string | number | null> = {};
    if (schedule.month !== undefined) updateData.month = schedule.month;
    if (schedule.year !== undefined) updateData.year = schedule.year;
    if (schedule.date !== undefined) updateData.date = schedule.date;
    if (schedule.day !== undefined) updateData.day = schedule.day;
    if (schedule.frontOffice !== undefined) updateData.front_office_id = schedule.frontOffice.toLowerCase();
    if (schedule.middleOffice !== undefined) updateData.middle_office_id = schedule.middleOffice.toLowerCase();
    if (schedule.backOffice !== undefined) updateData.back_office_id = schedule.backOffice.toLowerCase();
    if (schedule.notes !== undefined) updateData.notes = schedule.notes || null;

    const response = await fetch(`${SUPABASE_URL}/rest/v1/schedules?id=eq.${id}`, {
      method: 'PATCH',
      headers: headers(),
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Failed to update schedule:', response.status, errorText);
      return null;
    }

    const result = await response.json();
    const updated = result[0];

    console.log('✅ Schedule updated:', id);
    return {
      id: String(updated.id),
      month: updated.month,
      year: updated.year,
      date: updated.date,
      day: updated.day,
      frontOffice: updated.front_office_id,
      middleOffice: updated.middle_office_id,
      backOffice: updated.back_office_id,
      notes: updated.notes || ''
    };
  } catch (error) {
    console.error('❌ Error updating schedule:', error);
    return null;
  }
}

export async function deleteSchedule(id: string): Promise<boolean> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Cannot delete schedule: Supabase not configured');
    return false;
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/schedules?id=eq.${id}`, {
      method: 'DELETE',
      headers: headers()
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Failed to delete schedule:', response.status, errorText);
      return false;
    }

    console.log('✅ Schedule deleted:', id);
    return true;
  } catch (error) {
    console.error('❌ Error deleting schedule:', error);
    return false;
  }
}
