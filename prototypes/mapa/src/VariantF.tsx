// PROTOTYP wariant F (telefon): stały podział ekranu – mapa u góry, panel D przewijany pod nią.
import { useEffect, useRef } from 'react';
import { Dane, Stopka } from './shared';
import { Legenda } from './mapaRunda2';
import { KartaPunktu, naTelefonie, useMapaPunktow } from './telefon';

export const nazwa = 'Podział: mapa 60% u góry, panel pod spodem';

function Mobilny({ dane }: { dane: Dane }) {
  const { ref, p, zamknij, filtry, przelacz, wWidoku } = useMapaPunktow(dane, { układ: 'podział 60/40' });
  const panel = useRef<HTMLDivElement>(null);
  // Po wybraniu punktu karta jest na górze panelu, więc przewijamy do niej.
  useEffect(() => { if (p) panel.current?.scrollTo({ top: 0, behavior: 'smooth' }); }, [p]);

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', font: '14px system-ui' }}>
      <div ref={ref} style={{ flex: '0 0 60%', position: 'relative' }} />
      <div ref={panel} style={{ flex: 1, overflow: 'auto', background: '#f8fafc', borderTop: '1px solid #e2e8f0', padding: '12px 16px', paddingBottom: 'calc(80px + env(safe-area-inset-bottom))', boxSizing: 'border-box' }}>
        {p ? <KartaPunktu p={p} zamknij={zamknij} style={{ marginBottom: 16 }} /> : <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>Punkty schronienia</div>}
        <Legenda filtry={filtry} przelacz={przelacz} wWidoku={wWidoku} />
        {!p && <div style={{ color: '#64748b', marginTop: 12 }}>Dotknij punktu na mapie, żeby zobaczyć szczegóły.</div>}
        <Stopka stan={dane.stan} style={{ marginTop: 16 }} />
      </div>
    </div>
  );
}

export const VariantF = naTelefonie(Mobilny);
