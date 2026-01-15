const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:10001';

export interface LoginResponse {
  token: string;
  user: {
    username: string;
    role: string;
  };
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

class ApiService {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  getToken(): string | null {
    return this.token;
  }

  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data: LoginResponse = await response.json();
    this.setToken(data.token);
    return data;
  }

  async verifyToken(): Promise<{ user: { username: string; role: string } } | null> {
    if (!this.token) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });

      if (!response.ok) {
        this.clearToken();
        return null;
      }

      return await response.json();
    } catch (error) {
      this.clearToken();
      return null;
    }
  }

  async addSchedule(schedule: Omit<Schedule, 'id'>): Promise<Schedule> {
    if (!this.token) throw new Error('Not authenticated');

    const response = await fetch(`${API_BASE_URL}/api/schedules`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
      },
      body: JSON.stringify(schedule),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add schedule');
    }

    const data = await response.json();
    return data.schedule;
  }

  async updateSchedule(id: string, schedule: Partial<Schedule>): Promise<Schedule> {
    if (!this.token) throw new Error('Not authenticated');

    const response = await fetch(`${API_BASE_URL}/api/schedules/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
      },
      body: JSON.stringify(schedule),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update schedule');
    }

    const data = await response.json();
    return data.schedule;
  }

  async deleteSchedule(id: string): Promise<void> {
    if (!this.token) throw new Error('Not authenticated');

    const response = await fetch(`${API_BASE_URL}/api/schedules/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete schedule');
    }
  }

  logout() {
    this.clearToken();
  }
}

export const apiService = new ApiService();
