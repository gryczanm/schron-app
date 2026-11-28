import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { JEZYKI } from '../teksty.ts';
import { odczytajPoradnik, plikPoradnika } from './poradnik.ts';

const link = { nazwa: 'Poradnik bezpieczeństwa', adres: 'https://www.gov.pl/web/poradnikbezpieczenstwa' };

describe('poradnik „Co robić w razie alarmu”', () => {
  it('daje porady i linki z pliku', () => {
    expect(odczytajPoradnik({ porady: ['Zachowaj spokój.'], linki: [link] })).toEqual({
      porady: ['Zachowaj spokój.'],
      linki: [link],
    });
  });

  it('przerywa czytelnym błędem bez porad albo przy pustej poradzie', () => {
    const blad = '„porady” muszą być niepustą listą niepustych tekstów';
    expect(() => odczytajPoradnik({ porady: [], linki: [] })).toThrow(blad);
    expect(() => odczytajPoradnik({ porady: ['Zachowaj spokój.', ' '], linki: [] })).toThrow(blad);
    expect(() => odczytajPoradnik(null)).toThrow(blad);
  });

  it('przyjmuje tylko linki https z nazwą', () => {
    expect(() => odczytajPoradnik({ porady: ['A'], linki: [link, { nazwa: 'RSO', adres: 'http://rso.pl' }] })).toThrow(
      'Link nr 2 musi mieć „nazwa” i „adres” zaczynający się od https://',
    );
    expect(() => odczytajPoradnik({ porady: ['A'], linki: [{ adres: link.adres }] })).toThrow('Link nr 1');
  });

  it.each(JEZYKI)('poradnik w języku %s ma poprawny format', (jezyk) => {
    const plik = readFileSync(new URL(`../../public/dane/${plikPoradnika(jezyk)}`, import.meta.url), 'utf8');
    expect(() => odczytajPoradnik(JSON.parse(plik))).not.toThrow();
  });

  it('tłumaczenia mają tyle samo porad i linków co polski poradnik', () => {
    const wczytaj = (j: string) =>
      odczytajPoradnik(JSON.parse(readFileSync(new URL(`../../public/dane/${plikPoradnika(j)}`, import.meta.url), 'utf8')));
    const pl = wczytaj('pl');
    for (const j of JEZYKI) {
      expect(wczytaj(j).porady).toHaveLength(pl.porady.length);
      expect(wczytaj(j).linki.map((l) => l.adres)).toEqual(pl.linki.map((l) => l.adres));
    }
  });
});
