import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase environment variables are missing. Please add them to your .env.local file.");
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(
    supabaseUrl || 'https://sixgdsqjesrhllfhvvnn.supabase.co',
    supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpeGdkc3FqZXNyaGxsZmh2dm5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg3ODM2MDcsImV4cCI6MjEwNDM1OTYwN30.M-NpJXPRDQiZNfBmyc7KXu9dSXVRz54dNPDnwsTL1B8'
);
