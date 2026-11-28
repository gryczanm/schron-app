// Strona główna: krótko o aplikacji, przejście do mapy, liczby punktów schronienia i co robić w razie alarmu.
// Mapa jest pod adresem #mapa, więc przycisk „Wstecz” w telefonie wraca tutaj.
import { useEffect, useMemo, useState } from 'react';
import { DOSTEPNOSCI, KOLOR_DOSTEPNOSCI, policzDostepnosci, type Zbior } from './dane/zbior.ts';
import { odczytajPoradnik, plikPoradnika, type Poradnik } from './dane/poradnik.ts';
import { jezyk, t } from './teksty.ts';
import { udzialy } from './udzialy.ts';
import { WyborJezyka } from './WyborJezyka.tsx';

export function StronaGlowna({ zbior }: { zbior: Zbior | null }) {
  const poradnik = usePoradnik();
  const liczniki = useMemo(() => zbior && policzDostepnosci(zbior.punkty), [zbior]);
  const procenty = useMemo(() => liczniki && udzialy(DOSTEPNOSCI.map((d) => liczniki[d])), [liczniki]);
  const postep = useNarastanie(zbior !== null);
  // Wartość licznika w trakcie animacji: od 0 do końcowej.
  const pokaz = (n: number) => Math.round(n * postep).toLocaleString(t.kod);

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
          {zbior && liczniki && procenty ? (
            <>
              <p className="sg-razem">
                {t.stronaGlowna.wszystkie}: <strong>{pokaz(zbior.punkty.length)}</strong>
              </p>
              {/* Pasek proporcji Dostępności; czytnik ekranu ma te same liczby niżej w liście. */}
              <div
                className="sg-pasek"
                aria-hidden="true"
                title={DOSTEPNOSCI.map((d, i) => `${t.dostepnosc[d]}: ${procenty[i]}%`).join(' · ')}
              >
                {DOSTEPNOSCI.map((d, i) => (
                  <span key={d} style={{ width: `${procenty[i] * postep}%`, background: KOLOR_DOSTEPNOSCI[d] }} />
                ))}
              </div>
              <ul className="sg-liczniki">
                {DOSTEPNOSCI.map((d) => (
                  <li key={d}>
                    <span className="kropka" style={{ background: KOLOR_DOSTEPNOSCI[d] }} />
                    {t.dostepnosc[d]}
                    <strong>{pokaz(liczniki[d])}</strong>
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

// Postęp animacji liczników od 0 do 1 w ok. 1 s, startuje raz, gdy dane są gotowe.
// Przy „ogranicz ruch” od razu 1, czyli wartości końcowe.
const CZAS_NARASTANIA = 1000;
function useNarastanie(gotowe: boolean) {
  const [postep, setPostep] = useState(0);
  useEffect(() => {
    if (!gotowe) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPostep(1);
      return;
    }
    let klatka = 0;
    let start: number | null = null;
    const krok = (teraz: number) => {
      start ??= teraz;
      const x = Math.min((teraz - start) / CZAS_NARASTANIA, 1);
      setPostep(1 - (1 - x) ** 3); // wygaszanie: szybko na początku, łagodnie na końcu
      if (x < 1) klatka = requestAnimationFrame(krok);
    };
    klatka = requestAnimationFrame(krok);
    return () => cancelAnimationFrame(klatka);
  }, [gotowe]);
  return postep;
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
