// PROTOTYP wariant H (każda szerokość): mapa na cały ekran, pływający filtr u góry.
// Runda 4 (grillowanie Q8–Q16): zaznaczony punkt, panel jak w Google Maps – dolny z podglądem/rozwinięciem na telefonie,
// boczny na komputerze (od 700 px); „i” otwiera się w tym samym panelu.
import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { DOSTEPNOSC, Dane, Punkt, Stopka } from './shared';
import { LegendaChipy, OBJ_KLASTRA, PrzyciskProwadz, useMapaPunktow, useWaski } from './telefon';

export const nazwa = 'Pływające + panel jak w Google Maps';

const SZER_PANELU = 400;
const PUSTE: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: [] };

type Wysokosc = 'podgląd' | 'rozwinięty';

function Mobilny({ dane }: { dane: Dane }) {
  const waski = useWaski();
  const [info, setInfo] = useState(false);
  const [wys, setWys] = useState<Wysokosc>('podgląd');
  const { ref, mapa, p, zamknij, filtry, przelacz, wWidoku } = useMapaPunktow(dane, {
    panel: p0(info, waski), ...(waski ? { 'panel dolny': wys } : {}),
  });

  // Q8/Q9: osobna warstwa wybranego punktu, dodana na końcu, więc zawsze nad klastrami.
  useEffect(() => {
    if (!mapa) return;
    mapa.addSource('wybrany', { type: 'geojson', data: PUSTE });
    mapa.addLayer({ id: 'wybrany', type: 'circle', source: 'wybrany', paint: {
      'circle-color': ['match', ['get', 'd'], 0, DOSTEPNOSC[0].kolor, 1, DOSTEPNOSC[1].kolor, DOSTEPNOSC[2].kolor],
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 5, 9, 17, 15],
      'circle-stroke-color': '#0f172a', 'circle-stroke-width': 4,
    } });
    // Q13: klik w puste miejsce mapy zamyka panel.
    mapa.on('click', (e) => {
      if (!mapa.queryRenderedFeatures(e.point, { layers: ['klaster', 'punkt', 'wybrany'] }).length) { zamknij(); setInfo(false); }
    });
  }, [mapa]);

  useEffect(() => {
    if (!mapa) return;
    (mapa.getSource('wybrany') as maplibregl.GeoJSONSource).setData(p
      ? { type: 'Feature', geometry: { type: 'Point', coordinates: [p.lng, p.lat] }, properties: { d: p.d } } : PUSTE);
    if (!p) return;
    setInfo(false);
    setWys('podgląd');
    // Q10: punkt na środek widocznej części mapy, bez zmiany przybliżenia.
    mapa.easeTo({ center: [p.lng, p.lat], offset: waski ? [0, -110] : [SZER_PANELU / 2, 0] });
  }, [mapa, p]);

  // Q9: wyłączenie Dostępności wybranego punktu zamyka panel.
  useEffect(() => { if (p && !filtry.has(p.d)) zamknij(); }, [filtry]);

  // Q13: Esc zamyka panel.
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') { zamknij(); setInfo(false); } };
    addEventListener('keydown', h);
    return () => removeEventListener('keydown', h);
  }, []);

  const otwartyPanel = info || p != null;
  const tresc = info
    ? <TrescInfo dane={dane} />
    : p && <TrescPunktu p={p} rozwiniety={!waski || wys === 'rozwinięty'} />;
  const zamknijPanel = () => { zamknij(); setInfo(false); };

  return (
    <div style={{ position: 'fixed', inset: 0, font: '14px system-ui', overflow: 'hidden' }}>
      <div ref={ref} style={{ position: 'absolute', inset: 0 }} />
      {!waski && otwartyPanel && (
        // Q12: panel boczny na całą wysokość; filtr zostaje nad nim, treść zaczyna się pod filtrem.
        <aside style={{ position: 'absolute', zIndex: 3, top: 0, bottom: 0, left: 0, width: SZER_PANELU, background: '#fff', boxShadow: '4px 0 20px rgba(0,0,0,.18)', overflow: 'auto', padding: '112px 20px 20px', boxSizing: 'border-box' }}>
          <PrzyciskZamknij onClick={zamknijPanel} style={{ position: 'absolute', top: 112, right: 12 }} />
          {tresc}
        </aside>
      )}
      <div style={{ position: 'absolute', zIndex: 4, top: 'calc(8px + env(safe-area-inset-top))', left: 8, width: 'calc(100% - 60px)', maxWidth: SZER_PANELU - 16 }}>
        <LegendaChipy filtry={filtry} przelacz={przelacz} wWidoku={wWidoku} cien />
        <button onClick={() => { zamknij(); setInfo(true); }} aria-label="Informacje" style={{
          marginTop: 8, width: 36, height: 36, borderRadius: 99, border: info ? '2px solid #0f172a' : 0, background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,.18)', fontWeight: 800, fontSize: 16, cursor: 'pointer',
        }}>i</button>
      </div>
      {waski && otwartyPanel && (
        <PanelDolny key={info ? 'info' : p!.id} wys={info ? 'rozwinięty' : wys} setWys={info ? () => {} : setWys} zamknij={zamknijPanel}>
          {tresc}
        </PanelDolny>
      )}
    </div>
  );
}

const p0 = (info: boolean, waski: boolean) => (info ? 'info' : '') + (waski ? ' (dolny)' : ' (boczny)');

// Q11/Q14: panel dolny z uchwytem. Przeciągnięcie w górę rozwija, w dół zwija albo zamyka, dotknięcie uchwytu przełącza.
function PanelDolny({ wys, setWys, zamknij, children }: { wys: Wysokosc; setWys: (w: Wysokosc) => void; zamknij: () => void; children: React.ReactNode }) {
  const [dy, setDy] = useState<number | null>(null);
  const startY = useRef(0);
  const down = (e: React.PointerEvent) => { (e.target as HTMLElement).setPointerCapture(e.pointerId); startY.current = e.clientY; setDy(0); };
  const move = (e: React.PointerEvent) => { if (dy != null) setDy(e.clientY - startY.current); };
  const up = () => {
    if (dy == null) return;
    if (Math.abs(dy) < 6) setWys(wys === 'podgląd' ? 'rozwinięty' : 'podgląd');
    else if (dy < -40) setWys('rozwinięty');
    else if (dy > 40) (wys === 'rozwinięty' ? setWys('podgląd') : zamknij());
    setDy(null);
  };
  return (
    <div style={{
      position: 'absolute', zIndex: 3, left: 0, right: 0, bottom: 0, maxHeight: '85%', display: 'flex', flexDirection: 'column',
      background: '#fff', borderRadius: '16px 16px 0 0', boxShadow: '0 -4px 20px rgba(0,0,0,.2)',
      transform: dy && dy > 0 ? `translateY(${dy}px)` : undefined, transition: dy == null ? 'transform .2s' : 'none',
    }}>
      <div onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} style={{ touchAction: 'none', cursor: 'grab', padding: '10px 0 6px', position: 'relative' }}>
        <div style={{ width: 40, height: 5, borderRadius: 9, background: '#cbd5e1', margin: '0 auto' }} />
        <PrzyciskZamknij onClick={zamknij} onPointerDown={(e) => e.stopPropagation()} style={{ position: 'absolute', top: 6, right: 10 }} />
      </div>
      <div style={{ overflow: 'auto', padding: '0 16px', paddingBottom: 'calc(16px + env(safe-area-inset-bottom))' }}>{children}</div>
    </div>
  );
}

// Q14: podgląd = adres, Dostępność z opisem, „Prowadź”; rozwinięcie dokłada gminę i miejsce na przyszłe funkcje.
function TrescPunktu({ p, rozwiniety }: { p: Punkt; rozwiniety: boolean }) {
  return (
    <div>
      <div style={{ fontWeight: 700, fontSize: 18, paddingRight: 36 }}>{p.adres}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, color: DOSTEPNOSC[p.d].kolor, fontWeight: 700 }}>
        <span style={{ width: 12, height: 12, borderRadius: 99, background: DOSTEPNOSC[p.d].kolor }} />{DOSTEPNOSC[p.d].nazwa}
      </div>
      <div style={{ margin: '4px 0 12px' }}>{DOSTEPNOSC[p.d].opis}</div>
      <div style={{ display: 'flex' }}><PrzyciskProwadz p={p} style={{ padding: 12 }} /></div>
      {rozwiniety && (
        <div style={{ marginTop: 16, borderTop: '1px solid #e2e8f0', paddingTop: 12 }}>
          <div style={{ fontSize: 12, color: '#64748b' }}>Gmina</div>
          <div style={{ marginBottom: 16 }}>{p.gmina}</div>
          <div style={{ border: '2px dashed #e2e8f0', borderRadius: 10, padding: 16, color: '#94a3b8', textAlign: 'center', fontSize: 12 }}>PROTOTYP: miejsce na przyszłe funkcje przy punkcie</div>
        </div>
      )}
    </div>
  );
}

function TrescInfo({ dane }: { dane: Dane }) {
  return (
    <div>
      <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 8, paddingRight: 36 }}>Punkty schronienia</div>
      <div style={{ marginBottom: 8 }}>Przyciski u góry filtrują punkty według Dostępności. Liczby to punkty w aktualnym widoku mapy.</div>
      <div style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>{OBJ_KLASTRA}</div>
      <Stopka stan={dane.stan} />
    </div>
  );
}

function PrzyciskZamknij({ onClick, onPointerDown, style }: { onClick: () => void; onPointerDown?: (e: React.PointerEvent) => void; style?: React.CSSProperties }) {
  return <button onClick={onClick} onPointerDown={onPointerDown} aria-label="Zamknij" style={{ width: 32, height: 32, borderRadius: 99, border: 0, background: '#f1f5f9', fontSize: 18, cursor: 'pointer', ...style }}>×</button>;
}

export const VariantH = Mobilny;
