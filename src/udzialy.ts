// Udziały liczników w procentach, np. dla paska Dostępności na stronie głównej.
// Zaokrąglenie metodą największych reszt, żeby suma zawsze wynosiła dokładnie 100.
export function udzialy(liczby: readonly number[]): number[] {
  const razem = liczby.reduce((a, b) => a + b, 0);
  if (razem <= 0) return liczby.map(() => 0);
  const dokladne = liczby.map((l) => (l / razem) * 100);
  const wynik = dokladne.map(Math.floor);
  let brakuje = 100 - wynik.reduce((a, b) => a + b, 0);
  // Brakujące punkty procentowe dostają liczby z największą częścią ułamkową.
  const kolejnosc = dokladne.map((d, i) => i).sort((a, b) => (dokladne[b] % 1) - (dokladne[a] % 1));
  for (const i of kolejnosc) {
    if (brakuje <= 0) break;
    wynik[i]++;
    brakuje--;
  }
  return wynik;
}
