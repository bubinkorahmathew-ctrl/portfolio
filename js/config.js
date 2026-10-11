// Supabase Configuration
// Replace these with your actual Supabase Project URL and Anon Key
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// Initialize the Supabase client (only once real credentials are set — createClient throws on the placeholder URL)
// We use window.supabase to distinguish between the library and our client instance
const supabaseClient = (typeof window !== 'undefined' && window.supabase && SUPABASE_URL.startsWith('http'))
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;
