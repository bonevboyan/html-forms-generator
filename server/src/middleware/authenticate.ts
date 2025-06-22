import { Request, Response, NextFunction } from 'express';
import supabase from '../supabaseClient';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export async function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const auth = req.headers['authorization'];
  if (!auth) return res.status(401).json({ error: 'No token' });
  const token = auth.replace('Bearer ', '');
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return res.status(401).json({ error: 'Invalid token' });
  req.user = data.user;
  next();
} 