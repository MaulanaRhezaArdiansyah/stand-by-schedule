const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:10001';

import { supabase } from '../lib/supabase';

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

class ApiService {
  /**
   * Ambil access token Supabase (untuk dipakai ke backend kamu)
   */
  private async getAccessToken(): Promise<string> {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;

    const token = data.session?.access_token;
    if (!token) throw new Error('Not authenticated');

    return token;
  }

  /**
   * LOGIN via Supabase (bukan /api/auth/login)
   */
  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  /**
   * Cek apakah user sudah login
   */
  async verifySession(): Promise<{ email?: string } | null> {
    const { data } = await supabase.auth.getSession();
    if (!data.session?.user) return null;

    return { email: data.session.user.email ?? undefined };
  }

  /**
   * CRUD schedules tetap lewat backend kamu,
   * tapi Authorization pakai token Supabase.
   */
  async addSchedule(schedule: Omit<Schedule, 'id'>): Promise<Schedule> {
    const token = await this.getAccessToken();

    const response = await fetch(`${API_BASE_URL}/api/schedules`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(schedule),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to add schedule');
    }

    const data = await response.json();
    return data.schedule;
  }

  async updateSchedule(id: string, schedule: Partial<Schedule>): Promise<Schedule> {
    const token = await this.getAccessToken();

    const response = await fetch(`${API_BASE_URL}/api/schedules/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(schedule),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to update schedule');
    }

    const data = await response.json();
    return data.schedule;
  }

  async deleteSchedule(id: string): Promise<void> {
    const token = await this.getAccessToken();

    const response = await fetch(`${API_BASE_URL}/api/schedules/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to delete schedule');
    }
  }

  /**
   * Logout Supabase
   */
  async logout() {
    await supabase.auth.signOut();
  }
}

export const apiService = new ApiService();
