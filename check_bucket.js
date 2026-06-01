import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sslbjygjvjkodcmrnfzn.supabase.co';
const supabaseKey = 'sb_publishable_fsAo4sFW9RH9u0afG-qY_g_-ljg5an0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testBucket() {
  const { data, error } = await supabase.storage.getBucket('product-images');
  console.log('Bucket Error:', error);
  console.log('Bucket Data:', data);
}

testBucket();
