// Prowadzenie do punktu schronienia (wariant C z prototypu): ciemny pasek u góry ze strzałką i odległością,
// na dole Dostępność celu i przyciski, na mapie linia od pozycji do celu. Działa bez internetu.
import { useEffect, useRef, useState } from 'react';
import { Layer, Source, useMap } from 'react-map-gl/maplibre';
import { useEkranWlaczony } from './ekran.ts';
import { KOLOR_DOSTEPNOSCI, szczegolyPunktu, type Punkt } from './dane/zbior.ts';
import { poprosOKompas, useKompas, usePozycjaUrzadzenia, type StanPozycji } from './pozycja.ts';
import { formatujOdleglosc, kierunek, okrag, opisOdleglosci, type Kierunek, type LngLat } from './prowadzenie.ts';
import { t } from './teksty.ts';

const NIEBIESKI = '#1d4ed8';
const CZAS_DOPASOWANIA = 700; // ms animacji „pozycja i cel naraz”, której śledzenie nie przerywa
const ODSTEP = 30; // px wolnego miejsca wokół pozycji i celu przy dopasowaniu widoku

// Stan Prowadzenia dla App. cel to wybrany punkt schronienia: jego zmiana zmienia cel Prowadzenia.
export function useProwadzenie(cel: Punkt | null) {
  const [wlaczone, setWlaczone] = useState(false);
  const [reczna, setReczna] = useState<LngLat | null>(null);
  const [wskazywanie, setWskazywanie] = useState(false);
  // Pasek u góry i przyciski na dole: mapa dopasowuje widok do miejsca między nimi.
  const pasek = useRef<HTMLDivElement>(null);
  const dol = useRef<HTMLDivElement>(null);
  const aktywne = wlaczone && cel != null;
  const urzadzenie = usePozycjaUrzadzenia(aktywne);
  const kompas = useKompas(aktywne);
  useEkranWlaczony(aktywne);

  // Bez celu (np. powrót na stronę główną) Prowadzenie się kończy.
  useEffect(() => {
    if (!cel) setWlaczone(false);
  }, [cel]);

  const start = () => {
    poprosOKompas(); // iPhone: zgoda musi paść w obsłudze kliknięcia „Prowadź”
    setWskazywanie(false);
    setWlaczone(true);
  };
  const zakoncz = () => {
    setWlaczone(false);
    setWskazywanie(false);
  };
  // Ręcznie wskazana pozycja obowiązuje do „Użyj mojej lokalizacji”, także po zmianie celu.
  const wskaz = (miejsce: LngLat) => {
    setReczna(miejsce);
    setWskazywanie(false);
  };

  const pozycja = reczna ?? urzadzenie.miejsce;
  const dokladnosc = reczna ? null : urzadzenie.dokladnosc; // null: pozycja wskazana ręcznie
  const wynik = cel && pozycja ? kierunek(pozycja, [cel.lng, cel.lat], dokladnosc, kompas) : null;

  return {
    aktywne,
    pasek,
    dol,
    start,
    zakoncz,
    wskazywanie,
    przelaczWskazywanie: () => setWskazywanie((w) => !w),
    wskaz,
    uzyjUrzadzenia: () => setReczna(null),
    moznaUzycUrzadzenia: reczna != null && urzadzenie.stan === 'ok',
    stan: reczna ? 'ok' : urzadzenie.stan,
    pozycja,
    dokladnosc,
    kompas,
    wynik,
  };
}

export type Prowadzenie = ReturnType<typeof useProwadzenie>;

// Ciemny pasek u góry: zastępuje legendę i panel na czas Prowadzenia.
export function PasekProwadzenia({ cel, p }: { cel: Punkt; p: Prowadzenie }) {
  return (
    <div className="prowadzenie-pasek" ref={p.pasek} role="status" aria-live="polite">
      {p.wynik && !p.wynik.naMiejscu ? (
        <>
          <Strzalka wynik={p.wynik} />
          <div className="prowadzenie-tekst">
            <div className="prowadzenie-odleglosc">{formatujOdleglosc(p.wynik.odleglosc, p.dokladnosc)}</div>
            <div className="prowadzenie-male">{t.prowadzenie.do(cel.adres)}</div>
            <div className="prowadzenie-male">{opisOdleglosci(p.dokladnosc)}</div>
          </div>
        </>
      ) : p.wynik ? (
        <Komunikat tytul={t.prowadzenie.naMiejscu} opis={t.prowadzenie.naMiejscuOpis} />
      ) : (
        <KomunikatPozycji stan={p.stan} />
      )}
      <button className="zamknij zamknij-jasny" aria-label={t.przyciski.zakoncz} onClick={p.zakoncz}>
        ×
      </button>
    </div>
  );
}

// Na dole: Dostępność celu, trasa w Google Maps i ręczne wskazanie pozycji.
export function DolProwadzenia({ cel, p }: { cel: Punkt; p: Prowadzenie }) {
  const szczegoly = szczegolyPunktu(cel);
  return (
    <div className="prowadzenie-dol" ref={p.dol}>
      <p className="dostepnosc">
        <span className="kropka" style={{ background: KOLOR_DOSTEPNOSCI[cel.d] }} />
        <strong>{szczegoly.dostepnosc}</strong>
      </p>
      {p.wskazywanie && <p className="prowadzenie-podpowiedz">{t.prowadzenie.wskazywanie}</p>}
      <div className="przyciski">
        <a className="przycisk-drugi" href={szczegoly.trasa} target="_blank" rel="noopener noreferrer">
          {t.przyciski.trasaGoogle}
        </a>
        <button className="przycisk-drugi" aria-pressed={p.wskazywanie} onClick={p.przelaczWskazywanie}>
          {t.przyciski.wskaz}
        </button>
        {p.moznaUzycUrzadzenia && (
          <button className="przycisk-drugi" onClick={p.uzyjUrzadzenia}>
            {t.przyciski.mojaLokalizacja}
          </button>
        )}
      </div>
    </div>
  );
}

function Strzalka({ wynik }: { wynik: Kierunek }) {
  const stopnie = Math.round(wynik.strzalka) % 360;
  return (
    <svg className="strzalka" width="52" height="52" viewBox="-50 -50 100 100" role="img" aria-label={t.prowadzenie.kierunek(stopnie)}>
      <circle r="46" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="3" />
      {wynik.wzgledemPolnocy && (
        <text y="-29" textAnchor="middle" fontSize="15" fontWeight="800" fill="#64748b">
          {t.prowadzenie.polnoc}
        </text>
      )}
      {/* Obrót przez CSS, żeby działała animacja. Środek obrotu to (0, 0) z viewBox, czyli środek tarczy. */}
      <path d="M0 -34 L19 16 L0 6 L-19 16 Z" fill={NIEBIESKI} style={{ transform: `rotate(${stopnie}deg)` }} />
    </svg>
  );
}

function Komunikat({ tytul, opis }: { tytul: string; opis: string }) {
  return (
    <div className="prowadzenie-tekst">
      <div className="prowadzenie-tytul">{tytul}</div>
      <div className="prowadzenie-opis">{opis}</div>
    </div>
  );
}

function KomunikatPozycji({ stan }: { stan: StanPozycji }) {
  const p = t.prowadzenie;
  if (stan === 'odmowa') return <Komunikat tytul={p.odmowa} opis={p.odmowaOpis} />;
  if (stan === 'niedostepna') return <Komunikat tytul={p.niedostepna} opis={p.niedostepnaOpis} />;
  return <Komunikat tytul={p.ustalanie} opis={p.ustalanieOpis} />;
}

// Warstwy i kamera Prowadzenia. Dziecko <Map>, bo potrzebuje mapy z useMap.
// Na starcie pokazuje naraz pozycję i cel, potem śledzi pozycję. Z kompasem obraca mapę tak,
// żeby kierunek telefonu był u góry, bez kompasu trzyma północ u góry.
export function ProwadzenieNaMapie({ cel, p }: { cel: Punkt; p: Prowadzenie }) {
  const { current: m } = useMap();
  const dopasowanyCel = useRef<string | null>(null);
  const sledzOd = useRef(0);
  const obrot = p.kompas ?? 0;
  const [lng, lat] = p.pozycja ?? [null, null];

  useEffect(() => {
    if (!m) return;
    if (lng == null || lat == null) {
      // Bez pozycji: najpierw sam cel.
      if (dopasowanyCel.current !== `bez-pozycji:${cel.id}`) {
        dopasowanyCel.current = `bez-pozycji:${cel.id}`;
        m.easeTo({ center: [cel.lng, cel.lat], bearing: obrot });
      }
      return;
    }
    const margines = marginesy(m.getContainer(), p.pasek.current, p.dol.current);
    if (dopasowanyCel.current !== cel.id && margines) {
      dopasowanyCel.current = cel.id;
      sledzOd.current = Date.now() + CZAS_DOPASOWANIA;
      m.fitBounds(
        [[Math.min(lng, cel.lng), Math.min(lat, cel.lat)], [Math.max(lng, cel.lng), Math.max(lat, cel.lat)]],
        { padding: margines, maxZoom: 17, bearing: obrot, duration: CZAS_DOPASOWANIA - 100 },
      );
    } else if (Date.now() >= sledzOd.current) {
      dopasowanyCel.current = cel.id; // za mały ekran na dopasowanie: od razu śledzenie
      m.easeTo({ center: [lng, lat], bearing: obrot, duration: 400 });
    }
  }, [m, lng, lat, cel.id, cel.lng, cel.lat, obrot]);

  // Koniec Prowadzenia: północ z powrotem u góry.
  useEffect(() => () => void m?.easeTo({ bearing: 0 }), [m]);

  if (!p.pozycja) return null;
  return <WarstwyProwadzenia pozycja={p.pozycja} cel={[cel.lng, cel.lat]} dokladnosc={p.dokladnosc} />;
}

// Wolne miejsce między paskiem u góry a przyciskami na dole. null, gdy ekran jest na to za niski
// (np. telefon w poziomie): wtedy mapa od razu śledzi pozycję zamiast pokazywać pozycję i cel naraz.
function marginesy(mapa: HTMLElement, pasek: HTMLElement | null, dol: HTMLElement | null) {
  const ramka = mapa.getBoundingClientRect();
  const top = (pasek ? pasek.getBoundingClientRect().bottom - ramka.top : 0) + ODSTEP;
  const bottom = (dol ? ramka.bottom - dol.getBoundingClientRect().top : 0) + ODSTEP;
  if (top + bottom > ramka.height - 2 * ODSTEP) return null;
  return { top, bottom, left: ODSTEP, right: ODSTEP + 30 }; // z prawej przyciski mapy
}

function WarstwyProwadzenia({ pozycja, cel, dokladnosc }: { pozycja: LngLat; cel: LngLat; dokladnosc: number | null }) {
  return (
    <>
      {dokladnosc != null && dokladnosc > 0 && (
        <Source id="prowadzenie-dokladnosc" type="geojson" data={{ type: 'Polygon', coordinates: [okrag(pozycja, dokladnosc)] }}>
          <Layer id="prowadzenie-dokladnosc" type="fill" beforeId="wybrany" paint={{ 'fill-color': NIEBIESKI, 'fill-opacity': 0.12 }} />
        </Source>
      )}
      <Source id="prowadzenie-linia" type="geojson" data={{ type: 'LineString', coordinates: [pozycja, cel] }}>
        <Layer
          id="prowadzenie-linia"
          type="line"
          beforeId="wybrany"
          layout={{ 'line-cap': 'round' }}
          paint={{ 'line-color': NIEBIESKI, 'line-width': 4, 'line-dasharray': [1.5, 1.5] }}
        />
      </Source>
      <Source id="prowadzenie-pozycja" type="geojson" data={{ type: 'Point', coordinates: pozycja }}>
        <Layer
          id="prowadzenie-pozycja"
          type="circle"
          paint={{ 'circle-color': NIEBIESKI, 'circle-radius': 8, 'circle-stroke-color': '#fff', 'circle-stroke-width': 3 }}
        />
      </Source>
    </>
  );
}
