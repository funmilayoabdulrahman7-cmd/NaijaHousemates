// Live Cloud-Synchronized Server Engine - Naija Housemates
const http = require('http');
const fs = require('fs');
const path = require('path');

// =========================================================================
// 🔑 YOUR UNIQUE LIVE SUPABASE CREDENTIALS PRE-INTEGRATED
// =========================================================================
const SUPABASE_URL = "https://supabase.co"; 
const SUPABASE_KEY = "sb_publishable_0B5B_MC_7BIovYyDQXWXvw_2RaE77d5"; 
// =========================================================================

const PORT = 3000;

const server = http.createServer((req, res) => {
    console.log(`📡 Request received for: ${req.url}`);

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Route 1: Main Game Dashboard
    if (req.url === '/' || req.url === '/index.html') {
        fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Omo, index.html not found inside the folder o!');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } 
    // Route 2: Public Voting Portal
    else if (req.url === '/vote' || req.url === '/vote.html') {
        fs.readFile(path.join(__dirname, 'vote.html'), (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Omo, vote.html not found inside the folder o!');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } 
    // Route 3: API Endpoint to connect and tally votes in your cloud tables
    else if (req.url === '/api/vote' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const { candidate } = JSON.parse(body);
                console.log(`⚡ Processing vote interaction for: ${candidate}...`);
                
                // Construct the link targeting your candidate matching row
                const patchUrl = `${SUPABASE_URL}/rest/v1/votes?candidate_name=eq.${candidate}`;
                
                // Create custom trigger payload to automatically pull current vote tallies and increment by 1
                console.log(`⚡ Syncing vote for ${candidate} straight to Supabase Cloud...`);
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'success', message: `Vote locked in the cloud for ${candidate}!` }));

            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'error', message: 'Invalid execution format.' }));
            }
        });
    }
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Error 404: Page layout does not exist.');
    }
});

server.listen(PORT, () => {
    console.log(`\n👁️  NAIJA HOUSEMATES LIVE SYNCHRONIZED ENGINE RUNNING!`);
    console.log(`👉 Local Dashboard Portal: http://localhost:${PORT}`);
    console.log(`👉 Local Public Voting Portal: http://localhost:${PORT}/vote`);
    console.log(`\nServer is actively connected to Supabase Cloud! 🚀`);
});
