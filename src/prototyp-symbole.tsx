// PROTOTYP (#9), do wyrzucenia. Pytanie: jak odróżnić Dostępności bez polegania na samym kolorze?
// Cztery warianty na istniejącej mapie, przełączane ?wariant= i paskiem na dole (tylko w trybie dev).
// Pasek ma też symulację widzenia barw, żeby ocenić warianty oczami osoby z daltonizmem.
import { useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import type { Map as MapaMapLibre } from 'maplibre-gl';
import { KOLOR_DOSTEPNOSCI, type Dostepnosc } from './dane/zbior.ts';

export const WARIANTY = [
  { klucz: '0', nazwa: 'Obecnie: sam kolor' },
  { klucz: 'A', nazwa: 'Znaki 24 / G / ?' },
  { klucz: 'B', nazwa: 'Kształty: koło / kwadrat / romb' },
  { klucz: 'C', nazwa: 'Wypełnienie: pełne / pół / puste' },
] as const;
export type Wariant = (typeof WARIANTY)[number]['klucz'];

const WIDZENIE = [
  { klucz: 'brak', nazwa: 'zwykłe' },
  { klucz: 'deuteranopia', nazwa: 'deuteranopia (zielony)' },
  { klucz: 'protanopia', nazwa: 'protanopia (czerwony)' },
  { klucz: 'tritanopia', nazwa: 'tritanopia (niebieski)' },
  { klucz: 'monochromia', nazwa: 'monochromia' },
] as const;

// Machado i in. 2009, nasilenie 1.0.
const MACIERZE: Record<string, string> = {
  deuteranopia: '0.367322 0.860646 -0.227968 0 0  0.280085 0.672501 0.047413 0 0  -0.011820 0.042940 0.968881 0 0  0 0 0 1 0',
  protanopia: '0.152286 1.052583 -0.204868 0 0  0.114503 0.786281 0.099216 0 0  -0.003882 -0.048116 1.051998 0 0  0 0 0 1 0',
  tritanopia: '1.255528 -0.076749 -0.178779 0 0  -0.078411 0.930809 0.147602 0 0  0.004733 0.691367 0.303900 0 0  0 0 0 1 0',
};

const odczytaj = (param: string, dozwolone: readonly { klucz: string }[]) => {
  const v = new URLSearchParams(location.search).get(param);
  return dozwolone.find((x) => x.klucz === v)?.klucz ?? dozwolone[0].klucz;
};
const zapisz = (param: string, wartosc: string) => {
  const u = new URL(location.href);
  u.searchParams.set(param, wartosc);
  history.replaceState(null, '', u);
  dispatchEvent(new Event('prototyp'));
};
const subskrybuj = (cb: () => void) => (addEventListener('prototyp', cb), () => removeEventListener('prototyp', cb));

export function useWariant(): Wariant {
  return useSyncExternalStore(subskrybuj, () => (import.meta.env.DEV ? (odczytaj('wariant', WARIANTY) as Wariant) : '0'));
}

// Symbol w układzie 20×20: obrys dostaje obwódkę (biała na mapie, ciemna dla wybranego), warstwy są wypełnieniami.
type Symbol = { obrys: string; warstwy: { d: string; kolor: string }[]; tekst?: string };

const kolo = (r: number) => `M${10 - r} 10a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;
const ZNAKI: Record<Dostepnosc, string> = { 0: '24', 1: 'G', 2: '?' };
const KSZTALTY: Record<Dostepnosc, string> = { 0: kolo(8.5), 1: 'M2.5 2.5h15v15h-15Z', 2: 'M10 0.5L19.5 10L10 19.5L0.5 10Z' };

export function symbol(wariant: Wariant, d: Dostepnosc): Symbol {
  const kolor = KOLOR_DOSTEPNOSCI[d];
  if (wariant === 'A') return { obrys: kolo(9.5), warstwy: [{ d: kolo(9.5), kolor }], tekst: ZNAKI[d] };
  if (wariant === 'B') return { obrys: KSZTALTY[d], warstwy: [{ d: KSZTALTY[d], kolor }] };
  if (wariant === 'C') {
    const warstwy = [{ d: kolo(8.5), kolor }];
    if (d !== 0) warstwy.push({ d: kolo(5), kolor: '#fff' });
    if (d === 1) warstwy.push({ d: 'M5 10A5 5 0 0 0 15 10Z', kolor });
    return { obrys: kolo(8.5), warstwy };
  }
  return { obrys: kolo(8.5), warstwy: [{ d: kolo(8.5), kolor }] };
}

// Znak do legendy i panelu.
export function Znak({ wariant, d, rozmiar = 16 }: { wariant: Wariant; d: Dostepnosc; rozmiar?: number }) {
  const s = symbol(wariant, d);
  return (
    <svg viewBox="-1 -1 22 22" width={rozmiar} height={rozmiar} style={{ flex: 'none' }} aria-hidden>
      {s.warstwy.map((w, i) => <path key={i} d={w.d} fill={w.kolor} />)}
      {s.tekst && (
        <text x="10" y="10.5" textAnchor="middle" dominantBaseline="central" fontSize={s.tekst.length > 1 ? 10 : 13} fontWeight="700" fill="#fff">
          {s.tekst}
        </text>
      )}
    </svg>
  );
}

// Ikony dla mapy (warianty B i C): sym-<wariant>-<d> i wersja wybrana sym-<wariant>-<d>-w.
const SKALA = 4;
function obraz(s: Symbol, obwodka: string, grubosc: number) {
  const c = document.createElement('canvas');
  c.width = c.height = 26 * SKALA;
  const ctx = c.getContext('2d')!;
  ctx.scale(SKALA, SKALA);
  ctx.translate(3, 3);
  ctx.lineJoin = 'round';
  ctx.lineWidth = 2 * grubosc; // połowa obwódki chowa się pod wypełnieniem
  ctx.strokeStyle = obwodka;
  ctx.stroke(new Path2D(s.obrys));
  for (const w of s.warstwy) {
    ctx.fillStyle = w.kolor;
    ctx.fill(new Path2D(w.d));
  }
  return ctx.getImageData(0, 0, c.width, c.height);
}

export function dodajIkony(m: MapaMapLibre) {
  for (const wariant of ['B', 'C'] as const) {
    for (const d of [0, 1, 2] as const) {
      const s = symbol(wariant, d);
      m.addImage(`sym-${wariant}-${d}`, obraz(s, '#fff', 1.5), { pixelRatio: SKALA });
      m.addImage(`sym-${wariant}-${d}-w`, obraz(s, '#0f172a', 3), { pixelRatio: SKALA });
    }
  }
}

export function PrzelacznikPrototypu() {
  const wariant = useWariant();
  const widzenie = useSyncExternalStore(subskrybuj, () => odczytaj('widzenie', WIDZENIE));
  const i = WARIANTY.findIndex((w) => w.klucz === wariant);
  const krok = (o: number) => zapisz('wariant', WARIANTY[(i + o + WARIANTY.length) % WARIANTY.length].klucz);
  const iw = WIDZENIE.findIndex((w) => w.klucz === widzenie);

  useEffect(() => {
    const klawisz = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest?.('input, textarea, [contenteditable]')) return;
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.stopPropagation(); // MapLibre przesuwałby mapę strzałkami
      krok(e.key === 'ArrowLeft' ? -1 : 1);
    };
    addEventListener('keydown', klawisz, true);
    return () => removeEventListener('keydown', klawisz, true);
  });

  useEffect(() => {
    const root = document.getElementById('root')!;
    root.style.filter = widzenie === 'brak' ? '' : widzenie === 'monochromia' ? 'grayscale(1)' : `url(#widzenie-${widzenie})`;
  }, [widzenie]);

  const przycisk: React.CSSProperties = { background: 'none', border: 0, color: 'inherit', font: 'inherit', cursor: 'pointer', padding: '4px 8px' };
  return createPortal(
    <div style={{
      position: 'fixed', zIndex: 100, bottom: 12, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: 2, padding: '6px 10px', borderRadius: 16, background: '#111', color: '#fde047',
      font: '600 13px system-ui', boxShadow: '0 4px 16px rgba(0,0,0,.4)', whiteSpace: 'nowrap',
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button style={przycisk} onClick={() => krok(-1)} aria-label="Poprzedni wariant">◀</button>
        <span>{wariant} ({WARIANTY[i].nazwa})</span>
        <button style={przycisk} onClick={() => krok(1)} aria-label="Następny wariant">▶</button>
      </div>
      <button style={{ ...przycisk, color: '#e5e7eb', fontWeight: 400, padding: 0 }} onClick={() => zapisz('widzenie', WIDZENIE[(iw + 1) % WIDZENIE.length].klucz)}>
        widzenie: {WIDZENIE[iw].nazwa} ⟳
      </button>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        {Object.entries(MACIERZE).map(([k, v]) => (
          <filter key={k} id={`widzenie-${k}`}><feColorMatrix type="matrix" values={v} /></filter>
        ))}
      </svg>
    </div>,
    document.body,
  );
}
