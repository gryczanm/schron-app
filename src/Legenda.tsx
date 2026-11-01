// Legenda Dostępności jako filtr: przycisk ukrywa albo pokazuje punkty, liczba to punkty schronienia w widoku mapy.
import { DOSTEPNOSCI, KOLOR_DOSTEPNOSCI, type Dostepnosc } from './dane/zbior.ts';
import { t } from './teksty.ts';
import { useWariant, Znak } from './prototyp-symbole.tsx';

type Wlasciwosci = {
  wlaczone: ReadonlySet<Dostepnosc>;
  przelacz: (d: Dostepnosc) => void;
  wWidoku: Record<Dostepnosc, number> | null; // null, dopóki nie ma danych i widoku
};

export function Legenda({ wlaczone, przelacz, wWidoku }: Wlasciwosci) {
  const wariant = useWariant(); // PROTOTYP #9
  return (
    <div className="legenda" role="group" aria-label={t.legenda}>
      {DOSTEPNOSCI.map((d) => {
        const wlaczona = wlaczone.has(d);
        const kolor = KOLOR_DOSTEPNOSCI[d];
        return (
          <button key={d} className="legenda-pozycja" aria-pressed={wlaczona} onClick={() => przelacz(d)}>
            <span className="legenda-liczba">
              {wariant === '0' ? (
                <span className="kropka" style={{ background: wlaczona ? kolor : 'transparent', border: `2px solid ${kolor}` }} />
              ) : (
                <Znak wariant={wariant} d={d} />
              )}
              {wWidoku ? wWidoku[d].toLocaleString('pl') : '–'}
            </span>
            <span className="legenda-nazwa">{t.dostepnosc[d]}</span>
          </button>
        );
      })}
    </div>
  );
}
