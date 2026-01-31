import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wdttymfqxxrdhkxvtloj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkdHR5bWZxeHhyZGhreHZ0bG9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4MTgyNDcsImV4cCI6MjA4NTM5NDI0N30.VhCHI9n5TXutxwBieUKtLWgGoueL2Ab6i9MMeZzBGsk';

export const supabase = createClient(supabaseUrl, supabaseKey);
