// Podkład mapy z OpenFreeMap. Offline działa w miarę możliwości (cache runtime service workera),
// a jego brak nie może zablokować warstw punktów schronienia.
import type { StyleSpecification } from 'maplibre-gl';

const STYL = 'https://tiles.openfreemap.org/styles/liberty';
const GLIFY = 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf';
const GLIFY_KLASTROW = GLIFY.replace('{fontstack}', 'Noto Sans Bold').replace('{range}', '0-255');

// Sam kolor tła: punkty schronienia i klastry rysują się na nim bez kafelków, stylu i sprite'a.
const STYL_ZAPASOWY: StyleSpecification = {
  version: 8,
  sources: {},
  glyphs: GLIFY,
  layers: [{ id: 'tlo', type: 'background', paint: { 'background-color': '#f8f4f0' } }],
};

// Bez sieci i bez stylu w cache daje styl zapasowy, zamiast zostawić mapę bez stylu.
// Limit czasu, bo mapa czeka na styl, a przy słabej sieci podczas alarmu fetch potrafi wisieć.
export async function wczytajStyl(pobierz: typeof fetch = fetch, limitMs = 4000): Promise<StyleSpecification> {
  const pobierzStyl = async () => {
    const odp = await pobierz(STYL);
    if (!odp.ok) return STYL_ZAPASOWY;
    return (await odp.json()) as StyleSpecification;
  };
  const poLimicie = new Promise<StyleSpecification>((ok) => setTimeout(() => ok(STYL_ZAPASOWY), limitMs));
  return Promise.race([pobierzStyl(), poLimicie]).catch(() => STYL_ZAPASOWY);
}

// Cyfry klastrów idą z glifów Noto Sans Bold 0-255. MapLibre odrzuca cały kafelek źródła, gdy glify
// się nie wczytają, więc bez sieci znikałyby też punkty. Ten zakres leży w aplikacji i jest w precache.
// Zwraca funkcję dla transformRequest MapLibre; undefined zostawia adres bez zmian.
export function przekierujGlify(baza: string) {
  return (url: string, zasob?: string) =>
    zasob === 'Glyphs' && url === GLIFY_KLASTROW
      ? { url: `${baza}glify/noto-sans-bold-0-255.pbf` }
      : undefined;
}
