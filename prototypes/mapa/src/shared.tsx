// PROTOTYP: wspólne dane i słownik Dostępności. Nie produkcja.
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';

export type Dostepnosc = 0 | 1 | 2;

export const DOSTEPNOSC: Record<Dostepnosc, { nazwa: string; opis: string; kolor: string; znak: string }> = {
  0: { nazwa: 'Całodobowa', opis: 'Dostępny całą dobę (wg PSP).', kolor: '#16a34a', znak: '24' },
  1: { nazwa: 'Określone godziny', opis: 'Dostępny w godzinach pracy obiektu. Godzin nie podano.', kolor: '#d97706', znak: 'G' },
  2: { nazwa: 'Na żądanie', opis: 'Zwykle zamknięty. Zarządca powinien udostępnić go po ogłoszeniu alarmu, w miarę możliwości – dostęp niegwarantowany.', kolor: '#64748b', znak: '?' },
};
export const WSZYSTKIE: Dostepnosc[] = [0, 1, 2];

export type Punkt = { id: string; lat: number; lng: number; adres: string; gmina: string; d: Dostepnosc };
export type Dane = { punkty: Punkt[]; geojson: GeoJSON.FeatureCollection<GeoJSON.Point>; stan: string | null };

export function useDane(): Dane | null {
  const [dane, setDane] = useState<Dane | null>(null);
  useEffect(() => {
    fetch('/punkty.json').then((r) => r.json()).then((raw) => {
      const punkty: Punkt[] = raw.id.map((id: string, i: number) => ({
        id, lat: raw.lat[i], lng: raw.lng[i], adres: raw.adres[i], gmina: raw.gmina[i], d: raw.d[i],
      }));
      setDane({ punkty, geojson: doGeojson(punkty), stan: raw.stan });
    });
  }, []);
  return dane;
}

export function doGeojson(punkty: Punkt[]): GeoJSON.FeatureCollection<GeoJSON.Point> {
  return {
    type: 'FeatureCollection',
    features: punkty.map((p, i) => ({
      type: 'Feature', id: i,
      geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
      properties: { i, d: p.d },
    })),
  };
}

export const STYLE = 'https://tiles.openfreemap.org/styles/positron';

export function useMapa(styl = STYLE) {
  const ref = useRef<HTMLDivElement>(null);
  const [mapa, setMapa] = useState<maplibregl.Map | null>(null);
  useEffect(() => {
    const m = new maplibregl.Map({
      container: ref.current!, style: styl, center: [19.4, 52.1], zoom: 5.6,
      attributionControl: false,
    });
    // Zwinięta atrybucja w MapLibre rozwija się sama, gdy styl dostarczy pierwsze atrybucje (nie przy dodaniu kontrolki).
    // Zwijamy ją raz, zaraz po tym; potem rozwija się tylko po dotknięciu „i”.
    m.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');
    const zwin = () => {
      const el = m.getContainer().querySelector('.maplibregl-ctrl-attrib.maplibregl-compact');
      if (!el) return;
      el.classList.remove('maplibregl-compact-show');
      m.off('styledata', zwin);
      m.off('sourcedata', zwin);
    };
    m.on('styledata', zwin);
    m.on('sourcedata', zwin);
    m.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');
    m.addControl(new maplibregl.GeolocateControl({ trackUserLocation: true, positionOptions: { enableHighAccuracy: true } }), 'top-right');
    m.on('load', () => setMapa(m));
    (window as any).__mapa = m; // PROTOTYP: dostęp do mapy dla skryptów testowych
    return () => m.remove();
  }, [styl]);
  return { ref, mapa };
}

export function linkiNawigacji(p: Punkt) {
  return {
    google: `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}&travelmode=walking`,
    apple: `https://maps.apple.com/?daddr=${p.lat},${p.lng}&dirflg=w`,
    geo: `geo:${p.lat},${p.lng}?q=${p.lat},${p.lng}`,
  };
}

export function Stopka({ stan, style }: { stan: string | null; style?: React.CSSProperties }) {
  const data = stan ? stan.split('-').reverse().join('.') : '?';
  return (
    <div style={{ fontSize: 11, lineHeight: 1.35, color: '#475569', ...style }}>
      Dane: <a href="https://dane.gov.pl/pl/dataset/28058,punkty-schronienia-w-polsce" target="_blank">KG PSP</a>, CC BY 4.0 · stan z {data}
      <br />Punkt schronienia nie jest schronem i nie gwarantuje ochrony.
    </div>
  );
}

// Stan prototypu pokazywany w pasku przełącznika (reguła „surface the state”).
export const StanCtx = createContext<(s: Record<string, unknown>) => void>(() => {});
export const useZglosStan = () => useContext(StanCtx);
