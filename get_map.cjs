const https = require('https');

https.get('https://share.google/8G47FSFoMBYfNfSJe', (res) => {
  console.log(res.headers.location);
});
