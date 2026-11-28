import { describe, expect, it, vi } from 'vitest';
import { trzymajEkran } from './ekran.ts';

// Atrapa Screen Wake Lock API: każda prośba daje nową blokadę, którą można zwolnić.
function atrapaWakeLock() {
  const blokady: { released: boolean; release: () => Promise<void> }[] = [];
  const request = vi.fn(async () => {
    const b = {
      released: false,
      release: vi.fn(async () => {
        b.released = true;
      }),
    };
    blokady.push(b);
    return b as unknown as WakeLockSentinel;
  });
  return { nav: { wakeLock: { request } }, request, blokady };
}

// Atrapa dokumentu z przełączaną widocznością.
function atrapaDokumentu() {
  const zdarzenia = new EventTarget();
  const dok = {
    visibilityState: 'visible' as DocumentVisibilityState,
    addEventListener: zdarzenia.addEventListener.bind(zdarzenia),
    removeEventListener: zdarzenia.removeEventListener.bind(zdarzenia),
  };
  const ustaw = (stan: DocumentVisibilityState) => {
    dok.visibilityState = stan;
    zdarzenia.dispatchEvent(new Event('visibilitychange'));
  };
  return { dok: dok as unknown as Document, ustaw };
}

const chwila = () => new Promise((r) => setTimeout(r, 0));

describe('ekran włączony podczas Prowadzenia', () => {
  it('bierze blokadę ekranu i zwalnia ją na koniec', async () => {
    const { nav, request, blokady } = atrapaWakeLock();
    const { dok } = atrapaDokumentu();
    const zakoncz = trzymajEkran(nav, dok);
    await chwila();
    expect(request).toHaveBeenCalledWith('screen');
    expect(blokady[0].released).toBe(false);

    zakoncz();
    await chwila();
    expect(blokady[0].released).toBe(true);
  });

  it('po powrocie do karty bierze blokadę ponownie', async () => {
    const { nav, request, blokady } = atrapaWakeLock();
    const { dok, ustaw } = atrapaDokumentu();
    trzymajEkran(nav, dok);
    await chwila();

    blokady[0].released = true; // przeglądarka zwalnia blokadę przy ukryciu strony
    ustaw('hidden');
    await chwila();
    expect(request).toHaveBeenCalledTimes(1);

    ustaw('visible');
    await chwila();
    expect(request).toHaveBeenCalledTimes(2);
    expect(blokady[1].released).toBe(false);
  });

  it('po zakończeniu nie reaguje na zmianę widoczności', async () => {
    const { nav, request } = atrapaWakeLock();
    const { dok, ustaw } = atrapaDokumentu();
    trzymajEkran(nav, dok)();
    ustaw('visible');
    await chwila();
    expect(request).toHaveBeenCalledTimes(1);
  });

  it('zwalnia blokadę, która przyszła już po zakończeniu', async () => {
    const { nav, blokady } = atrapaWakeLock();
    const { dok } = atrapaDokumentu();
    trzymajEkran(nav, dok)(); // koniec, zanim prośba się rozstrzygnęła
    await chwila();
    expect(blokady[0].released).toBe(true);
  });

  it('bez wsparcia API nic nie robi i nie rzuca błędu', () => {
    const { dok } = atrapaDokumentu();
    expect(() => trzymajEkran({}, dok)()).not.toThrow();
  });

  it('odmowa przeglądarki nie jest błędem', async () => {
    const request = vi.fn(() => Promise.reject(new DOMException('Odmowa', 'NotAllowedError')));
    const { dok } = atrapaDokumentu();
    const zakoncz = trzymajEkran({ wakeLock: { request } }, dok);
    await chwila();
    expect(() => zakoncz()).not.toThrow();
  });
});
