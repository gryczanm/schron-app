import { describe, expect, it } from 'vitest';
import { odczytajZbior, policzWWidoku, przefiltruj, szczegolyPunktu, zbudujZbior, type Dostepnosc } from './zbior.ts';

const NAGLOWEK =
  'Identyfikator publiczny,Nazwa,Rodzaj obiektu,Opis ogolny,Gmina,Powiat,Wojewodztwo,Szerokosc geograficzna,Dlugosc geograficzna,Adres,Dostepnosc';
const STAN = new Date('2026-10-23T09:46:36Z');

const csv = (...wiersze: string[]) => [NAGLOWEK, ...wiersze].join('\r\n') + '\r\n';

describe('zbiór punktów schronienia z CSV PSP', () => {
  it('daje punkty schronienia z adresem, gminą i Dostępnością', () => {
    const zbior = zbudujZbior(
      csv('OZO-1,Miejsce ochronne,Obiekt ochrony ludności,,Otmuchów,pow. nyski,opolskie,50.4,17.1,Rynek 1,Całodobowa'),
      STAN,
    );
    expect(odczytajZbior(zbior).punkty).toEqual([
      { id: 'OZO-1', lat: 50.4, lng: 17.1, adres: 'Rynek 1', gmina: 'Otmuchów', d: 0 },
    ]);
  });

  it('zamienia trzy wartości Dostępności na kody 0, 1, 2', () => {
    const zbior = zbudujZbior(
      csv(
        'OZO-1,,,,Gmina,,,50,17,A,Całodobowa',
        'OZO-2,,,,Gmina,,,50,17,B,Określone godziny',
        'OZO-3,,,,Gmina,,,50,17,C,Na żądanie',
      ),
      STAN,
    );
    expect(odczytajZbior(zbior).punkty.map((p) => p.d)).toEqual([0, 1, 2]);
  });

  it('pomija BOM i rozumie pola w cudzysłowie z przecinkiem i podwojonym cudzysłowem', () => {
    const zbior = zbudujZbior(
      '\uFEFF' + csv('OZO-1,,,,Gmina,,,50,17,"ul. Szkolna 5, Kraków (""stara szkoła"")",Na żądanie'),
      STAN,
    );
    const [p] = odczytajZbior(zbior).punkty;
    expect(p.id).toBe('OZO-1');
    expect(p.adres).toBe('ul. Szkolna 5, Kraków ("stara szkoła")');
    expect(p.d).toBe(2);
  });

  it('zaokrągla współrzędne do 6 miejsc po przecinku', () => {
    const zbior = zbudujZbior(csv('OZO-1,,,,Gmina,,,50.412254848596,17.1544466939522,A,Na żądanie'), STAN);
    const [p] = odczytajZbior(zbior).punkty;
    expect([p.lat, p.lng]).toEqual([50.412255, 17.154447]);
  });

  it('zostawia duplikaty i rekordy zastępcze bez zmian (ADR-0002)', () => {
    const zastepczy = 'OZO-2,,,,Gmina,,,52.215933,19.134422,Adres zastępczy,Na żądanie';
    const zbior = zbudujZbior(
      csv('OZO-1,,,,Gmina,,,50,17,Rynek 1,Całodobowa', 'OZO-1,,,,Gmina,,,50,17,Rynek 1,Całodobowa', zastepczy, zastepczy),
      STAN,
    );
    expect(odczytajZbior(zbior).punkty.map((p) => [p.id, p.lat, p.lng])).toEqual([
      ['OZO-1', 50, 17],
      ['OZO-1', 50, 17],
      ['OZO-2', 52.215933, 19.134422],
      ['OZO-2', 52.215933, 19.134422],
    ]);
  });

  it('zapisuje datę stanu jako dzień w Polsce', () => {
    const wiersz = 'OZO-1,,,,Gmina,,,50,17,A,Na żądanie';
    expect(zbudujZbior(csv(wiersz), STAN).stan).toBe('2026-10-23');
    // 23:30 UTC 23 października to już 24 października w Polsce.
    expect(zbudujZbior(csv(wiersz), new Date('2026-10-23T23:30:00Z')).stan).toBe('2026-10-24');
  });

  it('przerywa czytelnym błędem przy nieznanej Dostępności', () => {
    const tekst = csv('OZO-1,,,,Gmina,,,50,17,A,Całodobowa', 'OZO-7,,,,Gmina,,,50,17,B,Czasami');
    expect(() => zbudujZbior(tekst, STAN)).toThrow('Nieznana Dostępność „Czasami” w wierszu 3 (OZO-7)');
  });

  it('przerywa czytelnym błędem, gdy brakuje wymaganej kolumny', () => {
    const tekst = csv('OZO-1,,,,Gmina,,,50,17,A,Całodobowa').replace(',Adres,', ',Ulica,');
    expect(() => zbudujZbior(tekst, STAN)).toThrow('Brak kolumny „Adres” w CSV PSP');
  });

  it('podaje stopkę ze źródłem, datą stanu DD.MM.RRRR i zastrzeżeniem', () => {
    const zbior = zbudujZbior(csv('OZO-1,,,,Gmina,,,50,17,A,Na żądanie'), new Date('2026-03-05T12:00:00Z'));
    expect(odczytajZbior(zbior).stopka).toEqual([
      'Dane: KG PSP, CC BY 4.0 · stan z 05.03.2026',
      'Punkt schronienia nie jest schronem i nie gwarantuje ochrony.',
    ]);
  });

  it('daje punkty jako GeoJSON z Dostępnością, współrzędne w kolejności [lng, lat]', () => {
    const zbior = zbudujZbior(
      csv('OZO-1,,,,Gmina,,,50.1,17.2,A,Określone godziny', 'OZO-2,,,,Gmina,,,51.3,18.4,B,Całodobowa'),
      STAN,
    );
    expect(odczytajZbior(zbior).geojson).toEqual({
      type: 'FeatureCollection',
      features: [
        { type: 'Feature', geometry: { type: 'Point', coordinates: [17.2, 50.1] }, properties: { i: 0, d: 1 } },
        { type: 'Feature', geometry: { type: 'Point', coordinates: [18.4, 51.3] }, properties: { i: 1, d: 0 } },
      ],
    });
  });

  it('przerywa czytelnym błędem przy pustej albo nieliczbowej współrzędnej', () => {
    expect(() => zbudujZbior(csv('OZO-1,,,,Gmina,,,,17,A,Na żądanie'), STAN)).toThrow(
      'Zła współrzędna „” w wierszu 2 (OZO-1)',
    );
    expect(() => zbudujZbior(csv('OZO-1,,,,Gmina,,,50,17°,A,Na żądanie'), STAN)).toThrow(
      'Zła współrzędna „17°” w wierszu 2 (OZO-1)',
    );
  });
});

describe('szczegóły punktu schronienia', () => {
  const punkt = { id: 'OZO-1', lat: 50.4, lng: 17.1, adres: 'Rynek 1', gmina: 'Otmuchów', d: 2 } as const;

  it('podaje adres, gminę oraz nazwę i opis Dostępności', () => {
    expect(szczegolyPunktu(punkt)).toMatchObject({
      adres: 'Rynek 1',
      gmina: 'Otmuchów',
      dostepnosc: 'Na żądanie',
      opis: 'Zwykle zamknięty. Zarządca powinien udostępnić go po ogłoszeniu alarmu, w miarę możliwości – dostęp niegwarantowany.',
    });
  });

  it('opisuje każdą Dostępność', () => {
    expect(szczegolyPunktu({ ...punkt, d: 0 }).opis).toBe('Dostępny całą dobę (wg PSP).');
    expect(szczegolyPunktu({ ...punkt, d: 1 }).opis).toBe('Dostępny w godzinach pracy obiektu. Godzin nie podano.');
  });

  it('prowadzi pieszo do punktu w Google Maps', () => {
    expect(szczegolyPunktu(punkt).prowadz).toBe(
      'https://www.google.com/maps/dir/?api=1&destination=50.4,17.1&travelmode=walking',
    );
  });
});

describe('filtr Dostępności', () => {
  const { geojson } = odczytajZbior(
    zbudujZbior(
      csv(
        'OZO-1,,,,Gmina,,,50,17,A,Na żądanie',
        'OZO-2,,,,Gmina,,,50,17,B,Całodobowa',
        'OZO-3,,,,Gmina,,,50,17,C,Określone godziny',
        'OZO-4,,,,Gmina,,,50,17,D,Całodobowa',
      ),
      STAN,
    ),
  );
  const indeksy = (wlaczone: Dostepnosc[]) => przefiltruj(geojson, new Set(wlaczone)).features.map((f) => f.properties.i);

  it('zostawia punkty włączonych Dostępności z ich indeksem w zbiorze', () => {
    expect(indeksy([0, 1, 2])).toEqual([0, 1, 2, 3]);
    expect(indeksy([0])).toEqual([1, 3]);
    expect(indeksy([1, 2])).toEqual([0, 2]);
  });

  it('bez włączonych Dostępności daje pustą kolekcję', () => {
    expect(przefiltruj(geojson, new Set())).toEqual({ type: 'FeatureCollection', features: [] });
  });
});

describe('liczniki punktów schronienia w widoku', () => {
  const punkt = (lat: number, lng: number, d: Dostepnosc) => ({ id: 'OZO', lat, lng, adres: '', gmina: '', d });
  const widok = { zachod: 17, poludnie: 50, wschod: 18, polnoc: 51 };

  it('liczy osobno każdą Dostępność w prostokącie widoku', () => {
    const punkty = [punkt(50.5, 17.5, 0), punkt(50.5, 17.5, 0), punkt(50.2, 17.9, 2), punkt(52, 17.5, 1), punkt(50.5, 16.9, 0)];
    expect(policzWWidoku(punkty, widok)).toEqual([2, 0, 1]);
  });

  it('liczy punkty leżące na granicy prostokąta', () => {
    const punkty = [punkt(50, 17, 0), punkt(51, 18, 0), punkt(50, 17.5, 1), punkt(50.5, 18, 2)];
    expect(policzWWidoku(punkty, widok)).toEqual([2, 1, 1]);
  });

  it('pomija punkty tuż za granicą', () => {
    const punkty = [punkt(49.999999, 17.5, 0), punkt(51.000001, 17.5, 0), punkt(50.5, 16.999999, 1), punkt(50.5, 18.000001, 2)];
    expect(policzWWidoku(punkty, widok)).toEqual([0, 0, 0]);
  });
});
