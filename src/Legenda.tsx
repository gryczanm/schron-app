// Legenda Dostępności jako filtr: przycisk ukrywa albo pokazuje punkty, liczba to punkty schronienia w widoku mapy.
import { KOLOR_DOSTEPNOSCI, type Dostepnosc } from './dane/zbior.ts';
import { t } from './teksty.ts';

const DOSTEPNOSCI: Dostepnosc[] = [0, 1, 2];

type Wlasciwosci = {
  wlaczone: ReadonlySet<Dostepnosc>;
  przelacz: (d: Dostepnosc) => void;
  wWidoku: Record<Dostepnosc, number> | null; // null, dopóki nie ma danych i widoku
};

export function Legenda({ wlaczone, przelacz, wWidoku }: Wlasciwosci) {
  return (
    <div className="legenda" role="group" aria-label={t.legenda}>
      {DOSTEPNOSCI.map((d) => {
        const wlaczona = wlaczone.has(d);
        const kolor = KOLOR_DOSTEPNOSCI[d];
        return (
          <button key={d} className="legenda-pozycja" aria-pressed={wlaczona} onClick={() => przelacz(d)}>
            <span className="legenda-liczba">
              <span className="kropka" style={{ background: wlaczona ? kolor : 'transparent', border: `2px solid ${kolor}` }} />
              {wWidoku ? wWidoku[d].toLocaleString('pl') : '–'}
            </span>
            <span className="legenda-nazwa">{t.dostepnosc[d]}</span>
          </button>
        );
      })}
    </div>
  );
}
