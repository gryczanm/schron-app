# Popyt i luki rynkowe: czego brakuje użytkownikom aplikacji o schronieniu i ostrzeganiu w Polsce

Stan na 2026-10-24. Raport opisuje **stronę popytu**. Uzupełnia dwa wcześniejsze raporty o podaży: [air-raid-alert-ukraina.md](air-raid-alert-ukraina.md) (ostrzeganie, ALARM.SOIA, Cell Broadcast) i [dane-o-schronach.md](dane-o-schronach.md) (zbiór PSP, prawo, art. 103a). Nie powtarzam ich ustaleń, tylko się do nich odwołuję.

Konwencje:
- Każde twierdzenie ma link do źródła. Tam, gdzie się dało, jest to źródło pierwotne: karta w sklepie z aplikacjami, raport CBOS, akt prawny, ogłoszenie TED, strona RPO lub NIK.
- **[Pomiar]** oznacza liczby, które policzyłem sam 24.10.2026. Metoda jest w sekcji 9.
- **[Analiza]** to moje wnioski, nie fakty ze źródła.
- **[Niezweryfikowane]** oznacza informację, której nie potwierdziłem w źródle pierwotnym, np. pochodzi tylko z mediów.
- Media służą tu głównie do datowania zdarzeń i jako relacje z sytuacji. Gdzie są jedynym źródłem, zaznaczam to.

## TL;DR

- **Rynek aplikacji konsumenckich jest już zatłoczony** **[Pomiar]**:
  - Oficjalnie działają: RSO (Google Play: 500 tys.+ pobrań, ocena 3,2; App Store: 2,4 przy 165 ocenach), PWA „Gdzie się ukryć” (PSP) i #wGotowości (MON). ALARM.SOIA jest zapowiedziana na grudzień 2026.
  - Prywatnie powstało w 2026 r. co najmniej **10 aplikacji**:
    - mapy schronień: Gdzie Schron? (50 tys.+ pobrań), Do Schronu, Schrony – OLiOC, Nieśmiertelnik, bezpieczny.info;
    - aplikacje o alarmie powietrznym: AlertyPL, Strażnik (102 oceny, średnia 4,94, mniej niż miesiąc od premiery), CVL, Alerty Polska;
    - aplikacja B2G dla gmin: mAlert (Go2Shelter).
  - Sama mapa punktów schronienia na danych PSP, z trybem offline, to dziś **standard**, a nie wyróżnik.
- **Głos użytkowników** (54 opinie ze sklepów, próba mała i niereprezentatywna) **[Pomiar]**. Najczęstsze skargi to:
  - aplikacja nie działa albo nie pokazuje danych (9);
  - złe filtrowanie i spam z innych województw, głównie w RSO (7);
  - jakość i dostępność samych punktów, np. „zasypane”, „nieprawdziwe” (4).
  - Pochwały dotyczą trybu offline (5) i tego, że alert przychodzi „szybciej niż RCB” (4, wszystkie o Strażniku).
  - Prośby o wersję angielską pojawiają się w dwóch aplikacjach.
- **Wiedza o schronieniu jest niska i stoi w miejscu:**
  - Tylko **17%** dorosłych sprawdziło, gdzie w pobliżu może się schronić (IV 2025; 18% rok wcześniej). Na wsi 12%, w grupie 65+ 10% ([CBOS 44/2025](https://cbos.pl/PL/publikacje/raporty/open_file.php?id=7017)).
  - Rządowy Poradnik bezpieczeństwa skłonił do sprawdzenia lokalizacji schronów tylko **13%** czytelników ([CBOS Flash 13/2026](https://cbos.pl/PL/publikacje/flashe/pliki/2026/fl_013_2026.pdf)).
- **Realne zdarzenia z 2026 r. odsłoniły luki w „ostatnim kroku” między alarmem a schronieniem:**
  - 30.07.2026: syreny wyły bez żadnego komunikatu, Alert RCB wstrzymano, a pierwszy wpis urzędu wojewódzkiego pojawił się po prawie 4 godzinach ([Prawo.pl](https://www.prawo.pl/samorzad/alarm-na-lubelszczyznie-ujawnil-luki-w-systemie-ostrzegania,1549690.html)).
  - 17.09.2026: szkoły nie wiedziały, dokąd zaprowadzić 500–600 dzieci, a mieszkańcy dzwonili do WCZK z pytaniem, co robić ([Bankier](https://www.bankier.pl/wiadomosc/Zagrozenie-atakiem-z-powietrza-Alert-RCB-i-wyjace-syreny-na-wschodzie-Polski-9198525.html)).
- **Popyt instytucjonalny jest udokumentowany najlepiej:**
  - Szkoły i przedszkola dostały 33-stronicowy **wzorzec procedury do samodzielnego dostosowania** ([MEN/MSWiA](https://dokumenty.men.gov.pl/Procedura-szkolaiprzedszkole-6aba78e09c764.PDF)). Muszą w nim wyznaczyć pomieszczenia, ich pojemność, ćwiczenia i komunikaty do rodziców.
  - Wójtowie i starostowie mają ustawowy obowiązek informować o lokalizacji obiektów, o dojściu i o ograniczeniach dla osób z niepełnosprawnościami. Mogą to robić „w tym [przez] aplikacje” ([art. 114 ust. 2–3](https://api.sejm.gov.pl/eli/acts/DU/2024/1907/text.html)).
- **[Analiza] Najsilniej udokumentowane luki** to:
  1. przepływ „alarm → co robić → najbliższe *realnie dostępne* miejsce” zamiast dwóch osobnych narzędzi (alarm i mapa);
  2. narzędzia dla instytucji (szkoły, placówki, zarządcy) do planowania schronienia wewnątrz budynku i ćwiczeń;
  3. weryfikacja dostępności punktów „Na żądanie” w terenie;
  4. dostępność dla osób z niepełnosprawnościami i dla obcokrajowców.

  Konkurowanie samą mapą albo samym kanałem alarmowym ma słabe uzasadnienie. ALARM.SOIA prawdopodobnie zamknie lukę „precyzyjnego i głośnego alarmu”.

---

## 1. Krajobraz konkurencji

### 1.1 Narzędzia oficjalne

| Narzędzie | Kto prowadzi | Funkcje | Platformy | Skala / oceny **[Pomiar 24.10.2026]** |
|---|---|---|---|---|
| **RSO** | MSWiA, wspólnie z TVP | Komunikaty WCZK, RCB i MSWiA: powiadomienia, ostrzeżenia i ostrzeżenia alarmowe (push). Wybór województw, opcjonalna geolokalizacja ([App Store](https://apps.apple.com/pl/app/id1326612339)) | iOS, Android | Google Play: **500 tys.+** pobrań, ocena **3,2** (2,03 tys. opinii), ostatnia aktualizacja 12.01.2026 ([Google Play](https://play.google.com/store/apps/details?id=mswia.rso&hl=pl&gl=PL)). App Store: **2,38** (165 ocen). Interfejs tylko po polsku (`languageCodesISO2A: PL`) |
| RSO – umowa | MSWiA | Ogłoszenie VEAT (zamiar udzielenia zamówienia bez przetargu) z 04.09.2026: „Świadczenie usługi w ramach RSO … z wykorzystaniem Platformy CMS” ([TED 609994-2026](https://ted.europa.eu/pl/notice/-/detail/609994-2026)) | – | **[Analiza]** RSO będzie działać dalej równolegle z ALARM.SOIA |
| **Gdzie się ukryć** (gdziesieukryc.pl) | KG PSP (BIŁ) | Mapa punktów schronienia, trasa, offline (PWA) | Web/PWA | Szczegóły w [dane-o-schronach.md §2.1](dane-o-schronach.md). W sklepach nie znalazłem jej **[Pomiar]**. Zapowiadana integracja z mObywatelem **[Niezweryfikowane]** ([Spider's Web, 10.06.2026](https://spidersweb.pl/2026/06/gdzie-sie-ukryc-2026.html)) |
| **ALARM.SOIA** | KG PSP / MSWiA | Zapowiedź na grudzień 2026. Szczegóły w [air-raid-alert-ukraina.md](air-raid-alert-ukraina.md) | iOS (wg mediów) | W App Store (pl, de, gb, cz) wyszukiwarka nie zwraca karty „ALARM.SOIA” **[Pomiar]**. Według [Spider's Web (28.09.2026)](https://spidersweb.pl/2026/09/alarm-soia-aplikacja-straz-pozarna.html) opis wymienia tylko „mapę aktywnych ostrzeżeń”, bez mapy schronień **[Niezweryfikowane]** |
| **#wGotowości** | Resort Obrony Narodowej | Szkolenia obronne: zapisy, mapa szkoleń | Android, iOS | **10 tys.+** pobrań, ocena 4,7 (104 opinie) ([Google Play](https://play.google.com/store/apps/details?id=pl.mil.ron.wgotowosci&hl=pl&gl=PL)) |
| **Warszawa 19115** | Urząd m.st. Warszawy | Zgłoszenia miejskie, odpady, jakość powietrza, toalety, parkingi. **Opis nie wspomina o schronach** **[Pomiar]** | iOS, Android | App Store: 2,14 (210 ocen) ([App Store](https://apps.apple.com/pl/app/id735957277)) |
| BLISKO (SISMS) | AMM Systems sp. z o.o., na zlecenie gmin | Komunikaty samorządów i centrów kryzysowych, retransmisja RSO ([App Store](https://apps.apple.com/pl/app/id821655959)). Działa „w kilkuset miastach i gminach” wg materiału gminy ([Gmina Chełmno](https://gmina-chelmno.pl/zapisz-do-pdf/6472)) **[Niezweryfikowane: dane producenta]** | iOS, Android | App Store: 2,98 (41 ocen) |

### 1.2 Aplikacje i serwisy prywatne (wszystkie w sklepach)

| Aplikacja | Wydawca | Premiera / aktualizacja | Co robi | Skala / oceny **[Pomiar]** | Języki (App Store) |
|---|---|---|---|---|---|
| **Gdzie Schron?** | eSport Entertainment Sergiusz Lelakowski; projekt „po godzinach”, finansowany z BuyCoffee ([gdzie-schron.pl](https://gdzie-schron.pl/)) | 01.05.2026 / 04.10.2026 | Mapa (dane.gov.pl i dane m.st. Warszawy), mapy offline, kompas, alerty RSO, ekran alarmu powietrznego, zgłoszenia i zdjęcia od społeczności, Street View | Google Play **50 tys.+**, ocena **2,7** (49) ([GP](https://play.google.com/store/apps/details?id=pl.gdzieschron.app&hl=pl&gl=PL)). App Store 3,31 (16) ([AS](https://apps.apple.com/pl/app/id6762662949)) | PL. **Niedostępna w App Store gb/de/ua** **[Pomiar]** |
| **Do Schronu** | Michał Dudkiewicz | – / 17.10.2026 | Mapa offline, nawigacja offline, bez logowania | Google Play **5 tys.+**, ocena 3,0 (7) ([GP](https://play.google.com/store/apps/details?id=com.godzinazero.godzina_zero&hl=pl&gl=PL)) | – |
| **Schrony – OLiOC** | Paweł Szydłowski | 11.06.2026 / 09.10.2026 | MDS, schrony, ukrycia, warstwa „zakładowe” jako premium, mapa offline (~1 GB), jednorazowe zakupy w aplikacji, Apple Watch/TV | App Store: 0 ocen ([AS](https://apps.apple.com/pl/app/id6766316218)) | EN |
| **Nieśmiertelnik: Shelters Map** | 6 Avenue | 23.01.2026 / 01.03.2026 | Mapa schronów, profil ICE (dane medyczne), latarka, lupa, baza wiedzy; dane tylko lokalnie | App Store 5,0 (5) ([AS](https://apps.apple.com/pl/app/id6756108139)) | EN, PL |
| **bezpieczny.info** | Piotr Zuzak | 06.01.2026 | Mapa zasobów, pakiet przetrwania, sygnały | 0 ocen ([AS](https://apps.apple.com/pl/app/id6756733650)) | – |
| **AlertyPL** | Oleksandr Yashchuk | 06.02.2026 / 09.10.2026 | Mapa alarmów wg województw, push, historia, offline. Źródło: „oficjalne systemy” (bez szczegółów) ([alertypl.com](https://alertypl.com/en)) | Google Play **5 tys.+**, ocena 4,7 (199) ([GP](https://play.google.com/store/apps/details?id=pl.alerty.app&hl=pl&gl=PL)). App Store 4,66 (162) | **EN, PL, UK** |
| **Strażnik: alarm powietrzny** | Piotr Kukier | 21.09.2026 / 22.10.2026 | Własny „indeks zagrożenia” na województwo z sygnałów RCB/RSO, PAŻP, ADS-B, OSINT (NEPTUN) i mediów. Zastrzega: „TO NIE JEST OFICJALNY SYSTEM” ([AS](https://apps.apple.com/pl/app/id6813563009)) | App Store **4,94 (102 oceny w ~1 miesiąc)** | PL |
| **CVL: Alarmy Podkarpacie** | BE1X sp. z o.o. | 20.10.2026 | Status Alertu RCB dla Podkarpacia, sytuacja po stronie ukraińskiej, punkty schronienia do 1 km (PSP) ([AS](https://apps.apple.com/pl/app/id6824275375)) | 2 oceny | PL |
| **Alerty Polska** | Marian Sikora | 28.09.2026 | Komunikaty RCB/RSO/IMGW, pogoda, punkty PSP, drogi, jakość powietrza ([AS](https://apps.apple.com/pl/app/id6814775850)) | 1 ocena | PL |
| **mAlert** | Go2Shelter sp. z o.o. | 31.10.2025 / 09.10.2026 | „Pierwszy w Polsce system zarządzania kryzysowego dla gmin i mieszkańców”: mapa schronów w gminie, komunikaty urzędowe, szkolenia ([AS](https://apps.apple.com/pl/app/id6753319281)) | 5,0 (7) | PL |
| (dla porównania) **Карта тривог – Dron Alerts** | NEPTUN Alerts | – | Ukraińska mapa alarmów i dronów | Google Play **1 mln+**, 4,6 (25,6 tys.) ([GP](https://play.google.com/store/apps/details?id=com.neptunalarm.neptun_alarm_app&hl=pl&gl=PL)) | – |

**[Analiza]**
- **Rynek wejściowy jest nasycony.** Mapy schronień na danych PSP z trybem offline ma co najmniej pięć aplikacji. Najpopularniejsza prywatna (Gdzie Schron?, 50 tys.+) ma słabe oceny (2,7). Na tle RSO (500 tys.+) i ok. 37,8 mln mieszkańców (wartość wynikająca z danych NIK: 1 428 369 osób = 3,78% ludności; [NIK](https://www.nik.gov.pl/najnowsze-informacje-o-wynikach-kontroli/budowle-ochronne-miejsca-ukrycia.html)) zasięg wszystkich aplikacji jest mały.
- **Modele przychodu są słabe:** darowizny (Gdzie Schron?), jednorazowe IAP (OLiOC), brak reklam (Nieśmiertelnik, chwalony za to w opiniach). Nikt nie pokazuje działającej monetyzacji B2C. Jedyny jawny model B2G to mAlert, ale nie znalazłem dowodu żadnego wdrożenia w gminie.
- **Popyt na „wcześniejszy sygnał” jest wyraźny.** Strażnik zebrał 102 oceny w miesiąc, a RSO w App Store 165 ocen przez 8 lat. To jednak obszar wysokiego ryzyka (fałszywe alarmy, odpowiedzialność, patrz [air-raid-alert-ukraina.md §4.4](air-raid-alert-ukraina.md)).

---

## 2. Głos użytkowników: opinie ze sklepów

### 2.1 Próba i metoda

- **App Store.** Publiczne karty aplikacji zawierają do 10 opinii, część z odpowiedziami dewelopera. Ich treść wyciągnąłem z kodu HTML strony (`?see-all=reviews`). Kanał RSS z opiniami zwracał puste wyniki **[Pomiar]**.
- **Google Play.** Karta pokazuje 3 opinie „najbardziej pomocne”.
- Nie korzystałem z nieudokumentowanych API sklepów.
- **Próba: 54 opinie z 9 aplikacji.** Nie jest losowa i jest przesunięta w stronę opinii wyróżnionych przez sklep. Liczby traktować jako sygnał jakościowy, nie jako rozkład.

| Aplikacja | App Store | Google Play | Razem |
|---|---|---|---|
| RSO | 10 | 3 | 13 |
| Gdzie Schron? | 10 | 3 | 13 |
| Strażnik | 10 | – | 10 |
| AlertyPL | 5 | 3 | 8 |
| mAlert | 4 | – | 4 |
| Nieśmiertelnik | 3 | – | 3 |
| Do Schronu | – | 3 | 3 |
| **Razem** | 42 | 12 | **54** |

### 2.2 Kategorie (opinia może mieć kilka) **[Pomiar]**

| Kategoria | Liczba | Przykłady (krótkie cytaty) |
|---|---|---|
| Aplikacja nie działa, nie ładuje się, nie pokazuje danych | **9** | Gdzie Schron?: „pisze że nic nie ma. Nie tylko w okolicy ale w całej Polsce” ([AS](https://apps.apple.com/pl/app/id6762662949)); „jestem z Jasla a lokalizacje pokazuje mi gdzieś na słowacji” ([GP](https://play.google.com/store/apps/details?id=pl.gdzieschron.app&hl=pl&gl=PL)); RSO: „nie wczytuje sie na ip 16” ([AS](https://apps.apple.com/pl/app/id1326612339)) |
| Filtrowanie, trafność geograficzna, spam | **7** (wszystkie RSO) | „Dostaję powiadomienia z innych województw”; „brak precyzyjnych filtrów … nadmiar alarmów … zmienia się w ignorowanie powiadomień” ([GP](https://play.google.com/store/apps/details?id=mswia.rso&hl=pl&gl=PL)) |
| Tryb offline (pochwała lub prośba) | **5** (4 pochwały, 1 prośba) | „Największą zaletą możliwość ściągnięcia map offline” (Gdzie Schron?); „Działa offline, więc jest niezawodna” (Do Schronu, [GP](https://play.google.com/store/apps/details?id=com.godzinazero.godzina_zero&hl=pl&gl=PL)) |
| Szybkość alertu względem RCB | **5** (1 skarga na RSO, 4 pochwały Strażnika) | RSO: „aplikacja ma jeszcze wieksze opoznienia niz wiadomosci sms”; Strażnik: „Działa szybciej niż alert z RCB/RSO” ([AS](https://apps.apple.com/pl/app/id6813563009)) |
| Jakość i dostępność samych punktów | **4** | Do Schronu: „większości schronów to można równie dobrze nie pokazywać … są zasypane/wykorzystywane jako pomieszczenie na rury”; Nieśmiertelnik: „nie jest jasne skąd pochodzi baza” ([AS](https://apps.apple.com/pl/app/id6756108139)) |
| UX (przeładowanie, nawigacja, ciemny motyw, kolory) | **4** | RSO: „powinna mieć ciemny motyw, żeby wydłużyć czas pracy na baterii”; Strażnik: „przeładowana treścią” |
| Kontekst zagrożenia („co leci, skąd”) | **3** | RSO: „zero informacji o naruszeniu polskiej strefy powietrznej w chwili ogłoszenia alarmu”; Strażnik: „można samemu ocenić czy faktycznie jest się czegoś obawiać” |
| Głośność, budzenie w nocy | **2** | AlertyPL: „bardzo cicho. W nocy nie obudzi”; RSO: „wiadomosc sms nie zawsze kazdy zauwazy a juz tymbardziej w nocy” |
| Błędne lub przestraszające alarmy | **2** | AlertyPL: „mega głośny alarm … Choć żadnego niebezpieczeństwa nie było … wystraszyła całą rodzinę!” ([AS](https://apps.apple.com/pl/app/id6757369533)); zła kolejność komunikatów alarm/odwołanie ([GP](https://play.google.com/store/apps/details?id=pl.alerty.app&hl=pl&gl=PL)) |
| Język angielski | **2** | RSO: „have the warnings translated to English”. MSWiA odpowiada: „We are considering … english version”. Gdzie Schron?: „please include a setting to change language - English” |
| Obawy etyczne (lęk, manipulacja) | 1 | Strażnik: „operuje alarmami, strachem i poczuciem zagrożenia” |
| Lokalność komunikatów (pochwała) | 1 | mAlert: „newsy bezpośrednio od gmin to na pewno lepsze rozwiązanie niż globalne alerty RCB” |
| Ogólnie pozytywne, bez treści | 13 | – |
| Ogólnie negatywne, bez treści | 1 | – |

**Odpowiedzi dewelopera RSO (fakty z [App Store](https://apps.apple.com/pl/app/id1326612339)):**
- Na skargi o niedziałaniu odpowiada: „Aplikacja jest przewidziana jedynie dla Polski i taki kraj musi być wybrany w sklepie”. Jednocześnie karta RSO jest widoczna w sklepach gb, de, ua i us **[Pomiar]**.
- Na skargi o spam odsyła do ukrytego filtra „Moje województwa”.

**[Analiza]**
- Skargi rozkładają się na dwie osie:
  - **niezawodność i trafność alarmu** (RSO, AlertyPL). To obszar, który ALARM.SOIA ma adresować przez Critical Alerts i wybór do 10 obszarów;
  - **wiarygodność mapy** (Gdzie Schron?, Do Schronu). Tego państwo nie rozwiązuje: dane PSP są tym samym źródłem dla wszystkich.
- Pochwały skupiają się na offline i „szybciej niż RCB”. Pierwsze to już standard. Drugie to popyt, który da się zaspokoić tylko kosztem ryzyka fałszywych alarmów.

---

## 3. Postawy i gotowość: badania

| Badanie | Termin, próba | Wynik |
|---|---|---|
| **CBOS, Komunikat 44/2025** ([PDF](https://cbos.pl/PL/publikacje/raporty/open_file.php?id=7017)) | 3–13.04.2025, N=1030, mixed-mode | **17%** sprawdziło, „gdzie w pobliżu … można się schronić, np. w przypadku bombardowania” (IV 2024: 18%). Wieś **12%**, 65+ **10%**, wykształcenie podstawowe 8%, miasta 20–22%. 19% sprawdziło zalecenia na wypadek wojny |
| **CBOS Flash 13/2026** ([PDF](https://cbos.pl/PL/publikacje/flashe/pliki/2026/fl_013_2026.pdf)) | 23–25.03.2026, N=1000, CATI/CAWI | Poradnik bezpieczeństwa (17 mln egz.) otrzymało 74%, nie otrzymało 22%; na wsi 69%. 56% odbiorców uważa, że **nie** zwiększył poczucia przygotowania. Po lekturze **13%** sprawdziło drogi ewakuacji i lokalizację schronów, a 41% nie zrobiło nic |
| **IBRiS dla Defence24** ([InfoSecurity24, 17.06.2026](https://infosecurity24.pl/bezpieczenstwo-wewnetrzne/polacy-nieprzygotowani-na-kryzys-alarmujace-wyniki-raportu)) | b.d. (raport „Obronność 2026”, V 2026) | **81,8%** nie wie, gdzie jest najbliższy schron. Autorzy nazywają to „największą luką systemową”. 24% wdrożyło zalecenia Poradnika. **[Niezweryfikowane: brak raportu źródłowego i metody]** |
| **IBRiS dla „Rzeczpospolitej”** ([rp.pl, 28.09.2026](https://www.rp.pl/spoleczenstwo/art45188391-sondaz-rzeczpospolitej-jak-sie-zachowac-gdy-zostanie-ogloszony-alarm)) | b.d. | 66,5% wie, jak się zachować po usłyszeniu syren, **29,3% nie wie**. Wśród mieszkańców wsi 33% i małych miast 34% nie wie **[Niezweryfikowane: brak metody]** |
| **IBRiS dla InfoSecurity24** ([29.03.2023](https://infosecurity24.pl/bezpieczenstwo-wewnetrzne/polacy-nie-wiedza-gdzie-sie-schronic-wyniki-badan-infosecurity24pl)) | b.d. | 81,4% nie wie, gdzie w miejscu zamieszkania jest schron; 16,3% wie. Wynik cytowany przez [NIK](https://www.nik.gov.pl/najnowsze-informacje-o-wynikach-kontroli/budowle-ochronne-miejsca-ukrycia.html) |
| **PBS dla PCK** ([pck.pl, 11.10.2024](https://pck.pl/en/polski-czerwony-krzyz/aktualnosci/2024-10-11-76-polakow-uwaza-katastrofy-naturalne-za-potencjalne-zagrozenie-dla-si)) | VIII 2024, N=2002, CAWI | ~93% nie wie, jak przygotować siebie i rodzinę na katastrofę; 88% nie jest pewnych, że poradzi sobie bez prądu i sieci komórkowej; 78% potrzebuje dodatkowej wiedzy |
| **Special Eurobarometer 547** ([KE, 30.09.2024](https://civil-protection-humanitarian-aid.ec.europa.eu/news-stories/news/europeans-believe-they-need-more-information-prepare-emergencies-recent-eurobarometer-survey-shows-2024-09-30_en); [badanie](https://europa.eu/eurobarometer/surveys/detail/3228)) | UE-27 | W UE prawie 2/3 potrzebuje więcej informacji, a ponad 1/3 ma trudność ze znalezieniem informacji od władz. Dla Polski karta kraju według PreventionWeb mówi o przeciętnej świadomości, mniejszej niż średnia liczbie podjętych działań i nieco niższym zaufaniu do rządu **[Niezweryfikowane: nie pobrałem karty PL, strona Eurobarometru renderuje się JS]** |

**Zaufanie do systemów ostrzegania.** Nie znalazłem badania sondażowego (CBOS, IBRiS ani rządowego), które mierzyłoby zaufanie do Alertu RCB lub RSO **[Niezweryfikowane: brak dowodu nieistnienia]**. Pośrednie sygnały to opinie ze sklepów (sekcja 2) i relacje z incydentów (sekcja 4.3).

**[Analiza]**
- Bariera nie leży w dostępie do mapy. Mapa jest publiczna od grudnia 2025, a odsetek osób, które sprawdziły schronienie, nie wzrósł (17–18%).
- Bariera leży w **motywacji, rozumieniu i momencie użycia**. Szczególnie dotyczy to wsi i osób 65+, czyli grup, które najrzadziej używają aplikacji.
- Produkt nastawiony na „pobierz i sprawdź zawczasu” trafi głównie do osób, które już to zrobiły (miasta, wykształcenie wyższe).

---

## 4. Audyty, oficjalne luki i braki

### 4.1 NIK (P/23/061, 2024)

Ustalenia o ewidencjach i stanie technicznym są w [dane-o-schronach.md §2.7](dane-o-schronach.md). Dla popytu ważne są dwie rzeczy ([NIK](https://www.nik.gov.pl/najnowsze-informacje-o-wynikach-kontroli/budowle-ochronne-miejsca-ukrycia.html)):
- NIK krytykuje ówczesną aplikację PSP za to, że „nie wskazuje bowiem mieszkańcom konkretnego miejsca schronienia”, tylko wszystkie w okolicy.
- NIK wnioskuje do MSWiA o narzędzie w rodzaju Alertu RCB, które wskazywałoby mieszkańcom konkretne miejsce i ograniczało przepełnienie.

Tylko 31% wójtów, burmistrzów i prezydentów zapewniło miejsca w schronach. W 6 z 32 gmin nikt nie miał takiego miejsca.

Nie znalazłem nowszej kontroli NIK z lat 2025–2026 na temat ostrzegania ani punktów schronienia **[Niezweryfikowane]**.

### 4.2 Program OLiOC i ustawa

- **Program.** Rada Ministrów przyjęła Program Ochrony Ludności i Obrony Cywilnej 27.05.2025: **16,7 mld zł (2025) i 17,2 mld zł (2026)** ([KG PSP](https://www.gov.pl/web/kgpsp/rzad-przyjal-program-ochrony-ludnosci-i-obrony-cywilnej-na-lata-2025-2026)).
  - Wśród obszarów są obiekty zbiorowej ochrony i Centralna Ewidencja oraz systemy alarmowania, ostrzegania i powiadamiania.
  - Komunikat nie podaje wskaźników liczbowych ani nie wspomina o aplikacjach mobilnych.
- **Przepływ pieniędzy do gmin.** MSWiA nie daje dotacji gminom bezpośrednio, środki rozdzielają wojewodowie. Stan na 15.09.2025 ([odp. na interpelację 2695](https://api.sejm.gov.pl/sejm/term10/writtenQuestions/2695/reply/DLRJ5M/body)):
  - podpisano 1 096 umów na ~265,3 mln zł;
  - w przygotowaniu było 3 065 umów na ~1,89 mld zł.
- **Nowelizacja z 2026 r., Ocena Skutków Regulacji** ([OSR z 21.01.2026, kopia ZPP](https://www.zpp.pl/storage/library/2026-01/6e03f565ed68549f679419714eb3784a.pdf)):
  - Punkty schronienia identyfikuje komendant powiatowy PSP. Informacje o nich „znajdą się w ewidencji … oraz w odpowiednich aplikacjach na urządzenia mobilne”.
  - Według danych ze stycznia 2026 samorządy zleciły sprawdzenie 5 821 budowli ochronnych.
  - OSR deklaruje, że projekt „nie będzie miał wpływu na … osoby starsze i niepełnosprawne”.
- **Art. 114 ust. 2–3 ustawy** ([Dz.U. 2024 poz. 1907](https://api.sejm.gov.pl/eli/acts/DU/2024/1907/text.html)). Organy ochrony ludności „zapewniają poinformowanie ludności o umiejscowieniu obiektów zbiorowej ochrony oraz … o sposobie dotarcia do nich … z uwzględnieniem informacji o ograniczeniach dostępu dla osób z niepełnosprawnościami”. Mogą to robić m.in. przez „narzędzia teleinformatyczne, w tym aplikacje na urządzenia mobilne”.
- **Ewidencja centralna.** KG PSP zamówiła „Centralną Ewidencję Zasobów Ochrony Ludności … umożliwiającą gromadzenie, zarządzanie i udostępnianie danych”. Wykonawca: 3Qcode sp. z o.o., 590 998 zł, 80 dni ([TED 547306-2025](https://ted.europa.eu/pl/notice/-/detail/547306-2025), [wynik 709974-2025](https://ted.europa.eu/pl/notice/-/detail/709974-2025)).
  - **[Analiza]** Państwo buduje własny back-office inwentaryzacji. Prywatne narzędzie „ewidencji dla gmin” powielałoby go.
- **Oznakowanie punktów.** Według wiceministra MSWiA (30.08.2026) postępowanie zakupowe na oznakowanie trwa, a oznaczenia mają być powiązane z „Gdzie się ukryć”. Rozmieszczać je będzie PSP z samorządami ([InfoSecurity24](https://infosecurity24.pl/bezpieczenstwo-wewnetrzne/tak-beda-oznaczone-miejsca-schronienia-mswia-wdraza-nowy-system)) **[Niezweryfikowane: relacja medialna]**.
- **Szacowana pojemność.** Według relacji z komisji sejmowej (05.07.2026) „Gdzie się ukryć” miało na początku marca 2026 81 823 punkty o szacowanej pojemności ponad 23,3 mln miejsc (62,8% ludności) ([InfoSecurity24](https://infosecurity24.pl/bezpieczenstwo-wewnetrzne/mswia-podsumowuje-co-z-tymi-schronami)). KPRM podaje „83 tysiące miejsc … dla blisko 24 mln osób” ([Spider's Web za KPRM](https://spidersweb.pl/2026/06/gdzie-sie-ukryc-2026.html)) **[Niezweryfikowane: nie znalazłem sprawozdania źródłowego]**.
  - **[Analiza]** Pojemność istnieje więc w systemie PSP, ale nie trafia do zbioru publicznego (por. [dane-o-schronach.md §4.3](dane-o-schronach.md)).

### 4.3 Incydenty z 2026 r. jako test popytu

| Data | Co się stało | Ujawniona luka |
|---|---|---|
| 30.07.2026, ~3:50 | Obiekt w przestrzeni powietrznej, prawdopodobne miejsce upadku Tarnawa-Kolonia. Syreny w Lublinie; Alert RCB „został … wstrzymany”. Pierwszy wpis LUW o 7:33 ([Prawo.pl](https://www.prawo.pl/samorzad/alarm-na-lubelszczyznie-ujawnil-luki-w-systemie-ostrzegania,1549690.html)) | Syrena bez treści. Brak komunikatu „wszystko jasne”. Gminy używają różnych narzędzi (SMS, social media, strony), niektóre żadnych. Eksperci: „Do dziś nie mamy spójnego, ogólnokrajowego systemu przepływu informacji” |
| 17.09.2026, przed południem | Alert RCB „Zagrożenie atakiem z powietrza. Znajdź bezpieczne miejsce.” i syreny w lubelskim i podkarpackim ([Bankier](https://www.bankier.pl/wiadomosc/Zagrozenie-atakiem-z-powietrza-Alert-RCB-i-wyjace-syreny-na-wschodzie-Polski-9198525.html)) | Szkoły sprowadzały dzieci do piwnic i szatni, część wyprowadzała na parkingi. Dyrektor szkoły w Lublinie nie miał bezpiecznego miejsca dla 600 uczniów. Szpital w Zamościu nie ma pomieszczeń ochronnych dla pacjentów. Mieszkańcy Rzeszowa dzwonili do WCZK z pytaniem, jak się zachować **[relacja medialna]** |
| 02.10.2026 | MSWiA przekazało kuratoriom „Procedurę przygotowania i reagowania w szkole lub przedszkolu …” ([PDF](https://dokumenty.men.gov.pl/Procedura-szkolaiprzedszkole-6aba78e09c764.PDF); data za [Portal Oświatowy](https://www.portaloswiatowy.pl/wazne-wydarzenia-dla-szkol-i-przedszkoli/atak-z-powietrza-co-ma-zrobic-dyrektor-mswia-przygotowalo-instrukcje-dla-szkol-i-przedszkoli-28059.html)) | 33-stronicowy „Wzorzec do dostosowania do warunków placówki”: dyrektor wyznacza pomieszczenia, ustala „dopuszczalną liczbę osób” dla każdego, prowadzi „wykaz braków”, ćwiczenia i komunikaty do rodziców |

### 4.4 Dostępność dla osób z niepełnosprawnościami

- **RPO o Poradniku bezpieczeństwa (02.12.2025).** Poradnik nie ma wersji w alfabecie Braille'a, PJM ani ETR. „Nie jest też jasne, czy wersja tekstowa jest kompatybilna z czytnikami ekranów”. RCB odpowiedziało, że „Rozpoczęto prace nad zwiększeniem dostępności” ([RPO](https://bip.brpo.gov.pl/pl/content/rpo-poradnik-bezpieczenstwa-ozn-dostepnosc-rcb)).
- **RPO o planach ewakuacji.** Plany zarządzania kryzysowego nie przewidują odrębnych procedur dla osób ze szczególnymi potrzebami ([RPO, odp. MSWiA](https://bip.brpo.gov.pl/pl/content/rpo-ustawa-ozn-sytuacje-kryzysowe-ewakuacja-opinia-mswia-odpowiedz)).
- **Alarm wizualny dla osób głuchych.** „Żółty trójkąt” z rozporządzenia MSWiA z 2025 r. według ekspertów i PZG „nie jest absolutnie skutecznym rozwiązaniem”. Przepisy nie określają jego wyglądu ani widoczności nocą, a PZG nie był konsultowany ([Prawo.pl, 16.03.2026](https://www.prawo.pl/samorzad/system-alarmowania-osob-gluchych,1540685.html)) **[relacja medialna z cytatami]**.
- **Brak danych o dostępności w zbiorze.** Zbiór PSP nie ma pola dostępności dla osób z niepełnosprawnościami, choć art. 114 ust. 2 tego wymaga ([dane-o-schronach.md §4.3](dane-o-schronach.md)).
- **Szkoły.** Procedura dla szkół każe uwzględniać „potrzeby osób z niepełnosprawnościami”, „sposób poruszania się i komunikowania, nadwrażliwość sensoryczną” przy ustalaniu pojemności pomieszczeń ([PDF](https://dokumenty.men.gov.pl/Procedura-szkolaiprzedszkole-6aba78e09c764.PDF)).

---

## 5. Sygnały zainteresowania: Google Trends **[Pomiar]**

Zapytanie: Polska, tygodniowo, 26.12.2021–24.10.2026; słowa „schron”, „schrony”, „najbliższy schron”, „mapa schronów”, „gdzie się ukryć”. Wartości są względne (100 = maksimum w zestawie), pobrane 24.10.2026 z endpointu `trends.google.com/trends/api` (sekcja 9).

| Tydzień | schron | schrony | najbliższy schron | mapa schronów | gdzie się ukryć | Zdarzenie (datowanie) |
|---|---|---|---|---|---|---|
| 27.02–05.03.2022 | 64 | 67 | 1 | 1 | 0 | Pierwszy tydzień po inwazji na Ukrainę **[Niezweryfikowane: zbieżność czasowa]** |
| 02–08.04.2023 | 17 | 56 | 2 | 4 | 0 | Nie ustaliłem przyczyny |
| 10–16.03.2024 | 25 | 29 | 0 | 2 | 0 | Publikacja NIK P/23/061 (12–13.03.2024) ([NIK](https://www.nik.gov.pl/najnowsze-informacje-o-wynikach-kontroli/budowle-ochronne-miejsca-ukrycia.html)) |
| 07–13.09.2025 | 18 | 29 | 0 | 3 | 0 | Naruszenie przestrzeni powietrznej przez drony w nocy 9/10.09.2025 ([rp.pl](https://www.rp.pl/konflikty-zbrojne/art42986481-wielokrotne-naruszenie-polskiej-przestrzeni-powietrznej-donald-tusk-uzyto-uzbrojenia)) |
| **14–20.09.2025** | 48 | **100** | 4 | 6 | 0 | Tydzień po incydencie (maksimum serii) |
| 21–27.12.2025 | 19 | 31 | 2 | 2 | **56** | Start „Gdzie się ukryć” 21–22.12.2025 ([MSWiA](https://www.gov.pl/web/mswia/nowe-narzedzie-pomoze-znalezc-punkty-schronienia)) |
| 26.07–01.08.2026 | 22 | 22 | 3 | 2 | 7 | Syreny w Lublinie 30.07.2026 ([Prawo.pl](https://www.prawo.pl/samorzad/alarm-na-lubelszczyznie-ujawnil-luki-w-systemie-ostrzegania,1549690.html)) |
| 13–19.09.2026 | 27 | 27 | 2 | 2 | 9 | Alerty RCB i syreny 13 i 17.09.2026 ([Bankier](https://www.bankier.pl/wiadomosc/Zagrozenie-atakiem-z-powietrza-Alert-RCB-i-wyjace-syreny-na-wschodzie-Polski-9198525.html)) |
| 18–24.10.2026 | 12 | 9 | 1 | 1 | 7 | Bieżący tydzień (niepełny) |
| średnia z 252 tygodni | 6,4 | 5,2 | 0,1 | 0,2 | 0,5 | – |

**Zapytania powiązane z „schron”** (09.2025–10.2026) **[Pomiar]**:
- Najpopularniejsze: „gdzie schron” (100), „gdzie jest schron” (62), „najbliższy schron” (30), „**przydomowy schron**” (22), „schron poznań” (21), „schron aplikacja” (13).
- Rosnące: „gdzie się ukryć”, „znajdź schron”, „gdzie jest najbliższy schron w mojej okolicy” (skok gwałtowny), „gdzie schron aplikacja” (+650%), „aplikacja schrony” (+250%).

**[Analiza]**
- Zainteresowanie jest **impulsowe**. Rośnie w tygodniu incydentu i przez tydzień po nim, a potem wraca do 10–20% szczytu.
- Szczyt z września 2025 był wyższy niż z lutego 2022. Kolejne incydenty z 2026 r. dały mniejsze skoki (22–27), co może świadczyć o oswojeniu.
- Wnioski dla produktu:
  - pozyskiwanie użytkowników trzeba planować pod okna po incydentach;
  - aplikacja musi działać przy skokowym ruchu;
  - wartość aplikacji musi wynikać z użycia „w chwili” (alarm), a nie z ciągłego zaangażowania.
- „Przydomowy schron” to sygnał osobnego rynku: budowy i doradztwa dla właścicieli domów. Nie badałem go.

---

## 6. Inne segmenty użytkowników

| Segment | Obowiązek lub potrzeba (źródło) | Czy ktoś to obsługuje | Siła dowodu |
|---|---|---|---|
| **Gminy i powiaty (organy ochrony ludności)** | Informowanie o lokalizacji, dojściu i ograniczeniach dostępności, także aplikacją ([art. 114 ust. 2–3](https://api.sejm.gov.pl/eli/acts/DU/2024/1907/text.html)). Środki z OLiOC przez wojewodów ([interpelacja 2695](https://api.sejm.gov.pl/sejm/term10/writtenQuestions/2695/reply/DLRJ5M/body)). Brak spójnego lokalnego kanału ([Prawo.pl](https://www.prawo.pl/samorzad/alarm-na-lubelszczyznie-ujawnil-luki-w-systemie-ostrzegania,1549690.html)) | BLISKO/SISMS (komunikaty), mAlert (deklaratywnie), RSO/Alert RCB na poziomie województwa. Ewidencję centralną buduje KG PSP. Szczecin zamówił „infrastrukturę informatyczną … systemów obrony cywilnej” ([TED 515218-2025](https://ted.europa.eu/pl/notice/-/detail/515218-2025)) | **Średnia.** Obowiązek i pieniądze istnieją. Nie znalazłem przetargu gminnego na aplikację o schronach (TED; e-Zamówienia miało przerwę techniczną **[Pomiar]**) |
| **Szkoły i przedszkola** | Wzorzec procedury: wyznaczenie pomieszczeń, pojemność, wykaz braków, ćwiczenia, komunikaty do rodziców ([PDF](https://dokumenty.men.gov.pl/Procedura-szkolaiprzedszkole-6aba78e09c764.PDF)). Lista oficjalnych kanałów: Alert RCB, RSO, syreny, RTV, „ostrzeżenia publiczne … technologii cyfrowych” | Nic dedykowanego nie znalazłem. Dziennik elektroniczny jako kanał do rodziców **[Niezweryfikowane]** | **Silna** (dokument z 02.10.2026 i incydent z 17.09.2026) |
| **Zarządcy budynków, wspólnoty, spółdzielnie** | Udostępnienie punktu „w miarę możliwości” po alarmie ([art. 103a](https://api.sejm.gov.pl/eli/acts/DU/2026/646/text.pdf)). PSP zawiadamia właściciela o identyfikacji punktu ([OSR](https://www.zpp.pl/storage/library/2026-01/6e03f565ed68549f679419714eb3784a.pdf)). Opinia: schrony „zasypane”, „nikt nie ma dostępu” ([Do Schronu, GP](https://play.google.com/store/apps/details?id=com.godzinazero.godzina_zero&hl=pl&gl=PL)) | Nic | **Średnia co do problemu, słaba co do gotowości płacenia.** Obowiązek jest miękki |
| **Pracodawcy, szpitale, urzędy** | Szpital bez pomieszczeń ochronnych dla pacjentów (17.09.2026, [Bankier](https://www.bankier.pl/wiadomosc/Zagrozenie-atakiem-z-powietrza-Alert-RCB-i-wyjace-syreny-na-wschodzie-Polski-9198525.html)). Schrony w obiektach niepublicznych są „w pierwszej kolejności” dla użytkowników budynku (art. 104, [dane-o-schronach.md §2.6](dane-o-schronach.md)). Branżowe portale piszą o szkole „jako pracodawcy” ([Portal Oświatowy](https://www.portaloswiatowy.pl/wazne-wydarzenia-dla-szkol-i-przedszkoli/zagrozenie-atakiem-z-powietrza.-jak-powinna-przygotowac-sie-szkola-jako-pracodawca-28044.html)) | Nic | **Słaba.** Nie znalazłem przepisu nakładającego na pracodawców obowiązek procedury schronienia **[Niezweryfikowane]** |
| **Osoby z niepełnosprawnościami** | Art. 114 ust. 2 (informacja o ograniczeniach dostępu). RPO: brak wersji dostępnych. Słaby alarm wizualny (sekcja 4.4) | Nic. Zbiór PSP nie ma pola dostępności | **Średnia co do potrzeby** (RPO, ustawa). Nie badałem gotowości do korzystania |
| **Obcokrajowcy i turyści** | Alert RCB ma wersję angielską dla roamingu ([air-raid-alert-ukraina.md](air-raid-alert-ukraina.md)). RSO jest tylko po polsku, a MSWiA „rozważa” angielski. Dwie prośby o EN w opiniach | Tylko AlertyPL ma EN/UK (alarmy, bez schronów). Gdzie Schron? jest niedostępna w App Store gb/de/ua **[Pomiar]** | **Średnio-słaba.** Brak danych o liczbie potencjalnych użytkowników |

---

## 7. Synteza: kandydackie luki rynkowe [Analiza]

Ranking według siły dowodu: liczba niezależnych źródeł pierwotnych i to, czy potrzeba ujawniła się w realnym zdarzeniu.

| # | Luka | Kto ma potrzebę | Dowody | Czy zamkną ją narzędzia oficjalne (w tym ALARM.SOIA)? | Jak zwalidować |
|---|---|---|---|---|---|
| 1 | **Plan schronienia dla instytucji**: wyznaczenie i opis pomieszczeń, pojemność, ćwiczenia, role, szablony komunikatów do rodziców, checklisty, „wykaz braków” do organu prowadzącego | Dyrektorzy szkół i przedszkoli, organy prowadzące (gminy), później szpitale, DPS-y, urzędy | [Procedura MEN/MSWiA](https://dokumenty.men.gov.pl/Procedura-szkolaiprzedszkole-6aba78e09c764.PDF) jako wzorzec do samodzielnego wypełnienia; incydent 17.09.2026 ([Bankier](https://www.bankier.pl/wiadomosc/Zagrozenie-atakiem-z-powietrza-Alert-RCB-i-wyjace-syreny-na-wschodzie-Polski-9198525.html)); zapowiedź kolejnych wytycznych ([Portal Oświatowy](https://www.portaloswiatowy.pl/wazne-wydarzenia-dla-szkol-i-przedszkoli/mswia-przygotuje-dodatkowe-wytyczne-dotyczace-ewakuacji-szkol-podczas-zagrozenia-atakiem-z-powietrza-28020.html)) | **Nie.** ALARM.SOIA i „Gdzie się ukryć” dotyczą ludności, nie wnętrza budynku. Ryzyko: MEN może dodać moduł do istniejących systemów szkolnych | Wywiady z 10–15 dyrektorami (lubelskie, podkarpackie, mazowieckie): jak wypełnili procedurę, ile to trwało, czym komunikują się z rodzicami, kto płaci (szkoła czy organ prowadzący), czy zrobili ćwiczenie |
| 2 | **Przepływ „alarm → instrukcja → najbliższe realnie dostępne miejsce”** w jednym ekranie, z rozróżnieniem „całodobowe” i „może być zamknięte” | Mieszkańcy terenów przygranicznych, osoby, które nie znają okolicy | Syreny bez treści (30.07.2026); telefony do WCZK (17.09.2026); NIK: narzędzie ma „wskazywać konkretne miejsce” ([NIK](https://www.nik.gov.pl/najnowsze-informacje-o-wynikach-kontroli/budowle-ochronne-miejsca-ukrycia.html)); 29,3% nie wie, co robić po syrenie ([rp.pl](https://www.rp.pl/spoleczenstwo/art45188391-sondaz-rzeczpospolitej-jak-sie-zachowac-gdy-zostanie-ogloszony-alarm)); trend „gdzie jest najbliższy schron w mojej okolicy” | **Częściowo i prawdopodobnie wkrótce.** ALARM.SOIA da alarm z Critical Alerts, ale według mediów bez mapy schronień **[Niezweryfikowane]**. Integracja „Gdzie się ukryć” z mObywatelem lub SOiA jest możliwa. Prywatne odpowiedniki (Gdzie Schron?, CVL) już istnieją. **Okno czasowe jest krótkie** | Zapytać KG PSP (wniosek o informację publiczną), czy SOiA będzie linkować do „Gdzie się ukryć”. Test użyteczności: czas od powiadomienia do wyboru miejsca, u osób 65+ i na wsi |
| 3 | **Weryfikacja dostępności punktów „Na żądanie” w terenie**: czy otwarte, kto ma klucz, gdzie jest wejście, zdjęcie oznakowania | Mieszkańcy, PSP (pętla zwrotna), zarządcy | 69% punktów „Na żądanie” i obowiązek „w miarę możliwości” ([dane-o-schronach.md](dane-o-schronach.md)); opinie „zasypane”, „nieprawdziwe” (sekcja 2); NIK: obiekty „dla mieszkańców niedostępne” | **Nie w pełni.** PSP przyjmuje propozycje nowych punktów, a oznakowanie jest w zakupie. Pętli „ten punkt był zamknięty” nie ma **[Niezweryfikowane]**. Gdzie Schron? ma już zgłoszenia społeczności | Pilotaż: zweryfikować np. 50 punktów „Na żądanie” w jednej dzielnicy i policzyć, ile było dostępnych. Zapytać KG PSP, czy przyjmie zbiorcze zgłoszenia |
| 4 | **Narzędzie dla gminy do realizacji art. 114 ust. 2–3**: publikacja punktów z opisem dojścia i dostępności, lokalne komunikaty, raport do wojewody | Wójtowie, starostowie, gminne centra zarządzania kryzysowego | Obowiązek ustawowy z wzmianką o aplikacjach; środki OLiOC; brak spójnego kanału lokalnego ([Prawo.pl](https://www.prawo.pl/samorzad/alarm-na-lubelszczyznie-ujawnil-luki-w-systemie-ostrzegania,1549690.html)) | **Częściowo.** Ewidencję buduje KG PSP (CEZOL), komunikaty obsługują BLISKO/SISMS, mAlert próbuje łączyć obie rzeczy. Gmina nie jest właścicielem danych o punktach (identyfikuje je PSP) | Wywiady z 5–10 pracownikami ds. zarządzania kryzysowego: czym realizują art. 114, czy mają budżet z OLiOC na IT, czy wojewoda tego wymaga. Przegląd BZP po zakończeniu przerwy w e-Zamówieniach |
| 5 | **Dostępność dla osób z niepełnosprawnościami**: atrybuty punktów (schody, winda, rampa), komunikaty w PJM i ETR, alarm wibracyjno-świetlny | OzN, ich opiekunowie, DPS-y; także gminy (obowiązek z art. 114 ust. 2) | RPO ([Poradnik](https://bip.brpo.gov.pl/pl/content/rpo-poradnik-bezpieczenstwa-ozn-dostepnosc-rcb), [ewakuacja](https://bip.brpo.gov.pl/pl/content/rpo-ustawa-ozn-sytuacje-kryzysowe-ewakuacja-opinia-mswia-odpowiedz)); PZG o alarmie wizualnym ([Prawo.pl](https://www.prawo.pl/samorzad/system-alarmowania-osob-gluchych,1540685.html)); OSR „nie będzie miał wpływu” | **Nie**, nic nie zapowiedziano. RCB pracuje tylko nad dostępnością Poradnika | Wywiady z PZG, PZN, organizacjami osób z niepełnosprawnością ruchową: czego brakuje w chwili alarmu. Czy PSP zbiera dane o dostępności w CEZOL? |
| 6 | **Wielojęzyczność** (EN, UK) dla alarmu i schronienia | Turyści, pracownicy z zagranicy, uchodźcy z Ukrainy | 2 prośby o EN; RSO tylko PL; MSWiA „rozważa” EN; Gdzie Schron? niedostępna w obcych App Store **[Pomiar]** | **Niepewne.** Alert RCB ma EN w roamingu. Język ALARM.SOIA nie jest znany | Sprawdzić języki ALARM.SOIA po premierze. Wywiady z organizacjami ukraińskimi i hotelami w miastach przygranicznych |
| 7 | **Kontekst zagrożenia** („co leci, skąd, kiedy koniec”) | Użytkownicy zmęczeni ogólnikowymi alarmami | Strażnik: 102 oceny w miesiąc, pochwały „można samemu ocenić”; skarga na RSO „zero informacji o naruszeniu” | **Nie.** Państwo nie publikuje takich danych. Prywatne źródła (OSINT, ADS-B) niosą ryzyko fałszywych alarmów i odpowiedzialności ([air-raid-alert-ukraina.md §4.4](air-raid-alert-ukraina.md)) | Przed decyzją: analiza prawna i ocena reakcji na fałszywy alarm (opinia AlertyPL z 23.09.2026) |
| 8 | **Precyzyjne i nie-spamowe alarmy** (gmina lub powiat, bez innych województw) | Użytkownicy RSO | 7 z 13 opinii o RSO | **Tak, prawdopodobnie.** ALARM.SOIA: do 10 obszarów, poziomy ważności **[Niezweryfikowane]**; Cell Broadcast w 2027 | Nie inwestować. Ocenić po premierze ALARM.SOIA |
| 9 | Mapa offline, nawigacja | Wszyscy | Pochwały offline (5) | **Już zamknięte**: PWA PSP, Gdzie Schron?, Do Schronu, OLiOC | – (to standard, nie luka) |

**Wnioski [Analiza]:**
- Luki 1, 3 i 5 mają wspólny mianownik: **dane o tym, czy miejsce naprawdę zadziała w chwili alarmu**, zbierane od instytucji i społeczności. Tego państwo dziś nie zbiera publicznie.
- Luka 2 jest najbardziej oczywista, ale i najbardziej narażona na kanibalizację przez ALARM.SOIA i mObywatel.
- Luka 4 wymaga sprzedaży do sektora publicznego i konkuruje z CEZOL oraz BLISKO.

---

## 8. Otwarte pytania

1. **ALARM.SOIA a schronienie.** Czy aplikacja po premierze w grudniu 2026 pokaże punkty schronienia albo zlinkuje „Gdzie się ukryć”? W jakich językach będzie działać? (Sprawdzić kartę w sklepie po premierze, ewentualnie wniosek do KG PSP.)
2. **Szkoły.** Ile szkół wypełniło wzorzec procedury do końca 2026 r.? Czy kuratoria lub organy prowadzące to egzekwują? Czy szkoły mają budżet lub fundusze OLiOC przez gminę na narzędzia?
3. **Gminy.** Jak gminy dokumentują wykonanie art. 114 ust. 2? Czy wojewodowie to kontrolują? Czy po zakończeniu przerwy w e-Zamówieniach widać zamówienia gminne na „aplikację” lub „system powiadamiania” finansowane z OLiOC?
4. **Pętla zwrotna PSP.** Czy KG PSP przyjmuje zgłoszenia „punkt był zamknięty” i czy publikuje datę weryfikacji punktu? Czy CEZOL będzie miała interfejs dla podmiotów zewnętrznych?
5. **Zaufanie do alarmów.** Czy istnieje badanie (RCB, MSWiA, CBOS) mierzące zaufanie do Alertu RCB i RSO oraz zmęczenie alarmami? Nie znalazłem go.
6. **Eurobarometr 547 dla Polski.** Jakie są dokładne odsetki w karcie PL (przygotowanie, źródła informacji, zaufanie)? Trzeba pobrać kartę ręcznie ze strony [badania](https://europa.eu/eurobarometer/surveys/detail/3228).
7. **IBRiS/Defence24 „Obronność 2026”.** Jaka jest metoda, próba i pełne brzmienie pytania o schron (81,8%)? Raportu źródłowego nie znalazłem.
8. **Skala segmentów.** Ile jest placówek oświatowych w województwach przygranicznych? Ilu cudzoziemców przebywa w tych województwach? (GUS, UdSC – nie sprawdzałem.)
9. **Monetyzacja.** Czy którakolwiek z prywatnych aplikacji zarabia (B2C, B2B, B2G)? Czy mAlert ma podpisaną umowę z jakąkolwiek gminą? (Wywiad z twórcami albo wnioski o informację publiczną do gmin.)
10. **Rynek „przydomowych schronów”** (sygnał z Trends) to osobny temat. Czy jest powiązany z aplikacją (np. katalog i certyfikacja)? Nie badałem.

---

## 9. Metoda i reprodukcja

- **App Store, metadane.** `itunes.apple.com/search` i `/lookup` z `country=pl` (oraz gb, de, ua, us dla dostępności). Pola: `userRatingCount`, `averageUserRating`, `releaseDate`, `currentVersionReleaseDate`, `languageCodesISO2A`, `sellerName`, `description`. Wyszukiwane frazy: schron, punkty schronienia, RSO, alert rcb, ostrzeganie, obrona cywilna, gdzie się ukryć, syreny alarm, 19115.
- **App Store, opinie.** Strona `apps.apple.com/pl/app/x/id{ID}?see-all=reviews`, z której wyciągnąłem obiekty `"review"` z osadzonego JSON. Publiczny RSS `customerreviews` zwrócił puste kanały dla wszystkich aplikacji. Nieudokumentowanego API sklepu nie używałem.
- **Google Play.** Strony `play.google.com/store/apps/details?id=…&hl=pl&gl=PL` (liczba pobrań, ocena, liczba opinii, 3 wyróżnione opinie) i strona wyszukiwania `store/search?q=…&c=apps`.
- **Kodowanie opinii.** Ręczne, wieloetykietowe, według kategorii z sekcji 2.2. Kodował jeden koder, bez weryfikacji drugim.
- **Google Trends.** Endpointy `trends.google.com/trends/api/explore` i `widgetdata/multiline` / `relatedsearches`. Ustawienia: `geo=PL`, `hl=pl`, okres 2022-01-01–2026-10-23 (seria) i 2025-09-01–2026-10-23 (zapytania powiązane). Wartości są względne w ramach jednego zapytania i nie da się ich porównywać między zapytaniami.
- **TED.** API wyszukiwania `api.ted.europa.eu/v3/notices/search`. Zapytania z `buyer-country=POL` i frazami: „aplikacja mobilna” i „ostrzegania”, „ochrony ludności” (CPV IT), „obiektów zbiorowej ochrony”, „SOiA”, „oznakowani*” i „schronienia”. **e-Zamówienia (BZP) 24.10.2026 zwracało stronę „Przerwa techniczna”**, więc krajowych ogłoszeń poniżej progów UE nie przeszukałem.
- **PDF-y** (CBOS, OSR, procedura MEN) przetworzyłem lokalnie na tekst przez `pypdf` w izolowanym katalogu.
- Wszystkie pobrania z 24.10.2026.

---

## 10. Źródła

**Sklepy z aplikacjami (karty, 24.10.2026):**
- App Store: [RSO](https://apps.apple.com/pl/app/id1326612339), [Gdzie Schron?](https://apps.apple.com/pl/app/id6762662949), [AlertyPL](https://apps.apple.com/pl/app/id6757369533), [Strażnik](https://apps.apple.com/pl/app/id6813563009), [CVL](https://apps.apple.com/pl/app/id6824275375), [Alerty Polska](https://apps.apple.com/pl/app/id6814775850), [mAlert](https://apps.apple.com/pl/app/id6753319281), [Nieśmiertelnik](https://apps.apple.com/pl/app/id6756108139), [Schrony – OLiOC](https://apps.apple.com/pl/app/id6766316218), [bezpieczny.info](https://apps.apple.com/pl/app/id6756733650), [Warszawa 19115](https://apps.apple.com/pl/app/id735957277), [BLISKO](https://apps.apple.com/pl/app/id821655959)
- Google Play: [RSO](https://play.google.com/store/apps/details?id=mswia.rso&hl=pl&gl=PL), [Gdzie Schron?](https://play.google.com/store/apps/details?id=pl.gdzieschron.app&hl=pl&gl=PL), [AlertyPL](https://play.google.com/store/apps/details?id=pl.alerty.app&hl=pl&gl=PL), [Do Schronu](https://play.google.com/store/apps/details?id=com.godzinazero.godzina_zero&hl=pl&gl=PL), [#wGotowości](https://play.google.com/store/apps/details?id=pl.mil.ron.wgotowosci&hl=pl&gl=PL), [NEPTUN Dron Alerts](https://play.google.com/store/apps/details?id=com.neptunalarm.neptun_alarm_app&hl=pl&gl=PL)
- Strony wydawców: [gdzie-schron.pl](https://gdzie-schron.pl/), [alertypl.com](https://alertypl.com/en)

**Badania:**
- [CBOS, Komunikat 44/2025 „Czy wojna rozszerzy się na państwa NATO?”](https://cbos.pl/PL/publikacje/raporty/open_file.php?id=7017)
- [CBOS Flash 13/2026 „Polacy o Poradniku bezpieczeństwa”](https://cbos.pl/PL/publikacje/flashe/pliki/2026/fl_013_2026.pdf)
- [IBRiS dla Defence24 (InfoSecurity24, 17.06.2026)](https://infosecurity24.pl/bezpieczenstwo-wewnetrzne/polacy-nieprzygotowani-na-kryzys-alarmujace-wyniki-raportu)
- [IBRiS dla „Rzeczpospolitej” (28.09.2026)](https://www.rp.pl/spoleczenstwo/art45188391-sondaz-rzeczpospolitej-jak-sie-zachowac-gdy-zostanie-ogloszony-alarm)
- [IBRiS dla InfoSecurity24 (29.03.2023)](https://infosecurity24.pl/bezpieczenstwo-wewnetrzne/polacy-nie-wiedza-gdzie-sie-schronic-wyniki-badan-infosecurity24pl)
- [PBS dla PCK (11.10.2024)](https://pck.pl/en/polski-czerwony-krzyz/aktualnosci/2024-10-11-76-polakow-uwaza-katastrofy-naturalne-za-potencjalne-zagrozenie-dla-si)
- [Special Eurobarometer 547: komunikat KE](https://civil-protection-humanitarian-aid.ec.europa.eu/news-stories/news/europeans-believe-they-need-more-information-prepare-emergencies-recent-eurobarometer-survey-shows-2024-09-30_en), [strona badania](https://europa.eu/eurobarometer/surveys/detail/3228)

**Prawo, administracja, audyty:**
- [Ustawa o ochronie ludności i obronie cywilnej, Dz.U. 2024 poz. 1907](https://api.sejm.gov.pl/eli/acts/DU/2024/1907/text.html)
- [Nowelizacja, Dz.U. 2026 poz. 646](https://api.sejm.gov.pl/eli/acts/DU/2026/646/text.pdf)
- [OSR projektu nowelizacji (UD317), 21.01.2026](https://www.zpp.pl/storage/library/2026-01/6e03f565ed68549f679419714eb3784a.pdf)
- [KG PSP: Rząd przyjął Program OLiOC 2025–2026](https://www.gov.pl/web/kgpsp/rzad-przyjal-program-ochrony-ludnosci-i-obrony-cywilnej-na-lata-2025-2026)
- [Odpowiedź MSWiA na interpelację nr 2695](https://api.sejm.gov.pl/sejm/term10/writtenQuestions/2695/reply/DLRJ5M/body)
- [NIK P/23/061 „W schronie się nie schronisz”](https://www.nik.gov.pl/najnowsze-informacje-o-wynikach-kontroli/budowle-ochronne-miejsca-ukrycia.html)
- [MSWiA: Nowe narzędzie pomoże znaleźć punkty schronienia](https://www.gov.pl/web/mswia/nowe-narzedzie-pomoze-znalezc-punkty-schronienia)
- [Procedura dla szkół i przedszkoli (MEN/MSWiA)](https://dokumenty.men.gov.pl/Procedura-szkolaiprzedszkole-6aba78e09c764.PDF)
- RPO: [Poradnik bezpieczeństwa a OzN](https://bip.brpo.gov.pl/pl/content/rpo-poradnik-bezpieczenstwa-ozn-dostepnosc-rcb), [ewakuacja OzN, odpowiedź MSWiA](https://bip.brpo.gov.pl/pl/content/rpo-ustawa-ozn-sytuacje-kryzysowe-ewakuacja-opinia-mswia-odpowiedz)
- TED: [609994-2026 (RSO)](https://ted.europa.eu/pl/notice/-/detail/609994-2026), [547306-2025 (CEZOL)](https://ted.europa.eu/pl/notice/-/detail/547306-2025), [709974-2025 (wynik CEZOL)](https://ted.europa.eu/pl/notice/-/detail/709974-2025), [515218-2025 (Szczecin)](https://ted.europa.eu/pl/notice/-/detail/515218-2025)

**Media (datowanie zdarzeń i relacje, źródła wtórne):**
- [Prawo.pl, 30.07.2026: alarm na Lubelszczyźnie](https://www.prawo.pl/samorzad/alarm-na-lubelszczyznie-ujawnil-luki-w-systemie-ostrzegania,1549690.html)
- [Bankier, 17.09.2026: Alert RCB i syreny](https://www.bankier.pl/wiadomosc/Zagrozenie-atakiem-z-powietrza-Alert-RCB-i-wyjace-syreny-na-wschodzie-Polski-9198525.html)
- [rp.pl, 10.09.2025: naruszenie przestrzeni powietrznej](https://www.rp.pl/konflikty-zbrojne/art42986481-wielokrotne-naruszenie-polskiej-przestrzeni-powietrznej-donald-tusk-uzyto-uzbrojenia)
- [Prawo.pl, 16.03.2026: alarmowanie osób głuchych](https://www.prawo.pl/samorzad/system-alarmowania-osob-gluchych,1540685.html)
- [InfoSecurity24, 05.07.2026: MSWiA podsumowuje](https://infosecurity24.pl/bezpieczenstwo-wewnetrzne/mswia-podsumowuje-co-z-tymi-schronami)
- [InfoSecurity24, 30.08.2026: oznakowanie](https://infosecurity24.pl/bezpieczenstwo-wewnetrzne/tak-beda-oznaczone-miejsca-schronienia-mswia-wdraza-nowy-system)
- [Spider's Web, 22.12.2025](https://spidersweb.pl/2025/12/rzadowa-mapa-miala-pokazywac-schrony-dziala-fatalnie.html), [10.06.2026](https://spidersweb.pl/2026/06/gdzie-sie-ukryc-2026.html), [28.09.2026](https://spidersweb.pl/2026/09/alarm-soia-aplikacja-straz-pozarna.html)
- Portal Oświatowy: [instrukcja MSWiA](https://www.portaloswiatowy.pl/wazne-wydarzenia-dla-szkol-i-przedszkoli/atak-z-powietrza-co-ma-zrobic-dyrektor-mswia-przygotowalo-instrukcje-dla-szkol-i-przedszkoli-28059.html), [zapowiedź wytycznych](https://www.portaloswiatowy.pl/wazne-wydarzenia-dla-szkol-i-przedszkoli/mswia-przygotuje-dodatkowe-wytyczne-dotyczace-ewakuacji-szkol-podczas-zagrozenia-atakiem-z-powietrza-28020.html), [szkoła jako pracodawca](https://www.portaloswiatowy.pl/wazne-wydarzenia-dla-szkol-i-przedszkoli/zagrozenie-atakiem-z-powietrza.-jak-powinna-przygotowac-sie-szkola-jako-pracodawca-28044.html)
- [Gmina Chełmno o BLISKO](https://gmina-chelmno.pl/zapisz-do-pdf/6472)
