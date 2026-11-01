// Moduł danych: zbiór PSP „Punkty schronienia w Polsce” bez zależności od UI.
// Dane bez poprawek (ADR-0002): rekordy zastępcze, odstające i duplikaty zostają.
import type { FeatureCollection, Point } from 'geojson';
import { t } from '../teksty.ts';

export type Dostepnosc = 0 | 1 | 2; // 0 = Całodobowa, 1 = Określone godziny, 2 = Na żądanie

// Kolumnowy zapis zbioru: krótszy niż GeoJSON, mapa składa go w przeglądarce.
export type ZwartyZbior = {
  stan: string; // ISO data stanu (z Last-Modified CSV PSP)
  id: string[]; // Identyfikator publiczny (OZO-…), stabilny klucz
  lat: number[];
  lng: number[];
  adres: string[];
  gmina: string[];
  d: Dostepnosc[];
};

export type Punkt = { id: string; lat: number; lng: number; adres: string; gmina: string; d: Dostepnosc };

const DOSTEPNOSC_Z_CSV = new Map<string, Dostepnosc>([['Całodobowa', 0], ['Określone godziny', 1], ['Na żądanie', 2]]);

const KOLUMNY = {
  id: 'Identyfikator publiczny',
  lat: 'Szerokosc geograficzna',
  lng: 'Dlugosc geograficzna',
  adres: 'Adres',
  gmina: 'Gmina',
  d: 'Dostepnosc',
} as const;

// Buduje zwarty zbiór z tekstu CSV PSP. Zmiana formatu PSP kończy się błędem, a nie cichym pominięciem.
export function zbudujZbior(csv: string, stan: Date): ZwartyZbior {
  const [naglowek, ...wiersze] = parsujCsv(csv);
  const kol = {} as Record<keyof typeof KOLUMNY, number>;
  for (const [klucz, nazwa] of Object.entries(KOLUMNY) as [keyof typeof KOLUMNY, string][]) {
    kol[klucz] = naglowek.indexOf(nazwa);
    if (kol[klucz] < 0) throw new Error(`Brak kolumny „${nazwa}” w CSV PSP`);
  }

  const zbior: ZwartyZbior = { stan: dzienWPolsce(stan), id: [], lat: [], lng: [], adres: [], gmina: [], d: [] };
  wiersze.forEach((w, i) => {
    const d = DOSTEPNOSC_Z_CSV.get(w[kol.d]);
    // Wiersz liczony jak w pliku: nagłówek to wiersz 1.
    const gdzie = `w wierszu ${i + 2} (${w[kol.id]})`;
    if (d === undefined) throw new Error(`Nieznana Dostępność „${w[kol.d]}” ${gdzie}`);
    const wspolrzedna = (wartosc = '') => {
      const liczba = Number(wartosc);
      if (wartosc.trim() === '' || !Number.isFinite(liczba)) throw new Error(`Zła współrzędna „${wartosc}” ${gdzie}`);
      return zaokraglij(liczba);
    };
    zbior.id.push(w[kol.id]);
    zbior.lat.push(wspolrzedna(w[kol.lat]));
    zbior.lng.push(wspolrzedna(w[kol.lng]));
    zbior.adres.push(w[kol.adres]);
    zbior.gmina.push(w[kol.gmina]);
    zbior.d.push(d);
  });
  return zbior;
}

export function odczytajZbior(zbior: ZwartyZbior) {
  const punkty: Punkt[] = zbior.id.map((id, i) => ({
    id, lat: zbior.lat[i], lng: zbior.lng[i], adres: zbior.adres[i], gmina: zbior.gmina[i], d: zbior.d[i],
  }));
  const [rok, miesiac, dzien] = zbior.stan.split('-');
  const stopka = [t.stopka.dane(`${dzien}.${miesiac}.${rok}`), t.stopka.zastrzezenie];
  // i to indeks w punktach: po kliknięciu w kropkę UI odnajduje po nim punkt schronienia.
  const geojson: PunktyGeojson = {
    type: 'FeatureCollection',
    features: punkty.map((p, i) => ({
      type: 'Feature', geometry: { type: 'Point', coordinates: [p.lng, p.lat] }, properties: { i, d: p.d },
    })),
  };
  return { punkty, geojson, stopka };
}

export type PunktyGeojson = FeatureCollection<Point, { i: number; d: Dostepnosc }>;

// Filtr Dostępności: mapa podmienia dane źródła na wynik, więc klastry liczą tylko widoczne punkty.
// Indeks i zostaje ten sam, co w pełnym zbiorze.
export function przefiltruj(geojson: PunktyGeojson, wlaczone: ReadonlySet<Dostepnosc>): PunktyGeojson {
  return { type: 'FeatureCollection', features: geojson.features.filter((f) => wlaczone.has(f.properties.d)) };
}

export type Prostokat = { zachod: number; poludnie: number; wschod: number; polnoc: number };

// Liczniki legendy: punkty schronienia każdej Dostępności w widoku mapy, z granicą włącznie.
// Liczy cały zbiór, więc filtr ich nie zmienia.
export function policzWWidoku(punkty: Punkt[], { zachod, poludnie, wschod, polnoc }: Prostokat): Record<Dostepnosc, number> {
  const liczniki: Record<Dostepnosc, number> = [0, 0, 0];
  for (const p of punkty) {
    if (p.lat >= poludnie && p.lat <= polnoc && p.lng >= zachod && p.lng <= wschod) liczniki[p.d]++;
  }
  return liczniki;
}

// Wszystko, co panel pokazuje o punkcie schronienia. „Prowadź” otwiera trasę pieszą w Google Maps.
export function szczegolyPunktu(p: Punkt) {
  return {
    adres: p.adres,
    gmina: p.gmina,
    dostepnosc: t.dostepnosc[p.d],
    opis: t.opisDostepnosci[p.d],
    prowadz: `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}&travelmode=walking`,
  };
}

// CSV wg RFC 4180: pola w cudzysłowie mogą zawierać przecinki, podwojone cudzysłowy i nowe linie.
function parsujCsv(tekst: string): string[][] {
  const wiersze: string[][] = [];
  let wiersz: string[] = [];
  let pole = '';
  let wCudzyslowie = false;
  for (let i = tekst.charCodeAt(0) === 0xfeff ? 1 : 0; i < tekst.length; i++) {
    const z = tekst[i];
    if (wCudzyslowie) {
      if (z === '"' && tekst[i + 1] === '"') { pole += '"'; i++; }
      else if (z === '"') wCudzyslowie = false;
      else pole += z;
    } else if (z === '"') wCudzyslowie = true;
    else if (z === ',') { wiersz.push(pole); pole = ''; }
    else if (z === '\n') { wiersz.push(pole.replace(/\r$/, '')); wiersze.push(wiersz); wiersz = []; pole = ''; }
    else pole += z;
  }
  if (pole || wiersz.length) { wiersz.push(pole); wiersze.push(wiersz); }
  return wiersze;
}

// 6 miejsc po przecinku to ok. 10 cm: dokładniej, niż potrzeba, a plik jest wyraźnie mniejszy.
const zaokraglij = (liczba: number) => Number(liczba.toFixed(6));

// Szwedzki zapis daty to RRRR-MM-DD.
const dzienWPolsce = (chwila: Date) => chwila.toLocaleDateString('sv-SE', { timeZone: 'Europe/Warsaw' });

export const KOLOR_DOSTEPNOSCI: Record<Dostepnosc, string> = { 0: '#16a34a', 1: '#d97706', 2: '#64748b' };
