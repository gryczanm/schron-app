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
  const [przesuniecie, setPrzesuniecie] = useState<number | null>(null);
  const poczatekY = useRef(0);
  const chwyc = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    poczatekY.current = e.clientY;
    setPrzesuniecie(0);
  };
  const przeciagnij = (e: React.PointerEvent) => przesuniecie != null && setPrzesuniecie(e.clientY - poczatekY.current);
  const pusc = () => {
    if (przesuniecie != null && przesuniecie > PROG_ZAMKNIECIA) zamknij();
    setPrzesuniecie(null);
  };
  return (
    <section
      className="panel panel-dolny"
      style={{ transform: przesuniecie && przesuniecie > 0 ? `translateY(${przesuniecie}px)` : undefined, transition: przesuniecie == null ? undefined : 'none' }}
    >
      <div className="uchwyt" onPointerDown={chwyc} onPointerMove={przeciagnij} onPointerUp={pusc} onPointerCancel={pusc}>
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
    const zapytanie = matchMedia(WASKI);
    const zmiana = () => setWaski(zapytanie.matches);
    zapytanie.addEventListener('change', zmiana);
    return () => zapytanie.removeEventListener('change', zmiana);
  }, []);
  return waski;
}
