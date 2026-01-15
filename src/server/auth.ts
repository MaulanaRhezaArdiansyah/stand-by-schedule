import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { IncomingMessage, ServerResponse } from 'http';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
const JWT_EXPIRES_IN = '7d'; // 7 days

// Simple in-memory user store (in production, use database)
interface User {
  username: string;
  password: string; // hashed
  role: 'admin' | 'viewer';
}

const users: User[] = [
  {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10),
    role: 'admin'
  }
];

export interface AuthRequest extends IncomingMessage {
  user?: {
    username: string;
    role: string;
  };
}

export function generateToken(username: string, role: string): string {
  return jwt.sign({ username, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): { username: string; role: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { username: string; role: string };
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function authenticateUser(username: string, password: string): Promise<User | null> {
  const user = users.find(u => u.username === username);
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  return user;
}

export function authMiddleware(req: AuthRequest, res: ServerResponse): boolean {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Unauthorized - No token provided' }));
    return false;
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix
  const decoded = verifyToken(token);

  if (!decoded) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Unauthorized - Invalid token' }));
    return false;
  }

  req.user = decoded;
  return true;
}

export function requireAdmin(req: AuthRequest, res: ServerResponse): boolean {
  if (!authMiddleware(req, res)) return false;

  if (req.user?.role !== 'admin') {
    res.writeHead(403, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Forbidden - Admin access required' }));
    return false;
  }

  return true;
}
