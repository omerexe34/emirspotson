import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://azgdzhgxwdofldrwthze.supabase.co';
const supabaseAnonKey = 'sb_publishable_j9BfwYV6tvSOXfCYP7pvWw_BHxNDors';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
