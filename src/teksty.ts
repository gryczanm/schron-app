// Wszystkie teksty UI w jednym miejscu. Kolejny język to kolejny klucz w TEKSTY o tym samym kształcie.
// Język wybiera się przyciskami PL/EN/DE. Wybór zostaje w przeglądarce, domyślny jest polski.
export const JEZYKI = ['pl', 'en', 'de'] as const;
export type Jezyk = (typeof JEZYKI)[number];

const pl = {
  kod: 'pl',
  tytul: 'Punkty schronienia',
  wyborJezyka: 'Język',
  dostepnosc: {
    0: 'Całodobowa',
    1: 'Określone godziny',
    2: 'Na żądanie',
  },
  opisDostepnosci: {
    0: 'Dostępny całą dobę (wg PSP).',
    1: 'Dostępny w godzinach pracy obiektu. Godzin nie podano.',
    2: 'Zwykle zamknięty. Zarządca powinien udostępnić go po ogłoszeniu alarmu, w miarę możliwości – dostęp niegwarantowany.',
  },
  legenda: 'Filtr Dostępności',
  gmina: (nazwa: string) => `Gmina: ${nazwa}`,
  stopka: {
    dane: (stan: string) => `Dane: KG PSP, CC BY 4.0 · stan z ${stan}`,
    zastrzezenie: 'Punkt schronienia nie jest schronem i nie gwarantuje ochrony.',
  },
  prowadzenie: {
    do: (adres: string) => `do: ${adres}`,
    wLiniiProstej: 'w linii prostej',
    gps: (metry: number) => `GPS ±${metry} m`,
    recznie: 'pozycja wskazana ręcznie',
    polnoc: 'N',
    naMiejscu: 'Jesteś na miejscu.',
    naMiejscuOpis: 'Rozejrzyj się za oznakowaniem punktu schronienia.',
    ustalanie: 'Ustalam pozycję…',
    ustalanieOpis: 'Bez internetu może to potrwać do minuty. Możesz też wskazać swoją pozycję na mapie.',
    odmowa: 'Brak zgody na lokalizację',
    odmowaOpis: 'Włącz lokalizację dla tej strony w ustawieniach przeglądarki albo wskaż swoją pozycję na mapie.',
    niedostepna: 'Nie mogę ustalić pozycji',
    niedostepnaOpis: 'Sprawdź, czy lokalizacja w telefonie jest włączona, albo wskaż swoją pozycję na mapie.',
    wskazywanie: 'Dotknij mapy w miejscu, w którym jesteś.',
    kierunek: (stopnie: number) => `Kierunek do celu: ${stopnie}°`,
  },
  przyciski: {
    informacje: 'Informacje',
    zamknij: 'Zamknij',
    prowadz: 'Prowadź',
    trasaGoogle: 'Trasa w Google Maps',
    zakoncz: 'Zakończ Prowadzenie',
    wskaz: 'Wskaż moją pozycję',
    mojaLokalizacja: 'Użyj mojej lokalizacji',
    doMapy: 'Przejdź do mapy',
    stronaGlowna: 'Strona główna',
  },
  stronaGlowna: {
    wstep: 'Mapa punktów schronienia w Polsce z otwartego zbioru Państwowej Straży Pożarnej. Działa też bez internetu.',
    zbior: 'Punkty schronienia w zbiorze',
    wszystkie: 'Wszystkie',
    wczytywanie: 'Wczytywanie danych…',
    alarm: 'Co robić w razie alarmu',
    wiecej: 'Więcej w oficjalnych materiałach:',
    bezAlarmow: 'Aplikacja nie ogłasza alarmów. Ogłaszają je organy ochrony ludności, m.in. syrenami, w RSO i przez Alert RCB.',
  },
};

export type Teksty = typeof pl;

const en: Teksty = {
  kod: 'en',
  tytul: 'Shelter points',
  wyborJezyka: 'Language',
  dostepnosc: {
    0: 'Open 24/7',
    1: 'Set hours',
    2: 'On request',
  },
  opisDostepnosci: {
    0: 'Open around the clock (according to PSP).',
    1: 'Open during the building’s opening hours. Hours not given.',
    2: 'Usually closed. The manager should open it once an alarm is announced, where possible – access not guaranteed.',
  },
  legenda: 'Availability filter',
  gmina: (nazwa: string) => `Municipality: ${nazwa}`,
  stopka: {
    dane: (stan: string) => `Data: KG PSP, CC BY 4.0 · as of ${stan}`,
    zastrzezenie: 'A shelter point is not a bomb shelter and does not guarantee protection.',
  },
  prowadzenie: {
    do: (adres: string) => `to: ${adres}`,
    wLiniiProstej: 'in a straight line',
    gps: (metry: number) => `GPS ±${metry} m`,
    recznie: 'position set by hand',
    polnoc: 'N',
    naMiejscu: 'You have arrived.',
    naMiejscuOpis: 'Look around for the shelter point sign.',
    ustalanie: 'Finding your position…',
    ustalanieOpis: 'Without internet this can take up to a minute. You can also mark your position on the map.',
    odmowa: 'No permission to use location',
    odmowaOpis: 'Allow location for this site in your browser settings or mark your position on the map.',
    niedostepna: 'Cannot find your position',
    niedostepnaOpis: 'Check that location is turned on in your phone or mark your position on the map.',
    wskazywanie: 'Tap the map where you are.',
    kierunek: (stopnie: number) => `Direction to destination: ${stopnie}°`,
  },
  przyciski: {
    informacje: 'Information',
    zamknij: 'Close',
    prowadz: 'Guide me',
    trasaGoogle: 'Route in Google Maps',
    zakoncz: 'End guidance',
    wskaz: 'Mark my position',
    mojaLokalizacja: 'Use my location',
    doMapy: 'Go to the map',
    stronaGlowna: 'Home page',
  },
  stronaGlowna: {
    wstep: 'Map of shelter points in Poland from the open dataset of the State Fire Service (PSP). Also works offline.',
    zbior: 'Shelter points in the dataset',
    wszystkie: 'All',
    wczytywanie: 'Loading data…',
    alarm: 'What to do during an alarm',
    wiecej: 'More in official materials (in Polish):',
    bezAlarmow: 'This app does not announce alarms. Civil protection authorities do, e.g. with sirens, in RSO and through Alert RCB.',
  },
};

const de: Teksty = {
  kod: 'de',
  tytul: 'Schutzpunkte',
  wyborJezyka: 'Sprache',
  dostepnosc: {
    0: 'Rund um die Uhr',
    1: 'Feste Zeiten',
    2: 'Auf Anfrage',
  },
  opisDostepnosci: {
    0: 'Rund um die Uhr zugänglich (laut PSP).',
    1: 'Zugänglich während der Öffnungszeiten des Gebäudes. Zeiten nicht angegeben.',
    2: 'Meist geschlossen. Der Verwalter sollte ihn nach Auslösung eines Alarms nach Möglichkeit öffnen – Zugang nicht garantiert.',
  },
  legenda: 'Filter nach Zugänglichkeit',
  gmina: (nazwa: string) => `Gemeinde: ${nazwa}`,
  stopka: {
    dane: (stan: string) => `Daten: KG PSP, CC BY 4.0 · Stand ${stan}`,
    zastrzezenie: 'Ein Schutzpunkt ist kein Schutzraum und garantiert keinen Schutz.',
  },
  prowadzenie: {
    do: (adres: string) => `nach: ${adres}`,
    wLiniiProstej: 'Luftlinie',
    gps: (metry: number) => `GPS ±${metry} m`,
    recznie: 'Position von Hand gesetzt',
    polnoc: 'N',
    naMiejscu: 'Sie sind am Ziel.',
    naMiejscuOpis: 'Halten Sie Ausschau nach der Kennzeichnung des Schutzpunkts.',
    ustalanie: 'Position wird ermittelt…',
    ustalanieOpis: 'Ohne Internet kann das bis zu einer Minute dauern. Sie können Ihre Position auch auf der Karte markieren.',
    odmowa: 'Keine Standortfreigabe',
    odmowaOpis: 'Erlauben Sie den Standort für diese Seite in den Browsereinstellungen oder markieren Sie Ihre Position auf der Karte.',
    niedostepna: 'Position nicht ermittelbar',
    niedostepnaOpis: 'Prüfen Sie, ob der Standort im Telefon eingeschaltet ist, oder markieren Sie Ihre Position auf der Karte.',
    wskazywanie: 'Tippen Sie auf die Karte dort, wo Sie sind.',
    kierunek: (stopnie: number) => `Richtung zum Ziel: ${stopnie}°`,
  },
  przyciski: {
    informacje: 'Informationen',
    zamknij: 'Schließen',
    prowadz: 'Navigieren',
    trasaGoogle: 'Route in Google Maps',
    zakoncz: 'Navigation beenden',
    wskaz: 'Meine Position markieren',
    mojaLokalizacja: 'Meinen Standort verwenden',
    doMapy: 'Zur Karte',
    stronaGlowna: 'Startseite',
  },
  stronaGlowna: {
    wstep: 'Karte der Schutzpunkte in Polen aus dem offenen Datensatz der Staatlichen Feuerwehr (PSP). Funktioniert auch offline.',
    zbior: 'Schutzpunkte im Datensatz',
    wszystkie: 'Alle',
    wczytywanie: 'Daten werden geladen…',
    alarm: 'Was tun bei Alarm',
    wiecej: 'Mehr in offiziellen Materialien (auf Polnisch):',
    bezAlarmow: 'Diese App löst keine Alarme aus. Das tun die Behörden des Bevölkerungsschutzes, u. a. mit Sirenen, in RSO und über Alert RCB.',
  },
};

const TEKSTY = { pl, en, de } satisfies Record<Jezyk, Teksty>;

const KLUCZ = 'jezyk';

// Bez localStorage (testy, tryb prywatny) zostaje polski.
function zapisanyJezyk(): Jezyk {
  try {
    const j = localStorage.getItem(KLUCZ);
    return JEZYKI.find((x) => x === j) ?? 'pl';
  } catch {
    return 'pl';
  }
}

export const jezyk: Jezyk = zapisanyJezyk();
export const t: Teksty = TEKSTY[jezyk];

// Teksty są czytane przy starcie, także poza komponentami, więc zmiana języka przeładowuje stronę.
export function zmienJezyk(nowy: Jezyk) {
  if (nowy === jezyk) return;
  try {
    localStorage.setItem(KLUCZ, nowy);
  } catch {
    return;
  }
  location.reload();
}
