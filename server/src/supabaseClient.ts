import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from './config';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
export default supabase; 