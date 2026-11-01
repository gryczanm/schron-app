// Wszystkie teksty UI w jednym miejscu. Kolejny język to kolejny klucz w TEKSTY o tym samym kształcie.
const pl = {
  tytul: 'Punkty schronienia',
  dostepnosc: {
    0: 'Całodobowa',
    1: 'Określone godziny',
    2: 'Na żądanie',
  },
  stopka: {
    dane: (stan: string) => `Dane: KG PSP, CC BY 4.0 · stan z ${stan}`,
    zastrzezenie: 'Punkt schronienia nie jest schronem i nie gwarantuje ochrony.',
  },
  przyciski: {
    informacje: 'Informacje',
    zamknij: 'Zamknij',
  },
};

export type Teksty = typeof pl;

const TEKSTY = { pl } satisfies Record<string, Teksty>;

export const t: Teksty = TEKSTY.pl;
