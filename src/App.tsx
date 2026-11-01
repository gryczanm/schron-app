// Układ H: mapa na cały ekran, legenda-filtr i pod nią „i” w lewym górnym rogu, jeden panel (dolny na telefonie, boczny na komputerze).
// Panel pokazuje albo objaśnienia spod „i”, albo wybrany punkt schronienia, nigdy oba naraz.
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  KOLOR_DOSTEPNOSCI, odczytajZbior, policzWWidoku, przefiltruj, szczegolyPunktu,
  type Dostepnosc, type Prostokat, type ZwartyZbior,
} from './dane/zbior.ts';
import { Legenda } from './Legenda.tsx';
import { Mapa } from './Mapa.tsx';
import { Panel } from './Panel.tsx';
import { t } from './teksty.ts';

type Zbior = ReturnType<typeof odczytajZbior>;

export function App() {
  const [zbior, setZbior] = useState<Zbior | null>(null);
  const [info, setInfo] = useState(false);
  const [wybranyIndeks, setWybranyIndeks] = useState<number | null>(null);
  const [wlaczone, setWlaczone] = useState<ReadonlySet<Dostepnosc>>(() => new Set([0, 1, 2]));
  const [widok, setWidok] = useState<Prostokat | null>(null);
  const panel = useRef<HTMLElement>(null);
  const wybrany = (zbior && wybranyIndeks != null && zbior.punkty[wybranyIndeks]) || null;

  const zamknij = () => {
    setInfo(false);
    setWybranyIndeks(null);
  };
  const wybierz = (i: number) => {
    setInfo(false);
    setWybranyIndeks(i);
  };

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}dane/punkty.json`)
      .then((odp) => odp.json() as Promise<ZwartyZbior>)
      .then((z) => setZbior(odczytajZbior(z)));
  }, []);

  useEffect(() => {
    const zamknijEscape = (e: KeyboardEvent) => e.key === 'Escape' && zamknij();
    addEventListener('keydown', zamknijEscape);
    return () => removeEventListener('keydown', zamknijEscape);
  }, []);

  // Wyłączenie Dostępności wybranego punktu zamyka panel i odznacza punkt.
  const przelacz = (d: Dostepnosc) => {
    const nowe = new Set(wlaczone);
    if (nowe.has(d)) nowe.delete(d);
    else nowe.add(d);
    setWlaczone(nowe);
    if (wybrany && !nowe.has(wybrany.d)) setWybranyIndeks(null);
  };

  const geojson = useMemo(() => (zbior ? przefiltruj(zbior.geojson, wlaczone) : undefined), [zbior, wlaczone]);
  const wWidoku = useMemo(() => (zbior && widok ? policzWWidoku(zbior.punkty, widok) : null), [zbior, widok]);
  const szczegoly = wybrany && szczegolyPunktu(wybrany);

  return (
    <div className="aplikacja">
      <Mapa
        geojson={geojson}
        wybrany={wybrany}
        onWybierz={wybierz}
        onKlikMapy={zamknij}
        onWidok={setWidok}
        panel={panel}
      />
      <div className="gora">
        <Legenda wlaczone={wlaczone} przelacz={przelacz} wWidoku={wWidoku} />
        <button
          className={`przycisk-info${info ? ' aktywny' : ''}`}
          aria-label={t.przyciski.informacje}
          aria-expanded={info}
          onClick={() => (info ? setInfo(false) : (setWybranyIndeks(null), setInfo(true)))}
        >
          i
        </button>
      </div>
      {info && (
        <Panel zamknij={zamknij} elRef={panel}>
          <h1 className="tytul">{t.tytul}</h1>
          {/* Stopka czeka na dane, bo zawiera ich datę stanu. */}
          {zbior && (
            <p className="stopka">
              {zbior.stopka[0]}
              <br />
              {zbior.stopka[1]}
            </p>
          )}
        </Panel>
      )}
      {wybrany && szczegoly && (
        // key: klik w inny punkt podmienia treść i wraca do podglądu.
        <Panel key={wybranyIndeks} zamknij={zamknij} elRef={panel} rozwiniecie={<p className="gmina">{t.gmina(szczegoly.gmina)}</p>}>
          <h2 className="tytul">{szczegoly.adres}</h2>
          <p className="dostepnosc">
            <span className="kropka" style={{ background: KOLOR_DOSTEPNOSCI[wybrany.d] }} />
            <strong>{szczegoly.dostepnosc}</strong>
          </p>
          <p className="opis">{szczegoly.opis}</p>
          <a className="prowadz" href={szczegoly.prowadz} target="_blank" rel="noopener noreferrer">
            {t.przyciski.prowadz}
          </a>
        </Panel>
      )}
    </div>
  );
}
