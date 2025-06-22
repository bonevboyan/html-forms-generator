import { Router, Request, Response } from 'express';
import supabase from '../supabaseClient';

const router = Router();

// Auth endpoints (handled by Supabase client on frontend)
router.post('/signup', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

export default router; 