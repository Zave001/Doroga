// One-off build script: turns raw Overpass output into a compact per-name dataset
// consumed by the app as public/data/osm-streets.json. Not part of the app runtime.
import { readFileSync, writeFileSync } from 'node:fs';

const raw = JSON.parse(readFileSync('scripts/overpass-raw.json', 'utf8'));

function normalize(name) {
  return name
    .toLowerCase()
    .replace(/ё/g, 'е') // ё -> е
    .replace(/[«»"'.]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const byName = new Map();

for (const el of raw.elements) {
  const name = el.tags && el.tags.name;
  if (!name) continue;
  const key = normalize(name);

  let entry = byName.get(key);
  if (!entry) {
    entry = {
      name,
      kind: el.type === 'way' ? 'way' : 'place',
      place: el.tags.place || null,
      segments: [],
      minLat: Infinity,
      minLon: Infinity,
      maxLat: -Infinity,
      maxLon: -Infinity,
    };
    byName.set(key, entry);
  }

  if (el.type === 'way' && Array.isArray(el.geometry)) {
    const coords = el.geometry.filter(Boolean).map((p) => [p.lat, p.lon]);
    if (coords.length) {
      entry.segments.push(coords);
      for (const [lat, lon] of coords) {
        if (lat < entry.minLat) entry.minLat = lat;
        if (lon < entry.minLon) entry.minLon = lon;
        if (lat > entry.maxLat) entry.maxLat = lat;
        if (lon > entry.maxLon) entry.maxLon = lon;
      }
    }
  } else if (el.type === 'node') {
    entry.segments.push([[el.lat, el.lon]]);
    entry.minLat = Math.min(entry.minLat, el.lat);
    entry.maxLat = Math.max(entry.maxLat, el.lat);
    entry.minLon = Math.min(entry.minLon, el.lon);
    entry.maxLon = Math.max(entry.maxLon, el.lon);
  } else if (el.type === 'relation' && Array.isArray(el.members)) {
    for (const m of el.members) {
      if (Array.isArray(m.geometry)) {
        const coords = m.geometry.filter(Boolean).map((p) => [p.lat, p.lon]);
        if (coords.length) {
          entry.segments.push(coords);
          for (const [lat, lon] of coords) {
            entry.minLat = Math.min(entry.minLat, lat);
            entry.maxLat = Math.max(entry.maxLat, lat);
            entry.minLon = Math.min(entry.minLon, lon);
            entry.maxLon = Math.max(entry.maxLon, lon);
          }
        }
      }
    }
  }
}

const out = {};
for (const [key, entry] of byName) {
  if (!entry.segments.length) continue;
  out[key] = {
    name: entry.name,
    kind: entry.kind,
    place: entry.place,
    center: [(entry.minLat + entry.maxLat) / 2, (entry.minLon + entry.maxLon) / 2],
    bounds: [
      [entry.minLat, entry.minLon],
      [entry.maxLat, entry.maxLon],
    ],
    segments: entry.segments,
  };
}

writeFileSync('public/data/osm-streets.json', JSON.stringify(out));
console.log('unique names:', Object.keys(out).length);
console.log('raw elements:', raw.elements.length);
