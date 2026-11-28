// Ekran nie gaśnie podczas Prowadzenia: Screen Wake Lock API, jeśli przeglądarka je ma.
import { useEffect } from 'react';

type Nawigator = { wakeLock?: Pick<WakeLock, 'request'> };
type Dokument = Pick<Document, 'visibilityState' | 'addEventListener' | 'removeEventListener'>;

// Trzyma ekran włączony do wywołania zwróconej funkcji. Bez wsparcia API nic nie robi.
export function trzymajEkran(nav: Nawigator = navigator, dok: Dokument = document): () => void {
  const wakeLock = nav.wakeLock;
  if (!wakeLock) return () => {};
  let blokada: WakeLockSentinel | null = null;
  let koniec = false;

  const popros = () => {
    if (koniec || dok.visibilityState !== 'visible' || (blokada && !blokada.released)) return;
    wakeLock.request('screen').then(
      (nowa) => {
        if (koniec) void nowa.release().catch(() => {}); // Prowadzenie skończyło się w trakcie prośby
        else blokada = nowa;
      },
      () => {}, // np. oszczędzanie baterii: ekran gaśnie jak zwykle, bez błędu
    );
  };

  // Przeglądarka zwalnia blokadę sama, gdy strona się chowa, więc po powrocie trzeba ją wziąć ponownie.
  dok.addEventListener('visibilitychange', popros);
  popros();

  return () => {
    koniec = true;
    dok.removeEventListener('visibilitychange', popros);
    void blokada?.release().catch(() => {});
    blokada = null;
  };
}

// Dopóki wlaczony, ekran telefonu sam nie gaśnie.
export function useEkranWlaczony(wlaczony: boolean) {
  useEffect(() => (wlaczony ? trzymajEkran() : undefined), [wlaczony]);
}
