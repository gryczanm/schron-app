// Prowadzenie do punktu schronienia: obliczenia bez zależności od UI i od sieci.
// Kierunek i odległość liczymy w linii prostej, bez trasy po ulicach (issue #24).
import { t } from './teksty.ts';

export type LngLat = [number, number];

const PROMIEN_ZIEMI = 6371000; // m
const NA_MIEJSCU = 25; // m, najmniejszy promień „Jesteś na miejscu”
const PRZYBLIZENIE_OD = 50; // m dokładności GPS, od których odległość dostaje „~”
const DOPISEK_GPS_OD = 30; // m dokładności GPS, od których widać „GPS ±X m”

const rad = (st: number) => (st * Math.PI) / 180;
const st = (r: number) => (r * 180) / Math.PI;
const doPelnegoKata = (kat: number) => ((kat % 360) + 360) % 360;

// Odległość po kole wielkim (haversine), w metrach.
export function odleglosc([lng1, lat1]: LngLat, [lng2, lat2]: LngLat): number {
  const a =
    Math.sin(rad(lat2 - lat1) / 2) ** 2 +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(rad(lng2 - lng1) / 2) ** 2;
  return 2 * PROMIEN_ZIEMI * Math.asin(Math.sqrt(a));
}

// Azymut początkowy z punktu a do b: 0° to północ, 90° wschód.
export function azymut([lng1, lat1]: LngLat, [lng2, lat2]: LngLat): number {
  const y = Math.sin(rad(lng2 - lng1)) * Math.cos(rad(lat2));
  const x = Math.cos(rad(lat1)) * Math.sin(rad(lat2)) - Math.sin(rad(lat1)) * Math.cos(rad(lat2)) * Math.cos(rad(lng2 - lng1));
  return doPelnegoKata(st(Math.atan2(y, x)));
}

// Promień „Jesteś na miejscu”: przy słabym GPS nie da się podejść bliżej niż jego dokładność.
export const progNaMiejscu = (dokladnosc: number | null) => Math.max(NA_MIEJSCU, dokladnosc ?? 0);

// Zaokrąglona do 10 m, od 1000 m w km z przecinkiem. Słaby GPS dodaje „~”.
export function formatujOdleglosc(metry: number, dokladnosc: number | null = null): string {
  const zaokraglone = Math.round(metry / 10) * 10;
  const tekst = zaokraglone >= 1000 ? `${(metry / 1000).toFixed(1).replace('.', ',')} km` : `${zaokraglone} m`;
  return dokladnosc != null && dokladnosc >= PRZYBLIZENIE_OD ? `~${tekst}` : tekst;
}

// Drugi wiersz pod odległością. dokladnosc null znaczy pozycję wskazaną ręcznie.
export function opisOdleglosci(dokladnosc: number | null): string {
  if (dokladnosc == null) return `${t.prowadzenie.wLiniiProstej} · ${t.prowadzenie.recznie}`;
  if (dokladnosc >= DOPISEK_GPS_OD) return `${t.prowadzenie.wLiniiProstej} · ${t.prowadzenie.gps(Math.round(dokladnosc))}`;
  return t.prowadzenie.wLiniiProstej;
}

export type Kierunek = {
  odleglosc: number; // m
  naMiejscu: boolean;
  strzalka: number; // obrót strzałki na ekranie, stopnie zgodnie z ruchem wskazówek
  wzgledemPolnocy: boolean; // bez kompasu: strzałka liczona od północy, na tarczy N
};

// kompas: dokąd jest skierowany telefon (stopnie od północy), null bez kompasu.
// Z kompasem mapa obraca się o ten sam kąt, więc strzałka pokazuje kierunek względem góry ekranu.
export function kierunek(pozycja: LngLat, cel: LngLat, dokladnosc: number | null, kompas: number | null): Kierunek {
  const odl = odleglosc(pozycja, cel);
  const az = azymut(pozycja, cel);
  return {
    odleglosc: odl,
    naMiejscu: odl <= progNaMiejscu(dokladnosc),
    strzalka: kompas == null ? az : doPelnegoKata(az - kompas),
    wzgledemPolnocy: kompas == null,
  };
}

// Okrąg dokładności jako wielokąt do warstwy mapy. Przybliżenie płaskie wystarcza dla kilkuset metrów.
export function okrag([lng, lat]: LngLat, promien: number, boki = 48): LngLat[] {
  const naStopienLat = 110540;
  const naStopienLng = 111320 * Math.cos(rad(lat));
  return Array.from({ length: boki + 1 }, (_, i) => {
    const k = (2 * Math.PI * i) / boki;
    return [lng + (promien * Math.sin(k)) / naStopienLng, lat + (promien * Math.cos(k)) / naStopienLat];
  });
}

// Kąt obrotu ekranu (0, 90, 180, 270), żeby kompas działał także w poziomie.
const obrotEkranu = () => (typeof screen !== 'undefined' && screen.orientation?.angle) || 0;

// Kierunek telefonu z DeviceOrientationEvent albo null, gdy zdarzenie nie niesie kompasu.
// iPhone podaje webkitCompassHeading, Android alpha w zdarzeniu absolutnym (liczone przeciwnie do wskazówek).
export function kierunekTelefonu(e: { alpha: number | null; absolute: boolean; webkitCompassHeading?: number }, obrot = obrotEkranu()): number | null {
  const k = e.webkitCompassHeading ?? (e.absolute && e.alpha != null ? 360 - e.alpha : null);
  return k == null ? null : doPelnegoKata(k + obrot);
}
