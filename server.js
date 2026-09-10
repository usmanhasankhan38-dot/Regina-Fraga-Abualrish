const http = require('http');
const fs = require('fs');
const path = require('path');

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff'
};

function requestHandler(req, res) {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  let filePath = path.join(__dirname, reqPath);

  // Clean URL resolution (e.g. /properties -> /properties.html)
  if (!path.extname(filePath)) {
    if (fs.existsSync(filePath + '.html')) {
      filePath = filePath + '.html';
    } else if (fs.existsSync(path.join(filePath, 'index.html'))) {
      filePath = path.join(filePath, 'index.html');
    }
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
        res.end(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <title>404 - Page Not Found</title>
            <style>
              body { font-family: sans-serif; background: #FAF7F2; color: #141210; text-align: center; padding: 100px 20px; }
              h1 { font-size: 3rem; margin-bottom: 12px; }
              a { color: #8C6430; text-decoration: none; font-weight: bold; }
            </style>
          </head>
          <body>
            <h1>404</h1>
            <p>The requested page was not found.</p>
            <p><a href="/index.html">← Return to Homepage</a></p>
          </body>
          </html>
        `, 'utf-8');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=UTF-8' });
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache'
      });
      res.end(content);
    }
  });
}

// When executed directly via `node server.js`
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  const server = http.createServer(requestHandler);
  server.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(` Regina Fraga Abualrish Luxury Real Estate`);
    console.log(` Local Server: http://localhost:${PORT}`);
    console.log(` Press Ctrl+C to stop the server`);
    console.log(`======================================================\n`);
  });
} else {
  // Support serverless export if ever imported
  module.exports = requestHandler;
}
