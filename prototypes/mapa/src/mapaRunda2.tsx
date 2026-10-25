// PROTOTYP runda 2: elementy już wybrane przez użytkownika – kolory punktów z A, mapa (Liberty + klastry wg udziału) i legenda z C.
import { useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { DOSTEPNOSC, WSZYSTKIE, Dane, Dostepnosc, doGeojson } from './shared';

export const STYL_LIBERTY = 'https://tiles.openfreemap.org/styles/liberty';

export function dodajWarstwy(mapa: maplibregl.Map, dane: Dane, onPunkt: (i: number) => void) {
  mapa.addSource('p', {
    type: 'geojson', data: dane.geojson, cluster: true, clusterMaxZoom: 15, clusterRadius: 60,
    clusterProperties: { c0: ['+', ['case', ['==', ['get', 'd'], 0], 1, 0]] },
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
  // Punkty jak w wariancie A.
  mapa.addLayer({ id: 'punkt', type: 'circle', source: 'p', filter: ['!', ['has', 'point_count']], paint: {
    'circle-color': ['match', ['get', 'd'], 0, DOSTEPNOSC[0].kolor, 1, DOSTEPNOSC[1].kolor, DOSTEPNOSC[2].kolor],
    'circle-radius': ['interpolate', ['linear'], ['zoom'], 10, 5, 17, 10],
    'circle-stroke-color': '#fff', 'circle-stroke-width': 2,
  } });

  mapa.on('click', 'klaster', async (e) => {
    const f = e.features![0];
    const zoom = await (mapa.getSource('p') as maplibregl.GeoJSONSource).getClusterExpansionZoom(f.properties.cluster_id);
    mapa.easeTo({ center: (f.geometry as GeoJSON.Point).coordinates as [number, number], zoom });
  });
  mapa.on('click', 'punkt', (e) => onPunkt(e.features![0].properties.i as number));
  for (const l of ['klaster', 'punkt']) {
    mapa.on('mouseenter', l, () => (mapa.getCanvas().style.cursor = 'pointer'));
    mapa.on('mouseleave', l, () => (mapa.getCanvas().style.cursor = ''));
  }
}

export function useFiltr(mapa: maplibregl.Map | null, dane: Dane) {
  const [filtry, setFiltry] = useState<Set<Dostepnosc>>(new Set(WSZYSTKIE));
  useEffect(() => {
    if (!mapa) return;
    (mapa.getSource('p') as maplibregl.GeoJSONSource).setData(doGeojson(dane.punkty.filter((p) => filtry.has(p.d))));
  }, [mapa, filtry]);
  const przelacz = (d: Dostepnosc) => setFiltry((f) => { const n = new Set(f); n.has(d) ? n.delete(d) : n.add(d); return n; });
  return { filtry, przelacz };
}

export function useWWidoku(mapa: maplibregl.Map | null, dane: Dane) {
  const [n, setN] = useState([0, 0, 0]);
  useEffect(() => {
    if (!mapa) return;
    const licz = () => {
      const b = mapa.getBounds();
      const w = [0, 0, 0];
      for (const p of dane.punkty) if (b.contains([p.lng, p.lat])) w[p.d]++;
      setN(w);
    };
    licz();
    mapa.on('moveend', licz);
    return () => { mapa.off('moveend', licz); };
  }, [mapa]);
  return n;
}

// Legenda z C: przycisk = filtr, liczba = punkty w aktualnym widoku.
export function Legenda({ filtry, przelacz, wWidoku }: { filtry: Set<Dostepnosc>; przelacz: (d: Dostepnosc) => void; wWidoku: number[] }) {
  return (
    <div>
      <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 6 }}>Dostępność · w widoku</div>
      {WSZYSTKIE.map((d) => {
        const on = filtry.has(d);
        return (
          <button key={d} onClick={() => przelacz(d)} style={{
            display: 'flex', width: '100%', alignItems: 'center', gap: 10, padding: 10, marginBottom: 6, borderRadius: 10,
            border: '1px solid #e2e8f0', background: on ? '#fff' : 'transparent', opacity: on ? 1 : 0.45, cursor: 'pointer', font: 'inherit', textAlign: 'left',
          }}>
            <span style={{ width: 14, height: 14, borderRadius: 99, background: DOSTEPNOSC[d].kolor, border: '2px solid #fff', boxShadow: '0 0 0 1px #cbd5e1', flex: 'none' }} />
            <span style={{ flex: 1 }}>{DOSTEPNOSC[d].nazwa}</span>
            <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{wWidoku[d].toLocaleString('pl')}</span>
          </button>
        );
      })}
      <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Kolor klastra: im bardziej zielony, tym więcej punktów całodobowych.</div>
    </div>
  );
}
