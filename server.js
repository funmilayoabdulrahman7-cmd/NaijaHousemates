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
  '/join.html': 'join.html',
  '/qualify': 'qualify.html',
  '/qualify.html': 'qualify.html'
};

const META = {
  'index.html': ['Naija Housemates 🏠', 'The Naija reality game. Join the house, win votes, survive eviction and fight for a spot. Play free!'],
  'join.html': ['Audition for Naija Housemates 🎤', 'Submit your pitch, get fans to vote for you and fight for one of 20 house spots.'],
  'vote.html': ['Fan Eviction Vote 🗳️', 'Who should leave the house this week? Cast your vote now.'],
  'qualify.html': ['Audition Standings 🏆', 'See who is leading the race for this week house spots.']
};

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

  const route = req.url.split('?')[0];

  if (route === '/preview.png') {
    fs.readFile(path.join(__dirname, 'preview.png'), (err, img) => {
      if (err) { res.writeHead(404); res.end('Image not found'); return; }
      res.writeHead(200, { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400' });
      res.end(img);
    });
    return;
  }

  const file = PAGES[route];

  if (file) {
    fs.readFile(path.join(__dirname, file), 'utf8', (err, html) => {
      if (err) { res.writeHead(500); res.end(file + ' not found'); return; }
      const m = META[file];
      if (m) {
        const proto = req.headers['x-forwarded-proto'] || 'https';
        const origin = proto + '://' + (req.headers.host || '');
        const url = origin + route;
        const image = origin + '/preview.png';
        const tags =
          '<meta name="description" content="' + esc(m[1]) + '">' +
          '<meta property="og:site_name" content="Naija Housemates">' +
          '<meta property="og:type" content="website">' +
          '<meta property="og:title" content="' + esc(m[0]) + '">' +
          '<meta property="og:description" content="' + esc(m[1]) + '">' +
          '<meta property="og:url" content="' + esc(url) + '">' +
          '<meta property="og:image" content="' + esc(image) + '">' +
          '<meta property="og:image:width" content="1200">' +
          '<meta property="og:image:height" content="630">' +
          '<meta name="twitter:card" content="summary_large_image">' +
          '<meta name="twitter:title" content="' + esc(m[0]) + '">' +
          '<meta name="twitter:description" content="' + esc(m[1]) + '">' +
          '<meta name="twitter:image" content="' + esc(image) + '">';
        html = html.replace('</head>', tags + '</head>');
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    });
  } else {
    res.writeHead(404);
    res.end('Page not found');
  }
});

server.listen(PORT, () => {
  console.log(`NAIJA HOUSEMATES CORE RUNNING ON PORT ${PORT}`);
});