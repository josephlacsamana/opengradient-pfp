const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;
const STATIC_DIR = __dirname;

// Load .env if present (local dev)
try { require('fs').readFileSync('.env', 'utf8').split('\n').forEach(line => { const [k, v] = line.split('='); if (k && v) process.env[k.trim()] = v.trim(); }); } catch (_) {}

const REPLICATE_TOKEN = process.env.REPLICATE_TOKEN || '';

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.json': 'application/json',
};

const server = http.createServer((req, res) => {
  // Proxy Replicate API calls to avoid CORS
  if (req.url.startsWith('/replicate/')) {
    const replicatePath = req.url.replace('/replicate', '');
    let body = '';

    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const options = {
        hostname: 'api.replicate.com',
        path: replicatePath,
        method: req.method,
        headers: {
          'Authorization': 'Bearer ' + REPLICATE_TOKEN,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body)
        }
      };

      const proxyReq = https.request(options, proxyRes => {
        res.writeHead(proxyRes.statusCode, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        proxyRes.pipe(res);
      });

      proxyReq.on('error', err => {
        res.writeHead(500);
        res.end(JSON.stringify({ error: err.message }));
      });

      if (body) proxyReq.write(body);
      proxyReq.end();
    });
    return;
  }

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*' });
    res.end();
    return;
  }

  // Serve static files
  let filePath = path.join(STATIC_DIR, req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'text/plain' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`OG PFP Generator running at http://localhost:${PORT}`);
});
