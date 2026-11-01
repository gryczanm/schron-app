import { describe, expect, it } from 'vitest';
import { przekierujGlify, wczytajStyl } from './podklad.ts';

const BAZA = '/schron-app/';

describe('styl podkładu', () => {
  it('bez sieci daje zapasowy styl bez podkładu, z lokalnymi glifami', async () => {
    const styl = await wczytajStyl(() => Promise.reject(new TypeError('Failed to fetch')));
    expect(styl).toMatchObject({ version: 8, sources: {}, glyphs: expect.stringContaining('{fontstack}') });
  });

  it('przy błędzie serwera też daje zapasowy styl', async () => {
    const styl = await wczytajStyl(async () => Response.json({ message: 'Service Unavailable' }, { status: 503 }));
    expect(styl).toMatchObject({ sources: {} });
  });

  it('gdy sieć wisi, po limicie czasu daje zapasowy styl', async () => {
    const styl = await wczytajStyl(() => new Promise(() => {}), 10);
    expect(styl).toMatchObject({ sources: {} });
  });

  it('z siecią daje styl OpenFreeMap', async () => {
    const liberty = { version: 8, sources: { openmaptiles: { type: 'vector', url: 'https://tiles.openfreemap.org/planet' } }, layers: [] };
    const styl = await wczytajStyl(async () => Response.json(liberty));
    expect(styl).toEqual(liberty);
  });
});

describe('etykiety podkładu', () => {
  const NAZWA_LIBERTY = [
    'case', ['has', 'name:nonlatin'],
    ['concat', ['get', 'name:latin'], '\n', ['get', 'name:nonlatin']],
    ['coalesce', ['get', 'name_en'], ['get', 'name']],
  ];
  const liberty = {
    version: 8,
    sources: {},
    layers: [
      { id: 'label_country_1', type: 'symbol', source: 'openmaptiles', layout: { 'text-field': NAZWA_LIBERTY, 'text-size': 14 } },
      { id: 'highway-shield-non-us', type: 'symbol', source: 'openmaptiles', layout: { 'text-field': ['to-string', ['get', 'ref']] } },
    ],
  };

  it('pokazują polską nazwę, a gdy jej nie ma, nazwę domyślną', async () => {
    const styl = await wczytajStyl(async () => Response.json(liberty));
    expect(styl.layers[0]).toMatchObject({ layout: { 'text-field': ['coalesce', ['get', 'name:pl'], ['get', 'name']], 'text-size': 14 } });
  });

  it('numerów dróg nie zmieniają', async () => {
    const styl = await wczytajStyl(async () => Response.json(liberty));
    expect(styl.layers[1]).toEqual(liberty.layers[1]);
  });
});

describe('glify cyfr klastrów', () => {
  it('Noto Sans Bold 0-255 bierze z pliku aplikacji', () => {
    expect(przekierujGlify(BAZA)('https://tiles.openfreemap.org/fonts/Noto Sans Bold/0-255.pbf', 'Glyphs')).toEqual({
      url: '/schron-app/glify/noto-sans-bold-0-255.pbf',
    });
  });

  it('inne zakresy, kroje i zasoby zostawia bez zmian', () => {
    const przekieruj = przekierujGlify(BAZA);
    expect(przekieruj('https://tiles.openfreemap.org/fonts/Noto Sans Bold/256-511.pbf', 'Glyphs')).toBeUndefined();
    expect(przekieruj('https://tiles.openfreemap.org/fonts/Noto Sans Regular/0-255.pbf', 'Glyphs')).toBeUndefined();
    expect(przekieruj('https://tiles.openfreemap.org/planet', 'Source')).toBeUndefined();
  });
});
