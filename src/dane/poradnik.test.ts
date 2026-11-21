import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { odczytajPoradnik } from './poradnik.ts';

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

  it('plik public/dane/poradnik.json ma poprawny format', () => {
    const plik = readFileSync(new URL('../../public/dane/poradnik.json', import.meta.url), 'utf8');
    expect(() => odczytajPoradnik(JSON.parse(plik))).not.toThrow();
  });
});
