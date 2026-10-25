// PROTOTYP runda 3 (#8): układ D na telefonie. Bazowy D (panel nad mapą) i cztery warianty mobilne, przełączane przez ?variant=D|F|G|H|I.
// Na szerokim ekranie F–I renderują D bez zmian; oceniać na telefonie albo w trybie urządzenia w DevTools.
// Runda 1 (A, B, C) jest w commicie 08905d3, runda 2 (D, E) w f3ecaef.
import { useCallback, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import 'maplibre-gl/dist/maplibre-gl.css';
import { StanCtx, useDane } from './shared';
import { PrototypeSwitcher } from './PrototypeSwitcher';
import * as D from './VariantD';
import * as F from './VariantF';
import * as G from './VariantG';
import * as H from './VariantH';
import * as I from './VariantI';

const WARIANTY = {
  D: { nazwa: 'Bazowy D: panel nad mapą', C: D.VariantD },
  F: { nazwa: F.nazwa, C: F.VariantF },
  G: { nazwa: G.nazwa, C: G.VariantG },
  H: { nazwa: H.nazwa, C: H.VariantH },
  I: { nazwa: I.nazwa, C: I.VariantI },
};
type Klucz = keyof typeof WARIANTY;

function App() {
  const dane = useDane();
  const [wariant, setWariant] = useState<Klucz>(() => (new URLSearchParams(location.search).get('variant') as Klucz) in WARIANTY
    ? new URLSearchParams(location.search).get('variant') as Klucz : 'D');
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
