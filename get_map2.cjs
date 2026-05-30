const https = require('https');

https.get('https://maps.app.goo.gl/rrzWC2fHYUt7Erb17', (res) => {
  console.log('Location:', res.headers.location);
});
