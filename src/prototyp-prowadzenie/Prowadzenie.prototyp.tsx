// PROTOTYP – kod do wyrzucenia, żyje tylko na gałęzi prototype/prowadzenie.
// Pytanie: jak wygląda Prowadzenie do punktu schronienia i czy jest czytelne na telefonie, także offline na pustym tle?
// Trzy warianty na istniejącej stronie, przełączane ?wariant=A|B|C i paskiem na dole (tylko `npm run dev`).
// Pozycja i kompas są symulowane (⚙ na pasku) albo prawdziwe (tryb GPS, do sprawdzenia na telefonie).
import { useEffect, useRef, useState } from 'react';
import { Layer, Source, useMap } from 'react-map-gl/maplibre';
import { KOLOR_DOSTEPNOSCI, szczegolyPunktu, type Punkt } from '../dane/zbior.ts';
import './prototyp.css';

export const PROTOTYP = import.meta.env.DEV;
export const OFFLINE = PROTOTYP && new URLSearchParams(location.search).has('offline');

type LngLat = [number, number];
const WARIANTY = { A: 'Panel', B: 'Kompas na cały ekran', C: 'Pasek u góry, mapa obraca się' } as const;
type Wariant = keyof typeof WARIANTY;
const KLUCZE = Object.keys(WARIANTY) as Wariant[];

type StanPozycji = 'ok' | 'ustalanie' | 'odmowa' | 'niedostepna';
type Sim = {
  tryb: 'sym' | 'gps';
  stan: StanPozycji;
  poz: LngLat | null;
  dokladnosc: number;
  kompas: boolean;
  kierunek: number; // dokąd jest skierowany telefon, stopnie od północy
  marsz: boolean;
};
type Wynik =
  | { rodzaj: 'ustalanie' | 'odmowa' | 'niedostepna' }
  | { rodzaj: 'ok' | 'na-miejscu'; odl: number; az: number; kat: number; wzgledemPolnocy: boolean };

// --- geometria ---
const R = 6371000;
const rad = (x: number) => (x * Math.PI) / 180;
const deg = (x: number) => (x * 180) / Math.PI;
function odleglosc([lng1, lat1]: LngLat, [lng2, lat2]: LngLat) {
  const a = Math.sin(rad(lat2 - lat1) / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(rad(lng2 - lng1) / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}
function azymut([lng1, lat1]: LngLat, [lng2, lat2]: LngLat) {
  const y = Math.sin(rad(lng2 - lng1)) * Math.cos(rad(lat2));
  const x = Math.cos(rad(lat1)) * Math.sin(rad(lat2)) - Math.sin(rad(lat1)) * Math.cos(rad(lat2)) * Math.cos(rad(lng2 - lng1));
  return (deg(Math.atan2(y, x)) + 360) % 360;
}
function przesun(a: LngLat, b: LngLat, m: number): LngLat {
  const d = odleglosc(a, b);
  if (d <= m) return b;
  const f = m / d;
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
}
function okrag([lng, lat]: LngLat, r: number): LngLat[] {
  return Array.from({ length: 49 }, (_, i) => {
    const k = (2 * Math.PI * i) / 48;
    return [lng + (r * Math.sin(k)) / (111320 * Math.cos(rad(lat))), lat + (r * Math.cos(k)) / 110540];
  });
}
const STRONY = ['północ', 'północny wschód', 'wschód', 'południowy wschód', 'południe', 'południowy zachód', 'zachód', 'północny zachód'];
const strona = (az: number) => STRONY[Math.round(az / 45) % 8];
function formatuj(m: number, dokl: number) {
  const s = m >= 1000 ? `${(m / 1000).toFixed(1).replace('.', ',')} km` : `${Math.max(10, Math.round(m / 10) * 10)} m`;
  return dokl > 50 ? `~${s}` : s;
}
const progNaMiejscu = (dokl: number) => Math.max(25, dokl);

// --- hook spinający prototyp z App ---
export function useProwadzenie(cel: Punkt | null) {
  const [wariant, setWariantStan] = useState<Wariant>(() => {
    const p = new URLSearchParams(location.search).get('wariant');
    return p && p in WARIANTY ? (p as Wariant) : 'A';
  });
  const [wlaczone, setWlaczone] = useState(false);
  const [mapaWKompasie, setMapaWKompasie] = useState(false);
  const [sim, setSim] = useState<Sim>({ tryb: 'sym', stan: 'ok', poz: null, dokladnosc: 15, kompas: true, kierunek: 0, marsz: false });
  const waski = useWaski();
  const aktywne = PROTOTYP && wlaczone && !!cel;

  useEffect(() => void (!cel && setWlaczone(false)), [cel]);

  const setWariant = (w: Wariant) => {
    const p = new URLSearchParams(location.search);
    p.set('wariant', w);
    history.replaceState(null, '', `?${p}`);
    setWariantStan(w);
  };

  // Marsz: co 0,7 s 10 m w stronę celu.
  useEffect(() => {
    if (!aktywne || !sim.marsz || sim.tryb !== 'sym' || !cel) return;
    const id = setInterval(() => setSim((s) => (s.poz ? { ...s, poz: przesun(s.poz, [cel.lng, cel.lat], 10) } : s)), 700);
    return () => clearInterval(id);
  }, [aktywne, sim.marsz, sim.tryb, cel]);

  // Tryb GPS: prawdziwa pozycja i kompas telefonu.
  useEffect(() => {
    if (!aktywne || sim.tryb !== 'gps') return;
    // Kompas dopiero po pierwszym odczycie czujnika: laptop go nie ma, więc strzałka zostaje względem N.
    setSim((s) => ({ ...s, stan: 'ustalanie', kompas: false }));
    const id = navigator.geolocation.watchPosition(
      (p) => setSim((s) => ({ ...s, stan: 'ok', poz: [p.coords.longitude, p.coords.latitude], dokladnosc: Math.round(p.coords.accuracy) })),
      (e) => setSim((s) => ({ ...s, stan: e.code === 1 ? 'odmowa' : 'niedostepna' })),
      { enableHighAccuracy: true },
    );
    const orientacja = (e: DeviceOrientationEvent & { webkitCompassHeading?: number }) => {
      const k = e.webkitCompassHeading ?? (e.absolute && e.alpha != null ? 360 - e.alpha : null);
      if (k != null) setSim((s) => ({ ...s, kompas: true, kierunek: Math.round(k) }));
    };
    addEventListener('deviceorientationabsolute', orientacja as EventListener);
    addEventListener('deviceorientation', orientacja as EventListener);
    return () => {
      navigator.geolocation.clearWatch(id);
      removeEventListener('deviceorientationabsolute', orientacja as EventListener);
      removeEventListener('deviceorientation', orientacja as EventListener);
    };
  }, [aktywne, sim.tryb]);

  const start = () => {
    if (!cel) return;
    setWlaczone(true);
    setMapaWKompasie(false);
    // iPhone: zgoda na kompas tylko po kliknięciu.
    const DOE = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
    if (sim.tryb === 'gps') DOE.requestPermission?.().catch(() => {});
    if (sim.tryb === 'sym' && !sim.poz) setSim((s) => ({ ...s, poz: [cel.lng - 0.004, cel.lat - 0.003] }));
  };
  const stop = () => setWlaczone(false);
  const klikMapy = (miejsce: LngLat) => {
    if (!aktywne || sim.tryb !== 'sym') return false;
    setSim((s) => ({ ...s, poz: miejsce }));
    return true;
  };

  let wynik: Wynik = { rodzaj: 'ustalanie' };
  if (cel && sim.stan !== 'ok') wynik = { rodzaj: sim.stan };
  else if (cel && sim.poz) {
    const c: LngLat = [cel.lng, cel.lat];
    const odl = odleglosc(sim.poz, c);
    const az = azymut(sim.poz, c);
    wynik = {
      rodzaj: odl <= progNaMiejscu(sim.dokladnosc) ? 'na-miejscu' : 'ok',
      odl, az,
      kat: sim.kompas ? (az - sim.kierunek + 360) % 360 : az,
      wzgledemPolnocy: !sim.kompas,
    };
  }

  const gm = cel ? szczegolyPunktu(cel).prowadz : '#';
  const wspolne = { cel: cel!, wynik, sim, stop, gm };

  return {
    aktywne,
    start,
    klikMapy,
    ukryjGore: aktywne && wariant !== 'A',
    ukryjPanel: aktywne && wariant !== 'A',
    panelTresc: aktywne && wariant === 'A' ? <WariantA {...wspolne} /> : null,
    ekran: !aktywne ? null : wariant === 'B' ? (
      <WariantB {...wspolne} mapa={mapaWKompasie} setMapa={setMapaWKompasie} />
    ) : wariant === 'C' ? (
      <WariantC {...wspolne} />
    ) : null,
    nakladkaMapy: aktywne && cel && sim.poz && sim.stan === 'ok' ? (
      <NakladkaMapy poz={sim.poz} cel={cel} sim={sim} wariant={wariant} waski={waski} mapaWKompasie={mapaWKompasie} />
    ) : null,
    pasek: PROTOTYP ? <PasekPrototypu wariant={wariant} setWariant={setWariant} sim={sim} setSim={setSim} wynik={wynik} aktywne={aktywne} cel={cel} /> : null,
  };
}

// --- wspólne kawałki ---
type Wspolne = { cel: Punkt; wynik: Wynik; sim: Sim; stop: () => void; gm: string };

function Strzalka({ kat, rozmiar, polnoc }: { kat: number; rozmiar: number; polnoc: boolean }) {
  return (
    <svg className="pp-strzalka" width={rozmiar} height={rozmiar} viewBox="-50 -50 100 100" aria-hidden>
      <circle r="46" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="3" />
      {polnoc && <text y="-31" textAnchor="middle" fontSize="13" fontWeight="800" fill="#64748b">N</text>}
      <g style={{ transform: `rotate(${kat}deg)`, transition: 'transform .4s' }}>
        <path d="M0 -36 L20 16 L0 6 L-20 16 Z" fill="#1d4ed8" />
      </g>
    </svg>
  );
}

const KOMUNIKATY = {
  ustalanie: ['Ustalam pozycję…', 'Bez internetu może to potrwać do minuty. Najszybciej pod gołym niebem.'],
  odmowa: ['Brak zgody na lokalizację', 'Włącz lokalizację dla tej strony w ustawieniach przeglądarki.'],
  niedostepna: ['Nie mogę ustalić pozycji', 'Sprawdź, czy lokalizacja w telefonie jest włączona.'],
};
function Komunikat({ rodzaj }: { rodzaj: keyof typeof KOMUNIKATY }) {
  const [tytul, opis] = KOMUNIKATY[rodzaj];
  return (
    <div className={`pp-komunikat pp-${rodzaj}`}>
      <strong>{tytul}</strong>
      <span>{opis}</span>
    </div>
  );
}
function NaMiejscu() {
  return (
    <div className="pp-na-miejscu">
      <strong>Jesteś na miejscu</strong>
      <span>Rozejrzyj się za oznakowaniem punktu schronienia.</span>
    </div>
  );
}
const opisOdl = (w: Extract<Wynik, { odl: number }>, sim: Sim) =>
  `w linii prostej · na ${strona(w.az)}${sim.dokladnosc > 30 ? ` · GPS ±${sim.dokladnosc} m` : ''}`;

function Dostepnosc({ cel }: { cel: Punkt }) {
  return (
    <span className="pp-dost">
      <span className="kropka" style={{ background: KOLOR_DOSTEPNOSCI[cel.d] }} />
      {szczegolyPunktu(cel).dostepnosc}
    </span>
  );
}

// --- A: wszystko w istniejącym panelu, mapa z północą u góry ---
function WariantA({ cel, wynik, sim, stop, gm }: Wspolne) {
  return (
    <>
      <p className="pp-etykieta">Prowadzenie do</p>
      <h2 className="tytul">{cel.adres}</h2>
      <Dostepnosc cel={cel} />
      {wynik.rodzaj === 'ok' ? (
        <div className="pp-a-wiersz">
          <Strzalka kat={wynik.kat} rozmiar={64} polnoc={wynik.wzgledemPolnocy} />
          <div>
            <div className="pp-odl">{formatuj(wynik.odl, sim.dokladnosc)}</div>
            <div className="pp-male">{opisOdl(wynik, sim)}</div>
          </div>
        </div>
      ) : wynik.rodzaj === 'na-miejscu' ? <NaMiejscu /> : <Komunikat rodzaj={wynik.rodzaj} />}
      <div className="pp-przyciski">
        <button className="pp-zakoncz" onClick={stop}>Zakończ</button>
        <a className="pp-gm" href={gm} target="_blank" rel="noopener noreferrer">Trasa w Google Maps</a>
      </div>
    </>
  );
}

// --- B: kompas na cały ekran, mapa na żądanie ---
function WariantB({ cel, wynik, sim, stop, gm, mapa, setMapa }: Wspolne & { mapa: boolean; setMapa: (m: boolean) => void }) {
  if (mapa) {
    return (
      <div className="pp-b-mini">
        <div>
          <strong className="pp-odl">{wynik.rodzaj === 'ok' ? formatuj(wynik.odl, sim.dokladnosc) : wynik.rodzaj === 'na-miejscu' ? 'Na miejscu' : '…'}</strong>
          <div className="pp-male">{cel.adres}</div>
        </div>
        <button className="pp-zakoncz" onClick={() => setMapa(false)}>Kompas</button>
        <button className="pp-x" onClick={stop} aria-label="Zakończ">×</button>
      </div>
    );
  }
  return (
    <div className="pp-b">
      <div className="pp-b-gora">
        <span className="pp-etykieta">Prowadzenie do</span>
        <strong>{cel.adres}</strong>
        <Dostepnosc cel={cel} />
      </div>
      <div className="pp-b-srodek">
        {wynik.rodzaj === 'ok' ? (
          <>
            <Strzalka kat={wynik.kat} rozmiar={240} polnoc={wynik.wzgledemPolnocy} />
            <div className="pp-b-odl">{formatuj(wynik.odl, sim.dokladnosc)}</div>
            <div className="pp-male">{opisOdl(wynik, sim)}</div>
            {wynik.wzgledemPolnocy && <div className="pp-uwaga">Kompas niedostępny: strzałka pokazuje kierunek względem północy (N).</div>}
          </>
        ) : wynik.rodzaj === 'na-miejscu' ? <NaMiejscu /> : <Komunikat rodzaj={wynik.rodzaj} />}
      </div>
      <div className="pp-b-dol">
        <button className="pp-zakoncz" onClick={() => setMapa(true)}>Mapa</button>
        <a className="pp-gm" href={gm} target="_blank" rel="noopener noreferrer">Trasa w Google Maps</a>
        <button className="pp-zakoncz" onClick={stop}>Zakończ</button>
      </div>
    </div>
  );
}

// --- C: ciemny pasek u góry jak w nawigacji, mapa śledzi pozycję i obraca się z telefonem ---
function WariantC({ cel, wynik, sim, stop, gm }: Wspolne) {
  return (
    <>
      <div className="pp-c-baner">
        {wynik.rodzaj === 'ok' ? (
          <>
            <Strzalka kat={wynik.kat} rozmiar={52} polnoc={wynik.wzgledemPolnocy} />
            <div className="pp-c-tekst">
              <div className="pp-c-odl">{formatuj(wynik.odl, sim.dokladnosc)}</div>
              <div className="pp-c-male">do: {cel.adres}</div>
              <div className="pp-c-male">{opisOdl(wynik, sim)}</div>
            </div>
          </>
        ) : wynik.rodzaj === 'na-miejscu' ? (
          <div className="pp-c-tekst"><div className="pp-c-odl">Jesteś na miejscu</div><div className="pp-c-male">Rozejrzyj się za oznakowaniem.</div></div>
        ) : (
          <div className="pp-c-tekst"><div className="pp-c-odl">{KOMUNIKATY[wynik.rodzaj][0]}</div><div className="pp-c-male">{KOMUNIKATY[wynik.rodzaj][1]}</div></div>
        )}
        <button className="pp-x pp-x-jasny" onClick={stop} aria-label="Zakończ">×</button>
      </div>
      <div className="pp-c-dol">
        <Dostepnosc cel={cel} />
        <a className="pp-gm" href={gm} target="_blank" rel="noopener noreferrer">Trasa w Google Maps</a>
      </div>
    </>
  );
}

// --- warstwy na mapie: linia, pozycja, okrąg dokładności ---
function NakladkaMapy({ poz, cel, sim, wariant, waski, mapaWKompasie }: { poz: LngLat; cel: Punkt; sim: Sim; wariant: Wariant; waski: boolean; mapaWKompasie: boolean }) {
  const { current: m } = useMap();
  const dopasowany = useRef<string | null>(null);
  const c: LngLat = [cel.lng, cel.lat];
  const obrot = wariant === 'C' && sim.kompas ? sim.kierunek : 0;

  useEffect(() => {
    if (!m) return;
    const klucz = `${cel.id}|${wariant}|${mapaWKompasie}`;
    if (dopasowany.current !== klucz) {
      dopasowany.current = klucz;
      // setTimeout: Mapa po zmianie celu sama centruje punkt, a jej efekt biegnie po naszym.
      setTimeout(() => m.fitBounds(
        [[Math.min(poz[0], c[0]), Math.min(poz[1], c[1])], [Math.max(poz[0], c[0]), Math.max(poz[1], c[1])]],
        {
          padding: { top: wariant === 'C' ? 140 : 120, bottom: waski && wariant === 'A' ? 320 : 110, left: !waski && wariant === 'A' ? 440 : 50, right: 60 },
          maxZoom: 17, bearing: obrot, duration: 600,
        },
      ), 0);
    } else if (wariant === 'C') {
      m.easeTo({ center: poz, bearing: obrot, duration: 400 });
    }
  }, [m, poz[0], poz[1], cel.id, wariant, obrot, mapaWKompasie]);

  return (
    <>
      <Source id="pp-dokl" type="geojson" data={{ type: 'Polygon', coordinates: [okrag(poz, sim.dokladnosc)] }}>
        <Layer id="pp-dokl" type="fill" paint={{ 'fill-color': '#1d4ed8', 'fill-opacity': 0.12 }} />
      </Source>
      <Source id="pp-linia" type="geojson" data={{ type: 'LineString', coordinates: [poz, c] }}>
        <Layer id="pp-linia" type="line" layout={{ 'line-cap': 'round' }} paint={{ 'line-color': '#1d4ed8', 'line-width': 4, 'line-dasharray': [1.5, 1.5] }} />
      </Source>
      <Source id="pp-ja" type="geojson" data={{ type: 'Point', coordinates: poz }}>
        <Layer id="pp-ja" type="circle" paint={{ 'circle-color': '#1d4ed8', 'circle-radius': 8, 'circle-stroke-color': '#fff', 'circle-stroke-width': 3 }} />
      </Source>
    </>
  );
}

// --- pasek przełączania wariantów i symulacji (tylko dev) ---
function PasekPrototypu({ wariant, setWariant, sim, setSim, wynik, aktywne, cel }: {
  wariant: Wariant; setWariant: (w: Wariant) => void; sim: Sim; setSim: React.Dispatch<React.SetStateAction<Sim>>; wynik: Wynik; aktywne: boolean; cel: Punkt | null;
}) {
  const [otwarte, setOtwarte] = useState(false);
  const i = KLUCZE.indexOf(wariant);
  const idz = (o: number) => setWariant(KLUCZE[(i + o + KLUCZE.length) % KLUCZE.length]);

  useEffect(() => {
    const klawisz = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest('input, textarea, select, [contenteditable]')) return;
      if (e.key === 'ArrowLeft') idz(-1);
      if (e.key === 'ArrowRight') idz(1);
    };
    addEventListener('keydown', klawisz);
    return () => removeEventListener('keydown', klawisz);
  });

  const p = new URLSearchParams(location.search);
  if (OFFLINE) p.delete('offline');
  else p.set('offline', '1');
  const ustaw = <K extends keyof Sim>(k: K, v: Sim[K]) => setSim((s) => ({ ...s, [k]: v }));
  const krok = () => cel && setSim((s) => (s.poz ? { ...s, poz: przesun(s.poz, [cel.lng, cel.lat], 20) } : s));

  return (
    <div className="pp-pasek-kontener">
      {otwarte && (
        <div className="pp-sim">
          <strong>Symulacja (prototyp)</strong>
          <label>Pozycja{' '}
            <select value={sim.tryb} onChange={(e) => ustaw('tryb', e.target.value as Sim['tryb'])}>
              <option value="sym">symulowana</option>
              <option value="gps">prawdziwy GPS i kompas</option>
            </select>
          </label>
          {sim.tryb === 'sym' && (
            <>
              <label>Stan pozycji{' '}
                <select value={sim.stan} onChange={(e) => ustaw('stan', e.target.value as StanPozycji)}>
                  <option value="ok">ustalona</option>
                  <option value="ustalanie">ustalanie</option>
                  <option value="odmowa">brak zgody</option>
                  <option value="niedostepna">niedostępna</option>
                </select>
              </label>
              <div className="pp-rzad">
                <button onClick={krok}>Krok 20 m</button>
                <label><input type="checkbox" checked={sim.marsz} onChange={(e) => ustaw('marsz', e.target.checked)} /> Marsz</label>
              </div>
              <small>Podczas Prowadzenia klik w mapę ustawia pozycję.</small>
              <label>Dokładność GPS: ±{sim.dokladnosc} m
                <input type="range" min={5} max={200} value={sim.dokladnosc} onChange={(e) => ustaw('dokladnosc', +e.target.value)} />
              </label>
              <label><input type="checkbox" checked={sim.kompas} onChange={(e) => ustaw('kompas', e.target.checked)} /> Kompas dostępny</label>
              {sim.kompas && (
                <label>Kierunek telefonu: {sim.kierunek}°
                  <input type="range" min={0} max={359} value={sim.kierunek} onChange={(e) => ustaw('kierunek', +e.target.value)} />
                </label>
              )}
            </>
          )}
          <a href={`?${p}`}>{OFFLINE ? 'Wróć do podkładu (online)' : 'Udawaj offline: bez podkładu'}</a>
          <pre>{JSON.stringify({
            wariant, aktywne, wynik: 'odl' in wynik ? { ...wynik, odl: Math.round(wynik.odl), az: Math.round(wynik.az), kat: Math.round(wynik.kat) } : wynik,
            poz: sim.poz?.map((x) => +x.toFixed(5)),
          }, null, 1)}</pre>
        </div>
      )}
      <div className="pp-pasek">
        <button onClick={() => idz(-1)} aria-label="Poprzedni wariant">‹</button>
        <span>{wariant} ({WARIANTY[wariant]})</span>
        <button onClick={() => idz(1)} aria-label="Następny wariant">›</button>
        <button onClick={() => setOtwarte((o) => !o)} aria-label="Symulacja" className={otwarte ? 'pp-wl' : ''}>⚙</button>
      </div>
    </div>
  );
}

function useWaski() {
  const [waski, setWaski] = useState(() => matchMedia('(max-width: 700px)').matches);
  useEffect(() => {
    const q = matchMedia('(max-width: 700px)');
    const zmiana = () => setWaski(q.matches);
    q.addEventListener('change', zmiana);
    return () => q.removeEventListener('change', zmiana);
  }, []);
  return waski;
}

