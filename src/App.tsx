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
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setInfo(false);
    addEventListener('keydown', esc);
    return () => removeEventListener('keydown', esc);
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
      {info && zbior && (
        <Panel zamknij={() => setInfo(false)}>
          <h1 className="tytul">{t.tytul}</h1>
          <p className="stopka">
            {zbior.stopka[0]}
            <br />
            {zbior.stopka[1]}
          </p>
        </Panel>
      )}
    </div>
  );
}
