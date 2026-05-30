const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://sslbjygjvjkodcmrnfzn.supabase.co';
const supabaseKey = 'sb_publishable_fsAo4sFW9RH9u0afG-qY_g_-ljg5an0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  const { data, error } = await supabase.from('products').select('*');
  if (error) {
    console.error('Error fetching:', error);
  } else {
    console.log('Products:', JSON.stringify(data, null, 2));
  }
}

checkData();
