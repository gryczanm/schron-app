// Układ H: mapa na cały ekran, „i” w lewym górnym rogu, jeden panel (dolny na telefonie, boczny na komputerze).
import { useEffect, useState } from 'react';
import { odczytajZbior, type ZwartyZbior } from './dane/zbior.ts';
import { Mapa } from './Mapa.tsx';
import { Panel } from './Panel.tsx';
import { t } from './teksty.ts';

type Zbior = ReturnType<typeof odczytajZbior>;

export function App() {
  const [zbior, setZbior] = useState<Zbior | null>(null);
  const [info, setInfo] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}dane/punkty.json`)
      .then((odp) => odp.json() as Promise<ZwartyZbior>)
      .then((z) => setZbior(odczytajZbior(z)));
  }, []);

  useEffect(() => {
    const zamknijEscape = (e: KeyboardEvent) => e.key === 'Escape' && setInfo(false);
    addEventListener('keydown', zamknijEscape);
    return () => removeEventListener('keydown', zamknijEscape);
  }, []);

  return (
    <div className="aplikacja">
      <Mapa geojson={zbior?.geojson} onKlikMapy={() => setInfo(false)} />
      <button
        className={`przycisk-info${info ? ' aktywny' : ''}`}
        aria-label={t.przyciski.informacje}
        aria-expanded={info}
        onClick={() => setInfo((o) => !o)}
      >
        i
      </button>
      {info && (
        <Panel zamknij={() => setInfo(false)}>
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
    </div>
  );
}
