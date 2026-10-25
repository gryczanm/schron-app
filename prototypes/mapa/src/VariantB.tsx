// PROTOTYP wariant B: mobile-first – mapa ciepła przy oddaleniu, punkty z bliska, wszystko w dolnym arkuszu.
import { useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { DOSTEPNOSC, WSZYSTKIE, Dane, Dostepnosc, Stopka, linkiNawigacji, useMapa, useZglosStan } from './shared';

export const nazwa = 'Arkusz: mapa ciepła + dolny panel';

export function VariantB({ dane }: { dane: Dane }) {
  const { ref, mapa } = useMapa('https://tiles.openfreemap.org/styles/bright');
  const [filtry, setFiltry] = useState<Set<Dostepnosc>>(new Set(WSZYSTKIE));
  const [wybrany, setWybrany] = useState<number | null>(null);
  const zglos = useZglosStan();

  useEffect(() => { zglos({ filtry: [...filtry].map((d) => DOSTEPNOSC[d].nazwa).join(', ') || '—', wybrany: wybrany != null ? dane.punkty[wybrany].id : '—' }); }, [filtry, wybrany]);

  useEffect(() => {
    if (!mapa) return;
    mapa.addSource('p', { type: 'geojson', data: dane.geojson });
    mapa.addLayer({ id: 'cieplo', type: 'heatmap', source: 'p', maxzoom: 12, paint: {
      'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 5, 6, 11, 20],
      'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 5, 0.6, 11, 1.5],
      'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 10, 0.8, 12, 0],
      'heatmap-color': ['interpolate', ['linear'], ['heatmap-density'],
        0, 'rgba(37,99,235,0)', 0.2, 'rgba(37,99,235,.4)', 0.5, '#2563eb', 0.8, '#7c3aed', 1, '#db2777'],
    } });
    mapa.addLayer({ id: 'punkt', type: 'circle', source: 'p', minzoom: 10, paint: {
      'circle-color': ['match', ['get', 'd'], 0, DOSTEPNOSC[0].kolor, 1, DOSTEPNOSC[1].kolor, DOSTEPNOSC[2].kolor],
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 10, 3, 14, 7, 18, 13],
      'circle-opacity': ['interpolate', ['linear'], ['zoom'], 10, 0, 11.5, 1],
      'circle-stroke-color': ['case', ['boolean', ['feature-state', 'wybrany'], false], '#0f172a', '#fff'],
      'circle-stroke-width': ['case', ['boolean', ['feature-state', 'wybrany'], false], 4, 1.5],
    } });
    mapa.on('click', 'punkt', (e) => {
      const i = e.features![0].properties.i as number;
      setWybrany(i);
      mapa.easeTo({ center: [dane.punkty[i].lng, dane.punkty[i].lat], padding: { bottom: 260 } });
    });
    mapa.on('click', (e) => { if (!mapa.queryRenderedFeatures(e.point, { layers: ['punkt'] }).length) setWybrany(null); });
    mapa.on('mouseenter', 'punkt', () => (mapa.getCanvas().style.cursor = 'pointer'));
    mapa.on('mouseleave', 'punkt', () => (mapa.getCanvas().style.cursor = ''));
  }, [mapa]);

  useEffect(() => {
    if (!mapa) return;
    const f: maplibregl.FilterSpecification = ['in', ['get', 'd'], ['literal', [...filtry]]];
    mapa.setFilter('cieplo', f);
    mapa.setFilter('punkt', f);
  }, [mapa, filtry]);

  useEffect(() => {
    if (!mapa || wybrany == null) return;
    mapa.setFeatureState({ source: 'p', id: wybrany }, { wybrany: true });
    return () => { mapa.setFeatureState({ source: 'p', id: wybrany }, { wybrany: false }); };
  }, [mapa, wybrany]);

  const przelacz = (d: Dostepnosc) => setFiltry((f) => { const n = new Set(f); n.has(d) ? n.delete(d) : n.add(d); return n; });
  const p = wybrany != null ? dane.punkty[wybrany] : null;
  const l = p && linkiNawigacji(p);

  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <div ref={ref} style={{ position: 'absolute', inset: 0 }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, maxWidth: 520, margin: '0 auto', background: '#fff',
        borderRadius: '18px 18px 0 0', boxShadow: '0 -4px 20px rgba(0,0,0,.18)', padding: '10px 16px 64px', font: '14px system-ui',
      }}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: '#cbd5e1', margin: '0 auto 10px' }} />
        {p && l ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 8 }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 700 }}>{p.adres}</div>
                <div style={{ color: '#64748b' }}>{p.gmina}</div>
              </div>
              <button onClick={() => setWybrany(null)} style={{ border: 0, background: '#f1f5f9', borderRadius: 99, width: 32, height: 32, fontSize: 16, cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ margin: '12px 0', padding: 10, borderLeft: `4px solid ${DOSTEPNOSC[p.d].kolor}`, background: '#f8fafc', borderRadius: 6 }}>
              <div style={{ fontWeight: 700, color: DOSTEPNOSC[p.d].kolor }}>{DOSTEPNOSC[p.d].nazwa}</div>
              <div>{DOSTEPNOSC[p.d].opis}</div>
            </div>
            <a href={l.google} target="_blank" style={{ display: 'block', textAlign: 'center', padding: 14, borderRadius: 12, background: '#0f172a', color: '#fff', fontWeight: 700, fontSize: 16, textDecoration: 'none' }}>Prowadź</a>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 8, fontSize: 13 }}>
              <a href={l.apple} target="_blank">Apple Maps</a><a href={l.geo}>Inna aplikacja</a>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Pokaż punkty schronienia</div>
            {WSZYSTKIE.map((d) => (
              <label key={d} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderTop: d ? '1px solid #f1f5f9' : 0, cursor: 'pointer' }}>
                <span style={{ width: 14, height: 14, borderRadius: 99, background: DOSTEPNOSC[d].kolor, flex: 'none' }} />
                <span style={{ flex: 1 }}>{DOSTEPNOSC[d].nazwa}</span>
                <input type="checkbox" checked={filtry.has(d)} onChange={() => przelacz(d)} style={{ width: 20, height: 20 }} />
              </label>
            ))}
            <div style={{ color: '#64748b', fontSize: 12, margin: '4px 0 8px' }}>Przybliż mapę, żeby zobaczyć pojedyncze punkty.</div>
          </div>
        )}
        <Stopka stan={dane.stan} style={{ marginTop: 10 }} />
      </div>
    </div>
  );
}
