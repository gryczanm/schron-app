// Panel jak w Google Maps: do 700 px dolny z uchwytem, od 700 px boczny po lewej na całą wysokość.
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { t } from './teksty.ts';

const WASKI = '(max-width: 700px)';
const PROG_ZAMKNIECIA = 40; // px przeciągnięcia w dół, po których panel dolny się zamyka

export function Panel({ zamknij, children }: { zamknij: () => void; children: ReactNode }) {
  const waski = useWaski();
  const przyciskZamknij = (
    <button className="zamknij" aria-label={t.przyciski.zamknij} onClick={zamknij} onPointerDown={(e) => e.stopPropagation()}>
      ×
    </button>
  );
  if (!waski) {
    return (
      <aside className="panel panel-boczny">
        {przyciskZamknij}
        {children}
      </aside>
    );
  }
  return (
    <PanelDolny zamknij={zamknij} przyciskZamknij={przyciskZamknij}>
      {children}
    </PanelDolny>
  );
}

function PanelDolny({ zamknij, przyciskZamknij, children }: { zamknij: () => void; przyciskZamknij: ReactNode; children: ReactNode }) {
  const [dy, setDy] = useState<number | null>(null);
  const startY = useRef(0);
  const down = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    startY.current = e.clientY;
    setDy(0);
  };
  const move = (e: React.PointerEvent) => dy != null && setDy(e.clientY - startY.current);
  const up = () => {
    if (dy != null && dy > PROG_ZAMKNIECIA) zamknij();
    setDy(null);
  };
  return (
    <section
      className="panel panel-dolny"
      style={{ transform: dy && dy > 0 ? `translateY(${dy}px)` : undefined, transition: dy == null ? undefined : 'none' }}
    >
      <div className="uchwyt" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
        <div className="uchwyt-pasek" />
        {przyciskZamknij}
      </div>
      <div className="tresc">{children}</div>
    </section>
  );
}

function useWaski() {
  const [waski, setWaski] = useState(() => matchMedia(WASKI).matches);
  useEffect(() => {
    const mq = matchMedia(WASKI);
    const zmiana = () => setWaski(mq.matches);
    mq.addEventListener('change', zmiana);
    return () => mq.removeEventListener('change', zmiana);
  }, []);
  return waski;
}
