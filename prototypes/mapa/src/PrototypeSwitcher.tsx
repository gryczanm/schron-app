// PROTOTYP: pływający przełącznik wariantów. Ukryty w buildzie produkcyjnym.
import { useEffect, useState } from 'react';

type Props = { warianty: { klucz: string; nazwa: string }[]; aktualny: string; onZmiana: (k: string) => void; stan: Record<string, unknown> };

export function PrototypeSwitcher({ warianty, aktualny, onZmiana, stan }: Props) {
  // Na telefonie startuje zwinięty, żeby nie zasłaniać panelu dolnego.
  const [zwiniety, setZwiniety] = useState(() => matchMedia('(max-width: 700px)').matches);
  const i = Math.max(0, warianty.findIndex((w) => w.klucz === aktualny));
  const idz = (krok: number) => onZmiana(warianty[(i + krok + warianty.length) % warianty.length].klucz);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest('input, textarea, [contenteditable]')) return;
      if (e.key === 'ArrowLeft') idz(-1);
      if (e.key === 'ArrowRight') idz(1);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  });

  if (!import.meta.env.DEV) return null;
  // Zwinięty: mała kropka przy lewej krawędzi, żeby nie zasłaniać dolnych paneli na telefonie.
  if (zwiniety) return (
    <button onClick={() => setZwiniety(false)} style={{
      position: 'fixed', left: 0, top: '45%', zIndex: 1000, background: '#facc15', border: '2px solid #000', borderLeft: 0, borderRadius: '0 10px 10px 0',
      font: '700 12px ui-monospace, monospace', padding: '8px 6px', cursor: 'pointer',
    }}>{warianty[i].klucz}</button>
  );
  const btn: React.CSSProperties = { background: 'transparent', color: '#fff', border: 0, fontSize: 18, padding: '0 10px', cursor: 'pointer' };
  return (
    <div style={{
      position: 'fixed', bottom: 12, left: '50%', transform: 'translateX(-50%)', zIndex: 1000, background: '#facc15', color: '#000',
      borderRadius: 14, boxShadow: '0 4px 16px rgba(0,0,0,.35)', font: '12px ui-monospace, monospace', padding: '6px 8px', maxWidth: 'calc(100vw - 24px)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', background: '#000', borderRadius: 99, color: '#fff', padding: '4px 4px' }}>
        <button style={btn} onClick={() => idz(-1)}>‹</button>
        <span style={{ flex: 1, textAlign: 'center', fontWeight: 700, whiteSpace: 'nowrap' }}>{warianty[i].klucz} ({warianty[i].nazwa})</span>
        <button style={btn} onClick={() => idz(1)}>›</button>
        <button style={{ ...btn, fontSize: 14, color: '#facc15' }} onClick={() => setZwiniety(true)} title="Zwiń">–</button>
      </div>
      <div style={{ padding: '4px 6px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {Object.entries(stan).map(([k, v]) => `${k}: ${v}`).join(' · ')}
      </div>
    </div>
  );
}
