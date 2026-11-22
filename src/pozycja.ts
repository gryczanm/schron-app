// Pozycja i kompas urządzenia na potrzeby Prowadzenia. Odczyty zostają w przeglądarce:
// nic nie jest wysyłane ani zapisywane.
import { useEffect, useState } from 'react';
import { kierunekTelefonu, type LngLat } from './prowadzenie.ts';

export type StanPozycji = 'ustalanie' | 'ok' | 'odmowa' | 'niedostepna';
export type PozycjaUrzadzenia = { stan: StanPozycji; miejsce: LngLat | null; dokladnosc: number };

const ZMIANA_KOMPASU = 3; // stopnie: mniejsze drgania czujnika nie obracają mapy

// Pozycja z lokalizacji urządzenia (GPS w telefonie, Wi-Fi w laptopie), aktualizowana na bieżąco, póki wlaczona.
export function usePozycjaUrzadzenia(wlaczona: boolean): PozycjaUrzadzenia {
  const [pozycja, setPozycja] = useState<PozycjaUrzadzenia>({ stan: 'ustalanie', miejsce: null, dokladnosc: 0 });

  useEffect(() => {
    if (!wlaczona) return;
    if (!('geolocation' in navigator)) {
      setPozycja({ stan: 'niedostepna', miejsce: null, dokladnosc: 0 });
      return;
    }
    setPozycja((p) => (p.stan === 'ok' ? p : { stan: 'ustalanie', miejsce: null, dokladnosc: 0 }));
    const id = navigator.geolocation.watchPosition(
      (p) => setPozycja({ stan: 'ok', miejsce: [p.coords.longitude, p.coords.latitude], dokladnosc: p.coords.accuracy }),
      (blad) =>
        setPozycja((p) => {
          if (blad.code === blad.PERMISSION_DENIED) return { stan: 'odmowa', miejsce: null, dokladnosc: 0 };
          // Chwilowy brak odczytu przy znanej już pozycji: zostaje ostatnia.
          return p.miejsce ? p : { stan: 'niedostepna', miejsce: null, dokladnosc: 0 };
        }),
      { enableHighAccuracy: true },
    );
    return () => navigator.geolocation.clearWatch(id);
  }, [wlaczona]);

  return pozycja;
}

type ZdarzenieOrientacji = DeviceOrientationEvent & { webkitCompassHeading?: number };

// Dokąd jest skierowany telefon (stopnie od północy) albo null, gdy urządzenie nie ma kompasu
// lub użytkownik nie zgodził się na czujnik. Laptop zwykle zwraca null.
export function useKompas(wlaczony: boolean): number | null {
  const [kierunek, setKierunek] = useState<number | null>(null);

  useEffect(() => {
    if (!wlaczony) return setKierunek(null);
    const odczyt = (e: Event) => {
      const k = kierunekTelefonu(e as ZdarzenieOrientacji);
      if (k == null) return;
      setKierunek((poprzedni) => {
        if (poprzedni == null) return Math.round(k);
        const roznica = Math.abs(((k - poprzedni + 540) % 360) - 180);
        return roznica >= ZMIANA_KOMPASU ? Math.round(k) : poprzedni;
      });
    };
    // Chrome na Androidzie podaje kompas w deviceorientationabsolute, Safari w deviceorientation.
    addEventListener('deviceorientationabsolute', odczyt);
    addEventListener('deviceorientation', odczyt);
    return () => {
      removeEventListener('deviceorientationabsolute', odczyt);
      removeEventListener('deviceorientation', odczyt);
    };
  }, [wlaczony]);

  return kierunek;
}

// iPhone wymaga zgody na czujnik orientacji, i to w obsłudze kliknięcia. Wołać przed pierwszym await.
export function poprosOKompas() {
  const zdarzenie = globalThis.DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> } | undefined;
  zdarzenie?.requestPermission?.().catch(() => {
    // Odmowa albo brak czujnika: Prowadzenie działa dalej z północą u góry.
  });
}
