// PROTOTYP: trzy warianty mapy punktów schronienia, przełączane przez ?variant=A|B|C.
import { useCallback, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import 'maplibre-gl/dist/maplibre-gl.css';
import { StanCtx, useDane } from './shared';
import { PrototypeSwitcher } from './PrototypeSwitcher';
import * as A from './VariantA';
import * as B from './VariantB';
import * as C from './VariantC';

const WARIANTY = { A: { nazwa: A.nazwa, C: A.VariantA }, B: { nazwa: B.nazwa, C: B.VariantB }, C: { nazwa: C.nazwa, C: C.VariantC } };
type Klucz = keyof typeof WARIANTY;

function App() {
  const dane = useDane();
  const [wariant, setWariant] = useState<Klucz>(() => (new URLSearchParams(location.search).get('variant') as Klucz) in WARIANTY
    ? new URLSearchParams(location.search).get('variant') as Klucz : 'A');
  const [stan, setStan] = useState<Record<string, unknown>>({});
  const zglos = useCallback((s: Record<string, unknown>) => setStan(s), []);

  useEffect(() => {
    const u = new URL(location.href);
    u.searchParams.set('variant', wariant);
    history.replaceState(null, '', u);
  }, [wariant]);

  if (!dane) return <div style={{ padding: 24, font: '16px system-ui' }}>Wczytuję punkty schronienia…</div>;
  const V = WARIANTY[wariant].C;
  return (
    <StanCtx.Provider value={zglos}>
      <V key={wariant} dane={dane} />
      <PrototypeSwitcher
        warianty={Object.entries(WARIANTY).map(([klucz, w]) => ({ klucz, nazwa: w.nazwa }))}
        aktualny={wariant} onZmiana={(k) => { setStan({}); setWariant(k as Klucz); }}
        stan={{ wariant, punktów: dane.punkty.length.toLocaleString('pl'), ...stan }}
      />
    </StanCtx.Provider>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
