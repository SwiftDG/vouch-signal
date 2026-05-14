const https = require('https');

https.get('https://rasgzwsyjpqlfochqbll.supabase.co/auth/v1/keys', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Raw response:', data);
  });
}).on('error', (e) => {
  console.log('❌ Failed to fetch:', e.message);
});
