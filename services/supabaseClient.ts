import { createClient } from '@supabase/supabase-js';

// ------------------------------------------------------------------
// Configured based on provided credentials
// ------------------------------------------------------------------

const supabaseUrl = 'https://eerklvxcvpxkkkcbydxt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlcmtsdnhjdnB4a2trY2J5ZHh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzODkwMTAsImV4cCI6MjA4NTk2NTAxMH0.B6AIOz3tnA39ZkoxmkWfGvIGlGJmmfkggUDWJKipAJw';

// ------------------------------------------------------------------

let client;

// Mock client factory for fallback mode
const createMockClient = () => ({
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: ({ email, password }) => {
       // Simulate basic validation for demo
       if(email === 'demo@paylockr.com' && password === 'PayLockr@123') {
           return Promise.resolve({ 
               data: { session: { user: { id: 'demo-user', email } } }, 
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
    console.warn('Invalid Supabase URL provided. Falling back to mock client.');
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
  console.error('Supabase Client Error:', error);
  client = createMockClient();
}

export const supabase = client;