import { IncomingMessage, ServerResponse } from 'http';
import { fetchSupabaseData, invalidateCache } from './supabaseService.js';
import { insertSchedule, updateSchedule as updateScheduleDB, deleteSchedule as deleteScheduleDB } from './supabaseUpdater.js';
import type { Schedule } from './supabaseService.js';
import { setSchedulesData } from '../services/scheduler.js';
import { authMiddleware, requireAdmin, type AuthRequest } from './auth.js';

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

  // // Login endpoint
  // if (url === '/api/auth/login' && method === 'POST') {
  //   try {
  //     const body = await parseBody(req);
  //     const { username, password } = body;

  //     if (!username || !password) {
  //       res.writeHead(400, { 'Content-Type': 'application/json' });
  //       res.end(JSON.stringify({ error: 'Username and password required' }));
  //       return true;
  //     }

  //     const user = await authenticateUser(username, password);
  //     if (!user) {
  //       res.writeHead(401, { 'Content-Type': 'application/json' });
  //       res.end(JSON.stringify({ error: 'Invalid credentials' }));
  //       return true;
  //     }

  //     const token = generateToken(user.username, user.role);
  //     res.writeHead(200, { 'Content-Type': 'application/json' });
  //     res.end(JSON.stringify({
  //       token,
  //       user: {
  //         username: user.username,
  //         role: user.role
  //       }
  //     }));
  //     return true;
  //   } catch (error) {
  //     res.writeHead(500, { 'Content-Type': 'application/json' });
  //     res.end(JSON.stringify({ error: 'Internal server error' }));
  //     return true;
  //   }
  // }

  // Verify token endpoint
  // if (url === '/api/auth/verify' && method === 'GET') {
  //   const authReq = req as AuthRequest;
  //   if (!authMiddleware(authReq, res)) return true;

  //   res.writeHead(200, { 'Content-Type': 'application/json' });
  //   res.end(JSON.stringify({
  //     user: authReq.user
  //   }));
  //   return true;
  // }

  if (url === '/api/auth/verify' && method === 'GET') {
    const authReq = req as AuthRequest
    if (!(await authMiddleware(authReq, res))) return true

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ user: authReq.user }))
    return true
  }

  // Get all data (public)
  if (url === '/api/data' && method === 'GET') {
    try {
      const data = await fetchSupabaseData();
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
    const authReq = req as AuthRequest
    if (!(await requireAdmin(authReq, res))) return true

    try {
      const body = await parseBody(req);
      const newSchedule = body;

      // Validate schedule
      if (!newSchedule.month || !newSchedule.year || !newSchedule.date) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid schedule data' }));
        return true;
      }

      // Insert to Supabase
      const inserted = await insertSchedule(newSchedule);
      if (!inserted) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to insert schedule to Supabase' }));
        return true;
      }

      // Invalidate cache & update scheduler
      invalidateCache();
      await refreshSchedulerData();

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, schedule: inserted }));
      return true;
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal server error' }));
      return true;
    }
  }

  // Update schedule (admin only)
  if (url.startsWith('/api/schedules/') && method === 'PUT') {
    const authReq = req as AuthRequest
    if (!(await requireAdmin(authReq, res))) return true

    try {
      const scheduleId = url.split('/')[3];
      const body = await parseBody(req);
      const updates: Partial<Schedule> = body;

      // Update in Supabase
      const updated = await updateScheduleDB(scheduleId, updates);
      if (!updated) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to update schedule in Supabase' }));
        return true;
      }

      // Invalidate cache & update scheduler
      invalidateCache();
      await refreshSchedulerData();

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, schedule: updated }));
      return true;
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal server error' }));
      return true;
    }
  }

  // Delete schedule (admin only)
  if (url.startsWith('/api/schedules/') && method === 'DELETE') {
    const authReq = req as AuthRequest
    if (!(await requireAdmin(authReq, res))) return true

    try {
      const scheduleId = url.split('/')[3];

      // Delete from Supabase
      const success = await deleteScheduleDB(scheduleId);
      if (!success) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to delete schedule from Supabase' }));
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
  const gistData = await fetchSupabaseData();

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
