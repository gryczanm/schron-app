// Panel jak w Google Maps: do 700 px dolny z uchwytem, od 700 px boczny po lewej na całą wysokość.
import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { t } from './teksty.ts';

const WASKI = '(max-width: 700px)';
const PROG_PRZECIAGNIECIA = 40; // px przeciągnięcia, po których panel dolny zmienia wysokość albo się zamyka
const PROG_DOTKNIECIA = 5; // px ruchu, do których przeciągnięcie liczy się jako dotknięcie uchwytu

type Wlasciwosci = {
  zamknij: () => void;
  children: ReactNode; // podgląd: zawsze widoczny
  rozwiniecie?: ReactNode; // na telefonie dopiero po rozwinięciu, na komputerze od razu
  elRef?: RefObject<HTMLElement>; // mapa sprawdza po nim, którą część ekranu panel zasłania
};

export function Panel({ zamknij, children, rozwiniecie, elRef }: Wlasciwosci) {
  const waski = useWaski();
  const przyciskZamknij = (
    <button className="zamknij" aria-label={t.przyciski.zamknij} onClick={zamknij} onPointerDown={(e) => e.stopPropagation()}>
      ×
    </button>
  );
  if (!waski) {
    return (
      <aside className="panel panel-boczny" ref={elRef}>
        {przyciskZamknij}
        {children}
        {rozwiniecie}
      </aside>
    );
  }
  return (
    <PanelDolny zamknij={zamknij} przyciskZamknij={przyciskZamknij} rozwiniecie={rozwiniecie} elRef={elRef}>
      {children}
    </PanelDolny>
  );
}

function PanelDolny({ zamknij, przyciskZamknij, children, rozwiniecie, elRef }: Wlasciwosci & { przyciskZamknij: ReactNode }) {
  const [rozwiniety, setRozwiniety] = useState(false);
  const [przesuniecie, setPrzesuniecie] = useState<number | null>(null);
  const poczatekY = useRef(0);
  const chwyc = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    poczatekY.current = e.clientY;
    setPrzesuniecie(0);
  };
  const przeciagnij = (e: React.PointerEvent) => przesuniecie != null && setPrzesuniecie(e.clientY - poczatekY.current);
  const pusc = () => {
    const dy = przesuniecie ?? 0;
    setPrzesuniecie(null);
    if (Math.abs(dy) <= PROG_DOTKNIECIA) setRozwiniety((r) => !r);
    else if (dy < -PROG_PRZECIAGNIECIA) setRozwiniety(true);
    else if (dy > PROG_PRZECIAGNIECIA) rozwiniety ? setRozwiniety(false) : zamknij();
  };
  return (
    <section
      className="panel panel-dolny"
      ref={elRef}
      style={{ transform: przesuniecie && przesuniecie > 0 ? `translateY(${przesuniecie}px)` : undefined, transition: przesuniecie == null ? undefined : 'none' }}
    >
      <div
        className="uchwyt"
        role="button"
        aria-expanded={rozwiniety}
        onPointerDown={chwyc}
        onPointerMove={przeciagnij}
        onPointerUp={pusc}
        onPointerCancel={() => setPrzesuniecie(null)}
      >
        <div className="uchwyt-pasek" />
        {przyciskZamknij}
      </div>
      <div className="tresc">
        {children}
        {rozwiniety && rozwiniecie}
      </div>
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
