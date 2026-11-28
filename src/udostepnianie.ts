// Udostępnianie punktu schronienia: systemowe okno (Web Share API), a bez niego schowek.
// Czysta funkcja z wstrzykiwanym navigatorem, żeby dało się ją testować bez przeglądarki.

export type WynikUdostepniania = 'udostepniono' | 'skopiowano' | 'anulowano' | 'blad';

export type NawigatorUdostepniania = {
  share?: (dane: ShareData) => Promise<void>;
  clipboard?: { writeText: (tekst: string) => Promise<void> };
};

export async function udostepnijPunkt(
  adres: string,
  link: string,
  nav: NawigatorUdostepniania = navigator,
): Promise<WynikUdostepniania> {
  if (nav.share) {
    try {
      await nav.share({ title: adres, text: adres, url: link });
      return 'udostepniono';
    } catch (e) {
      // Użytkownik zamknął okno udostępniania: nic więcej nie robimy.
      if (e instanceof Error && e.name === 'AbortError') return 'anulowano';
      // Inny błąd (np. brak uprawnień): próbujemy schowka.
    }
  }
  if (!nav.clipboard) return 'blad';
  try {
    await nav.clipboard.writeText(`${adres}\n${link}`);
    return 'skopiowano';
  } catch {
    return 'blad';
  }
}
