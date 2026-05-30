import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sslbjygjvjkodcmrnfzn.supabase.co';
const supabaseKey = 'sb_publishable_fsAo4sFW9RH9u0afG-qY_g_-ljg5an0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpload() {
  const { data, error } = await supabase.storage
    .from('this-bucket-does-not-exist')
    .upload('test.txt', 'hello world');
  
  console.log('Error:', error);
  console.log('Data:', data);
}

testUpload();
