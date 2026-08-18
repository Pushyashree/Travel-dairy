/* ============================================================
   Travel Diary — backend server
   ------------------------------------------------------------
   What this file does:
     1. Serves the website (the /public folder) to the browser.
     2. Gives the page the Google Maps browser key (/api/config).
     3. Looks up travel times by mode via Google Routes API (/api/routes).
     4. Saves each finished diary to disk (/api/submit).
     5. Lets you download all responses (/api/export).
   Run it with:  npm start   (then open http://localhost:3000)
   ============================================================ */

require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const BROWSER_KEY = process.env.GOOGLE_MAPS_BROWSER_KEY || '';
const SERVER_KEY = process.env.GOOGLE_MAPS_SERVER_KEY || BROWSER_KEY;

const DATA_DIR = path.join(__dirname, 'data');
const STORE = path.join(DATA_DIR, 'responses.jsonl'); // one JSON line per respondent
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

/* --- 1. give the page its (public) map key --- */
app.get('/api/config', (req, res) => {
  res.json({ mapsKey: BROWSER_KEY });
});

/* --- 2. travel times by mode (Google Routes API), kept server-side --- */
async function routeMinutes(origin, dest, mode) {
  const body = {
    origin: { location: { latLng: { latitude: origin.lat, longitude: origin.lng } } },
    destination: { location: { latLng: { latitude: dest.lat, longitude: dest.lng } } },
    travelMode: mode
  };
  if (mode === 'DRIVE') body.routingPreference = 'TRAFFIC_AWARE';
  if (mode === 'TRANSIT') body.departureTime = new Date(Date.now() + 60 * 1000).toISOString();
  try {
    const r = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': SERVER_KEY,
        'X-Goog-FieldMask': 'routes.duration'
      },
      body: JSON.stringify(body)
    });
    const j = await r.json();
    if (j.routes && j.routes[0] && j.routes[0].duration) {
      return Math.round(parseInt(j.routes[0].duration, 10) / 60); // seconds -> minutes
    }
    return null;
  } catch (e) {
    return null;
  }
}

app.post('/api/routes', async (req, res) => {
  const { origin, destination } = req.body || {};
  if (!origin || !destination) return res.status(400).json({ error: 'origin and destination required' });
  const [drive, transit, bicycle, walk] = await Promise.all([
    routeMinutes(origin, destination, 'DRIVE'),
    routeMinutes(origin, destination, 'TRANSIT'),
    routeMinutes(origin, destination, 'BICYCLE'),
    routeMinutes(origin, destination, 'WALK')
  ]);
  res.json({ drive, transit, bicycle, walk });
});

/* --- 3. save a finished diary --- */
app.post('/api/submit', (req, res) => {
  const record = {
    id: 'r_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
    submitted_at: new Date().toISOString(),
    data: req.body
  };
  fs.appendFile(STORE, JSON.stringify(record) + '\n', (err) => {
    if (err) return res.status(500).json({ error: 'could not save' });
    res.json({ ok: true, id: record.id });
  });
});

/* --- 4. download everything (for you, the researcher) --- */
app.get('/api/export', (req, res) => {
  let lines = [];
  try { lines = fs.readFileSync(STORE, 'utf8').trim().split('\n').filter(Boolean); } catch (e) {}
  const rows = lines.map((l) => { try { return JSON.parse(l); } catch (e) { return null; } }).filter(Boolean);
  if (req.query.format === 'csv') {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="responses.csv"');
    return res.send(toCsv(rows));
  }
  res.json(rows);
});

function toCsv(rows) {
  const out = [['id', 'submitted_at', 'occupation', 'purpose', 'main_mode', 'mode_sequence',
    'leave_home', 'back_home', 'time_away_min', 'frequency', 'dest_label', 'dest_lat', 'dest_lng',
    'home_label', 'home_lat', 'home_lng', 'stops', 'drive_min', 'transit_min', 'bicycle_min', 'walk_min'].join(',')];
  rows.forEach((r) => {
    const d = r.data || {};
    const home = d.home || {};
    const trips = d.trips || {};
    Object.keys(trips).forEach((pk) => {
      const t = trips[pk];
      const tt = t.travel_times || {};
      out.push([
        r.id, r.submitted_at, d.occupation || '', pk, t.main_mode || '',
        '"' + (t.mode_sequence || []).join(' > ') + '"',
        t.leave_home || '', t.back_home || '', t.time_away_min == null ? '' : t.time_away_min,
        '"' + (t.frequency || '') + '"',
        '"' + ((t.destination && t.destination.label) || '') + '"',
        (t.destination && t.destination.lat) || '', (t.destination && t.destination.lng) || '',
        '"' + (home.label || '') + '"', home.lat || '', home.lng || '',
        '"' + (t.intermediate_stops || []).join('; ') + '"',
        tt.drive == null ? '' : tt.drive, tt.transit == null ? '' : tt.transit,
        tt.bicycle == null ? '' : tt.bicycle, tt.walk == null ? '' : tt.walk
      ].join(','));
    });
  });
  return out.join('\n');
}

app.listen(PORT, () => {
  console.log('Travel Diary running →  http://localhost:' + PORT);
  if (!BROWSER_KEY) console.log('⚠  No GOOGLE_MAPS_BROWSER_KEY set yet — copy .env.example to .env and add your key.');
});
