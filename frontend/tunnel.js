import localtunnel from 'localtunnel';
import fs from 'fs';

(async () => {
  try {
    const tunnel = await localtunnel({ port: 5173 });
    console.log('PUBLIC_URL:' + tunnel.url);
    fs.writeFileSync('public_url.txt', tunnel.url);
  } catch (err) {
    console.error('Tunnel error:', err);
  }
})();
