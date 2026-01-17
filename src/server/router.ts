import { IncomingMessage, ServerResponse } from 'node:http';
import { fetchSupabaseData, invalidateCache } from './supabaseService.js';
import { insertSchedule, updateSchedule as updateScheduleDB, deleteSchedule as deleteScheduleDB } from './supabaseUpdater.js';
import type { Schedule } from './supabaseService.js';
import { setSchedulesData } from '../services/scheduler.js';
import { authMiddleware, requireAdmin, type AuthRequest } from './auth.js';

interface MonthlySchedule {
  month: string;
  year: number;
  schedules: Array<{
    date: number;
    day: string;
    frontOffice: string;
    middleOffice: string;
    backOffice: string;
    notes?: string;
  }>;
  monthNotes: string[];
}

interface ScheduleInput {
  month?: string;
  year?: number;
  date?: number;
  day?: string;
  frontOffice?: string;
  middleOffice?: string;
  backOffice?: string;
  notes?: string;
}

// Helper to parse request body
async function parseBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

// Enable CORS
function setCORS(res: ServerResponse): void {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// JSON response helpers
function jsonResponse(res: ServerResponse, status: number, data: object): void {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function errorResponse(res: ServerResponse, status: number, message: string): void {
  jsonResponse(res, status, { error: message });
}

// Route handlers - return void since they always handle the request
function handleHealthCheck(res: ServerResponse): void {
  jsonResponse(res, 200, {
    status: 'ok',
    service: 'standby-scheduler',
    timestamp: new Date().toISOString()
  });
}

async function handleAuthVerify(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const authReq = req as AuthRequest;
  if (!(await authMiddleware(authReq, res))) return;

  jsonResponse(res, 200, { user: authReq.user });
}

async function handleGetData(res: ServerResponse): Promise<void> {
  try {
    const data = await fetchSupabaseData();
    jsonResponse(res, 200, data);
  } catch {
    errorResponse(res, 500, 'Failed to fetch data');
  }
}

async function handleCreateSchedule(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const authReq = req as AuthRequest;
  if (!(await requireAdmin(authReq, res))) return;

  try {
    const body = await parseBody(req) as ScheduleInput;

    if (!body.month || !body.year || !body.date) {
      errorResponse(res, 400, 'Invalid schedule data');
      return;
    }

    const inserted = await insertSchedule(body as Omit<Schedule, 'id'>);
    if (!inserted) {
      errorResponse(res, 500, 'Failed to insert schedule to Supabase');
      return;
    }

    invalidateCache();
    await refreshSchedulerData();

    jsonResponse(res, 201, { success: true, schedule: inserted });
  } catch {
    errorResponse(res, 500, 'Internal server error');
  }
}

async function handleUpdateSchedule(req: IncomingMessage, res: ServerResponse, scheduleId: string): Promise<void> {
  const authReq = req as AuthRequest;
  if (!(await requireAdmin(authReq, res))) return;

  try {
    const updates = await parseBody(req) as Partial<Schedule>;

    const updated = await updateScheduleDB(scheduleId, updates);
    if (!updated) {
      errorResponse(res, 500, 'Failed to update schedule in Supabase');
      return;
    }

    invalidateCache();
    await refreshSchedulerData();

    jsonResponse(res, 200, { success: true, schedule: updated });
  } catch {
    errorResponse(res, 500, 'Internal server error');
  }
}

async function handleDeleteSchedule(req: IncomingMessage, res: ServerResponse, scheduleId: string): Promise<void> {
  const authReq = req as AuthRequest;
  if (!(await requireAdmin(authReq, res))) return;

  try {
    const success = await deleteScheduleDB(scheduleId);
    if (!success) {
      errorResponse(res, 500, 'Failed to delete schedule from Supabase');
      return;
    }

    invalidateCache();
    await refreshSchedulerData();

    jsonResponse(res, 200, { success: true });
  } catch {
    errorResponse(res, 500, 'Internal server error');
  }
}

// Main request handler - returns true if handled, false if not
export async function handleRequest(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
  setCORS(res);

  const method = req.method ?? 'GET';
  const url = req.url ?? '';

  // Handle preflight
  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return true;
  }

  // Route matching
  if (url === '/health' || url === '/') {
    handleHealthCheck(res);
    return true;
  }

  if (url === '/api/auth/verify' && method === 'GET') {
    await handleAuthVerify(req, res);
    return true;
  }

  if (url === '/api/data' && method === 'GET') {
    await handleGetData(res);
    return true;
  }

  if (url === '/api/schedules' && method === 'POST') {
    await handleCreateSchedule(req, res);
    return true;
  }

  if (url.startsWith('/api/schedules/') && method === 'PUT') {
    const scheduleId = url.split('/')[3];
    await handleUpdateSchedule(req, res, scheduleId);
    return true;
  }

  if (url.startsWith('/api/schedules/') && method === 'DELETE') {
    const scheduleId = url.split('/')[3];
    await handleDeleteSchedule(req, res, scheduleId);
    return true;
  }

  return false;
}

async function refreshSchedulerData(): Promise<void> {
  const gistData = await fetchSupabaseData();

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
  }, {} as Record<string, MonthlySchedule>);

  const monthSchedulesArray = Object.values(monthlySchedules);
  setSchedulesData(monthSchedulesArray);

  console.log(`🔄 Scheduler data refreshed: ${gistData.schedules.length} schedules`);
}
