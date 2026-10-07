const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const PAGES = {
  '/': 'index.html',
  '/index.html': 'index.html',
  '/vote': 'vote.html',
  '/vote.html': 'vote.html',
  '/join': 'join.html',
  '/join.html': 'join.html'
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

  const route = req.url.split('?')[0];
  const file = PAGES[route];

  if (file) {
    fs.readFile(path.join(__dirname, file), (err, data) => {
      if (err) { res.writeHead(500); res.end(file + ' not found'); }
      else { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(data); }
    });
  } else {
    res.writeHead(404);
    res.end('Page not found');
  }
});

server.listen(PORT, () => {
  console.log(`NAIJA HOUSEMATES CORE RUNNING ON PORT ${PORT}`);
});