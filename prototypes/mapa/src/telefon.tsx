// PROTOTYP runda 3 (#8): wspólne klocki wariantów układu na telefonie. Decyzje z D (legenda-filtr, karta, stopka) bez zmian, zmienia się tylko układ.
import { useEffect, useState } from 'react';
import { DOSTEPNOSC, WSZYSTKIE, Dane, Dostepnosc, Punkt, linkiNawigacji, useMapa, useZglosStan } from './shared';
import { STYL_LIBERTY, dodajWarstwy, useFiltr, useWWidoku } from './mapaRunda2';
import { VariantD } from './VariantD';

export const WASKI = '(max-width: 700px)';

function useWaski() {
  const [waski, setWaski] = useState(() => matchMedia(WASKI).matches);
  useEffect(() => {
    const mq = matchMedia(WASKI);
    const h = () => setWaski(mq.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return waski;
}

// Na szerokim ekranie każdy wariant to po prostu D (układ desktopowy bez zmian).
export function naTelefonie(Mobilny: (p: { dane: Dane }) => JSX.Element) {
  return function Wariant({ dane }: { dane: Dane }) {
    return useWaski() ? <Mobilny dane={dane} /> : <VariantD dane={dane} />;
  };
}

// Mapa + stan jak w D; extra trafia do paska przełącznika.
export function useMapaPunktow(dane: Dane, extra: Record<string, unknown> = {}) {
  const { ref, mapa } = useMapa(STYL_LIBERTY);
  const [wybrany, setWybrany] = useState<number | null>(null);
  useEffect(() => { if (mapa) dodajWarstwy(mapa, dane, setWybrany); }, [mapa]);
  const { filtry, przelacz } = useFiltr(mapa, dane);
  const wWidoku = useWWidoku(mapa, dane);
  const zglos = useZglosStan();
  const p = wybrany != null ? dane.punkty[wybrany] : null;
  useEffect(() => {
    zglos({ ekran: `${innerWidth}×${innerHeight}`, filtry: [...filtry].map((d) => DOSTEPNOSC[d].nazwa).join(', ') || '—', wybrany: p?.id ?? '—', 'w widoku': wWidoku.join('/'), ...extra });
  }, [filtry, p, wWidoku, JSON.stringify(extra)]);
  return { ref, mapa, p, zamknij: () => setWybrany(null), filtry, przelacz, wWidoku };
}

// Legenda-filtr w wersji kompaktowej: trzy przyciski obok siebie, liczba nad nazwą.
export function LegendaChipy({ filtry, przelacz, wWidoku, cien }: { filtry: Set<Dostepnosc>; przelacz: (d: Dostepnosc) => void; wWidoku: number[]; cien?: boolean }) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {WSZYSTKIE.map((d) => {
        const on = filtry.has(d);
        return (
          <button key={d} onClick={() => przelacz(d)} style={{
            flex: 1, minWidth: 0, padding: '6px 4px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff',
            opacity: on ? 1 : 0.5, cursor: 'pointer', font: 'inherit', boxShadow: cien ? '0 2px 8px rgba(0,0,0,.18)' : undefined,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
              <span style={{ width: 12, height: 12, borderRadius: 99, background: on ? DOSTEPNOSC[d].kolor : 'transparent', border: `2px solid ${DOSTEPNOSC[d].kolor}`, flex: 'none' }} />
              {wWidoku[d].toLocaleString('pl')}
            </div>
            <div style={{ fontSize: 11, color: '#475569', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{DOSTEPNOSC[d].nazwa}</div>
          </button>
        );
      })}
    </div>
  );
}

// Karta punktu jak w D.
export function KartaPunktu({ p, zamknij, style }: { p: Punkt; zamknij: () => void; style?: React.CSSProperties }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderTop: `4px solid ${DOSTEPNOSC[p.d].kolor}`, borderRadius: 12, padding: 14, ...style }}>
      <div style={{ fontWeight: 700, fontSize: 16 }}>{p.adres}</div>
      <div style={{ color: '#64748b', marginBottom: 8 }}>{p.gmina}</div>
      <div style={{ color: DOSTEPNOSC[p.d].kolor, fontWeight: 700 }}>{DOSTEPNOSC[p.d].nazwa}</div>
      <div style={{ marginBottom: 12 }}>{DOSTEPNOSC[p.d].opis}</div>
      <div style={{ display: 'flex', gap: 8 }}>
        <PrzyciskProwadz p={p} />
        <button onClick={zamknij} style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', font: 'inherit' }}>Zamknij</button>
      </div>
    </div>
  );
}

export function PrzyciskProwadz({ p, style }: { p: Punkt; style?: React.CSSProperties }) {
  return <a href={linkiNawigacji(p).google} target="_blank" style={{ flex: 1, textAlign: 'center', padding: 10, borderRadius: 8, background: '#0f172a', color: '#fff', fontWeight: 700, textDecoration: 'none', ...style }}>Prowadź</a>;
}

export const OBJ_KLASTRA = 'Kolor klastra: im bardziej zielony, tym więcej punktów całodobowych.';
