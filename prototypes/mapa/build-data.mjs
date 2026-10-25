// PROTOTYP: pobiera CSV PSP i zamienia go na zwarty JSON dla mapy.
// Dane bez poprawek (ADR-0002). Wynik: public/punkty.json (gitignored).
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const cacheDir = join(here, '.cache');
const csvPath = join(cacheDir, 'punkty_schronienia.csv');
const outPath = join(here, 'public', 'punkty.json');
const URL = 'https://gdziesieukryc.pl/PS_XML/punkty_schronienia.csv';

if (existsSync(outPath)) {
  console.log('punkty.json już jest, pomijam (usuń, żeby odświeżyć)');
  process.exit(0);
}

if (!existsSync(csvPath)) {
  console.log('Pobieram', URL);
  const res = await fetch(URL);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  mkdirSync(cacheDir, { recursive: true });
  writeFileSync(csvPath, Buffer.from(await res.arrayBuffer()));
  writeFileSync(join(cacheDir, 'last-modified.txt'), res.headers.get('last-modified') ?? '');
}

function parseCsv(text) {
  const rows = [];
  let row = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field.replace(/\r$/, '')); rows.push(row); row = []; field = ''; }
    else field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows;
}

const [header, ...rows] = parseCsv(readFileSync(csvPath, 'utf8').replace(/^﻿/, ''));
const col = (name) => header.indexOf(name);
const DOSTEPNOSC = { 'Całodobowa': 0, 'Określone godziny': 1, 'Na żądanie': 2 };

// Kolumnowy format: krótszy niż GeoJSON, mapa składa go w przeglądarce.
const out = { id: [], lat: [], lng: [], adres: [], gmina: [], d: [] };
for (const r of rows) {
  if (r.length < header.length) continue;
  out.id.push(r[col('Identyfikator publiczny')]);
  out.lat.push(+(+r[col('Szerokosc geograficzna')]).toFixed(6));
  out.lng.push(+(+r[col('Dlugosc geograficzna')]).toFixed(6));
  out.adres.push(r[col('Adres')]);
  out.gmina.push(`${r[col('Gmina')]}, ${r[col('Wojewodztwo')]}`);
  out.d.push(DOSTEPNOSC[r[col('Dostepnosc')]] ?? 2);
}
const lastModified = existsSync(join(cacheDir, 'last-modified.txt'))
  ? readFileSync(join(cacheDir, 'last-modified.txt'), 'utf8') : '';
out.stan = lastModified ? new Date(lastModified).toISOString().slice(0, 10) : null;

writeFileSync(outPath, JSON.stringify(out));
console.log(`Zapisano ${out.id.length} punktów → ${outPath}`);
