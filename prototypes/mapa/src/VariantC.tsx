// PROTOTYP wariant C: panel boczny z legendą-filtrem i licznikami w widoku; klastry barwione udziałem „Całodobowa”,
// punkty jako znaczniki z symbolem (24 / G / ?) – czytelne bez rozróżniania kolorów.
import { useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { DOSTEPNOSC, WSZYSTKIE, Dane, Dostepnosc, Stopka, doGeojson, linkiNawigacji, useMapa, useZglosStan } from './shared';

export const nazwa = 'Panel: legenda-filtr + klastry wg udziału';

export function VariantC({ dane }: { dane: Dane }) {
  const { ref, mapa } = useMapa('https://tiles.openfreemap.org/styles/liberty');
  const [filtry, setFiltry] = useState<Set<Dostepnosc>>(new Set(WSZYSTKIE));
  const [wybrany, setWybrany] = useState<number | null>(null);
  const [wWidoku, setWWidoku] = useState<number[]>([0, 0, 0]);
  const zglos = useZglosStan();

  useEffect(() => { zglos({ filtry: [...filtry].map((d) => DOSTEPNOSC[d].nazwa).join(', ') || '—', wybrany: wybrany != null ? dane.punkty[wybrany].id : '—', 'w widoku': wWidoku.join('/') }); }, [filtry, wybrany, wWidoku]);

  useEffect(() => {
    if (!mapa) return;
    mapa.addSource('p', {
      type: 'geojson', data: dane.geojson, cluster: true, clusterMaxZoom: 15, clusterRadius: 60,
      clusterProperties: {
        c0: ['+', ['case', ['==', ['get', 'd'], 0], 1, 0]],
        c1: ['+', ['case', ['==', ['get', 'd'], 1], 1, 0]],
      },
    });
    const udzial = ['/', ['get', 'c0'], ['get', 'point_count']];
    mapa.addLayer({ id: 'klaster', type: 'circle', source: 'p', filter: ['has', 'point_count'], paint: {
      'circle-color': ['interpolate', ['linear'], udzial, 0, DOSTEPNOSC[2].kolor, 0.25, '#0d9488', 0.5, DOSTEPNOSC[0].kolor] as any,
      'circle-radius': ['interpolate', ['linear'], ['sqrt', ['get', 'point_count']], 1, 12, 100, 44],
      'circle-opacity': 0.88, 'circle-stroke-color': '#fff', 'circle-stroke-width': 3,
    } });
    mapa.addLayer({ id: 'klaster-liczba', type: 'symbol', source: 'p', filter: ['has', 'point_count'], layout: {
      'text-field': ['get', 'point_count_abbreviated'], 'text-size': 13, 'text-font': ['Noto Sans Bold'],
    }, paint: { 'text-color': '#fff' } });
    mapa.addLayer({ id: 'punkt', type: 'circle', source: 'p', filter: ['!', ['has', 'point_count']], paint: {
      'circle-color': ['match', ['get', 'd'], 0, DOSTEPNOSC[0].kolor, 1, DOSTEPNOSC[1].kolor, DOSTEPNOSC[2].kolor],
      'circle-radius': 11, 'circle-stroke-color': '#fff', 'circle-stroke-width': 2,
    } });
    mapa.addLayer({ id: 'punkt-znak', type: 'symbol', source: 'p', filter: ['!', ['has', 'point_count']], layout: {
      'text-field': ['match', ['get', 'd'], 0, DOSTEPNOSC[0].znak, 1, DOSTEPNOSC[1].znak, DOSTEPNOSC[2].znak],
      'text-size': 11, 'text-font': ['Noto Sans Bold'], 'text-allow-overlap': true,
    }, paint: { 'text-color': '#fff' } });

    mapa.on('click', 'klaster', async (e) => {
      const f = e.features![0];
      const zoom = await (mapa.getSource('p') as maplibregl.GeoJSONSource).getClusterExpansionZoom(f.properties.cluster_id);
      mapa.easeTo({ center: (f.geometry as GeoJSON.Point).coordinates as [number, number], zoom });
    });
    mapa.on('click', 'punkt', (e) => setWybrany(e.features![0].properties.i as number));
    for (const l of ['klaster', 'punkt']) {
      mapa.on('mouseenter', l, () => (mapa.getCanvas().style.cursor = 'pointer'));
      mapa.on('mouseleave', l, () => (mapa.getCanvas().style.cursor = ''));
    }
  }, [mapa]);

  useEffect(() => {
    if (!mapa) return;
    (mapa.getSource('p') as maplibregl.GeoJSONSource).setData(doGeojson(dane.punkty.filter((p) => filtry.has(p.d))));
  }, [mapa, filtry]);

  // Liczniki punktów w aktualnym widoku (wszystkie, niezależnie od filtra).
  useEffect(() => {
    if (!mapa) return;
    const licz = () => {
      const b = mapa.getBounds();
      const n = [0, 0, 0];
      for (const p of dane.punkty) if (b.contains([p.lng, p.lat])) n[p.d]++;
      setWWidoku(n);
    };
    licz();
    mapa.on('moveend', licz);
    return () => { mapa.off('moveend', licz); };
  }, [mapa]);

  const przelacz = (d: Dostepnosc) => setFiltry((f) => { const n = new Set(f); n.has(d) ? n.delete(d) : n.add(d); return n; });
  const p = wybrany != null ? dane.punkty[wybrany] : null;
  const l = p && linkiNawigacji(p);

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexWrap: 'wrap', font: '14px system-ui' }}>
      <aside style={{ flex: '1 1 300px', maxWidth: 360, minWidth: 0, padding: 16, overflow: 'auto', background: '#f8fafc', borderRight: '1px solid #e2e8f0', maxHeight: '100%', boxSizing: 'border-box' }}>
        <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>Punkty schronienia</div>
        <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 6 }}>Dostępność · w widoku</div>
        {WSZYSTKIE.map((d) => {
          const on = filtry.has(d);
          return (
            <button key={d} onClick={() => przelacz(d)} style={{
              display: 'flex', width: '100%', alignItems: 'center', gap: 10, padding: 10, marginBottom: 6, borderRadius: 10,
              border: '1px solid #e2e8f0', background: on ? '#fff' : 'transparent', opacity: on ? 1 : 0.45, cursor: 'pointer', font: 'inherit', textAlign: 'left',
            }}>
              <span style={{ width: 24, height: 24, borderRadius: 99, background: DOSTEPNOSC[d].kolor, color: '#fff', fontSize: 11, fontWeight: 700, display: 'grid', placeItems: 'center', flex: 'none' }}>{DOSTEPNOSC[d].znak}</span>
              <span style={{ flex: 1 }}>{DOSTEPNOSC[d].nazwa}</span>
              <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{wWidoku[d].toLocaleString('pl')}</span>
            </button>
          );
        })}
        <div style={{ fontSize: 12, color: '#64748b', margin: '8px 0 16px' }}>Kolor klastra: im bardziej zielony, tym więcej punktów całodobowych.</div>
        {p && l ? (
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{p.adres}</div>
            <div style={{ color: '#64748b', marginBottom: 8 }}>{p.gmina}</div>
            <div style={{ color: DOSTEPNOSC[p.d].kolor, fontWeight: 700 }}>{DOSTEPNOSC[p.d].nazwa}</div>
            <div style={{ marginBottom: 12 }}>{DOSTEPNOSC[p.d].opis}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <a href={l.google} target="_blank" style={{ flex: 1, textAlign: 'center', padding: 10, borderRadius: 8, background: '#16a34a', color: '#fff', fontWeight: 700, textDecoration: 'none' }}>Prowadź</a>
              <button onClick={() => setWybrany(null)} style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer' }}>Zamknij</button>
            </div>
          </div>
        ) : (
          <div style={{ color: '#64748b' }}>Kliknij punkt na mapie, żeby zobaczyć szczegóły.</div>
        )}
        <Stopka stan={dane.stan} style={{ marginTop: 16 }} />
      </aside>
      <div ref={ref} style={{ flex: '999 1 320px', minHeight: '55vh', position: 'relative' }} />
    </div>
  );
}
