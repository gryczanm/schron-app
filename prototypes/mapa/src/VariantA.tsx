// PROTOTYP wariant A: klasyczna mapa – chipy filtrów u góry, klastry z liczbą, dymek przy punkcie.
import { useEffect, useMemo, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { DOSTEPNOSC, WSZYSTKIE, Dane, Dostepnosc, Stopka, doGeojson, linkiNawigacji, useMapa, useZglosStan } from './shared';

export const nazwa = 'Klasyczna: chipy + klastry + dymek';

export function VariantA({ dane }: { dane: Dane }) {
  const { ref, mapa } = useMapa();
  const [filtry, setFiltry] = useState<Set<Dostepnosc>>(new Set(WSZYSTKIE));
  const [wybrany, setWybrany] = useState<number | null>(null);
  const zglos = useZglosStan();
  const liczby = useMemo(() => WSZYSTKIE.map((d) => dane.punkty.filter((p) => p.d === d).length), [dane]);

  useEffect(() => { zglos({ filtry: [...filtry].map((d) => DOSTEPNOSC[d].nazwa).join(', ') || '—', wybrany: wybrany != null ? dane.punkty[wybrany].id : '—' }); }, [filtry, wybrany]);

  useEffect(() => {
    if (!mapa) return;
    mapa.addSource('p', { type: 'geojson', data: dane.geojson, cluster: true, clusterMaxZoom: 14, clusterRadius: 50 });
    mapa.addLayer({ id: 'klaster', type: 'circle', source: 'p', filter: ['has', 'point_count'], paint: {
      'circle-color': '#1e3a8a', 'circle-opacity': 0.85, 'circle-stroke-color': '#fff', 'circle-stroke-width': 2,
      'circle-radius': ['step', ['get', 'point_count'], 14, 50, 18, 500, 24, 5000, 32],
    } });
    mapa.addLayer({ id: 'klaster-liczba', type: 'symbol', source: 'p', filter: ['has', 'point_count'], layout: {
      'text-field': ['get', 'point_count_abbreviated'], 'text-size': 12, 'text-font': ['Noto Sans Bold'],
    }, paint: { 'text-color': '#fff' } });
    mapa.addLayer({ id: 'punkt', type: 'circle', source: 'p', filter: ['!', ['has', 'point_count']], paint: {
      'circle-color': ['match', ['get', 'd'], 0, DOSTEPNOSC[0].kolor, 1, DOSTEPNOSC[1].kolor, DOSTEPNOSC[2].kolor],
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 10, 5, 17, 10],
      'circle-stroke-color': '#fff', 'circle-stroke-width': 2,
    } });

    const popup = new maplibregl.Popup({ maxWidth: '280px', offset: 12 });
    mapa.on('click', 'klaster', async (e) => {
      const f = e.features![0];
      const zoom = await (mapa.getSource('p') as maplibregl.GeoJSONSource).getClusterExpansionZoom(f.properties.cluster_id);
      mapa.easeTo({ center: (f.geometry as GeoJSON.Point).coordinates as [number, number], zoom });
    });
    mapa.on('click', 'punkt', (e) => {
      const i = e.features![0].properties.i as number;
      const p = dane.punkty[i];
      const info = DOSTEPNOSC[p.d];
      const l = linkiNawigacji(p);
      setWybrany(i);
      popup.setLngLat([p.lng, p.lat]).setHTML(`
        <div style="font:13px system-ui">
          <div style="font-weight:600;font-size:14px">${p.adres}</div>
          <div style="color:#64748b;margin-bottom:6px">${p.gmina}</div>
          <div style="display:inline-block;padding:2px 8px;border-radius:99px;background:${info.kolor};color:#fff;font-weight:600">${info.nazwa}</div>
          <div style="margin:6px 0 8px">${info.opis}</div>
          <a href="${l.google}" target="_blank" style="display:block;text-align:center;padding:8px;border-radius:8px;background:#1e3a8a;color:#fff;text-decoration:none;font-weight:600">Prowadź</a>
        </div>`).addTo(mapa);
    });
    popup.on('close', () => setWybrany(null));
    for (const l of ['klaster', 'punkt']) {
      mapa.on('mouseenter', l, () => (mapa.getCanvas().style.cursor = 'pointer'));
      mapa.on('mouseleave', l, () => (mapa.getCanvas().style.cursor = ''));
    }
  }, [mapa]);

  // Filtr na danych, żeby liczby w klastrach zgadzały się z widocznymi punktami.
  useEffect(() => {
    if (!mapa) return;
    (mapa.getSource('p') as maplibregl.GeoJSONSource).setData(doGeojson(dane.punkty.filter((p) => filtry.has(p.d))));
  }, [mapa, filtry]);

  const przelacz = (d: Dostepnosc) => setFiltry((f) => { const n = new Set(f); n.has(d) ? n.delete(d) : n.add(d); return n; });

  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <div ref={ref} style={{ position: 'absolute', inset: 0 }} />
      <div style={{ position: 'absolute', top: 12, left: 12, right: 60, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {WSZYSTKIE.map((d) => {
          const on = filtry.has(d);
          return (
            <button key={d} onClick={() => przelacz(d)} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 99, border: `2px solid ${DOSTEPNOSC[d].kolor}`,
              background: on ? DOSTEPNOSC[d].kolor : '#fff', color: on ? '#fff' : '#334155', font: '600 13px system-ui',
              boxShadow: '0 1px 4px rgba(0,0,0,.2)', cursor: 'pointer',
            }}>
              {DOSTEPNOSC[d].nazwa} <span style={{ opacity: 0.75, fontWeight: 400 }}>{liczby[d].toLocaleString('pl')}</span>
            </button>
          );
        })}
      </div>
      <Stopka stan={dane.stan} style={{ position: 'absolute', left: 12, bottom: 70, background: 'rgba(255,255,255,.9)', padding: '6px 8px', borderRadius: 6 }} />
    </div>
  );
}
