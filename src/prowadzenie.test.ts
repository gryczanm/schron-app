import { describe, expect, it } from 'vitest';
import {
  azymut, formatujOdleglosc, kierunek, kierunekTelefonu, odleglosc, okrag, opisOdleglosci, progNaMiejscu, type LngLat,
} from './prowadzenie.ts';

const WARSZAWA: LngLat = [21.0122, 52.2297];
const KRAKOW: LngLat = [19.945, 50.0647];

describe('odległość w linii prostej', () => {
  it('Warszawa–Kraków to ok. 252 km', () => {
    expect(odleglosc(WARSZAWA, KRAKOW) / 1000).toBeCloseTo(252, 0);
  });

  it('jest zerowa dla tego samego miejsca i symetryczna', () => {
    expect(odleglosc(KRAKOW, KRAKOW)).toBe(0);
    expect(odleglosc(WARSZAWA, KRAKOW)).toBeCloseTo(odleglosc(KRAKOW, WARSZAWA), 6);
  });

  it('0,001° szerokości to ok. 111 m', () => {
    expect(odleglosc([17, 50], [17, 50.001])).toBeCloseTo(111.2, 0);
  });
});

describe('azymut', () => {
  it('daje cztery strony świata', () => {
    const tu: LngLat = [17, 50];
    expect(azymut(tu, [17, 50.01])).toBeCloseTo(0, 3);
    expect(azymut(tu, [17.01, 50])).toBeCloseTo(90, 1);
    expect(azymut(tu, [17, 49.99])).toBeCloseTo(180, 3);
    expect(azymut(tu, [16.99, 50])).toBeCloseTo(270, 1);
  });

  it('z Warszawy do Krakowa to południowy zachód', () => {
    const az = azymut(WARSZAWA, KRAKOW);
    expect(az).toBeGreaterThan(180);
    expect(az).toBeLessThan(270);
  });
});

describe('formatowanie odległości', () => {
  it('zaokrągla do 10 m', () => {
    expect(formatujOdleglosc(84)).toBe('80 m');
    expect(formatujOdleglosc(85)).toBe('90 m');
    expect(formatujOdleglosc(994)).toBe('990 m');
  });

  it('od 1000 m podaje km z przecinkiem', () => {
    expect(formatujOdleglosc(995)).toBe('1,0 km');
    expect(formatujOdleglosc(1440)).toBe('1,4 km');
    expect(formatujOdleglosc(12_345)).toBe('12,3 km');
  });

  it('przy słabym GPS (od 50 m) dodaje „~”', () => {
    expect(formatujOdleglosc(500, 49)).toBe('500 m');
    expect(formatujOdleglosc(500, 50)).toBe('~500 m');
    expect(formatujOdleglosc(1440, 120)).toBe('~1,4 km');
  });

  it('przy pozycji wskazanej ręcznie nie dodaje „~”', () => {
    expect(formatujOdleglosc(500, null)).toBe('500 m');
  });
});

describe('opis pod odległością', () => {
  it('zawsze mówi „w linii prostej”', () => {
    expect(opisOdleglosci(5)).toBe('w linii prostej');
  });

  it('od 30 m dokładności dopisuje GPS', () => {
    expect(opisOdleglosci(29)).toBe('w linii prostej');
    expect(opisOdleglosci(30.4)).toBe('w linii prostej · GPS ±30 m');
  });

  it('przy pozycji wskazanej ręcznie mówi o tym zamiast GPS', () => {
    expect(opisOdleglosci(null)).toBe('w linii prostej · pozycja wskazana ręcznie');
  });
});

describe('próg „Jesteś na miejscu”', () => {
  it('to większa z wartości: 25 m albo dokładność GPS', () => {
    expect(progNaMiejscu(10)).toBe(25);
    expect(progNaMiejscu(80)).toBe(80);
    expect(progNaMiejscu(null)).toBe(25);
  });

  it('obejmuje sam próg', () => {
    const tu: LngLat = [17, 50];
    const cel: LngLat = [17, 50.0002]; // ok. 22 m
    expect(kierunek(tu, cel, 5, null).naMiejscu).toBe(true);
    expect(kierunek(tu, [17, 50.0003], 5, null).naMiejscu).toBe(false); // ok. 33 m
    expect(kierunek(tu, [17, 50.0003], 40, null).naMiejscu).toBe(true);
  });
});

describe('strzałka', () => {
  const tu: LngLat = [17, 50];
  const naWschod: LngLat = [17.01, 50];

  it('bez kompasu pokazuje kierunek względem północy', () => {
    const k = kierunek(tu, naWschod, 10, null);
    expect(k.wzgledemPolnocy).toBe(true);
    expect(k.strzalka).toBeCloseTo(90, 1);
  });

  // Różnica kątów z zawinięciem: 359,99° i 0° to prawie to samo.
  const roznica = (a: number, b: number) => Math.abs(((a - b + 540) % 360) - 180);

  it('z kompasem pokazuje kierunek względem telefonu', () => {
    expect(roznica(kierunek(tu, naWschod, 10, 90).strzalka, 0)).toBeLessThan(0.1); // telefon na wschód: prosto
    expect(roznica(kierunek(tu, naWschod, 10, 180).strzalka, 270)).toBeLessThan(0.1); // telefon na południe: w lewo
    expect(kierunek(tu, naWschod, 10, 0).wzgledemPolnocy).toBe(false);
  });
});

describe('kierunek telefonu z czujnika', () => {
  it('iPhone: bierze webkitCompassHeading', () => {
    expect(kierunekTelefonu({ alpha: 10, absolute: false, webkitCompassHeading: 45 }, 0)).toBe(45);
  });

  it('Android: alpha w zdarzeniu absolutnym liczy się przeciwnie do wskazówek', () => {
    expect(kierunekTelefonu({ alpha: 90, absolute: true }, 0)).toBe(270);
    expect(kierunekTelefonu({ alpha: 0, absolute: true }, 0)).toBe(0);
  });

  it('pomija zdarzenia bez kompasu', () => {
    expect(kierunekTelefonu({ alpha: 90, absolute: false }, 0)).toBeNull();
    expect(kierunekTelefonu({ alpha: null, absolute: true }, 0)).toBeNull();
  });

  it('uwzględnia obrót ekranu w poziomie', () => {
    expect(kierunekTelefonu({ alpha: 0, absolute: true }, 90)).toBe(90);
    expect(kierunekTelefonu({ alpha: 0, absolute: false, webkitCompassHeading: 300 }, 90)).toBe(30);
  });
});

describe('okrąg dokładności', () => {
  it('jest zamknięty i leży w zadanym promieniu', () => {
    const srodek: LngLat = [17, 50];
    const punkty = okrag(srodek, 100);
    expect(punkty[0]).toEqual(punkty[punkty.length - 1]);
    for (const p of punkty) expect(odleglosc(srodek, p)).toBeCloseTo(100, -1);
  });
});
