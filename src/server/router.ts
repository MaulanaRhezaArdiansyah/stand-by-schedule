import { IncomingMessage, ServerResponse } from 'http';
import { authenticateUser, generateToken, authMiddleware, requireAdmin, type AuthRequest } from './auth.js';
import { fetchGistData, invalidateCache } from './gistService.js';
import { updateGist } from './gistUpdater.js';
import type { GistData, Schedule } from './gistService.js';
import { setSchedulesData } from '../services/scheduler.js';

// Helper to parse request body
async function parseBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

// Enable CORS
function setCORS(res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export async function handleRequest(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
  setCORS(res);

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return true;
  }

  const url = req.url || '';
  const method = req.method || 'GET';

  // Health check
  if (url === '/health' || url === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      service: 'standby-scheduler',
      timestamp: new Date().toISOString()
    }));
    return true;
  }

  // Login endpoint
  if (url === '/api/auth/login' && method === 'POST') {
    try {
      const body = await parseBody(req);
      const { username, password } = body;

      if (!username || !password) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Username and password required' }));
        return true;
      }

      const user = await authenticateUser(username, password);
      if (!user) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid credentials' }));
        return true;
      }

      const token = generateToken(user.username, user.role);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        token,
        user: {
          username: user.username,
          role: user.role
        }
      }));
      return true;
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal server error' }));
      return true;
    }
  }

  // Verify token endpoint
  if (url === '/api/auth/verify' && method === 'GET') {
    const authReq = req as AuthRequest;
    if (!authMiddleware(authReq, res)) return true;

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      user: authReq.user
    }));
    return true;
  }

  // Get all data (public)
  if (url === '/api/data' && method === 'GET') {
    try {
      const data = await fetchGistData();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
      return true;
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to fetch data' }));
      return true;
    }
  }

  // Add schedule (admin only)
  if (url === '/api/schedules' && method === 'POST') {
    const authReq = req as AuthRequest;
    if (!requireAdmin(authReq, res)) return true;

    try {
      const body = await parseBody(req);
      const newSchedule: Schedule = body;

      // Validate schedule
      if (!newSchedule.month || !newSchedule.year || !newSchedule.date) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid schedule data' }));
        return true;
      }

      // Generate ID
      newSchedule.id = `${Date.now()}`;

      // Fetch current data
      const data = await fetchGistData();
      data.schedules.push(newSchedule);

      // Update Gist
      const success = await updateGist(data);
      if (!success) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to update Gist' }));
        return true;
      }

      // Invalidate cache & update scheduler
      invalidateCache();
      await refreshSchedulerData();

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, schedule: newSchedule }));
      return true;
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal server error' }));
      return true;
    }
  }

  // Update schedule (admin only)
  if (url.startsWith('/api/schedules/') && method === 'PUT') {
    const authReq = req as AuthRequest;
    if (!requireAdmin(authReq, res)) return true;

    try {
      const scheduleId = url.split('/')[3];
      const body = await parseBody(req);
      const updatedSchedule: Partial<Schedule> = body;

      // Fetch current data
      const data = await fetchGistData();
      const index = data.schedules.findIndex(s => s.id === scheduleId);

      if (index === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Schedule not found' }));
        return true;
      }

      // Update schedule
      data.schedules[index] = { ...data.schedules[index], ...updatedSchedule };

      // Update Gist
      const success = await updateGist(data);
      if (!success) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to update Gist' }));
        return true;
      }

      // Invalidate cache & update scheduler
      invalidateCache();
      await refreshSchedulerData();

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, schedule: data.schedules[index] }));
      return true;
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal server error' }));
      return true;
    }
  }

  // Delete schedule (admin only)
  if (url.startsWith('/api/schedules/') && method === 'DELETE') {
    const authReq = req as AuthRequest;
    if (!requireAdmin(authReq, res)) return true;

    try {
      const scheduleId = url.split('/')[3];

      // Fetch current data
      const data = await fetchGistData();
      const index = data.schedules.findIndex(s => s.id === scheduleId);

      if (index === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Schedule not found' }));
        return true;
      }

      // Remove schedule
      data.schedules.splice(index, 1);

      // Update Gist
      const success = await updateGist(data);
      if (!success) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to update Gist' }));
        return true;
      }

      // Invalidate cache & update scheduler
      invalidateCache();
      await refreshSchedulerData();

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
      return true;
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal server error' }));
      return true;
    }
  }

  return false; // Not handled
}

async function refreshSchedulerData() {
  const gistData = await fetchGistData();

  // Group schedules by month
  const monthlySchedules = gistData.schedules.reduce((acc, schedule) => {
    const key = `${schedule.month}-${schedule.year}`;
    if (!acc[key]) {
      acc[key] = {
        month: schedule.month,
        year: schedule.year,
        schedules: [],
        monthNotes: gistData.monthNotes
      };
    }
    acc[key].schedules.push({
      date: schedule.date,
      day: schedule.day,
      frontOffice: schedule.frontOffice,
      middleOffice: schedule.middleOffice,
      backOffice: schedule.backOffice,
      notes: schedule.notes
    });
    return acc;
  }, {} as Record<string, any>);

  const monthSchedulesArray = Object.values(monthlySchedules);
  setSchedulesData(monthSchedulesArray);

  console.log(`🔄 Scheduler data refreshed: ${gistData.schedules.length} schedules`);
}
