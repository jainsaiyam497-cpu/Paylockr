import { createClient } from '@supabase/supabase-js';

// ------------------------------------------------------------------
// Configured based on environment variables with fallback
// ------------------------------------------------------------------

const getEnv = (key: string) => {
  // Check for Vite's import.meta.env
  if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
    return (import.meta as any).env[key];
  }
  // Check for Node's process.env safely
  try {
    if (typeof process !== 'undefined' && process.env) {
      return process.env[key];
    }
  } catch (e) {
    // Ignore error if process is not defined
  }
  return '';
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

// ------------------------------------------------------------------

let client;

// Mock client factory for fallback mode
const createMockClient = () => ({
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: ({ email, password }: any) => {
       // Simulate basic validation for demo
       if(email === 'demo@paylockr.com' && password === 'PayLockr@123') {
           return Promise.resolve({ 
               data: { session: { user: { id: 'demo-user', email, user_metadata: { name: 'Demo User' } } } }, 
               error: null 
           });
       }
       return Promise.resolve({ data: { session: null }, error: { message: "Invalid credentials (Mock)" } });
    },
    signUp: () => Promise.resolve({ data: { session: null }, error: { message: "Signup disabled in demo mode" } }),
    signInWithOAuth: () => Promise.resolve({ data: null, error: { message: "OAuth disabled in demo mode" } }),
    signOut: () => Promise.resolve({ error: null })
  }
});

try {
  const url = supabaseUrl ? supabaseUrl.trim() : '';
  const key = supabaseAnonKey ? supabaseAnonKey.trim() : '';

  if (!url || !url.startsWith('http')) {
    console.warn('Supabase URL missing or invalid. Falling back to mock client. Check your .env file or rely on demo mode.');
    client = createMockClient();
  } else {
    // Attempt to create real client
    client = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
  }

} catch (error) {
  console.error('Supabase Client Initialization Error:', error);
  client = createMockClient();
}

export const supabase = client;