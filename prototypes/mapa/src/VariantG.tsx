// PROTOTYP wariant G (telefon): mapa na cały ekran, dolny arkusz z uchwytem (nisko / połowa / wysoko).
import { useEffect, useRef, useState } from 'react';
import { Dane, Stopka } from './shared';
import { KartaPunktu, LegendaChipy, OBJ_KLASTRA, naTelefonie, useMapaPunktow } from './telefon';

export const nazwa = 'Dolny arkusz z uchwytem';

type Poz = 'nisko' | 'połowa' | 'wysoko';
const wysokosc = (poz: Poz) => (poz === 'nisko' ? 116 : poz === 'połowa' ? innerHeight * 0.5 : innerHeight * 0.88);

function Mobilny({ dane }: { dane: Dane }) {
  const [poz, setPoz] = useState<Poz>('nisko');
  const [ciagniety, setCiagniety] = useState<number | null>(null);
  const { ref, p, zamknij, filtry, przelacz, wWidoku } = useMapaPunktow(dane, { arkusz: poz });
  const start = useRef({ y: 0, h: 0, ruch: false });

  useEffect(() => { if (p && poz === 'nisko') setPoz('połowa'); }, [p]);

  const h = ciagniety ?? wysokosc(poz);
  const down = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    start.current = { y: e.clientY, h, ruch: false };
    setCiagniety(h);
  };
  const move = (e: React.PointerEvent) => {
    if (ciagniety == null) return;
    const dy = start.current.y - e.clientY;
    if (Math.abs(dy) > 4) start.current.ruch = true;
    setCiagniety(Math.min(innerHeight * 0.92, Math.max(80, start.current.h + dy)));
  };
  const up = () => {
    if (ciagniety == null) return;
    if (!start.current.ruch) {
      // Dotknięcie uchwytu: przełącz między niskim a połową.
      setPoz(poz === 'nisko' ? 'połowa' : 'nisko');
    } else {
      const najblizsza = (['nisko', 'połowa', 'wysoko'] as Poz[]).reduce((a, b) => (Math.abs(wysokosc(b) - ciagniety) < Math.abs(wysokosc(a) - ciagniety) ? b : a));
      setPoz(najblizsza);
    }
    setCiagniety(null);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, font: '14px system-ui', overflow: 'hidden' }}>
      <div ref={ref} style={{ position: 'absolute', inset: 0 }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: h, background: '#f8fafc', borderRadius: '16px 16px 0 0',
        boxShadow: '0 -4px 20px rgba(0,0,0,.2)', display: 'flex', flexDirection: 'column', transition: ciagniety == null ? 'height .25s ease' : 'none',
      }}>
        <div onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} style={{ touchAction: 'none', cursor: 'grab', padding: '8px 12px 6px' }}>
          <div style={{ width: 40, height: 5, borderRadius: 9, background: '#cbd5e1', margin: '0 auto 8px' }} />
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontWeight: 800, fontSize: 16 }}>Punkty schronienia</span>
            <span style={{ fontSize: 11, color: '#64748b' }}>w widoku</span>
          </div>
        </div>
        <div style={{ padding: '0 12px' }}><LegendaChipy filtry={filtry} przelacz={przelacz} wWidoku={wWidoku} /></div>
        <div style={{ flex: 1, overflow: 'auto', padding: '12px 12px', paddingBottom: 'calc(80px + env(safe-area-inset-bottom))' }}>
          {p ? <KartaPunktu p={p} zamknij={zamknij} /> : <div style={{ color: '#64748b' }}>Dotknij punktu na mapie, żeby zobaczyć szczegóły.</div>}
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 12 }}>{OBJ_KLASTRA}</div>
          <Stopka stan={dane.stan} style={{ marginTop: 12 }} />
        </div>
      </div>
    </div>
  );
}

export const VariantG = naTelefonie(Mobilny);
