// Strona główna: krótko o aplikacji, przejście do mapy, liczby punktów schronienia i co robić w razie alarmu.
// Mapa jest pod adresem #mapa, więc przycisk „Wstecz” w telefonie wraca tutaj.
import { useEffect, useMemo, useState } from 'react';
import { DOSTEPNOSCI, KOLOR_DOSTEPNOSCI, policzDostepnosci, type Zbior } from './dane/zbior.ts';
import { odczytajPoradnik, plikPoradnika, type Poradnik } from './dane/poradnik.ts';
import { jezyk, t } from './teksty.ts';
import { WyborJezyka } from './WyborJezyka.tsx';

export function StronaGlowna({ zbior }: { zbior: Zbior | null }) {
  const poradnik = usePoradnik();
  const liczniki = useMemo(() => zbior && policzDostepnosci(zbior.punkty), [zbior]);

  return (
    <main className="strona-glowna">
      <div className="sg-srodek">
        <WyborJezyka />
        <img className="sg-grafika" src={`${import.meta.env.BASE_URL}strona-glowna.svg`} alt="" />
        <h1 className="sg-tytul">{t.tytul}</h1>
        <p className="sg-wstep">{t.stronaGlowna.wstep}</p>
        <a className="sg-do-mapy" href="#mapa">
          {t.przyciski.doMapy}
        </a>

        <section className="sg-karta" aria-labelledby="sg-zbior">
          <h2 id="sg-zbior">{t.stronaGlowna.zbior}</h2>
          {zbior && liczniki ? (
            <>
              <p className="sg-razem">
                {t.stronaGlowna.wszystkie}: <strong>{zbior.punkty.length.toLocaleString(t.kod)}</strong>
              </p>
              <ul className="sg-liczniki">
                {DOSTEPNOSCI.map((d) => (
                  <li key={d}>
                    <span className="kropka" style={{ background: KOLOR_DOSTEPNOSCI[d] }} />
                    {t.dostepnosc[d]}
                    <strong>{liczniki[d].toLocaleString(t.kod)}</strong>
                  </li>
                ))}
              </ul>
              <p className="stopka">
                {zbior.stopka[0]}
                <br />
                {zbior.stopka[1]}
              </p>
            </>
          ) : (
            <p className="sg-wczytywanie">{t.stronaGlowna.wczytywanie}</p>
          )}
        </section>

        {/* Bez pliku poradnika albo przy złym formacie sekcji po prostu nie ma. */}
        {poradnik && (
          <section className="sg-karta" aria-labelledby="sg-alarm">
            <h2 id="sg-alarm">{t.stronaGlowna.alarm}</h2>
            <ol className="sg-porady">
              {poradnik.porady.map((porada, i) => (
                <li key={i}>{porada}</li>
              ))}
            </ol>
            {poradnik.linki.length > 0 && (
              <>
                <p className="sg-wiecej">{t.stronaGlowna.wiecej}</p>
                <ul className="sg-linki">
                  {poradnik.linki.map((l, i) => (
                    <li key={i}>
                      <a href={l.adres} target="_blank" rel="noopener noreferrer">
                        {l.nazwa}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <p className="stopka">{t.stronaGlowna.bezAlarmow}</p>
          </section>
        )}
      </div>
    </main>
  );
}

function usePoradnik() {
  const [poradnik, setPoradnik] = useState<Poradnik | null>(null);
  useEffect(() => {
    let aktualny = true;
    fetch(`${import.meta.env.BASE_URL}dane/${plikPoradnika(jezyk)}`)
      .then((odp) => odp.json())
      .then((dane) => aktualny && setPoradnik(odczytajPoradnik(dane)))
      .catch((blad) => console.warn('Poradnik pominięty:', blad));
    return () => void (aktualny = false);
  }, []);
  return poradnik;
}
