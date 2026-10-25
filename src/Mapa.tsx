import { useRef, useState } from 'react';
import Map, {
  AttributionControl, GeolocateControl, Layer, NavigationControl, Source,
  type MapLayerMouseEvent, type MapRef,
} from 'react-map-gl/maplibre';
import type { ExpressionSpecification, GeoJSONSource } from 'maplibre-gl';
import type { FeatureCollection, Point } from 'geojson';
import { KOLOR_DOSTEPNOSCI } from './dane/zbior.ts';

const STYL = 'https://tiles.openfreemap.org/styles/liberty';
const SRODEK_POLSKI = { longitude: 19.4, latitude: 52.1, zoom: 5.6 };

// Kolor klastra mówi, jaka część jego punktów schronienia jest Całodobowa (c0 / point_count).
const UDZIAL_CALODOBOWYCH: ExpressionSpecification = ['/', ['get', 'c0'], ['get', 'point_count']];
const MORSKI = '#0d9488';
const JEST_KLASTREM: ExpressionSpecification = ['has', 'point_count'];

export function Mapa({ geojson, onKlikMapy }: { geojson?: FeatureCollection<Point>; onKlikMapy: () => void }) {
  const mapa = useRef<MapRef>(null);
  const zwinieta = useRef(false);
  const [nadKlastrem, setNadKlastrem] = useState(false);

  // Zwinięta atrybucja MapLibre 4.7 rozwija się sama, gdy styl dostarczy pierwsze atrybucje.
  // Zwijamy ją raz, gdy kontrolka dostanie klasę maplibregl-compact; potem rozwija się tylko po dotknięciu ⓘ.
  const zwinAtrybucje = () => {
    if (zwinieta.current) return;
    const el = mapa.current?.getContainer().querySelector('.maplibregl-ctrl-attrib.maplibregl-compact');
    if (!el) return;
    el.classList.remove('maplibregl-compact-show');
    zwinieta.current = true;
  };

  const klik = async (e: MapLayerMouseEvent) => {
    const m = mapa.current;
    // e.features pochodzi z ostatniego ruchu myszy, a po przybliżeniu klaster pod kursorem już nie istnieje.
    const [klaster] = m?.getLayer('klaster') ? m.queryRenderedFeatures(e.point, { layers: ['klaster'] }) : [];
    if (!m || !klaster) return onKlikMapy();
    try {
      const zoom = await (m.getSource('punkty') as GeoJSONSource).getClusterExpansionZoom(klaster.properties.cluster_id);
      m.easeTo({ center: (klaster.geometry as Point).coordinates as [number, number], zoom });
    } catch {
      // Klaster zniknął w trakcie (np. po podmianie danych): klik po prostu nic nie robi.
    }
  };

  return (
    <Map
      ref={mapa}
      mapStyle={STYL}
      initialViewState={SRODEK_POLSKI}
      attributionControl={false}
      onStyleData={zwinAtrybucje}
      onSourceData={zwinAtrybucje}
      onClick={klik}
      interactiveLayerIds={geojson ? ['klaster'] : []}
      onMouseEnter={() => setNadKlastrem(true)}
      onMouseLeave={() => setNadKlastrem(false)}
      cursor={nadKlastrem ? 'pointer' : ''}
      style={{ position: 'absolute', inset: 0 }}
    >
      <NavigationControl position="top-right" />
      {/* Lokalizacja zostaje w przeglądarce: GeolocateControl tylko centruje mapę. */}
      <GeolocateControl position="top-right" trackUserLocation positionOptions={{ enableHighAccuracy: true }} />
      <AttributionControl position="bottom-right" compact />
      {geojson && (
        <Source
          id="punkty"
          type="geojson"
          data={geojson}
          cluster
          clusterMaxZoom={15}
          clusterRadius={60}
          clusterProperties={{ c0: ['+', ['case', ['==', ['get', 'd'], 0], 1, 0]] }}
        >
          <Layer
            id="klaster"
            type="circle"
            filter={JEST_KLASTREM}
            paint={{
              'circle-color': [
                'interpolate', ['linear'], UDZIAL_CALODOBOWYCH,
                0, KOLOR_DOSTEPNOSCI[2], 0.25, MORSKI, 0.5, KOLOR_DOSTEPNOSCI[0],
              ],
              'circle-radius': ['interpolate', ['linear'], ['sqrt', ['get', 'point_count']], 1, 12, 100, 44],
              'circle-opacity': 0.88,
              'circle-stroke-color': '#fff',
              'circle-stroke-width': 3,
            }}
          />
          <Layer
            id="klaster-liczba"
            type="symbol"
            filter={JEST_KLASTREM}
            layout={{ 'text-field': ['get', 'point_count_abbreviated'], 'text-size': 13, 'text-font': ['Noto Sans Bold'] }}
            paint={{ 'text-color': '#fff' }}
          />
          <Layer
            id="punkt"
            type="circle"
            filter={['!', JEST_KLASTREM]}
            paint={{
              'circle-color': ['match', ['get', 'd'], 0, KOLOR_DOSTEPNOSCI[0], 1, KOLOR_DOSTEPNOSCI[1], KOLOR_DOSTEPNOSCI[2]],
              'circle-radius': ['interpolate', ['linear'], ['zoom'], 10, 5, 17, 10],
              'circle-stroke-color': '#fff',
              'circle-stroke-width': 2,
            }}
          />
        </Source>
      )}
    </Map>
  );
}
