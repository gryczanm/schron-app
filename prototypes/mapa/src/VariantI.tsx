// PROTOTYP wariant I (telefon): górny pasek + wysuwana szuflada z pełnym panelem D; szczegóły punktu jako jednowierszowy pasek na dole, rozwijany dotknięciem.
import { useEffect, useState } from 'react';
import { DOSTEPNOSC, Dane, Stopka } from './shared';
import { Legenda } from './mapaRunda2';
import { PrzyciskProwadz, naTelefonie, useMapaPunktow } from './telefon';

export const nazwa = 'Szuflada z panelem + pasek punktu';

function Mobilny({ dane }: { dane: Dane }) {
  const [szuflada, setSzuflada] = useState(false);
  const [rozwiniety, setRozwiniety] = useState(false);
  const { ref, p, zamknij, filtry, przelacz, wWidoku } = useMapaPunktow(dane, { szuflada: szuflada ? 'otwarta' : 'zamknięta', pasek: rozwiniety ? 'rozwinięty' : 'zwinięty' });
  useEffect(() => setRozwiniety(false), [p]);

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', font: '14px system-ui', overflow: 'hidden' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', paddingTop: 'calc(8px + env(safe-area-inset-top))', background: '#0f172a', color: '#fff' }}>
        <button onClick={() => setSzuflada(true)} aria-label="Menu" style={{ background: 'transparent', border: 0, color: '#fff', fontSize: 22, cursor: 'pointer', padding: '0 4px' }}>☰</button>
        <span style={{ fontWeight: 800, fontSize: 16, flex: 1 }}>Punkty schronienia</span>
        <span style={{ fontSize: 12, opacity: 0.8 }}>filtr {filtry.size}/3</span>
      </header>
      <div ref={ref} style={{ flex: 1, position: 'relative' }} />
      {p && (
        <div style={{ background: '#fff', borderTop: `4px solid ${DOSTEPNOSC[p.d].kolor}`, boxShadow: '0 -4px 16px rgba(0,0,0,.15)', padding: '10px 12px', paddingBottom: 'calc(72px + env(safe-area-inset-bottom))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div onClick={() => setRozwiniety(!rozwiniety)} style={{ flex: 1, minWidth: 0, cursor: 'pointer' }}>
              <div style={{ fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.adres}</div>
              <div style={{ fontSize: 12, color: DOSTEPNOSC[p.d].kolor, fontWeight: 700 }}>{DOSTEPNOSC[p.d].nazwa} {rozwiniety ? '▾' : '▸'}</div>
            </div>
            <PrzyciskProwadz p={p} style={{ flex: 'none', padding: '10px 16px' }} />
            <button onClick={zamknij} aria-label="Zamknij" style={{ border: 0, background: 'transparent', fontSize: 20, cursor: 'pointer', color: '#64748b' }}>×</button>
          </div>
          {rozwiniety && <div style={{ marginTop: 8 }}><div style={{ color: '#64748b' }}>{p.gmina}</div><div>{DOSTEPNOSC[p.d].opis}</div></div>}
        </div>
      )}
      <div onClick={() => setSzuflada(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,.45)', opacity: szuflada ? 1 : 0, pointerEvents: szuflada ? 'auto' : 'none', transition: 'opacity .2s' }} />
      <aside style={{
        position: 'absolute', top: 0, bottom: 0, left: 0, width: 'min(85vw, 340px)', background: '#f8fafc', padding: 16, paddingTop: 'calc(16px + env(safe-area-inset-top))', boxSizing: 'border-box', overflow: 'auto',
        transform: szuflada ? 'none' : 'translateX(-100%)', transition: 'transform .25s ease', boxShadow: szuflada ? '4px 0 20px rgba(0,0,0,.25)' : 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 18, fontWeight: 800, flex: 1 }}>Punkty schronienia</span>
          <button onClick={() => setSzuflada(false)} aria-label="Zamknij" style={{ border: 0, background: 'transparent', fontSize: 22, cursor: 'pointer' }}>×</button>
        </div>
        <Legenda filtry={filtry} przelacz={przelacz} wWidoku={wWidoku} />
        <Stopka stan={dane.stan} style={{ marginTop: 16 }} />
      </aside>
    </div>
  );
}

export const VariantI = naTelefonie(Mobilny);
