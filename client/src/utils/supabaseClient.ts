import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// In a real app, these would be environment variables
const supabaseUrl = 'https://udvwfalfqfaerjjlxfaf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkdndmYWxmcWZhZXJqamx4ZmFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMTI1ODcsImV4cCI6MjA1Nzc4ODU4N30.VqGAcvOnSu7jEenD0APJimHAoG1H_wMLk2HAam9VJQ4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);