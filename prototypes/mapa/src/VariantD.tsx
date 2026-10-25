// PROTOTYP wariant D: panel boczny (legenda + szczegóły punktu w panelu), mapa obok.
import { useEffect, useState } from 'react';
import { DOSTEPNOSC, Dane, Stopka, linkiNawigacji, useMapa, useZglosStan } from './shared';
import { Legenda, STYL_LIBERTY, dodajWarstwy, useFiltr, useWWidoku } from './mapaRunda2';

export const nazwa = 'Panel boczny: legenda + szczegóły w panelu';

export function VariantD({ dane }: { dane: Dane }) {
  const { ref, mapa } = useMapa(STYL_LIBERTY);
  const [wybrany, setWybrany] = useState<number | null>(null);
  // Warstwy muszą powstać przed efektem filtra z useFiltr.
  useEffect(() => { if (mapa) dodajWarstwy(mapa, dane, setWybrany); }, [mapa]);
  const { filtry, przelacz } = useFiltr(mapa, dane);
  const wWidoku = useWWidoku(mapa, dane);
  const zglos = useZglosStan();
  useEffect(() => { zglos({ filtry: [...filtry].map((d) => DOSTEPNOSC[d].nazwa).join(', ') || '—', wybrany: wybrany != null ? dane.punkty[wybrany].id : '—', 'w widoku': wWidoku.join('/') }); }, [filtry, wybrany, wWidoku]);

  const p = wybrany != null ? dane.punkty[wybrany] : null;
  const l = p && linkiNawigacji(p);

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexWrap: 'wrap', font: '14px system-ui' }}>
      <aside style={{ flex: '1 1 300px', maxWidth: 360, minWidth: 0, padding: 16, overflow: 'auto', background: '#f8fafc', borderRight: '1px solid #e2e8f0', maxHeight: '100%', boxSizing: 'border-box' }}>
        <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>Punkty schronienia</div>
        <Legenda filtry={filtry} przelacz={przelacz} wWidoku={wWidoku} />
        <div style={{ marginTop: 16 }}>
          {p && l ? (
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderTop: `4px solid ${DOSTEPNOSC[p.d].kolor}`, borderRadius: 12, padding: 14 }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{p.adres}</div>
              <div style={{ color: '#64748b', marginBottom: 8 }}>{p.gmina}</div>
              <div style={{ color: DOSTEPNOSC[p.d].kolor, fontWeight: 700 }}>{DOSTEPNOSC[p.d].nazwa}</div>
              <div style={{ marginBottom: 12 }}>{DOSTEPNOSC[p.d].opis}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <a href={l.google} target="_blank" style={{ flex: 1, textAlign: 'center', padding: 10, borderRadius: 8, background: '#0f172a', color: '#fff', fontWeight: 700, textDecoration: 'none' }}>Prowadź</a>
                <button onClick={() => setWybrany(null)} style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer' }}>Zamknij</button>
              </div>
            </div>
          ) : (
            <div style={{ color: '#64748b' }}>Kliknij punkt na mapie, żeby zobaczyć szczegóły.</div>
          )}
        </div>
        <Stopka stan={dane.stan} style={{ marginTop: 16 }} />
      </aside>
      <div ref={ref} style={{ flex: '999 1 320px', minHeight: '55vh', position: 'relative' }} />
    </div>
  );
}
