import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dherazmmzauqypchftib.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoZXJhem1temF1cXlwY2hmdGliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NjYzNDAsImV4cCI6MjA3ODU0MjM0MH0.zdJi0_iPMtGwzAAOYxbRp6hxU2z8XpDvSN1cpnUJjHs';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key are required.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
