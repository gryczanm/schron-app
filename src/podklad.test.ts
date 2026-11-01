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

  it('z siecią daje styl OpenFreeMap', async () => {
    const liberty = { version: 8, sources: { openmaptiles: { type: 'vector', url: 'https://tiles.openfreemap.org/planet' } }, layers: [] };
    const styl = await wczytajStyl(async () => Response.json(liberty));
    expect(styl).toEqual(liberty);
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
