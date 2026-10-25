# „Повітряна тривога" (Air Alert): jak działa w Ukrainie i co z tego da się przenieść do Polski

Stan wiedzy na 2026-10-24. Każde twierdzenie ma link do źródła. Sekcje opisujące fakty są oddzielone od analizy. Analiza i rekomendacje są oznaczone **[Analiza]**. Rzeczy, których nie udało się potwierdzić w źródle pierwotnym, są oznaczone **[Niezweryfikowane]**.

## TL;DR

- **Czym jest aplikacja.** „Повітряна тривога" wydaje Ajax Systems. Aplikacja powstała z inicjatywy Stfalcon i przy wsparciu Ministerstwa Transformacji Cyfrowej (Mintsyfra). Ruszyła 1 marca 2022 r. ([kmu.gov.ua](https://www.kmu.gov.ua/news/za-pidtrimki-mincifri-zapushcheno-zastosunok-povitryana-trivoga-dlya-operativnoyi-reakciyi-na-pochatok-i-zakinchennya-trivog)).
- **Skąd bierze się sygnał.** Alarm nie jest wyliczany automatycznie. Ręcznie wprowadza go dyżurny obrony cywilnej w obwodowej administracji wojskowej, czyli ta sama osoba, która uruchamia syreny. Następnie trafia do użytkowników, którzy wybrali dany obwód, rejon lub hromadę ([Stfalcon](https://stfalcon.com/en/blog/post/air-alert-app), [DOU](https://dou.ua/lenta/interviews/air-alarm-application/)).
- **Przewaga techniczna.** Aplikacja używa iOS Critical Alerts, więc dźwięk przebija tryb cichy i „Nie przeszkadzać". Nie wymaga rejestracji i nie zbiera lokalizacji ([App Store](https://apps.apple.com/ua/app/повітряна-тривога/id1611955391)).
- **Ekosystem.** Wokół aplikacji powstały oficjalne API (api.ukrainealarm.com), oficjalna mapa i kanał Telegram. Istnieje też niezależny, wolontariacki serwis alerts.in.ua z publicznym API (token, limit 8–12 zapytań na minutę) ([devs.alerts.in.ua](https://devs.alerts.in.ua/)).
- **Polska ma podstawę prawną i własne systemy.** Ustawa z 5.12.2024 o ochronie ludności i obronie cywilnej wymienia zamknięty katalog kanałów ostrzegania: syreny, RSO, ALERT RCB, cell broadcast, media i inne ([art. 71](https://api.sejm.gov.pl/eli/acts/DU/2024/1907/text.html)). Alarm lub komunikat ogłasza organ ochrony ludności, czyli wójt, starosta albo wojewoda ([rozp. MSWiA, Dz.U. 2025 poz. 645](https://api.sejm.gov.pl/eli/acts/DU/2025/645/text.pdf)).
- **Państwo buduje własny odpowiednik.** MSWiA i PSP przygotowują aplikację SOiA. W październiku 2026 była „gotowa programistycznie" i przechodziła testy bezpieczeństwa; prezentacja jest zapowiedziana na grudzień 2026. Cell Broadcast ma ruszyć w II połowie 2027 ([MSWiA](https://www.gov.pl/web/mswia/minister-marcin-kierwinski-podpisal-list-intencyjny-ws-systemu-ostrzegania-ludnosci-cywilnej-cell-broadcast)).
- **Brak publicznego feedu alarmów.** Nie znalazłem w Polsce żadnego publicznego, maszynowo czytelnego źródła alarmów ani komunikatów RSO (szukałem m.in. w katalogu dane.gov.pl).
- **Dane o schronach są otwarte.** PSP publikuje co tydzień zbiór „Punkty schronienia w Polsce" (ok. 87 tys. punktów, CSV, licencja CC BY 4.0) ([dane.gov.pl](https://dane.gov.pl/pl/dataset/28058,punkty-schronienia-w-polsce)).
- **[Analiza] Co z tego wynika dla prywatnej aplikacji.** Prywatna aplikacja nie może dziś legalnie „ogłaszać alarmów" ani wiarygodnie ich retransmitować bez porozumienia z MSWiA, RCB lub PSP. Realne nisze bez takiego porozumienia to:
  - mapa i nawigacja do schronień na otwartych danych PSP,
  - edukacja i przygotowanie,
  - ewentualnie pośrednictwo (agregacja) ostrzeżeń IMGW, przy czym licencja tych danych wyklucza użycie komercyjne.

---

## 1. Jak działa „Повітряна тривога"

### 1.1 Kto za nią stoi i jak powstała

- Mintsyfra ogłosiła start 1 marca 2022 r. Aplikację „wydała Ajax Systems z inicjatywy IT-firmy stfalcon.com" przy wsparciu ministerstwa. Powstała „w ciągu jednej doby" ([kmu.gov.ua, 01.03.2022](https://www.kmu.gov.ua/news/za-pidtrimki-mincifri-zapushcheno-zastosunok-povitryana-trivoga-dlya-operativnoyi-reakciyi-na-pochatok-i-zakinchennya-trivog)).
- W App Store sprzedawcą jest **Ajax Systems Inc.**, a aplikacja ma kategorię „Wiadomości" ([App Store](https://apps.apple.com/ua/app/повітряна-тривога/id1611955391)). Na Google Play identyfikator to `com.ukrainealarm` ([link z komunikatu Mintsyfry](https://play.google.com/store/apps/details?id=com.ukrainealarm)).
- Podział pracy według wywiadu z założycielem Stfalcon ([DOU, 25.04.2022](https://dou.ua/lenta/interviews/air-alarm-application/)):
  - Ajax odpowiadał za backend, frontend, UI/UX i publikację w sklepach.
  - Stfalcon (od końca marca) robił natywne aplikacje, stronę, mapy i API.
  - Łącznie zaangażowanych było ponad 100 osób.
  - Pierwszą wersję wysłano do sklepów 28.02.2022. Apple przeszedł przyspieszone review w około 30 minut.

### 1.2 Źródło sygnału: kto naciska przycisk

- Komunikat Mintsyfry z 1.03.2022 mówi, że informacja pochodzi „z pierwszych ust", czyli od administracji obwodowych. Na starcie dostępnych było 12 obwodów ([kmu.gov.ua](https://www.kmu.gov.ua/news/za-pidtrimki-mincifri-zapushcheno-zastosunok-povitryana-trivoga-dlya-operativnoyi-reakciyi-na-pochatok-i-zakinchennya-trivog)).
- Stfalcon opisuje łańcuch tak: operator administracji obwodowej otrzymuje sygnał, wprowadza go do konsoli, aplikacja wysyła alert do osób, które wybrały dany obwód, rejon lub hromadę, a sygnał odwołania wywołuje komunikat „відбій" ([Stfalcon](https://stfalcon.com/en/blog/post/air-alert-app)).
- Według wywiadu w DOU ([DOU](https://dou.ua/lenta/interviews/air-alarm-application/)):
  - Alarmy włączają **ręcznie dyżurni** – ci sami ludzie, którzy obsługują syreny w obwodowych ośrodkach ochrony cywilnej.
  - Dostęp nadawano przez administracje obwodowe i DSNS (Państwową Służbę ds. Sytuacji Nadzwyczajnych). Kontakty dostarczyli CDTO (cyfrowi wiceszefowie) z Mintsyfry.
  - Stfalcon weryfikował każdy kontakt przez SBU.
  - Aplikacja **nie jest automatycznie spięta z syrenami**. To równoległy kanał, który często wyprzedza analogowe syreny o 1–2 minuty.
- Od wersji 3.0 (kwiecień 2022) dane podają operatorzy administracji obwodowych, a koordynują je dyżurni DSNS. Doszły typy „walki uliczne" i „ostrzał artyleryjski" ([DOU, 27.04.2022](https://dou.ua/lenta/news/air-alarm-application-version-3/)).
- W wersji 6.0 (28.02.2024) pojawiło się ostrzeżenie „Підвищена небезпека!" dla konkretnych miast lub hromad przy zbliżaniu się rakiety albo drona. Wysyłają je oficerowie obrony cywilnej w obwodowych administracjach wojskowych ([Stfalcon](https://stfalcon.com/en/blog/post/air-alert-app)).
- Wersja 7.2.0 wprowadziła żółty i czerwony poziom zagrożenia ([App Store, historia wersji](https://apps.apple.com/ua/app/повітряна-тривога/id1611955391)).
- 17.10.2026 do aplikacji dodano mapę przybliżonego ruchu rakiet manewrujących i dronów (Shahed, „Бандероль"):
  - Dane przekazują Siły Powietrzne za pośrednictwem MON Ukrainy.
  - Mapa nie pokazuje rakiet balistycznych ani celów szybszych niż 2000 km/h.
  - To wspólny projekt Mintsyfry, MON, Sił Powietrznych i firm IT.
  - Źródło: [Слово і Діло](https://www.slovoidilo.ua/2026/10/17/novyna/bezpeka/zastosunku-povitryana-tryvoha-zyavylasya-karta-ruxu-vorozhyx-raket-droniv), [Fakty](https://fakty.com.ua/ua/ukraine/20261017-u-zastosunku-povitryana-tryvoga-teper-vydno-pryblyznyj-ruh-raket-i-droniv/).
  - **[Niezweryfikowane]** Nie znalazłem samego komunikatu MON ani Mintsyfry, tylko relacje mediów.

### 1.3 Ziarnistość i typy alertów

- Na starcie alerty działały na poziomie obwodu ([kmu.gov.ua](https://www.kmu.gov.ua/news/za-pidtrimki-mincifri-zapushcheno-zastosunok-povitryana-trivoga-dlya-operativnoyi-reakciyi-na-pochatok-i-zakinchennya-trivog)). Dziś można wybrać obwód, rejon albo hromadę ([App Store](https://apps.apple.com/ua/app/повітряна-тривога/id1611955391)).
- Typy alertów to: powietrzny, chemiczny, techniczny (awarie przemysłowe), ostrzał artyleryjski, walki uliczne i zagrożenie radiacyjne ([Stfalcon](https://stfalcon.com/en/blog/post/air-alert-app), [Ajax](https://ajax.systems/blog/air-alert-via-software-ajax/)).
- Każdy typ ma własny dźwięk i tekst z zaleceniami ([DOU](https://dou.ua/lenta/news/air-alarm-application-version-3/)).

### 1.4 Dostarczanie powiadomień

- **iOS.** Aplikacja używa Critical Alerts, czyli głośnego sygnału mimo trybu cichego i uśpienia ekranu. Użytkownik może je wyłączyć w ustawieniach ([App Store](https://apps.apple.com/ua/app/повітряна-тривога/id1611955391)). Uprawnienie (entitlement) do Critical Alerts Ajax miał już wcześniej, więc aplikację opublikowano z jego konta deweloperskiego. Według techleada samo uzyskanie entitlementu zajmuje „co najmniej tydzień" ([DOU](https://dou.ua/lenta/interviews/air-alarm-application/)).
- **Android.** Na części urządzeń push dochodził z opóźnieniem liczonym w minutach. Przy 100 tys. użytkowników wysyłka była bardzo wolna, co naprawiono w około 15 minut ([DOU](https://dou.ua/lenta/interviews/air-alarm-application/)).
- **Szczegóły infrastruktury.** Nie ujawniono stosu backendu ani tego, czy używany jest FCM czy APNs bezpośrednio ([DOU](https://dou.ua/lenta/interviews/air-alarm-application/)). **[Niezweryfikowane]**
- **Wymagania.** Aplikacja potrzebuje internetu ([Stfalcon](https://stfalcon.com/en/blog/post/air-alert-app)). Operatorzy lifecell, Kyivstar i Vodafone nie naliczają za nią transferu danych. Istnieje zapasowy kanał Telegram „Повітряна тривога", który powiela wszystkie alerty ([kmu.gov.ua, 16.03.2022](https://www.kmu.gov.ua/news/mincifri-onovleno-zastosunok-povitryana-trivoga)).

### 1.5 Prywatność

- Aplikacja nie wymaga rejestracji i „nie zbiera danych osobowych ani danych o geolokalizacji" ([kmu.gov.ua](https://www.kmu.gov.ua/news/za-pidtrimki-mincifri-zapushcheno-zastosunok-povitryana-trivoga-dlya-operativnoyi-reakciyi-na-pochatok-i-zakinchennya-trivog)).
- Etykieta prywatności w App Store wymienia tylko diagnostykę awarii, niepowiązaną z użytkownikiem ([App Store](https://apps.apple.com/ua/app/повітряна-тривога/id1611955391)).
- **[Analiza]** Region wybierany ręcznie zamiast geolokalizacji upraszcza RODO i buduje zaufanie, ale nie ostrzega osób, które przemieszczają się między regionami.

### 1.6 Integracja ze smart home (Ajax)

- Ajax zintegrował aplikację przez API ze swoimi systemami alarmowymi. Alarm wojenny może zabrzmieć z syren Ajax w budynku we wszystkich 24 obwodach i w Kijowie ([Ajax, 27.09.2022](https://ajax.systems/blog/air-alert-via-software-ajax/)).
- Funkcję włącza instalator lub firma ochrony. Powiadomienia nie rozróżniają typu zagrożenia. Pilotaż odbył się z UNICEF w szkole w Irpieniu ([Ajax](https://ajax.systems/blog/air-alert-via-software-ajax/)).

### 1.7 Skala i model finansowania

Liczby pochodzą tylko z wypowiedzi pierwszej strony (Mintsyfra, Stfalcon, Ajax):

| Kiedy | Liczba | Źródło |
|---|---|---|
| pierwsza godzina po ogłoszeniu | > 1 mln pobrań | [DOU](https://dou.ua/lenta/interviews/air-alarm-application/) |
| 16.03.2022 | > 3,5 mln instalacji | [kmu.gov.ua](https://www.kmu.gov.ua/news/mincifri-onovleno-zastosunok-povitryana-trivoga) |
| 27.04.2022 | ok. 5 mln pobrań | [DOU](https://dou.ua/lenta/news/air-alarm-application-version-3/) |
| bez daty (strona Stfalcon) | 26 mln pobrań, > 6 mln użytkowników | [Stfalcon](https://stfalcon.com/en/blog/post/air-alert-app) |
| 2026-10 | 338 tys. ocen w App Store, średnia 4,7 | [App Store](https://apps.apple.com/ua/app/повітряна-тривога/id1611955391) |

- **Model finansowania.** Projekt jest wolontariacki na poziomie firm: Ajax, Stfalcon, Fwdays i Kasta pokrywają koszty z własnych zasobów. Aplikacja jest bezpłatna i bez reklam ([DOU](https://dou.ua/lenta/interviews/air-alarm-application/)). Nie znalazłem danych o kosztach ani o finansowaniu państwowym. **[Niezweryfikowane]**
- **Integracja z Diią.** Nie znalazłem żadnego źródła o integracji z Diią. **[Niezweryfikowane]**
- **Rozbieżność w źródłach.** Stfalcon pisze raz o „jednym dniu", a gdzie indziej o „48 godzinach" budowy ([Stfalcon](https://stfalcon.com/en/blog/post/air-alert-app)).

---

## 2. Ekosystem danych w Ukrainie

### 2.1 Oficjalne API i mapa (Ajax/Stfalcon)

- Wersja 3.0 przyniosła oficjalną mapę [map.ukrainealarm.com](https://map.ukrainealarm.com/) i API dla deweloperów [api.ukrainealarm.com](https://api.ukrainealarm.com/). Dostęp wymaga wniosku z danymi kontaktowymi i opisem projektu ([DOU](https://dou.ua/lenta/news/air-alarm-application-version-3/)).
- Strona API zwróciła mi błąd 403, więc warunków i limitów nie zweryfikowałem. **[Niezweryfikowane]**

### 2.2 alerts.in.ua: niezależny agregator

Źródło całego podrozdziału: [devs.alerts.in.ua](https://devs.alerts.in.ua/).

- **Kto prowadzi.** Projekt wolontariacki finansowany z darowizn.
- **Dostęp.** Bazowy adres to `https://api.alerts.in.ua`. Token uzyskuje się przez formularz i przekazuje jako `Authorization: Bearer` albo parametr `token`.
- **Endpointy:**
  - `/v1/alerts/active.json`,
  - warianty IoT, np. 27-znakowy string statusu obwodów; wersja v2 rozróżnia poziom czerwony i żółty,
  - historia: `/v1/regions/{uid}/alerts/month_ago.json`.
- **Typy i poziomy.**
  - `location_type`: oblast, raion, city, hromada.
  - Typy alertów: air_raid, artillery_shelling, urban_fights, chemical, nuclear.
  - Typy zagrożeń: m.in. ballistic_missiles, drones, guided_aerial_bombs.
- **Limity.** Miękki limit to 8–10 zapytań na minutę na IP, twardy 12 na minutę. Historia ma limit 2 zapytań na minutę. Endpointy obsługują `If-Modified-Since`.
- **Zasady:**
  - Nie wolno osadzać tokenu w aplikacji mobilnej ani na stronie WWW; ruch ma iść przez własny serwer proxy (wyjątek: urządzenia IoT).
  - Wprost: „Nie używajcie API dla infrastruktury krytycznej". Brak gwarancji i odpowiedzialności, możliwe opóźnienia.
  - Brak wskazanej licencji danych.
- **Deklarowane źródła danych:** oficjalne API, kanał Telegram „Повітряна тривога", obwodowe administracje wojskowe (ОВА), Suspilne, DSNS.

**[Analiza]** W Ukrainie wzorzec wygląda tak: jedno oficjalne źródło (konsola operatorów), wiele kanałów dystrybucji (aplikacja, Telegram, API, Ajax), a na końcu społeczność i rynek budujący produkty pochodne (mapy, urządzenia IoT, boty). To jest element, którego w Polsce brakuje (sekcja 3.4).

---

## 3. Stan w Polsce

### 3.1 Podstawa prawna ostrzegania

**Ustawa z 5.12.2024 o ochronie ludności i obronie cywilnej** (Dz.U. 2024 poz. 1907, w mocy od 1.01.2025) ([tekst](https://api.sejm.gov.pl/eli/acts/DU/2024/1907/text.html), [metadane i nowelizacje](https://api.sejm.gov.pl/eli/acts/DU/2024/1907)):

- **art. 67.** Obowiązek powiadamiania, ostrzegania i alarmowania spoczywa na organie lub podmiocie, który pierwszy powziął informację o zagrożeniu.
- **art. 70 ust. 2 pkt 3.** System wykrywania zagrożeń „uderzeniami z powietrza" nadzoruje Minister Obrony Narodowej.
- **art. 71 ust. 1–2.** System powiadamiania, ostrzegania i alarmowania nadzoruje minister spraw wewnętrznych. W jego skład wchodzą „w szczególności":
  1. syreny,
  2. krajowe, regionalne i lokalne systemy ostrzegania, w tym RSO,
  3. środki wydawców prasy,
  4. nadawcy RTV,
  5. ALERT RCB,
  6. „ostrzeżenie publiczne wysyłane w ramach technologii cyfrowych szybkiej transmisji",
  7. oficjalne serwisy internetowe.
- **art. 71 ust. 3.** Alarmy ogłaszają i odwołują **organy ochrony ludności**.
- **art. 73.** Na żądanie MSWiA lub wojewody, przekazane przez RCB, nadawcy RTV i operatorzy komórkowi (ust. 1–2) oraz redaktorzy dzienników i **wydawcy stron internetowych** (ust. 3) muszą niezwłocznie i nieodpłatnie publikować komunikaty.
- **Nowelizacja Dz.U. 2026 poz. 646** (w mocy od 29.05.2026) ([tekst](https://api.sejm.gov.pl/eli/acts/DU/2026/646/text.pdf)):
  - dodaje kategorię **„punktów schronienia"** (art. 91a), które identyfikuje komendant powiatowy PSP,
  - nakłada obowiązek udostępnienia punktu schronienia „w miarę możliwości" w razie alarmu, zwłaszcza o uderzeniu z powietrza (art. 103a),
  - pozwala przekazywać wezwania do służby w obronie cywilnej przez mObywatela.

**Rozporządzenie MSWiA z 14.05.2025 w sprawie alarmów i komunikatów ostrzegawczych** (Dz.U. 2025 poz. 645) ([PDF](https://api.sejm.gov.pl/eli/acts/DU/2025/645/text.pdf)):

- **Rodzaje alarmów (§ 2):**
  - akustyczny: syrena albo zapowiedź słowna,
  - wizualny: żółty trójkąt.
- **Sygnały syren:**
  - alarm: modulowany dźwięk przez 3 minuty,
  - odwołanie: dźwięk ciągły przez 3 minuty,
  - alarm ćwiczebny: dźwięk ciągły przez 1 minutę.
- **Rodzaje komunikatów ostrzegawczych (§ 3):** komunikat RSO przekazywany „za pomocą aplikacji mobilnej", komunikaty w prasie i internecie, komunikaty w RTV i u operatorów komórkowych oraz ALERT RCB.
- **Kto ogłasza (§ 5–9).** Alarm lub komunikat ogłasza terytorialny organ ochrony ludności: wójt, starosta albo wojewoda. Organ wskazuje obszar, zalecenia i przewidywany czas trwania. Wojewoda albo minister wnioskuje do RCB o ALERT RCB.

**ALERT RCB (SMS):**

- Podstawą jest art. 21a ust. 3 ustawy o zarządzaniu kryzysowym. Operator komórkowy musi na żądanie dyrektora RCB niezwłocznie i nieodpłatnie wysłać komunikat do użytkowników na wskazanym obszarze ([t.j. Dz.U. 2026 poz. 574](https://api.sejm.gov.pl/eli/acts/DU/2026/574/text.pdf)).
- Szczegóły określa rozporządzenie RM z 31.08.2020 (Dz.U. 2020 poz. 1527), które nadal obowiązuje ([tekst](https://api.sejm.gov.pl/eli/acts/DU/2020/1527/text.html)):
  - SMS w GSM 7-bit, bez polskich znaków, maksymalnie 306 znaków,
  - nadawca „ALERT RCB", dla roamingu wersja po angielsku,
  - **obszar wskazywany jest z dokładnością do województwa albo powiatu** (§ 4 ust. 2).

**Cell Broadcast:**

- 14.10.2026 MSWiA, RCB, UKE oraz operatorzy Orange, Play, Polkomtel i T-Mobile podpisali list intencyjny.
- Budżet to blisko 100 mln zł z Programu OLiOC. Pełne uruchomienie planowane jest na II połowę 2027.
- Źródło: [MSWiA](https://www.gov.pl/web/mswia/minister-marcin-kierwinski-podpisal-list-intencyjny-ws-systemu-ostrzegania-ludnosci-cywilnej-cell-broadcast).

**Prawo UE:**

- Art. 110 dyrektywy 2018/1972 (EECC) wymaga przekazywania ostrzeżeń publicznych przez dostawców usług komunikacji opartych na numerach. Ust. 2 dopuszcza alternatywę w postaci m.in. **aplikacji mobilnej korzystającej z internetu**, pod warunkiem „równoważnej skuteczności pod względem zasięgu i przepustowości", także wobec osób przebywających na danym obszarze tylko czasowo ([tekst art. 110, wersja z legislation.gov.uk](https://www.legislation.gov.uk/eudr/2018/1972/article/110); [EUR-Lex](https://eur-lex.europa.eu/eli/dir/2018/1972/oj)).
- Kryteria tej równoważności opisują [wytyczne BEREC BoR (20) 115](https://www.berec.europa.eu/en/document-categories/berec/regulatory-best-practices/guidelines/berec-guidelines-on-how-to-assess-the-effectiveness-of-public-warning-systems-transmitted-by-different-means).
- Polska ustawa Prawo komunikacji elektronicznej (Dz.U. 2024 poz. 1221) nie reguluje tego bezpośrednio. Przeszukałem tekst i jedyne „ostrzeżenie publiczne" dotyczy sankcji Prezesa UKE. Obowiązek nadawania ostrzeżeń realizuje art. 21a ustawy o zarządzaniu kryzysowym, do którego PKE wprowadziła zmiany ([art. 37 ustawy wprowadzającej PKE, przypis w t.j.](https://api.sejm.gov.pl/eli/acts/DU/2026/574/text.pdf)).

### 3.2 Istniejące systemy i aplikacje

| System | Operator | Co robi | Ograniczenia |
|---|---|---|---|
| Syreny (SOiA) | KG PSP | Modernizacja 4 060 lokalizacji: 2 474 syreny cyfrowe, sterowanie przez LoRa/GSM APN, centralny system zarządzania; finansowanie KPO 175,7 mln zł ([KG PSP](https://www.gov.pl/web/kgpsp/rozbudowa-systemu-ostrzegania-i-alarmowania)) | Syreny nie docierają do wnętrz budynków (argument, który Mintsyfra podawała dla Ukrainy: [EUAM](https://www.euam-ukraine.eu/news/heroesofukraine-the-ministry-of-digital-transformation-launches-an-app-to-alert-citizens-of-air-raids/)) |
| ALERT RCB | RCB i operatorzy | SMS na obszar województwa lub powiatu | Zwykły SMS, który nie przebija trybu cichego **[Analiza]**; ziarnistość powiatowa |
| RSO (aplikacja) | MSWiA / TVP | Komunikaty WCZK, wybór województw, opcjonalna geolokalizacja, push ([App Store PL](https://apps.apple.com/pl/app/regionalny-system-ostrzegania/id1326612339)) | 165 ocen, średnia 2,4; brak wzmianki o Critical Alerts |
| **ALARM.SOIA** (w budowie) | KG PSP / MSWiA | „Gotowa programistycznie, w testach bezpieczeństwa", prezentacja w grudniu 2026 ([MSWiA](https://www.gov.pl/web/mswia/minister-marcin-kierwinski-podpisal-list-intencyjny-ws-systemu-ostrzegania-ludnosci-cywilnej-cell-broadcast)) | Według [Spider's Web](https://spidersweb.pl/2026/09/alarm-soia-aplikacja-straz-pozarna.html): 4 poziomy (P1 jako Critical Alert, którego nie da się wyłączyć), do 10 obszarów, brak lokalizacji i konta. **[Niezweryfikowane w źródle pierwotnym]** |
| Cell Broadcast | MSWiA, RCB, UKE, operatorzy | Broadcast bez aplikacji i bez SMS | Od II połowy 2027 |
| „Gdzie się ukryć" | PSP / MSWiA | Mapa punktów schronienia, nawigacja, tryb offline ([MSWiA, 22.12.2025](https://www.gov.pl/web/mswia/nowe-narzedzie-pomoze-znalezc-punkty-schronienia)) | MSWiA podaje 86,5 tys. punktów dla 23,7 mln osób ([MSWiA, 14.10.2026](https://www.gov.pl/web/mswia/minister-marcin-kierwinski-podpisal-list-intencyjny-ws-systemu-ostrzegania-ludnosci-cywilnej-cell-broadcast)) |

### 3.3 Dane o schronach

- **Centralna Ewidencja OZO** (art. 108–113 ustawy):
  - Prowadzi ją Komendant Główny PSP.
  - Zawiera m.in. lokalizację, kategorię odporności, pojemność i dane właścicieli.
  - Dane **nie są informacją publiczną** (art. 113 ust. 1).
  - Większość pól (art. 108 ust. 4 pkt 2 i 5–13) ma klauzulę **„zastrzeżone"** (art. 113 ust. 2). Klauzula **nie obejmuje** podstawy uznania, typu ani lokalizacji (pkt 1, 3, 4).
  - Źródło: [ustawa](https://api.sejm.gov.pl/eli/acts/DU/2024/1907/text.html).
- **Obowiązek informowania.** Art. 114 ust. 2–3 zobowiązuje organy ochrony ludności do informowania o umiejscowieniu obiektów zbiorowej ochrony, m.in. „za pomocą narzędzi teleinformatycznych, w tym aplikacji na urządzenia mobilne". Od 2026 r. obowiązek obejmuje też punkty schronienia (art. 114 ust. 4) ([nowelizacja](https://api.sejm.gov.pl/eli/acts/DU/2026/646/text.pdf)).
- **Otwarty zbiór danych.** „Punkty schronienia w Polsce" na dane.gov.pl ([zbiór 28058](https://dane.gov.pl/pl/dataset/28058,punkty-schronienia-w-polsce), [API](https://api.dane.gov.pl/1.4/datasets/28058)):
  - Wydawca: KG PSP. Licencja **CC BY 4.0**. Aktualizacja co tydzień (ostatnia modyfikacja 19.10.2026).
  - Opis mówi o 87 316 punktach. W pliku CSV pobranym 24.10.2026 naliczyłem 87 724 rekordy.
  - Źródłem są pliki `https://gdziesieukryc.pl/PS_XML/punkty_schronienia.xml` i `.csv`.
  - Kolumny: identyfikator publiczny (np. `OZO-…`), nazwa, rodzaj obiektu, opis, gmina, powiat, województwo, szerokość i długość geograficzna, adres, dostępność.
  - Dostępność według mojego zliczenia pliku: 60 597 „Na żądanie", 19 582 „Całodobowa", 7 545 „Określone godziny".
  - Wszystkie rekordy mają rodzaj „Obiekt ochrony ludności" i nazwę „Miejsce ochronne". **Zbiór nie zawiera pojemności, rozróżnienia schron/ukrycie ani kategorii odporności.**
- **Geoportal.** GUGiK udostępnia ten sam zbiór jako usługę „Schrony" ([geoportal.gov.pl](https://www.geoportal.gov.pl/aktualnosci/nowa-usluga-schrony-dostepna-w-module-zarzadzanie-kryzysowe-w-serwisie-www-geoportal-gov-pl/)).

### 3.4 Czy w Polsce istnieje publiczny feed alarmów?

- W katalogu dane.gov.pl nie znalazłem zbioru z alarmami, komunikatami RSO ani ALERT RCB. Szukałem fraz „ostrzeg", „RSO", „alarm", „syren" przez [API dane.gov.pl](https://api.dane.gov.pl/1.4/datasets?q=ostrzeg).
- Jedyny pokrewny zbiór to **ostrzeżenia meteorologiczne i hydrologiczne IMGW-PIB** na licencji **CC BY-NC-ND 4.0**, czyli bez użytku komercyjnego i bez utworów zależnych ([zbiór 919](https://dane.gov.pl/pl/dataset/919)).
- Nie znalazłem publicznego API RSO ani SOiA. **[Niezweryfikowane: brak dowodu nieistnienia]**

---

## 4. Jak przenieść koncept do Polski [Analiza]

### 4.1 Czego nie da się skopiować 1:1

1. **Źródło sygnału.** W Ukrainie prywatny podmiot dostał konsolę, do której piszą dyżurni administracji. W Polsce ogłaszanie alarmów to ustawowa kompetencja organów ochrony ludności (art. 71 ust. 3), a katalog kanałów w art. 71 ust. 2 i w rozp. 2025/645 nie obejmuje aplikacji prywatnych.
   - Prywatna aplikacja może być kanałem wyłącznie na podstawie **porozumienia** z MSWiA, PSP lub wojewodą.
   - Ewentualnie mogłaby korzystać z art. 73 ust. 3, który dotyczy „wydawców stron internetowych". To obowiązek publikacji na żądanie RCB, a nie dostęp do feedu.
2. **Pozycja startowa.** Państwo właśnie buduje własny odpowiednik „Повітряної тривоги" (ALARM.SOIA) i Cell Broadcast. Prywatna konkurencja na rynku alarmów ma słaby sens produktowy i ryzyko wprowadzania w błąd.
3. **Brak publicznego feedu.** Nie ma polskiego odpowiednika api.ukrainealarm.com ani alerts.in.ua. Scraping kanałów (strony urzędów wojewódzkich, X/Telegram) daje opóźnienia i fałszywe alarmy. Nawet alerts.in.ua zastrzega, że nie nadaje się do infrastruktury krytycznej ([devs.alerts.in.ua](https://devs.alerts.in.ua/)).

### 4.2 Opcje (od najmniej do najbardziej zależnej od państwa)

| Opcja | Dane | Wymagania formalne | Ryzyko |
|---|---|---|---|
| A. Mapa i nawigacja do schronień, offline, dostępność | dane.gov.pl, CC BY 4.0 | Atrybucja KG PSP; zastrzeżenie, że dane mogą być nieaktualne | Niskie; konkuruje z „Gdzie się ukryć" (wyróżnik: UX, offline, filtry, integracje) |
| B. Edukacja i przygotowanie (plecak, plan rodzinny, ćwiczenia, objaśnienie sygnałów syren z rozp. 2025/645) | teksty aktów prawnych | brak | Niskie |
| C. Agregator oficjalnych komunikatów z linkiem do źródła | IMGW (NC-ND, tylko niekomercyjnie), RSO i strony urzędów wojewódzkich | Licencja IMGW; brak oficjalnego API RSO | Średnie: opóźnienia, błędy parsowania |
| D. Kanał partnerski SOiA/RSO, czyli retransmisja z Critical Alerts | oficjalny feed (o ile powstanie) | Porozumienie z MSWiA/PSP, audyt bezpieczeństwa, SLA | Wysokie, ale tak działał model ukraiński |
| E. IoT / smart home (odpowiednik Ajax) | jak w D | jak w D | jak w D |

**Rekomendacja:** zacząć od A i B, przygotować architekturę pod D (pozyskanie entitlementu Critical Alerts, backend z fan-outem push) i złożyć MSWiA/KG PSP propozycję udostępnienia publicznego feedu SOiA, wzorem ukraińskiego API.

### 4.3 Wymagania techniczne

- **iOS Critical Alerts.**
  - Wymagają specjalnego entitlementu wydawanego przez Apple. Bez niego nie da się poprosić o autoryzację `criticalAlert` ([Apple: entitlement](https://developer.apple.com/documentation/bundleresources/entitlements/com.apple.developer.usernotifications.critical-alerts), [Apple: criticalAlert](https://developer.apple.com/documentation/usernotifications/unauthorizationoptions/criticalalert)).
  - Wniosek składa się przez [formularz Apple](https://developer.apple.com/contact/request/notifications-critical-alerts-entitlement/). Kryteria nie są publiczne. Z forów deweloperów wynika, że przegląd trwa od tygodni do braku odpowiedzi ([forum](https://developer.apple.com/forums/thread/111671)). **[Analiza]** Bez umowy z organem państwowym szansa na entitlement dla „aplikacji alarmowej" jest niepewna.
- **Android.**
  - Kanał omijający tryb „Nie przeszkadzać" może ustawić tylko aplikacja z dostępem do polityki DND, i to tylko zanim użytkownik sam zmieni ustawienia kanału ([NotificationChannel.setBypassDnd](https://developer.android.com/reference/android/app/NotificationChannel#setBypassDnd(boolean))).
  - FCM high priority „próbuje" dostarczyć wiadomość natychmiast i budzi urządzenie, ale bez gwarancji. Wiadomości, po których nie pojawia się widoczne powiadomienie, mogą zostać obniżone do normal priority ([Firebase](https://firebase.google.com/docs/cloud-messaging/android/message-priority)). Zgadza się to z ukraińskimi doświadczeniami opóźnień na Androidzie ([DOU](https://dou.ua/lenta/interviews/air-alarm-application/)).
- **Fan-out.** Wysyłka do milionów urządzeń w kilkadziesiąt sekund wymaga topiców per region lub hromada (w PL: per powiat lub gmina, kodami TERYT, tak jak RCB w rozp. 2020/1527).
- **Prywatność.** Wybór obszaru bez geolokalizacji, jak w Ukrainie i w zapowiedziach SOiA, minimalizuje zakres RODO. Geolokalizacja w tle to dane o lokalizacji wymagające podstawy prawnej i DPIA. **[Analiza — nie konsultowano z prawnikiem]**

### 4.4 Ryzyka

- **Fałszywe lub opóźnione alarmy.** Przy braku oficjalnego feedu to ryzyko krytyczne. Alerts.in.ua wprost wyłącza odpowiedzialność i odradza użycie krytyczne ([devs.alerts.in.ua](https://devs.alerts.in.ua/)).
- **Odpowiedzialność i wprowadzanie w błąd.** Aplikacja nie może sugerować, że jest kanałem urzędowym. Nie może używać nazw „ALERT RCB" ani „RSO", znaku obrony cywilnej z art. 105 ani herbów. Należy zawsze odsyłać do syren, ALERT RCB i RSO, tak jak robi to Stfalcon ([Stfalcon](https://stfalcon.com/en/blog/post/air-alert-app)). **[Analiza — bez analizy prawnej odpowiedzialności cywilnej i karnej]**
- **Dane o schronach.** Zbiór PSP nie zawiera pojemności ani rodzaju (schron/ukrycie). Aplikacja nie powinna sugerować poziomu ochrony.
- **Bezpieczeństwo.** Konsola alarmowa to cel ataku. W Ukrainie każdego operatora sprawdzało SBU ([DOU](https://dou.ua/lenta/interviews/air-alarm-application/)). SOiA testuje DKWOC ([Spider's Web](https://spidersweb.pl/2026/09/alarm-soia-aplikacja-straz-pozarna.html), **[Niezweryfikowane]**).
- **Kanibalizacja przez państwo.** Po starcie ALARM.SOIA (zapowiedź na grudzień 2026) i Cell Broadcast (2027) wartość prywatnego kanału alarmowego spadnie.

---

## 5. Otwarte pytania

1. Czy ALARM.SOIA będzie miała publiczne API lub feed (jak api.ukrainealarm.com) i na jakich warunkach? Warto zapytać KG PSP lub MSWiA, np. wnioskiem o informację publiczną.
2. Jak dokładnie (powiat, gmina) ALARM.SOIA i Cell Broadcast będą adresować obszar alarmu?
3. Czy RSO ma niepubliczny lub partnerski interfejs dla mediów (art. 73 ust. 3) i czy prywatna aplikacja może się do niego podłączyć?
4. Jakie są warunki api.ukrainealarm.com (strona zwróciła 403)?
5. Czy Apple przyzna entitlement Critical Alerts prywatnej aplikacji bez umowy z organem państwowym?
6. Czy Ukraina formalnie zintegrowała aplikację z Diią lub z państwowym rejestrem? Nie znalazłem źródeł.
7. Jak państwo ukraińskie finansuje ten projekt (o ile w ogóle)? Pierwotne źródła mówią tylko o wolontariacie firm.

---

## 6. Źródła

**Ukraina**
- Mintsyfra / kmu.gov.ua: [start 01.03.2022](https://www.kmu.gov.ua/news/za-pidtrimki-mincifri-zapushcheno-zastosunok-povitryana-trivoga-dlya-operativnoyi-reakciyi-na-pochatok-i-zakinchennya-trivog), [aktualizacja 16.03.2022](https://www.kmu.gov.ua/news/mincifri-onovleno-zastosunok-povitryana-trivoga)
- [Stfalcon: Air Alert](https://stfalcon.com/en/blog/post/air-alert-app)
- [Ajax: Air alert via Ajax](https://ajax.systems/blog/air-alert-via-software-ajax/)
- [App Store: Повітряна тривога](https://apps.apple.com/ua/app/повітряна-тривога/id1611955391)
- DOU: [wywiad 25.04.2022](https://dou.ua/lenta/interviews/air-alarm-application/), [wersja 3.0](https://dou.ua/lenta/news/air-alarm-application-version-3/)
- [EUAM Ukraine](https://www.euam-ukraine.eu/news/heroesofukraine-the-ministry-of-digital-transformation-launches-an-app-to-alert-citizens-of-air-raids/)
- [alerts.in.ua API docs](https://devs.alerts.in.ua/)
- Mapa rakiet i dronów (media): [Слово і Діло](https://www.slovoidilo.ua/2026/10/17/novyna/bezpeka/zastosunku-povitryana-tryvoha-zyavylasya-karta-ruxu-vorozhyx-raket-droniv), [Fakty](https://fakty.com.ua/ua/ukraine/20261017-u-zastosunku-povitryana-tryvoga-teper-vydno-pryblyznyj-ruh-raket-i-droniv/)

**Polska: prawo**
- [Ustawa o ochronie ludności i obronie cywilnej, Dz.U. 2024 poz. 1907](https://api.sejm.gov.pl/eli/acts/DU/2024/1907/text.html)
- [Nowelizacja, Dz.U. 2026 poz. 646](https://api.sejm.gov.pl/eli/acts/DU/2026/646/text.pdf)
- [Rozp. MSWiA w sprawie alarmów i komunikatów ostrzegawczych, Dz.U. 2025 poz. 645](https://api.sejm.gov.pl/eli/acts/DU/2025/645/text.pdf)
- [Ustawa o zarządzaniu kryzysowym, t.j. Dz.U. 2026 poz. 574](https://api.sejm.gov.pl/eli/acts/DU/2026/574/text.pdf)
- [Rozp. RM w sprawie współpracy RCB z operatorami, Dz.U. 2020 poz. 1527](https://api.sejm.gov.pl/eli/acts/DU/2020/1527/text.html)
- [Prawo komunikacji elektronicznej, Dz.U. 2024 poz. 1221](https://api.sejm.gov.pl/eli/acts/DU/2024/1221/text.html)
- [Dyrektywa 2018/1972 (EECC) art. 110](https://www.legislation.gov.uk/eudr/2018/1972/article/110) / [EUR-Lex](https://eur-lex.europa.eu/eli/dir/2018/1972/oj)
- [Wytyczne BEREC](https://www.berec.europa.eu/en/document-categories/berec/regulatory-best-practices/guidelines/berec-guidelines-on-how-to-assess-the-effectiveness-of-public-warning-systems-transmitted-by-different-means)

**Polska: systemy i dane**
- [MSWiA: list intencyjny Cell Broadcast i SOiA, 14.10.2026](https://www.gov.pl/web/mswia/minister-marcin-kierwinski-podpisal-list-intencyjny-ws-systemu-ostrzegania-ludnosci-cywilnej-cell-broadcast)
- [MSWiA: „Gdzie się ukryć", 22.12.2025](https://www.gov.pl/web/mswia/nowe-narzedzie-pomoze-znalezc-punkty-schronienia)
- [KG PSP: rozbudowa systemu ostrzegania i alarmowania](https://www.gov.pl/web/kgpsp/rozbudowa-systemu-ostrzegania-i-alarmowania)
- [App Store: RSO](https://apps.apple.com/pl/app/regionalny-system-ostrzegania/id1326612339)
- [dane.gov.pl: Punkty schronienia w Polsce](https://dane.gov.pl/pl/dataset/28058,punkty-schronienia-w-polsce)
- [dane.gov.pl: Ostrzeżenia IMGW](https://dane.gov.pl/pl/dataset/919)
- [Geoportal: usługa Schrony](https://www.geoportal.gov.pl/aktualnosci/nowa-usluga-schrony-dostepna-w-module-zarzadzanie-kryzysowe-w-serwisie-www-geoportal-gov-pl/)
- [Spider's Web o ALARM.SOIA (wtórne)](https://spidersweb.pl/2026/09/alarm-soia-aplikacja-straz-pozarna.html)

**Platformy**
- Apple: [entitlement Critical Alerts](https://developer.apple.com/documentation/bundleresources/entitlements/com.apple.developer.usernotifications.critical-alerts), [criticalAlert](https://developer.apple.com/documentation/usernotifications/unauthorizationoptions/criticalalert)
- [Android: NotificationChannel](https://developer.android.com/reference/android/app/NotificationChannel)
- [Firebase: priorytet wiadomości](https://firebase.google.com/docs/cloud-messaging/android/message-priority)
