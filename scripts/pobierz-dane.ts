// Ręczne odświeżenie danych: `npm run dane`. Pobiera CSV PSP i zapisuje zwarty zbiór do repozytorium.
// Pobieramy po naszej stronie, bo przeglądarka nie dostanie CSV od PSP (CORS, ADR-0002).
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { zbudujZbior } from '../src/dane/zbior.ts';

const ZRODLO = 'https://gdziesieukryc.pl/PS_XML/punkty_schronienia.csv';
const CEL = fileURLToPath(new URL('../public/dane/punkty.json', import.meta.url));

console.log('Pobieram', ZRODLO);
const odp = await fetch(ZRODLO);
if (!odp.ok) throw new Error(`PSP odpowiedziało HTTP ${odp.status}`);
const lastModified = odp.headers.get('last-modified');
if (!lastModified) throw new Error('Brak nagłówka Last-Modified, nie znam daty stanu danych');

const zbior = zbudujZbior(await odp.text(), new Date(lastModified));
mkdirSync(dirname(CEL), { recursive: true });
writeFileSync(CEL, JSON.stringify(zbior));
console.log(`Zapisano ${zbior.id.length} punktów schronienia, stan z ${zbior.stan} → ${CEL}`);
