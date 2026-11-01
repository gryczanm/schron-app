import { useEffect, useRef, useState, type RefObject } from 'react';
import Map, {
  AttributionControl, GeolocateControl, Layer, NavigationControl, Source,
  useMap, type MapLayerMouseEvent, type MapRef,
} from 'react-map-gl/maplibre';
import type { ExpressionSpecification, GeoJSONSource, StyleSpecification } from 'maplibre-gl';
import type { FeatureCollection, Point } from 'geojson';
import { KOLOR_DOSTEPNOSCI, type Prostokat, type Punkt } from './dane/zbior.ts';
import { przekierujGlify, wczytajStyl } from './podklad.ts';

const PRZEKIERUJ_GLIFY = przekierujGlify(import.meta.env.BASE_URL);
const SRODEK_POLSKI = { longitude: 19.4, latitude: 52.1, zoom: 5.6 };

// Kolor klastra mówi, jaka część jego punktów schronienia jest Całodobowa (c0 / point_count).
const UDZIAL_CALODOBOWYCH: ExpressionSpecification = ['/', ['get', 'c0'], ['get', 'point_count']];
const MORSKI = '#0d9488';
const JEST_KLASTREM: ExpressionSpecification = ['has', 'point_count'];
const KOLOR_PUNKTU: ExpressionSpecification = ['match', ['get', 'd'], 0, KOLOR_DOSTEPNOSCI[0], 1, KOLOR_DOSTEPNOSCI[1], KOLOR_DOSTEPNOSCI[2]];
const CIEMNY = '#0f172a';

type Wlasciwosci = {
  geojson?: FeatureCollection<Point>;
  wybrany: Punkt | null;
  onWybierz: (i: number) => void; // i to indeks punktu schronienia w zbiorze
  onKlikMapy: () => void;
  onWidok: (widok: Prostokat) => void; // od razu po utworzeniu mapy i po każdym zakończonym ruchu
  panel: RefObject<HTMLElement>; // część ekranu zasłonięta przez panel
};

export function Mapa({ geojson, wybrany, onWybierz, onKlikMapy, onWidok, panel }: Wlasciwosci) {
  const mapa = useRef<MapRef>(null);
  const zwinieta = useRef(false);
  const [nadObiektem, setNadObiektem] = useState(false);
  const [styl, setStyl] = useState<StyleSpecification | null>(null);

  useEffect(() => void wczytajStyl().then(setStyl), []);

  // Wybrany punkt ląduje na środku części mapy, której panel nie zasłania. Przybliżenie zostaje.
  // offset, nie padding: padding zostaje w mapie i przesuwałby późniejsze przybliżenia klastrów.
  useEffect(() => {
    const m = mapa.current;
    if (!m || !wybrany) return;
    const ramka = panel.current?.getBoundingClientRect();
    const mapaRamka = m.getContainer().getBoundingClientRect();
    let offset: [number, number] = [0, 0];
    if (ramka && ramka.top <= mapaRamka.top) offset = [(ramka.right - mapaRamka.left) / 2, 0]; // panel boczny
    else if (ramka) offset = [0, -(mapaRamka.bottom - ramka.top) / 2]; // panel dolny
    m.easeTo({ center: [wybrany.lng, wybrany.lat], offset });
  }, [wybrany, panel]);

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
    const [obiekt] = m?.getLayer('klaster') ? m.queryRenderedFeatures(e.point, { layers: ['klaster', 'punkt'] }) : [];
    if (!m || !obiekt) return onKlikMapy();
    if (obiekt.layer.id === 'punkt') return onWybierz(obiekt.properties.i);
    const klaster = obiekt;
    try {
      const zoom = await (m.getSource('punkty') as GeoJSONSource).getClusterExpansionZoom(klaster.properties.cluster_id);
      m.easeTo({ center: (klaster.geometry as Point).coordinates as [number, number], zoom });
    } catch {
      // Klaster zniknął w trakcie (np. po podmianie danych): klik po prostu nic nie robi.
    }
  };

  // Mapa powstaje dopiero ze stylem: wczytajStyl offline daje styl zapasowy, więc punkty i tak się narysują.
  if (!styl) return null;

  return (
    <Map
      ref={mapa}
      mapStyle={styl}
      transformRequest={PRZEKIERUJ_GLIFY}
      initialViewState={SRODEK_POLSKI}
      attributionControl={false}
      onStyleData={zwinAtrybucje}
      onSourceData={zwinAtrybucje}
      onClick={klik}
      interactiveLayerIds={geojson ? ['klaster', 'punkt'] : []}
      onMouseEnter={() => setNadObiektem(true)}
      onMouseLeave={() => setNadObiektem(false)}
      cursor={nadObiektem ? 'pointer' : ''}
      style={{ position: 'absolute', inset: 0 }}
    >
      <NavigationControl position="top-right" />
      {/* Lokalizacja zostaje w przeglądarce: GeolocateControl tylko centruje mapę. */}
      <GeolocateControl position="top-right" trackUserLocation positionOptions={{ enableHighAccuracy: true }} />
      <AttributionControl position="bottom-right" compact />
      <ZglosWidok onWidok={onWidok} />
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
              'circle-color': KOLOR_PUNKTU,
              'circle-radius': ['interpolate', ['linear'], ['zoom'], 10, 5, 17, 10],
              'circle-stroke-color': '#fff',
              'circle-stroke-width': 2,
            }}
          />
        </Source>
      )}
      {/* Osobne źródło bez klastrów: wybrany punkt leży nad klastrami i jest widoczny też po oddaleniu. */}
      {wybrany && (
        <Source id="wybrany" type="geojson" data={{ type: 'Point', coordinates: [wybrany.lng, wybrany.lat] }}>
          <Layer
            id="wybrany"
            type="circle"
            paint={{
              'circle-color': KOLOR_DOSTEPNOSCI[wybrany.d],
              'circle-radius': ['interpolate', ['linear'], ['zoom'], 10, 9, 17, 14],
              'circle-stroke-color': CIEMNY,
              'circle-stroke-width': 4,
            }}
          />
        </Source>
      )}
    </Map>
  );
}

// Zgłasza prostokąt widoku od razu i po każdym zakończonym ruchu mapy. Nie czeka na load,
// bo ten czeka na kafelki podkładu, a liczniki potrzebują tylko prostokąta.
// Osobny komponent, bo dzieci <Map> powstają dopiero, gdy mapa już istnieje.
function ZglosWidok({ onWidok }: { onWidok: (widok: Prostokat) => void }) {
  const { current: m } = useMap();
  useEffect(() => {
    if (!m) return;
    const zglos = () => {
      const b = m.getBounds();
      onWidok({ zachod: b.getWest(), poludnie: b.getSouth(), wschod: b.getEast(), polnoc: b.getNorth() });
    };
    zglos();
    m.on('moveend', zglos);
    return () => void m.off('moveend', zglos);
  }, [m, onWidok]);
  return null;
}
