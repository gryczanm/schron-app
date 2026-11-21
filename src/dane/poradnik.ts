// Poradnik „Co robić w razie alarmu” z public/dane/poradnik.json. Treść pochodzi z oficjalnych materiałów,
// a aplikacja tylko ją pokazuje i odsyła do źródeł (ADR-0001).
export type Link = { nazwa: string; adres: string };
export type Poradnik = { porady: string[]; linki: Link[] };

const jestTekstem = (x: unknown): x is string => typeof x === 'string' && x.trim() !== '';

// Plik jest edytowany ręcznie, więc zły format kończy się czytelnym błędem. Linki tylko https.
export function odczytajPoradnik(dane: unknown): Poradnik {
  const { porady, linki } = (dane ?? {}) as Record<string, unknown>;
  if (!Array.isArray(porady) || porady.length === 0 || !porady.every(jestTekstem)) {
    throw new Error('„porady” muszą być niepustą listą niepustych tekstów');
  }
  if (!Array.isArray(linki)) throw new Error('„linki” muszą być listą');
  return {
    porady,
    linki: linki.map((l: Partial<Link> | null, i) => {
      if (!jestTekstem(l?.nazwa) || !jestTekstem(l.adres) || !l.adres.startsWith('https://')) {
        throw new Error(`Link nr ${i + 1} musi mieć „nazwa” i „adres” zaczynający się od https://`);
      }
      return { nazwa: l.nazwa, adres: l.adres };
    }),
  };
}
