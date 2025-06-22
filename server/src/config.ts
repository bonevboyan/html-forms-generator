import dotenv from 'dotenv';
dotenv.config();

export const SUPABASE_URL = process.env.SUPABASE_PROJECT_URL || '';
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
export const PORT = process.env.PORT || 3001;
export const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING || ''; 