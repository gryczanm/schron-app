// PROTOTYP wariant H (każda szerokość, Q1–Q4 z grillowania): mapa na cały ekran, filtr jako pływające przyciski u góry, karta punktu wyjeżdża od dołu, „i” otwiera stopkę.
import { useState } from 'react';
import { Dane, Stopka } from './shared';
import { KartaPunktu, LegendaChipy, OBJ_KLASTRA, useMapaPunktow } from './telefon';

export const nazwa = 'Pływające: filtr u góry, karta na dole (każda szerokość)';

function Mobilny({ dane }: { dane: Dane }) {
  const [info, setInfo] = useState(false);
  const { ref, p, zamknij, filtry, przelacz, wWidoku } = useMapaPunktow(dane, { info: info ? 'otwarte' : 'zamknięte' });

  return (
    <div style={{ position: 'fixed', inset: 0, font: '14px system-ui', overflow: 'hidden' }}>
      <div ref={ref} style={{ position: 'absolute', inset: 0 }} />
      {/* Prawe 52 px zostaje na przyciski mapy; na szerokim ekranie filtr nie szerszy niż 420 px. */}
      <div style={{ position: 'absolute', top: 'calc(8px + env(safe-area-inset-top))', left: 8, width: 'calc(100% - 60px)', maxWidth: 420 }}>
        <LegendaChipy filtry={filtry} przelacz={przelacz} wWidoku={wWidoku} cien />
        <button onClick={() => setInfo(true)} aria-label="Informacje" style={{
          marginTop: 8, width: 36, height: 36, borderRadius: 99, border: 0, background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,.18)', fontWeight: 800, fontSize: 16, cursor: 'pointer',
        }}>i</button>
      </div>
      {p && (
        <div style={{ position: 'absolute', left: 8, width: 'calc(100% - 16px)', maxWidth: 380, bottom: 'calc(80px + env(safe-area-inset-bottom))' }}>
          <KartaPunktu p={p} zamknij={zamknij} style={{ boxShadow: '0 6px 24px rgba(0,0,0,.25)' }} />
        </div>
      )}
      {info && (
        <div onClick={() => setInfo(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,.45)', display: 'flex', alignItems: 'flex-end' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', width: '100%', maxWidth: 420, boxSizing: 'border-box', borderRadius: '16px 16px 0 0', padding: 16, paddingBottom: 'calc(80px + env(safe-area-inset-bottom))' }}>
            <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 8 }}>Punkty schronienia</div>
            <div style={{ marginBottom: 8 }}>Przyciski u góry filtrują punkty według Dostępności. Liczby to punkty w aktualnym widoku mapy.</div>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>{OBJ_KLASTRA}</div>
            <Stopka stan={dane.stan} />
            <button onClick={() => setInfo(false)} style={{ marginTop: 16, width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', font: 'inherit', cursor: 'pointer' }}>Zamknij</button>
          </div>
        </div>
      )}
    </div>
  );
}

export const VariantH = Mobilny;
