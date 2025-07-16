import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jfvwhbjtjxigdqtefbtd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmdndoYmp0anhpZ2RxdGVmYnRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MDI5MDcsImV4cCI6MjA2NzI3ODkwN30.7kl8A_LYkU6O9leCrkmyDAi99Wv4ZxtEW6esGeG2-uw';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
