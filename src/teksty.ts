// Wszystkie teksty UI w jednym miejscu. Kolejny język to kolejny klucz w TEKSTY o tym samym kształcie.
const pl = {
  tytul: 'Punkty schronienia',
  dostepnosc: {
    0: 'Całodobowa',
    1: 'Określone godziny',
    2: 'Na żądanie',
  },
  opisDostepnosci: {
    0: 'Dostępny całą dobę (wg PSP).',
    1: 'Dostępny w godzinach pracy obiektu. Godzin nie podano.',
    2: 'Zwykle zamknięty. Zarządca powinien udostępnić go po ogłoszeniu alarmu, w miarę możliwości – dostęp niegwarantowany.',
  },
  legenda: 'Filtr Dostępności',
  gmina: (nazwa: string) => `Gmina: ${nazwa}`,
  stopka: {
    dane: (stan: string) => `Dane: KG PSP, CC BY 4.0 · stan z ${stan}`,
    zastrzezenie: 'Punkt schronienia nie jest schronem i nie gwarantuje ochrony.',
  },
  przyciski: {
    informacje: 'Informacje',
    zamknij: 'Zamknij',
    prowadz: 'Prowadź',
    doMapy: 'Przejdź do mapy',
    stronaGlowna: 'Strona główna',
  },
  stronaGlowna: {
    wstep: 'Mapa punktów schronienia w Polsce z otwartego zbioru Państwowej Straży Pożarnej. Działa też bez internetu.',
    zbior: 'Punkty schronienia w zbiorze',
    wszystkie: 'Wszystkie',
    wczytywanie: 'Wczytywanie danych…',
    alarm: 'Co robić w razie alarmu',
    wiecej: 'Więcej w oficjalnych materiałach:',
    bezAlarmow: 'Aplikacja nie ogłasza alarmów. Ogłaszają je organy ochrony ludności, m.in. syrenami, w RSO i przez Alert RCB.',
  },
};

export type Teksty = typeof pl;

const TEKSTY = { pl } satisfies Record<string, Teksty>;

export const t: Teksty = TEKSTY.pl;
