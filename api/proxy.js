const https = require('https');

module.exports = async function handler(req, res) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    return res.status(204).end();
  }

  // Extract the Replicate API path from query param (set by vercel.json rewrite)
  const replicatePath = req.query.replicatePath || req.url.replace(/^\/api\/proxy\??.*/, '');
  if (!replicatePath) {
    return res.status(400).json({ error: 'Missing replicatePath' });
  }

  const token = process.env.REPLICATE_TOKEN || '';
  const body = req.method !== 'GET' ? JSON.stringify(req.body) : '';

  return new Promise((resolve) => {
    const options = {
      hostname: 'api.replicate.com',
      path: replicatePath,
      method: req.method,
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      }
    };
    if (body) options.headers['Content-Length'] = Buffer.byteLength(body);

    const proxyReq = https.request(options, proxyRes => {
      let data = '';
      proxyRes.on('data', chunk => data += chunk);
      proxyRes.on('end', () => {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(proxyRes.statusCode).send(data);
        resolve();
      });
    });

    proxyReq.on('error', err => {
      res.status(500).json({ error: err.message });
      resolve();
    });

    if (body) proxyReq.write(body);
    proxyReq.end();
  });
};
