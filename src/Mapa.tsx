import { useRef } from 'react';
import Map, { AttributionControl, GeolocateControl, Layer, NavigationControl, Source, type MapRef } from 'react-map-gl/maplibre';
import type { FeatureCollection, Point } from 'geojson';
import { KOLOR_DOSTEPNOSCI } from './dane/zbior.ts';

const STYL = 'https://tiles.openfreemap.org/styles/liberty';
const SRODEK_POLSKI = { longitude: 19.4, latitude: 52.1, zoom: 5.6 };

export function Mapa({ geojson, onKlikMapy }: { geojson?: FeatureCollection<Point>; onKlikMapy: () => void }) {
  const mapa = useRef<MapRef>(null);
  const zwinieta = useRef(false);

  // Zwinięta atrybucja MapLibre 4.7 rozwija się sama, gdy styl dostarczy pierwsze atrybucje.
  // Zwijamy ją raz, gdy kontrolka dostanie klasę maplibregl-compact; potem rozwija się tylko po dotknięciu ⓘ.
  const zwinAtrybucje = () => {
    if (zwinieta.current) return;
    const el = mapa.current?.getContainer().querySelector('.maplibregl-ctrl-attrib.maplibregl-compact');
    if (!el) return;
    el.classList.remove('maplibregl-compact-show');
    zwinieta.current = true;
  };

  return (
    <Map
      ref={mapa}
      mapStyle={STYL}
      initialViewState={SRODEK_POLSKI}
      attributionControl={false}
      onStyleData={zwinAtrybucje}
      onSourceData={zwinAtrybucje}
      onClick={onKlikMapy}
      style={{ position: 'absolute', inset: 0 }}
    >
      <NavigationControl position="top-right" />
      {/* Lokalizacja zostaje w przeglądarce: GeolocateControl tylko centruje mapę. */}
      <GeolocateControl position="top-right" trackUserLocation positionOptions={{ enableHighAccuracy: true }} />
      <AttributionControl position="bottom-right" compact />
      {geojson && (
        <Source id="punkty" type="geojson" data={geojson}>
          <Layer
            id="punkt"
            type="circle"
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
