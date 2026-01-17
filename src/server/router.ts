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

// Route handlers
function handleHealthCheck(res: ServerResponse): boolean {
  jsonResponse(res, 200, {
    status: 'ok',
    service: 'standby-scheduler',
    timestamp: new Date().toISOString()
  });
  return true;
}

async function handleAuthVerify(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
  const authReq = req as AuthRequest;
  if (!(await authMiddleware(authReq, res))) return true;

  jsonResponse(res, 200, { user: authReq.user });
  return true;
}

async function handleGetData(res: ServerResponse): Promise<boolean> {
  try {
    const data = await fetchSupabaseData();
    jsonResponse(res, 200, data);
  } catch {
    errorResponse(res, 500, 'Failed to fetch data');
  }
  return true;
}

async function handleCreateSchedule(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
  const authReq = req as AuthRequest;
  if (!(await requireAdmin(authReq, res))) return true;

  try {
    const body = await parseBody(req) as ScheduleInput;

    if (!body.month || !body.year || !body.date) {
      errorResponse(res, 400, 'Invalid schedule data');
      return true;
    }

    const inserted = await insertSchedule(body as Omit<Schedule, 'id'>);
    if (!inserted) {
      errorResponse(res, 500, 'Failed to insert schedule to Supabase');
      return true;
    }

    invalidateCache();
    await refreshSchedulerData();

    jsonResponse(res, 201, { success: true, schedule: inserted });
  } catch {
    errorResponse(res, 500, 'Internal server error');
  }
  return true;
}

async function handleUpdateSchedule(req: IncomingMessage, res: ServerResponse, scheduleId: string): Promise<boolean> {
  const authReq = req as AuthRequest;
  if (!(await requireAdmin(authReq, res))) return true;

  try {
    const updates = await parseBody(req) as Partial<Schedule>;

    const updated = await updateScheduleDB(scheduleId, updates);
    if (!updated) {
      errorResponse(res, 500, 'Failed to update schedule in Supabase');
      return true;
    }

    invalidateCache();
    await refreshSchedulerData();

    jsonResponse(res, 200, { success: true, schedule: updated });
  } catch {
    errorResponse(res, 500, 'Internal server error');
  }
  return true;
}

async function handleDeleteSchedule(req: IncomingMessage, res: ServerResponse, scheduleId: string): Promise<boolean> {
  const authReq = req as AuthRequest;
  if (!(await requireAdmin(authReq, res))) return true;

  try {
    const success = await deleteScheduleDB(scheduleId);
    if (!success) {
      errorResponse(res, 500, 'Failed to delete schedule from Supabase');
      return true;
    }

    invalidateCache();
    await refreshSchedulerData();

    jsonResponse(res, 200, { success: true });
  } catch {
    errorResponse(res, 500, 'Internal server error');
  }
  return true;
}

// Main request handler
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
    return handleHealthCheck(res);
  }

  if (url === '/api/auth/verify' && method === 'GET') {
    return handleAuthVerify(req, res);
  }

  if (url === '/api/data' && method === 'GET') {
    return handleGetData(res);
  }

  if (url === '/api/schedules' && method === 'POST') {
    return handleCreateSchedule(req, res);
  }

  if (url.startsWith('/api/schedules/') && method === 'PUT') {
    const scheduleId = url.split('/')[3];
    return handleUpdateSchedule(req, res, scheduleId);
  }

  if (url.startsWith('/api/schedules/') && method === 'DELETE') {
    const scheduleId = url.split('/')[3];
    return handleDeleteSchedule(req, res, scheduleId);
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
