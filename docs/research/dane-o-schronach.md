# Dane o schronach i dostęp do nich: co jest dostępne dla aplikacji agregującej

Stan na 2026-10-24. Raport rozwija sekcję 3.3 raportu [air-raid-alert-ukraina.md](air-raid-alert-ukraina.md) i nie powtarza jego ustaleń ogólnych.

Konwencje:
- Każde twierdzenie ma link do źródła pierwotnego.
- Liczby oznaczone **[Pomiar]** policzyłem sam na plikach pobranych 24.10.2026. Metoda jest opisana w sekcji 6.
- **[Analiza]** to moje wnioski i rekomendacje, a nie fakty ze źródła.
- **[Niezweryfikowane]** oznacza rzeczy, których nie potwierdziłem w źródle pierwotnym.

## TL;DR

- **Jeden realny zbiór krajowy.** Zbiór „Punkty schronienia w Polsce” (KG PSP) to jeden plik CSV z 11 kolumnami. Przy rzeczywistej treści jest ich 7, bo kolumny „Nazwa” i „Rodzaj obiektu” mają wszędzie tę samą wartość, a „Opis ogolny” jest zawsze pusty **[Pomiar]**. Plik na żywo liczy **87 724 rekordy** (stan z 23.10.2026). Metadane na dane.gov.pl są nieaktualne: podają 87 316 rekordów i datę 19.10 ([API dane.gov.pl](https://api.dane.gov.pl/1.4/datasets/28058/resources)).
- **Stabilne identyfikatory.** Rekordy mają identyfikatory `OZO-` + 12 znaków hex. Porównałem wersję z 10.03.2026 z wersją z 23.10.2026: **78 807 identyfikatorów przetrwało** (96% starej wersji), 3 160 zniknęło, a 8 917 doszło. Da się więc śledzić rekordy między aktualizacjami **[Pomiar]**.
- **Jakość współrzędnych jest dobra, ale nie idealna** **[Pomiar]**:
  - nie ma pustych współrzędnych ani punktów poza bboxem Polski;
  - 21 rekordów z 9 województw ma ten sam punkt 52.215933, 19.134422, czyli zastępczy wynik geokodowania;
  - 60 punktów leży ponad 30 km od mediany swojej gminy, w tym 43 ponad 100 km;
  - 512 grup ma identyczne współrzędne (1 185 rekordów), a 342 grupy to duplikaty z różnymi ID;
  - 7 440 rekordów ma gminę „Nieznana” (w tym 7 200 w Warszawie).
- **Dostępność.** 69% punktów ma wartość „Na żądanie”, 22% „Całodobowa”, 9% „Określone godziny”.
  - PSP opisuje kategorię „wzajemnej pomocy” słowami: obiekty, których zarządcy „powinni umożliwić dostęp” ([KW PSP Warszawa](https://www.gov.pl/web/kwpsp-warszawa/gdzie-sie-ukryc--sprawdz-najblizsze-punkty-schronienia-ps)).
  - Ustawa zobowiązuje zarządcę punktu schronienia do udostępnienia go tylko „w miarę możliwości” i tylko po ogłoszeniu alarmu ([art. 103a, Dz.U. 2026 poz. 646](https://api.sejm.gov.pl/eli/acts/DU/2026/646/text.pdf)).
- **Co prawo pozwala publikować.**
  - Dla obiektów zbiorowej ochrony publikuje się tylko podstawę uznania, typ i lokalizację ([§ 3 pkt 5 rozp. Dz.U. 2025 poz. 922](https://api.sejm.gov.pl/eli/acts/DU/2025/922/text.pdf)). Pojemność, kategoria odporności i dane właścicieli są „zastrzeżone” (art. 113 ust. 2 ustawy).
  - Dla punktów schronienia ustawa przewiduje tylko trzy pola: rodzaj, lokalizację i dostępność ([art. 108 ust. 5](https://api.sejm.gov.pl/eli/acts/DU/2026/646/text.pdf)). Zbiór PSP odpowiada temu zakresowi, ale pole „rodzaj” jest w nim puste merytorycznie (wszędzie ta sama wartość).
- **Inne źródła są marginalne.**
  - Samorządy: na dane.gov.pl znalazłem tylko Legionowo (pochodna zbioru PSP) i Krosno (11 schronów z pojemnością, 2024, CC0).
  - OSM: w Polsce jest **0** obiektów `shelter_type=bomb_shelter`. Około 5,6 tys. `military=bunker` to głównie fortyfikacje historyczne ([Overpass](https://overpass-api.de/)).
  - Licencji CC BY 4.0 nie wolno wprost importować do OSM bez zgody ([OSMF](https://osmfoundation.org/wiki/Licence/Licence_Compatibility)).
- **[Analiza] Rekomendacja.** Aplikacja powinna:
  - pobierać CSV z `gdziesieukryc.pl` z zapytaniem warunkowym (ETag), raz dziennie;
  - używać `Identyfikator publiczny` jako klucza;
  - oznaczać i nie pokazywać punktów zastępczych i odstających;
  - nie sugerować poziomu ochrony;
  - opisywać „Na żądanie” jako „dostęp niegwarantowany”.

---

## 1. Zbiór PSP „Punkty schronienia w Polsce” w szczegółach

### 1.1 Metadane i punkty dostępu (fakty)

| Element | Wartość | Źródło |
|---|---|---|
| Wydawca | Komenda Główna PSP (instytucja 22 w dane.gov.pl) | [API: zasób 1393918](https://api.dane.gov.pl/1.4/resources/1393918,punkty-schronienia-dane-csv) |
| Utworzony / zweryfikowany | 2026-03-10 | [API: zbiór 28058](https://api.dane.gov.pl/1.4/datasets/28058) |
| Częstotliwość | „Co tydzień” | [API: zbiór 28058](https://api.dane.gov.pl/1.4/datasets/28058) |
| Licencja | CC BY 4.0. Warunek: „Ponowne wykorzystywanie informacji sektora publicznego spełniających cechy utworu lub stanowiących bazę danych odbywa się na warunkach licencji CC BY 4.0.” | [API: zbiór 28058](https://api.dane.gov.pl/1.4/datasets/28058) |
| Mechanizm publikacji | Harvester dane.gov.pl czyta plik `punkty_schronienia.xml` (schemat `urn:otwarte-dane:harvester:1.13`), a ten wskazuje CSV jako zasób zdalny (`<availability>remote</availability>`) | [XML](https://gdziesieukryc.pl/PS_XML/punkty_schronienia.xml), pole `source` w [API](https://api.dane.gov.pl/1.4/datasets/28058) |
| Plik źródłowy (na żywo) | `https://gdziesieukryc.pl/PS_XML/punkty_schronienia.csv`, `Last-Modified: Fri, 23 Oct 2026 09:46:36 GMT`, 15 425 857 B | [CSV](https://gdziesieukryc.pl/PS_XML/punkty_schronienia.csv) (nagłówki HTTP, pomiar 24.10) |
| Link „pobierz” dane.gov.pl | `https://api.dane.gov.pl/resources/1393918,punkty-schronienia-dane-csv/file` zwraca **302** na plik źródłowy. Pobrany plik był bajtowo identyczny **[Pomiar]** | [download_url](https://api.dane.gov.pl/resources/1393918,punkty-schronienia-dane-csv/file) |
| Archiwum dane.gov.pl | ZIP z kopią CSV i JSON-LD z **10.03.2026** (14 407 921 B, 81 967 rekordów). Jest to jedyna archiwalna wersja | [archiwum ZIP](https://api.dane.gov.pl/datasets/28058,punkty-schronienia-w-polsce/resources/files/download) |
| JSON-LD (CSVW) | 142 MB, wygenerowany z wersji marcowej | [jsonld](https://api.dane.gov.pl/media/resources/20260310/punkty_schronienia_875cc428.jsonld) |
| Otwartość | `openness_score` 4 (dzięki JSON-LD); sam CSV ma 3 | [API: zasób](https://api.dane.gov.pl/1.4/resources/1393918,punkty-schronienia-dane-csv) |

**Rozjazd metadanych (fakt):**
- XML w źródle podaje **87 724** rekordy i `lastUpdateDate` 2026-10-23T11:46:35+02:00 ([XML](https://gdziesieukryc.pl/PS_XML/punkty_schronienia.xml)).
- dane.gov.pl nadal pokazuje opis „87316 rekordów”, `data_date` 2026-10-19 i `file_size` 14 407 921, czyli rozmiar pliku marcowego ([API](https://api.dane.gov.pl/1.4/datasets/28058/resources)).
- Ostatni import harvestera: `2026-10-20T04:40:35Z` ([API](https://api.dane.gov.pl/1.4/datasets/28058)).

**Aktualizacja w praktyce (fakt + pomiar):**
- Serwer źródłowy obsługuje zapytania warunkowe. `If-None-Match` lub `If-Modified-Since` z aktualnym ETagiem lub datą zwraca **304** **[Pomiar]**.
- Serwer nie kompresuje odpowiedzi (`Accept-Encoding: gzip` nadal daje 15,4 MB) **[Pomiar]**.
- W Wayback Machine nie ma kopii pliku ([CDX](https://web.archive.org/cdx/search/cdx?url=gdziesieukryc.pl/PS_XML/punkty_schronienia.csv&output=json)). Historii tygodniowych wersji nie da się więc odtworzyć poza parą marzec/październik.

**[Analiza] Endpoint do pobierania programowego.**
- Źródłem prawdy jest `https://gdziesieukryc.pl/PS_XML/punkty_schronienia.xml`. Daje `lastUpdateDate`, `dataDate` i URL CSV.
- Wariant przez dane.gov.pl: `GET https://api.dane.gov.pl/1.4/datasets/28058/resources`, potem `data[0].attributes.download_url` (redirect do pliku źródłowego).
- Nie należy polegać na `file_size` ani na opisie w API dane.gov.pl, bo są nieaktualne.
- Strona `gdziesieukryc.pl` (HTML) jest za weryfikacją antybotową. Tytuł strony zwrócony curlem to „Weryfikacja bezpieczeństwa - Safe Place Admin” **[Pomiar]**. Katalog `/PS_XML/` jest jednak dostępny bez tej weryfikacji.

### 1.2 Format i schemat (pomiar na pliku z 23.10.2026)

Format pliku: UTF-8 z BOM, separator `,`, końce linii CRLF, cudzysłowy RFC 4180 (adres zawiera przecinek). Nie ma znaków nowej linii w polach. Ma 87 725 linii, w tym nagłówek **[Pomiar]**. BOM deklaruje sam wydawca w opisie zasobu ([API](https://api.dane.gov.pl/1.4/resources/1393918,punkty-schronienia-dane-csv)).

| Kolumna | Typ (de facto) | Puste | Różnych wartości | Uwagi **[Pomiar]** |
|---|---|---|---|---|
| `Identyfikator publiczny` | string `^OZO-[0-9A-F]{12}$` | 0 | 87 724 (unikalne) | Wszystkie pasują do wzorca |
| `Nazwa` | stała | 0 | 1 | Zawsze „Miejsce ochronne” |
| `Rodzaj obiektu` | stała | 0 | 1 | Zawsze „Obiekt ochrony ludności” |
| `Opis ogolny` | — | 87 724 | — | Zawsze pusty |
| `Gmina` | string | 0 | 2 077 | Zawiera „Nieznana” (7 440) |
| `Powiat` | string | 0 | 370 nazw / 380 par (woj., powiat) | Format „pow. nyski” albo sama nazwa dla miast na prawach powiatu (66 nazw bez „pow.”) |
| `Wojewodztwo` | słownik, 16 | 0 | 16 | Małe litery, z polskimi znakami |
| `Szerokosc geograficzna` | float jako tekst | 0 | 86 894 | Od 2 do 15 cyfr po przecinku |
| `Dlugosc geograficzna` | float jako tekst | 0 | 86 962 | jw. |
| `Adres` | string, max 81 znaków | 0 | 83 468 | „ul. Ulica Nr, Miejscowość” albo „Nr, Miejscowość” |
| `Dostepnosc` | słownik, 3 | 0 | 3 | „Na żądanie”, „Całodobowa”, „Określone godziny” |

Nagłówki są bez polskich znaków (`Wojewodztwo`, `Dostepnosc`), a wartości z nimi.

Przykładowe wiersze (dosłownie z pliku):

```
OZO-6D94271C9708,Miejsce ochronne,Obiekt ochrony ludności,,Otmuchów,pow. nyski,opolskie,50.412254848596,17.1544466939522,"53, Piotrowice Nyskie",Na żądanie
OZO-B819E3A3FD3D,Miejsce ochronne,Obiekt ochrony ludności,,Nysa,pow. nyski,opolskie,50.47912108141113,17.322451472282413,"ul. Tadeusza Kościuszki 9, Nysa",Określone godziny
OZO-96C662CF8CD3,Miejsce ochronne,Obiekt ochrony ludności,,Katowice,Katowice,śląskie,50.243856304485654,19.01297003123659,"ul. Ceglana 55, Katowice",Określone godziny
```

**Układ współrzędnych.**
- Fakt: plik nie deklaruje CRS. Wartości to stopnie dziesiętne mieszczące się w Polsce.
- **[Analiza]** Należy przyjąć WGS 84 (EPSG:4326). Usługa WMS GUGiK budowana na tym zbiorze oferuje m.in. EPSG:4326 ([GetCapabilities](https://mapy.geoportal.gov.pl/wss/ext/Schrony?SERVICE=WMS&REQUEST=GetCapabilities)).

### 1.3 Liczności i dostępność wg województw

Kolumna „Zmiana od 10.03” to różnica netto liczby rekordów. Wszystkie liczby **[Pomiar]**.

| Województwo | Rekordy 23.10 | Całodobowa | Określone godziny | Na żądanie | Rekordy 10.03 | Zmiana od 10.03 |
|---|---|---|---|---|---|---|
| mazowieckie | 12 567 | 1 222 (10%) | 1 340 | 10 005 (80%) | 12 462 | +105 |
| śląskie | 8 825 | 2 267 (26%) | 940 | 5 618 (64%) | 8 083 | +742 |
| warmińsko-mazurskie | 8 320 | 2 310 (28%) | 324 | 5 686 (68%) | 7 305 | +1 015 |
| wielkopolskie | 7 883 | 2 431 (31%) | 432 | 5 020 (64%) | 6 907 | +976 |
| małopolskie | 6 188 | 2 244 (36%) | 722 | 3 222 (52%) | 5 833 | +355 |
| łódzkie | 5 509 | 1 034 (19%) | 666 | 3 809 (69%) | 5 451 | +58 |
| zachodniopomorskie | 5 193 | 500 (10%) | 231 | 4 462 (86%) | 4 920 | +273 |
| lubuskie | 4 857 | 674 (14%) | 172 | 4 011 (83%) | 4 273 | +584 |
| dolnośląskie | 4 713 | 389 (8%) | 179 | 4 145 (88%) | 4 349 | +364 |
| kujawsko-pomorskie | 4 212 | 1 079 (26%) | 371 | 2 762 (66%) | 3 864 | +348 |
| podlaskie | 3 769 | 1 182 (31%) | 196 | 2 391 (63%) | 3 701 | +68 |
| opolskie | 3 542 | 1 245 (35%) | 321 | 1 976 (56%) | 2 565 | +977 |
| lubelskie | 3 534 | 865 (24%) | 398 | 2 271 (64%) | 3 812 | −278 |
| pomorskie | 3 031 | 834 (28%) | 272 | 1 925 (64%) | 3 208 | −177 |
| podkarpackie | 2 811 | 479 (17%) | 470 | 1 862 (66%) | 2 517 | +294 |
| świętokrzyskie | 2 770 | 827 (30%) | 511 | 1 432 (52%) | 2 717 | +53 |
| **Polska** | **87 724** | **19 582 (22,3%)** | **7 545 (8,6%)** | **60 597 (69,1%)** | **81 967** | **+5 757** |

Największe miasta wg pola `Gmina`: Kraków 3 057, Wrocław 1 579, Łódź 1 527, Poznań 1 418, Lublin 1 201, Gdańsk 1 137. Warszawa ma 7 501 rekordów wg pola `Powiat`, ale 7 200 z nich ma gminę „Nieznana” **[Pomiar]**.

**Co znaczą kategorie dostępności (fakt).** PSP w komunikacie o narzędziu „Gdzie się ukryć” opisuje trzy kategorie ([KW PSP Warszawa, 23.12.2025](https://www.gov.pl/web/kwpsp-warszawa/gdzie-sie-ukryc--sprawdz-najblizsze-punkty-schronienia-ps)):
- „Dostępny całodobowo (24h) – punkty oznaczone dodatkową zieloną obwódką wokół znaku obrony cywilnej”,
- „Ograniczona dostępność (określone godziny otwarcia) – ograniczenie wynika m.in. z godzin pracy czy obecności obsługi obiektu”,
- „Ograniczona dostępność (dostęp w ramach wzajemnej pomocy) – są to m.in. obiekty zamknięte, pod ścisłym nadzorem wspólnot i zarządców, którzy w przypadku zagrożenia powinni umożliwić dostęp do swoich obiektów osobom potrzebującym schronienia w ramach wzajemnej pomocy”.

Ten sam komunikat zastrzega: „Narzędzie informuje o lokalizacji i dostępności miejsc. Nie nadaje uprawnień do wstępu tam, gdzie obowiązują ograniczenia.”

**[Niezweryfikowane]** Że wartość CSV „Na żądanie” odpowiada kategorii „dostęp w ramach wzajemnej pomocy”, wnioskuję przez eliminację. Nie znalazłem słownika pól od PSP.

### 1.4 Jakość współrzędnych i duplikaty (pomiar)

| Test | Wynik |
|---|---|
| Brak lub nieparsowalne współrzędne | 0 |
| Współrzędne = 0 | 0 |
| Poza bboxem Polski (49,0–54,9 N, 14,1–24,2 E) | 0 |
| Zamienione lat/lon | 0 |
| **Punkt zastępczy 52.215933, 19.134422** | **21 rekordów** z 9 województw, np. Suwałki, Lubawka, Gubin, Krosno, Choszczno, Elbląg. Do tego 1 rekord tuż obok (52.215956, 19.134393, Czorsztyn) |
| Punkty > 30 km od mediany współrzędnych swojej gminy (gminy z ≥ 3 punktami) | 60. W tym 43 ponad 100 km, np. „ul. Świętego Ducha 6, Szczecin” na 52.576, 21.863 (okolice Warszawy, 498 km) |
| Niska precyzja (≤ 4 cyfry po przecinku, czyli ≥ ~10 m) | 128 |
| Identyczne współrzędne | 512 grup / 1 185 rekordów, max 21 (punkt zastępczy) |
| Współrzędne zaokrąglone do 4 miejsc | 933 grupy / 2 041 rekordów |
| Ten sam adres w tej samej gminie | 2 962 grupy / 7 194 rekordy, np. „ul. Bema Józefa 22, Kędzierzyn-Koźle” ×15 |
| Rekordy identyczne we wszystkich polach poza ID | 342 grupy, 410 nadmiarowych rekordów |

**[Analiza]** Jak to interpretować:
- Punkt 52.215933, 19.134422 ma adresy z całej Polski, więc to niemal na pewno wynik geokodera, który nie rozpoznał adresu i zwrócił środek kraju. Te rekordy trzeba ukrywać albo geokodować ponownie z adresu.
- Wiele rekordów pod jednym adresem nie musi być błędem. Jeden budynek może mieć kilka wejść lub punktów, np. klatki schodowe. Rekordy identyczne we wszystkich polach (te same współrzędne, adres i dostępność) to jednak dla użytkownika duplikaty. Na mapie trzeba je klastrować lub scalać, zachowując wszystkie ID.
- Wartości bboxów województw pokazują, że część punktów leży w złym województwie. Przykład: maksymalna szerokość w małopolskim wynosi 53,868, a długość w lubuskim sięga 19,673 **[Pomiar]**. Pełna weryfikacja wymaga testu punkt-w-poligonie z granicami PRG GUGiK.

**Jakość adresów (pomiar):**
- 10 158 adresów ma postać „Nr, Miejscowość” bez ulicy (głównie wsie).
- Prefiksy bywają zdublowane: 1 228 × „os. Osiedle…”, 254 × „pl. plac…”, 970 × „ul. Plac/Aleja/Osiedle…”.
- 192 adresy zawierają kilka numerów.
- W źródle odwrócono imię i nazwisko patrona ulicy, np. „ul. Bema Józefa 22”, „ul.Ibn Siny Awicenny 30”. Wygląda to na format TERYT/ULIC (nazwa główna + przydomek) **[Analiza]**.

**[Analiza] Pole `Powiat`.** Ma 380 par (województwo, powiat). Odpowiada to liczbie powiatów ziemskich i miast na prawach powiatu, więc pole wygląda na kompletne. Pole `Gmina` ma 2 190 trójek, w tym „Nieznana”. Nie dołączono kodów TERYT, więc łączenie z PRG wymaga dopasowania po nazwach.

### 1.5 Stabilność identyfikatorów: porównanie wersji 10.03.2026 i 23.10.2026 (pomiar)

| Metryka | Wartość |
|---|---|
| Rekordy: marzec → październik | 81 967 → 87 724 |
| ID zachowane | 78 807 (96,1% wersji marcowej) |
| ID usunięte / dodane | 3 160 / 8 917 |
| Rekordy zachowane, ale zmienione | 3 694 |
| …zmiana współrzędnych | 2 159. Mediana przesunięcia ok. 15 m; 125 przesunięć > 1 km; max 422 km |
| …zmiana adresu | 1 344, np. „30, Racibórz” → „ul. Cecylii 30, Racibórz” |
| …zmiana dostępności | 1 164. Najczęściej „Całodobowa” → „Na żądanie” (643) i „Określone godziny” → „Na żądanie” (218); w drugą stronę „Na żądanie” → „Całodobowa” 132 razy |
| …zmiana gminy / powiatu | 69 / 6, np. „Nieznana” → „Gogolin” |
| Usunięte ID, których adres pojawia się wśród dodanych | 99 (możliwe „przepięcie” ID) |
| Kolejność wierszy | Niezachowana |

**[Analiza]** Wnioski z porównania:
- `Identyfikator publiczny` nadaje się na klucz główny.
- Zmiany treści przy zachowanym ID są częste (4,7% w 7 miesięcy), więc ETL musi robić upsert, a nie tylko wstawiać nowe rekordy.
- Spadek dostępności (z „Całodobowa” na „Na żądanie”) to najczęstsza zmiana. Aplikacja nie może trzymać starej dostępności w pamięci podręcznej przez tygodnie.
- Pochodny zbiór Legionowa (sekcja 3.1) używa tych samych ID (28/28 obecnych w zbiorze krajowym) **[Pomiar]**. To potwierdza, że ID są stałe także poza PSP.

### 1.6 Licencja i atrybucja

- **Fakt:** CC BY 4.0 z warunkiem dla baz danych cytowanym w 1.1 ([API](https://api.dane.gov.pl/1.4/datasets/28058)). Pola `license_condition_source` i `license_condition_modification` w API są puste. XML wydawcy ma jednak `<source>true</source>` i `<modification>true</modification>` ([XML](https://gdziesieukryc.pl/PS_XML/punkty_schronienia.xml)).
- **[Niezweryfikowane]** Według konwencji harvestera dane.gov.pl pole `source=true` oznacza obowiązek podania źródła, a `modification=true` obowiązek informowania o modyfikacji. Nie znalazłem tej definicji w dokumentacji.
- **[Analiza] Proponowana atrybucja w aplikacji:** „Źródło: Komenda Główna Państwowej Straży Pożarnej, zbiór »Punkty schronienia w Polsce«, dane.gov.pl, licencja CC BY 4.0. Dane przetworzone (geokodowanie, deduplikacja).” Do tego link do zbioru i data pobrania. To spełnia wymogi CC BY 4.0: autor, licencja, link, informacja o zmianach ([CC BY 4.0, sekcja 3(a)](https://creativecommons.org/licenses/by/4.0/legalcode.pl)).

---

## 2. Powiązane źródła oficjalne

### 2.1 Narzędzie „Gdzie się ukryć” (gdziesieukryc.pl)

**Fakty:**
- Narzędzie udostępniło PSP 22–23.12.2025. W komunikacie z tego dnia baza liczyła „ponad 70 tys. obiektów” ([KW PSP Warszawa](https://www.gov.pl/web/kwpsp-warszawa/gdzie-sie-ukryc--sprawdz-najblizsze-punkty-schronienia-ps), [MSWiA](https://www.gov.pl/web/mswia/nowe-narzedzie-pomoze-znalezc-punkty-schronienia)).
- Dane są „weryfikowane przez Państwową Straż Pożarną i upoważnione organy ochrony ludności”.
- Narzędzie jest PWA (aplikacją webową instalowaną na ekranie głównym telefonu). Działa offline, gdy dane zostaną wcześniej pobrane.
- Komunikat zapowiadał wersję w sklepach z aplikacjami ([KW PSP Warszawa](https://www.gov.pl/web/kwpsp-warszawa/gdzie-sie-ukryc--sprawdz-najblizsze-punkty-schronienia-ps)).
- Na mapie punkty mają znak obrony cywilnej. Punkty całodobowe mają dodatkowo zieloną obwódkę (tamże).
- Nagłówek CSP serwisu dopuszcza połączenia do `api.mapbox.com`, `router.project-osrm.org`, `nominatim.openstreetmap.org`, `photon.komoot.io`, `*.tile.openstreetmap.org` oraz `admin.gdziesieukryc.pl` **[Pomiar: nagłówki HTTP]**.
- **[Analiza]** Z CSP wynika, że serwis korzysta z kafli OSM, publicznego routera OSRM i geokoderów opartych na OSM. Panel `admin.` jest prawdopodobnie źródłem eksportu CSV.
- Nie znalazłem publicznego API serwisu poza plikami w `/PS_XML/`.

**Co serwis pokazuje w porównaniu z CSV:** **[Niezweryfikowane]** Nie obejrzałem interfejsu, bo blokuje go weryfikacja antybotowa. Z komunikatów PSP wynika, że pokazuje lokalizację, dostępność i trasę. To pokrywa się z kolumnami CSV.

### 2.2 Usługa WMS GUGiK „Schrony”

**Fakty:**
- GUGiK ogłosił 23.03.2026 usługę „Schrony” w kompozycji „Zarządzanie kryzysowe” geoportal.gov.pl. Ogłoszenie podaje „ponad 82 tys.” punktów, źródło dane.gov.pl i widoczność w skalach 1:500 000 i większych ([geoportal.gov.pl](https://www.geoportal.gov.pl/aktualnosci/nowa-usluga-schrony-dostepna-w-module-zarzadzanie-kryzysowe-w-serwisie-www-geoportal-gov-pl/)).
- Endpoint: `https://mapy.geoportal.gov.pl/wss/ext/Schrony` ([GetCapabilities](https://mapy.geoportal.gov.pl/wss/ext/Schrony?SERVICE=WMS&REQUEST=GetCapabilities)):
  - warstwa `schrony`;
  - CRS EPSG:2180, 4326, 4258, 3857;
  - `MaxScaleDenominator` 501000;
  - `AccessConstraints`/`Fees` = NONE.
- Opis w odpowiedzi GetFeatureInfo mówi: „Prezentowane dane są okresowo synchronizowane, co może skutkować niewielkimi opóźnieniami” **[Pomiar]**.
- Moje próbne zapytania GetFeatureInfo nie zwróciły atrybutów obiektów.

**[Analiza]** WMS to tylko obraz. Dla aplikacji nie wnosi danych ponad CSV. Może służyć do wizualnej kontroli lub jako warstwa podkładowa.

### 2.3 Prawo: kategorie obiektów i definicje

Źródła: ustawa z 5.12.2024 w brzmieniu pierwotnym ([tekst](https://api.sejm.gov.pl/eli/acts/DU/2024/1907/text.html)) i nowelizacja z 17.04.2026, w mocy od 29.05.2026 ([Dz.U. 2026 poz. 646](https://api.sejm.gov.pl/eli/acts/DU/2026/646/text.pdf)).

| Kategoria | Definicja (cytat/skrót) | Kto ustala | Przepis |
|---|---|---|---|
| **Schron** | Budowla ochronna „o konstrukcji zamkniętej i hermetycznej, wyposażony w urządzenia filtrowentylacyjne lub pochłaniacze regeneracyjne” | Wójt, starosta lub wojewoda (wyznaczenie, porozumienie albo decyzja) | art. 83 ust. 3, art. 86–88 |
| **Ukrycie** | Budowla ochronna „o konstrukcji niehermetycznej” | jw. | art. 83 ust. 4 |
| **Miejsce doraźnego schronienia (MDS)** | Obiekt zbiorowej ochrony „przystosowany do tymczasowego ukrycia ludzi”, organizowany w stanie nadzwyczajnym lub w czasie wojny | Wójt, starosta lub wojewoda | art. 84, art. 102 |
| **Punkt schronienia** (od 29.05.2026) | „miejsca przydatne do tymczasowego ukrycia ludzi […] zapewniające spełnienie podstawowej funkcji ochronnej przed nagłymi niebezpiecznymi zjawiskami pogodowymi oraz skutkami użycia konwencjonalnych środków rażenia, w szczególności odłamkami” | **Komendant powiatowy (miejski) PSP** identyfikuje punkt i zawiadamia wójta, starostę i właściciela | art. 84a, art. 91a |

**Kategorie odporności (fakt):** S-0 do S-3 dla schronów (nadciśnienie od 0,03 do 0,3 MPa) oraz U-1 do U-3 dla ukryć, zależnie od zakresu funkcji ochronnych ([§ 13 rozp. MSWiA, Dz.U. 2025 poz. 235](https://api.sejm.gov.pl/eli/acts/DU/2025/235/text.pdf)).

**Wymagania dla MDS (fakt):** MDS organizuje się m.in. w obiektach „w odległości nie większej niż 500 m od miejsc stałego przebywania ludzi” i „umożliwiających schronienie się co najmniej 15 osobom” ([§ 3 rozp. Dz.U. 2025 poz. 932](https://api.sejm.gov.pl/eli/acts/DU/2025/932/text.pdf)).

**[Analiza]** Zbiór PSP zawiera „punkty schronienia” w rozumieniu art. 84a/91a, a nie schrony ani ukrycia. Wskazuje na to nazwa zbioru, a także pełne dopasowanie zakresu pól do art. 108 ust. 5 (rodzaj, lokalizacja, dostępność). Punkt schronienia z definicji chroni tylko przed pogodą i odłamkami. Aplikacja **nie może** nazywać ich „schronami”.

### 2.4 Ewidencja: co jest jawne, a co niejawne

**Fakty:**
- Centralną Ewidencję OZO prowadzi KG PSP w systemie teleinformatycznym (art. 108 ust. 1–2).
- Po nowelizacji ewidencja obejmuje także punkty schronienia (art. 108 ust. 3 pkt 4). Wpisuje je komendant powiatowy PSP (art. 109 ust. 2 pkt 4) ([Dz.U. 2026 poz. 646](https://api.sejm.gov.pl/eli/acts/DU/2026/646/text.pdf)).
- Dane o obiekcie zbiorowej ochrony (art. 108 ust. 4) obejmują 13 pozycji ([ustawa](https://api.sejm.gov.pl/eli/acts/DU/2024/1907/text.html)), m.in.:
  1. podstawę uznania,
  2. numer ewidencyjny,
  3. typ,
  4. lokalizację ze współrzędnymi,
  5. dane właściciela, zarządcy, osoby odpowiedzialnej za udostępnienie i kierownika, w tym PESEL i telefon,
  6. przeznaczenie,
  7. kategorię odporności,
  8. pojemność,
  9. rok budowy.
- Dane o punkcie schronienia (art. 108 ust. 5) to tylko: rodzaj obiektu lub miejsca, lokalizacja z adresem i współrzędnymi oraz dostępność ([nowelizacja](https://api.sejm.gov.pl/eli/acts/DU/2026/646/text.pdf)).
- „Dane zawarte w Centralnej Ewidencji OZO nie stanowią informacji publicznej” (art. 113 ust. 1). Klauzulę „zastrzeżone” mają dane z art. 108 ust. 4 pkt 2 i 5–13, czyli m.in. numer, dane osób, kategoria odporności i pojemność (art. 113 ust. 2) ([ustawa](https://api.sejm.gov.pl/eli/acts/DU/2024/1907/text.html)).
- Rozporządzenie o Centralnej Ewidencji OZO przewiduje „publikowanie danych o obiektach zbiorowej ochrony w zakresie danych określonych w art. 108 ust. 4 pkt 1, 3 i 4”, czyli podstawy uznania, typu i lokalizacji ([§ 3 pkt 5, Dz.U. 2025 poz. 922](https://api.sejm.gov.pl/eli/acts/DU/2025/922/text.pdf)).
- To rozporządzenie zachowuje moc najdłużej 12 miesięcy od wejścia w życie nowelizacji, czyli do ok. 29.05.2027 ([art. 12 ust. 3 nowelizacji](https://api.sejm.gov.pl/eli/acts/DU/2026/646/text.pdf)).
- KG PSP ma wprowadzić punkty schronienia do ewidencji w ciągu 6 miesięcy od jej uruchomienia (art. 201 ust. 3, tamże).

**[Analiza] Wnioski dla aplikacji:**
- **Klauzula „zastrzeżone” nie obejmuje danych o punktach schronienia**, bo art. 113 ust. 2 odwołuje się tylko do ust. 4. Publikacja zbioru przez PSP to potwierdza.
- Dla schronów i ukryć jawne mogą być **typ** (schron/ukrycie) i lokalizacja. Pojemność i kategoria odporności są zastrzeżone.
- Aplikacja nie powinna zbierać ani publikować od użytkowników (crowdsourcing) pojemności ani kategorii odporności schronów. Nawet jeśli ktoś je zna, w ewidencji są to informacje niejawne. Publikacja przez osobę nieuprawnioną do informacji niejawnych to inna sytuacja prawna, wymagająca porady prawnika **[Niezweryfikowane: kwestia prawna]**.
- Krosno opublikowało w 2024 r. pojemności schronów na CC0 (sekcja 3.1), czyli przed obecnym reżimem. **Nie należy tego zbioru importować.**

### 2.5 Obowiązek informowania i oznakowanie

**Obowiązek informowania (fakty):**
- MSWiA podaje do publicznej wiadomości „ogólne informacje o obiektach zbiorowej ochrony w poszczególnych województwach i powiatach, w tym procentowe zestawienie miejsc […] w stosunku do liczby mieszkańców” (art. 114 ust. 1, [ustawa](https://api.sejm.gov.pl/eli/acts/DU/2024/1907/text.html)).
- Organy ochrony ludności informują o umiejscowieniu obiektów, sposobie dotarcia i ograniczeniach dla osób z niepełnosprawnościami, także „za pomocą narzędzi teleinformatycznych, w tym aplikacji na urządzenia mobilne” (art. 114 ust. 2–3). Od 2026 r. obowiązek ten dotyczy również punktów schronienia (art. 114 ust. 4, [nowelizacja](https://api.sejm.gov.pl/eli/acts/DU/2026/646/text.pdf)).
- **[Niezweryfikowane]** Nie znalazłem zestawienia MSWiA z art. 114 ust. 1, czyli procentu miejsc w podziale na powiaty. Szukałem w gov.pl. Strony urzędów, które sprawdziłem, podają tylko definicje bez wykazów ([UW Opolski](https://www.gov.pl/web/uw-opolski/dfrgthyj), [Powiat Oleśnicki](https://samorzad.gov.pl/web/powiat-olesnicki/obiekty-zbiorowej-ochrony)).

**Oznakowanie (fakty):**
- Budowle ochronne i MDS oznacza się międzynarodowym znakiem obrony cywilnej oraz napisem „SCHRON”, „UKRYCIE” lub „MIEJSCE DORAŹNEGO SCHRONIENIA” (art. 105, [ustawa](https://api.sejm.gov.pl/eli/acts/DU/2024/1907/text.html)).
- Wzór znaku to niebieski trójkąt na pomarańczowym tle, minimum 0,2 m ([zał. 11 rozp. Dz.U. 2025 poz. 1548](https://api.sejm.gov.pl/eli/acts/DU/2025/1548/text.pdf)).
- Nowelizacja nie rozszerzyła art. 105 na punkty schronienia ([Dz.U. 2026 poz. 646](https://api.sejm.gov.pl/eli/acts/DU/2026/646/text.pdf)).
- W ELI nie ma aktu o oznakowaniu punktów schronienia ([wyszukiwanie ELI „punktów schronienia”](https://api.sejm.gov.pl/eli/acts/search?title=punkt%C3%B3w%20schronienia)).
- **[Niezweryfikowane: źródło wtórne]** Wiceminister MSWiA miał zapowiedzieć oznakowanie punktów do końca 2026 r. Przepis był wtedy „na końcowym etapie uzgodnień międzyresortowych” ([xyz.pl za PAP, 29.09.2026](https://xyz.pl/?p=255280)).

### 2.6 Dostęp do schronienia: kto otwiera i kiedy

| Obiekt | Kto udostępnia | Kiedy | Siła obowiązku | Przepis |
|---|---|---|---|---|
| Budowla ochronna (schron/ukrycie) | Właściciel lub zarządca; wyznacza osobę odpowiedzialną za udostępnienie i kierownika budowli | **Na polecenie organu ochrony ludności**: przy przewidywanej klęsce żywiołowej, w stanie nadzwyczajnym lub w czasie wojny; polecenie „podlega bezzwłocznemu wykonaniu” | Obowiązek | art. 96 ust. 1 pkt 2, art. 97, art. 99–100 ([ustawa](https://api.sejm.gov.pl/eli/acts/DU/2024/1907/text.html)) |
| Budowla w obiekcie niepublicznym | jw. | jw. | „w pierwszej kolejności” dla użytkowników budynku | art. 104 |
| MDS | Właściciel lub zarządca | Po zorganizowaniu MDS (stan nadzwyczajny lub wojna); przy przygotowaniu „otworzenie na stałe drzwi wejściowych i ewakuacyjnych” | Obowiązek | art. 103; [§ 3 ust. 1 pkt 4 rozp. 933](https://api.sejm.gov.pl/eli/acts/DU/2025/933/text.pdf) |
| **Punkt schronienia** | Właściciel lub zarządca obiektu | **„W razie ogłoszenia alarmu”**, zwłaszcza o uderzeniu z powietrza, „na czas trwania tego zagrożenia” | **„w miarę możliwości”** | art. 103a ([nowelizacja](https://api.sejm.gov.pl/eli/acts/DU/2026/646/text.pdf)) |

**Obsługa budowli ochronnych (fakty):**
- Budowla o pojemności powyżej 120 osób ma mieć personel: co najmniej 1 osoba na 120 osób plus 1 na każde 5 osób z niepełnosprawnościami ([§ 6 ust. 2 rozp. 933](https://api.sejm.gov.pl/eli/acts/DU/2025/933/text.pdf)).
- Przygotowanie budowli do użycia obejmuje „sprawdzenie dostępności budowli ochronnej dla osób ze szczególnymi potrzebami” (§ 2 pkt 4, tamże).

**[Niezweryfikowane: źródło wtórne]** Według PAP wiceminister MSWiA powiedział, że w czasie pokoju udostępnianie punktów odbywa się „na zasadzie solidarności społecznej, a nie obowiązku”, a w czasie wojny jest obowiązkowe ([xyz.pl za PAP](https://xyz.pl/?p=255280)). Wypowiedź pochodzi z 29.09.2026, czyli już po wejściu w życie art. 103a.

### 2.7 Kontekst: wiarygodność dawnych ewidencji (NIK)

**Fakty z kontroli NIK P/23/061, opublikowanej 12–13.03.2024** ([NIK](https://www.nik.gov.pl/najnowsze-informacje-o-wynikach-kontroli/budowle-ochronne-miejsca-ukrycia.html)):
- „W całym kraju jest 10622 – schronów i ukryć dla 1428369 obywateli (3,78%)”.
- Ewidencje gmin były „w większości niepełnych i niezweryfikowanych”.
- Spośród skontrolowanych obiektów wymaganych warunków technicznych nie spełniało 17 z 25 schronów i 10 z 19 ukryć.
- „W spisie obiektów ochronnych znalazły się również takie, które były dla mieszkańców niedostępne”.

**[Analiza]** Dzisiejsze ~87 tys. punktów schronienia to inna, szersza kategoria niż ~10,6 tys. schronów i ukryć z ewidencji badanej przez NIK. Liczb tych nie należy porównywać wprost.

---

## 3. Inne źródła

### 3.1 Dane samorządowe

| Źródło | Co zawiera | Licencja | Ocena |
|---|---|---|---|
| **Legionowo**: „Punkty schronienia wraz z lokalizacją, rodzajem obiektu i danymi adresowymi”, CSV + TTL, 18–21.09.2026 ([zasób 2648378](https://api.dane.gov.pl/1.4/resources/2648378), [plik](https://api.dane.gov.pl/media/resources/20260918/punkty-schronienia-legionowo.csv)) | 34 wiersze (28 ID). Adres rozbity na pola: kod PNA, cecha, ulica, nr budynku, nr lokalu. Separator `;` | CC0 1.0 (zbiór [40809](https://api.dane.gov.pl/1.4/datasets/40809)) | Pochodna zbioru PSP; te same ID. Wiersz zbioru PSP z kilkoma numerami budynków („Mickiewicza 25, 26, 27”) rozbito na osobne wiersze z tym samym ID **[Pomiar]**. Pokazuje lepszy format adresu |
| **Krosno**: „Schrony zlokalizowane w Mieście Krosno”, 2024 ([zbiór 3626](https://api.dane.gov.pl/1.4/datasets/3626), [plik](https://api.dane.gov.pl/media/resources/20240220/Schrony.csv)) | 11 obiektów z **pojemnością** i opisem typu („ukrycie w zakładzie pracy”, „budowla ochronna ludności”) | CC0 1.0 | Sprzed ustawy; pojemność to dziś dana zastrzeżona (2.4). Nie używać |
| Gdańsk (CKAN) | Zapytanie „schron”: 0 wyników ([API](https://ckan.multimediagdansk.pl/api/3/action/package_search?q=schron)) | — | Brak danych |
| Warszawa 19115 | Strona „Miejsca doraźnego schronienia” odsyła do narzędzia PSP; bez własnych danych (aktualizacja 2026-05-08) ([warszawa19115.pl](https://warszawa19115.pl/en/-/miejsca-dora%C5%BAnego-schronienia)) | — | Brak danych |
| Wyszukiwarka dane.gov.pl | Frazy „schron”, „schrony”, „punkty schronienia”: poza powyższymi brak zbiorów o schronieniu ludności ([API search](https://api.dane.gov.pl/1.4/search?q=schrony)) | — | — |

**[Niezweryfikowane]** Portali Wrocławia i Warszawy nie udało się odpytać przez API: odpowiedzi 403 i zerwane połączenie. Krakowa (MSIP) i Poznania nie sprawdziłem. Nie twierdzę, że nie mają danych.

**[Analiza]** Nie ma drugiego niezależnego krajowego źródła. Samorządy publikują co najwyżej wycinki zbioru PSP. Agregacja w praktyce sprowadza się do jednego źródła, ewentualnie uzupełnionego o dane własne lub zgłoszenia użytkowników.

### 3.2 OpenStreetMap

**Tagowanie (fakty, [OSM Wiki: shelter_type=bomb_shelter](https://wiki.openstreetmap.org/wiki/Tag:shelter_type=bomb_shelter)):**
- Schron dla ludności oznacza się `amenity=shelter` + `shelter_type=bomb_shelter`, ze status „in use”.
- Wiki „zdecydowanie” zaleca `access=*`, jeśli obiekt nie jest stale dostępny.
- Wiki ostrzega przed myleniem z `bunker_type=bomb_shelter` (w połączeniu z `military=bunker`/`building=bunker`), bo wiele schronów nie jest bunkrami.

**Liczby w Polsce (pomiar, Overpass, baza z 2026-10-24T08:56Z):**

| Zapytanie | Liczba |
|---|---|
| `shelter_type=bomb_shelter` | **0** |
| `military=bunker` | 5 607 |
| `building=bunker` | 4 291 |
| `amenity=shelter` (wszystkie typy, głównie wiaty) | 48 997 |
| `emergency=assembly_point` | 669 |

Na świecie `shelter_type=bomb_shelter` ma 580 obiektów, a `military=bunker` ma 110 075 ([taginfo](https://taginfo.openstreetmap.org/api/4/tag/stats?key=shelter_type&value=bomb_shelter)). Próbka 40 obiektów z nazwą zawierającą „schron” to prawie wyłącznie fortyfikacje historyczne (`historic=ruins`, np. „Schron bojowy Przedmościa Bydgoskiego”) i schroniska turystyczne **[Pomiar]**.

**Licencje (fakty):**
- Według OSMF „all CC BY versions have additional terms that make them incompatible with OpenStreetMap without explicit waivers” ([OSMF Licence Compatibility](https://osmfoundation.org/wiki/Licence/Licence_Compatibility)).
- Mapa (Produced Work) z danych ODbL wymaga tylko atrybucji OSM (tamże).

**[Analiza] Wnioski dla aplikacji:**
- OSM **nie jest** źródłem danych o schronach w Polsce. Bunkry w OSM to w większości zabytki, a pokazanie ich jako miejsc schronienia byłoby niebezpieczne.
- OSM przydaje się jako podkład mapowy, do routingu pieszego i do geokodowania zastępczego. Robi tak samo narzędzie PSP (sekcja 2.1).
- Nie importować danych PSP do OSM bez pisemnej zgody KG PSP (waiver).
- W aplikacji trzymać dane PSP (CC BY) i dane OSM (ODbL) w osobnych warstwach. Mapa wynikowa to wtedy Produced Work: wystarczą obie atrybucje. Jeśli aplikacja zbuduje i udostępni **bazę** łączącą oba źródła (np. API z punktami PSP wzbogaconymi o atrybuty z OSM), może powstać Derivative Database z obowiązkiem share-alike ODbL. Wymaga to osobnej analizy **[Niezweryfikowane: interpretacja licencji]**.

---

## 4. Analiza dla aplikacji [Analiza]

### 4.1 Pobieranie i odświeżanie (ETL)

1. **Harmonogram.**
   - Raz dziennie pobierać `punkty_schronienia.xml` i odczytać `lastUpdateDate`.
   - Następnie wysłać `GET` na CSV z `If-None-Match` (ETag). Odpowiedź 304 oznacza brak zmian.
   - Raz dziennie wystarczy: wydawca deklaruje tygodniowy cykl, a obserwowane modyfikacje (19.10 i 23.10) pokazują, że zmiany bywają częstsze.
2. **Parsowanie.** UTF-8-sig, `csv` z cudzysłowami. Walidacja schematu: 11 kolumn o dokładnych nazwach. Przy zmianie schematu wstrzymać import i wysłać alert.
3. **Kontrole przed publikacją**, zatrzymujące import (circuit breaker):
   - liczba rekordów nie spada o więcej niż X% (np. 5%) względem poprzedniej wersji;
   - odsetek usuniętych ID mieści się w normie;
   - brak pustych współrzędnych.
4. **Upsert po `Identyfikator publiczny`.**
   - Przechowywać historię: `first_seen`, `last_seen`, `changed_at`, poprzednią dostępność.
   - Rekordy usunięte oznaczać jako nieaktywne zamiast je kasować. Pozwala to wyjaśnić użytkownikowi, czemu punkt zniknął.
5. **Flagi jakości** (bez modyfikowania danych źródłowych):
   - `geocode_fallback` dla 52.215933, 19.134422 i otoczenia ~50 m;
   - `outlier` dla punktów > X km od mediany gminy oraz dla niezgodności punktu z poligonem województwa lub powiatu (PRG GUGiK);
   - `low_precision` dla ≤ 4 cyfr po przecinku;
   - `gmina_unknown` dla gminy „Nieznana”.
6. **Geokodowanie zastępcze** dla rekordów z flagami.
   - Geokodować adres przez PRG/EMUiA (punkty adresowe GUGiK) lub Nominatim, z kontrolą, że wynik leży w deklarowanym powiecie.
   - Wynik zapisywać jako osobne pole `geom_fixed`, nigdy nie nadpisywać współrzędnych źródłowych.
   - Rekordów, których nie da się naprawić, nie pokazywać na mapie. Mogą zostać na liście z dopiskiem „lokalizacja niepewna”.
   - Zgodność licencji usługi geokodującej sprawdzić osobno **[Niezweryfikowane]**.
7. **Deduplikacja.**
   - Rekordy identyczne we wszystkich polach poza ID scalać w jeden marker z listą ID.
   - Rekordy pod jednym adresem z różnymi współrzędnymi lub różną dostępnością zostawić osobno, ale klastrować.
8. **Normalizacja adresu.** Usuwać zdublowane prefiksy („os. Osiedle”, „pl. plac”). Rozbijać listy numerów jak w zbiorze Legionowa. Zachowywać oryginał.
9. **Offline.** Cały zbiór to ~15 MB CSV. Po odrzuceniu stałych kolumn i skróceniu współrzędnych do 6 miejsc (~0,1 m) paczka powinna mieć kilka MB **[Niezweryfikowane: nie mierzyłem]**. Pozwala to na pełny tryb offline, podobnie jak w narzędziu PSP.

### 4.2 Ryzyka jakości danych

- **Fałszywe poczucie bezpieczeństwa.** 69% punktów jest „Na żądanie”, a obowiązek udostępnienia brzmi „w miarę możliwości” (art. 103a). Nawigacja do najbliższego punktu może prowadzić pod zamknięte drzwi.
  - Domyślne sortowanie powinno preferować „Całodobowa”.
  - Przy pozostałych kategoriach trzeba jasno komunikować, że dostęp nie jest gwarantowany.
- **Błędne współrzędne.** Co najmniej 21 rekordów ma punkt zastępczy, a 60 jest odstających. Nawigacja do takiego punktu może skierować użytkownika setki kilometrów dalej.
- **Brak typu obiektu.** Pola `Nazwa` i `Rodzaj obiektu` są stałe, choć art. 108 ust. 5 pkt 1 przewiduje „rodzaj obiektu budowlanego lub innego miejsca”. Użytkownik nie wie, czy idzie do garażu, przejścia podziemnego czy piwnicy.
- **Zmienność dostępności.** Najczęstsza zmiana między wersjami to „Całodobowa” → „Na żądanie” (643 rekordy w 7 miesięcy).
- **Opóźnienie dane.gov.pl.** Metadane i archiwum na dane.gov.pl są nieaktualne. Pobierać trzeba ze źródła.
- **Niejednoznaczność liczb.** W komunikacji publicznej pojawiają się różne liczby:
  - 70 tys. w grudniu 2025 ([MSWiA](https://www.gov.pl/web/mswia/nowe-narzedzie-pomoze-znalezc-punkty-schronienia)),
  - 82 tys. w marcu 2026 ([GUGiK](https://www.geoportal.gov.pl/aktualnosci/nowa-usluga-schrony-dostepna-w-module-zarzadzanie-kryzysowe-w-serwisie-www-geoportal-gov-pl/)),
  - 86,5 tys. w październiku 2026 ([MSWiA](https://www.gov.pl/web/mswia/minister-marcin-kierwinski-podpisal-list-intencyjny-ws-systemu-ostrzegania-ludnosci-cywilnej-cell-broadcast)),
  - 87 724 w pliku.

  Aplikacja powinna pokazywać liczbę z własnego importu i jego datę.

### 4.3 Brakujące atrybuty, których potrzebuje użytkownik

| Atrybut | Jest w zbiorze PSP? | Czy wolno go uzupełnić? | Propozycja |
|---|---|---|---|
| Typ obiektu (garaż, przejście, metro, piwnica) | Nie (pole stałe) | Tak; art. 108 ust. 5 przewiduje to pole jako jawne | Wniosek do KG PSP o wypełnienie pola. Ewentualnie ręczna kategoryzacja po adresie lub OSM, z oznaczeniem „nieoficjalne” |
| Schron / ukrycie / MDS / punkt | Nie | Typ OZO jest publikowalny (§ 3 pkt 5 rozp. 922) | Czekać na publikację z Centralnej Ewidencji OZO |
| Pojemność | Nie | **Nie** dla OZO (zastrzeżone); dla punktów ustawa jej nie przewiduje | Nie zbierać, nie szacować |
| Kategoria odporności | Nie | **Nie** (zastrzeżone) | Nie sugerować poziomu ochrony |
| Godziny otwarcia przy „Określone godziny” | Nie | Tak | Pole do uzupełnienia przez zarządcę lub użytkowników, z moderacją |
| Dostępność dla osób z niepełnosprawnościami | Nie | Tak; art. 114 ust. 2 wręcz wymaga takiej informacji | Wniosek do PSP; zgłoszenia społecznościowe (schody, winda, rampa) |
| Kontakt do zarządcy | Nie | Dane osób fizycznych z ewidencji są zastrzeżone i chronione RODO | Najwyżej ogólny kontakt instytucjonalny, jeśli zarządca sam go poda |
| Wejście (dokładny punkt drzwi) | Nie (punkt to budynek lub adres) | Tak | Doprecyzowanie przez użytkowników lub zarządców |
| Oznakowanie na miejscu | Nie | Tak | Zgłoszenia ze zdjęciem; uwaga na prywatność |

### 4.4 Ograniczenia prawne i licencyjne (podsumowanie)

- Publikować wyłącznie zakres jawny: dla punktów schronienia rodzaj, lokalizację i dostępność; dla OZO podstawę, typ i lokalizację. Nie publikować pojemności, kategorii odporności ani danych osób, także pozyskanych z innych źródeł (np. starego zbioru z Krosna).
- Atrybucja CC BY 4.0 z informacją o modyfikacjach (1.6).
- Nie importować danych do OSM. Rozdzielić warstwy PSP i OSM (3.2).
- Prywatna aplikacja może legalnie realizować cel art. 114 ust. 3 (informowanie przez aplikacje), ale nie jest „organem ochrony ludności”. Nie powinna sugerować oficjalnego statusu ani używać znaku obrony cywilnej w sposób sugerujący oznakowanie urzędowe. Ochronę znaku w prawie międzynarodowym (Protokół I) trzeba sprawdzić osobno **[Niezweryfikowane]**.

### 4.5 Jak komunikować dostęp do schronienia

- **„Całodobowa”**: „Dostępny całą dobę (wg PSP)”, z datą ostatniej weryfikacji, czyli datą importu, w którym status się nie zmienił.
- **„Określone godziny”**: „Dostępny w godzinach pracy obiektu. Godzin nie podano.”
- **„Na żądanie”**: „Obiekt zwykle zamknięty. Zarządca powinien go udostępnić w razie alarmu, w miarę możliwości (art. 103a ustawy).” Nie używać sformułowania „otwarty na żądanie”, które sugeruje gwarancję.
- **Przy alarmie** pokazywać najpierw punkty całodobowe w zasięgu pieszym. Dalej punkty pozostałe z ostrzeżeniem. Zawsze dodać wskazówkę o alternatywie (np. klatka schodowa lub korytarz bez okien wg poradników PSP) **[Niezweryfikowane: nie cytuję konkretnego poradnika]**.
- **Nie nazywać punktów „schronami”.** Ustawowo punkt schronienia chroni przed pogodą i odłamkami, nie przed bronią masowego rażenia (art. 84a).

---

## 5. Otwarte pytania

1. **Słownik pól.** Czy „Na żądanie” to oficjalnie „dostęp w ramach wzajemnej pomocy”? Czy PSP planuje wypełnić pola `Nazwa`, `Rodzaj obiektu` i `Opis ogolny`, skoro art. 108 ust. 5 pkt 1 wymaga „rodzaju”? Sposób weryfikacji: wniosek lub pytanie do KG PSP (Biuro Informatyki i Łączności lub Biuro Ochrony Ludności).
2. **Publikacja OZO.** Kiedy i w jakim formacie KG PSP opublikuje typ i lokalizację schronów, ukryć i MDS (§ 3 pkt 5 rozp. 922)? Nowe rozporządzenie o ewidencji musi wejść do ok. 29.05.2027.
3. **Zestawienie z art. 114 ust. 1.** Czy MSWiA opublikowało procent miejsc w OZO na powiat, a jeśli tak, to gdzie?
4. **Rotacja ID.** Czy usunięcie rekordu i dodanie nowego ID pod tym samym adresem (99 przypadków) to zmiana obiektu, czy artefakt eksportu?
5. **Punkt zastępczy i odstające.** Czy PSP wie o 21 rekordach na 52.215933, 19.134422 i o 60 odstających? Warto zgłosić. Poprawki wrócą do aplikacji wraz z kolejną aktualizacją.
6. **Licencja w praktyce.** Czy KG PSP zgodzi się na waiver dla OSM? Czy pozwoli na „wzbogacanie” danych (typ obiektu, godziny) przez osoby trzecie z odesłaniem poprawek do PSP?
7. **Oznakowanie punktów.** Kiedy wejdzie przepis o oznakowaniu punktów schronienia i czy przewiduje zieloną obwódkę dla punktów całodobowych, znaną z mapy PSP?
8. **Dostęp przy alarmie w praktyce.** Jak zarządcy „Na żądanie” (wspólnoty, spółdzielnie) realizują art. 103a? Czy ktoś ma klucze i czy otwiera bez wezwania? Odpowiedź wymaga badania terenowego lub ankiety, bo przepisy tego nie rozstrzygają.
9. **API.** Czy „Gdzie się ukryć” ma lub będzie miało API (np. zgłoszenia zamkniętych punktów)? Integracja z mObywatelem była zapowiadana w mediach **[Niezweryfikowane]**.
10. **Pozostałe miasta.** Czy Kraków, Wrocław lub Poznań publikują własne dane o MDS albo punktach (nie sprawdzono, sekcja 3.1)?

---

## 6. Metoda i reprodukcja

**Pliki** pobrano 24.10.2026 do katalogu tymczasowego (poza repo):
- `gdziesieukryc.pl/PS_XML/punkty_schronienia.csv` i `.xml`;
- kopię przez `api.dane.gov.pl/.../file` (identyczna bajtowo);
- archiwum ZIP dane.gov.pl z wersją z 10.03.2026;
- pliki Legionowa i Krosna.

**Analiza w Pythonie 3.9 (`python3 -I`, biblioteka standardowa):**
- profil kolumn;
- testy bbox, precyzji i duplikatów;
- odległość haversine od mediany gminy (gminy z ≥ 3 punktami, próg 30 km);
- porównanie wersji po `Identyfikator publiczny` (przesunięcie liczone przybliżeniem 111 km/° szer. i 70 km/° dł.).

**Liczby OSM:** Overpass API (`overpass-api.de`) z `out count`, obszar `ISO3166-1=PL`, oraz taginfo API v4.

**Teksty prawne:** PDF-y z `api.sejm.gov.pl/eli/acts/DU/...` przetworzone na tekst (pypdf), ustawa w HTML.

**Ograniczenia metody:**
- Bbox Polski jest prostokątem. Nie robiłem testu punkt-w-poligonie z granicami PRG.
- Nie widziałem interfejsu gdziesieukryc.pl (blokada antybotowa).
- Mam tylko dwie wersje zbioru do porównania.

## 7. Źródła

**Dane**
- [dane.gov.pl: zbiór 28058 „Punkty schronienia w Polsce”](https://dane.gov.pl/pl/dataset/28058,punkty-schronienia-w-polsce) · [API zbioru](https://api.dane.gov.pl/1.4/datasets/28058) · [API zasobów](https://api.dane.gov.pl/1.4/datasets/28058/resources) · [archiwum ZIP](https://api.dane.gov.pl/datasets/28058,punkty-schronienia-w-polsce/resources/files/download)
- [CSV źródłowy](https://gdziesieukryc.pl/PS_XML/punkty_schronienia.csv) · [XML harvestera](https://gdziesieukryc.pl/PS_XML/punkty_schronienia.xml)
- [WMS GUGiK „Schrony”](https://mapy.geoportal.gov.pl/wss/ext/Schrony?SERVICE=WMS&REQUEST=GetCapabilities) · [ogłoszenie GUGiK](https://www.geoportal.gov.pl/aktualnosci/nowa-usluga-schrony-dostepna-w-module-zarzadzanie-kryzysowe-w-serwisie-www-geoportal-gov-pl/)
- [Legionowo, zasób 2648378](https://api.dane.gov.pl/1.4/resources/2648378) · [Krosno, zbiór 3626](https://api.dane.gov.pl/1.4/datasets/3626)

**Prawo**
- [Ustawa o ochronie ludności i obronie cywilnej, Dz.U. 2024 poz. 1907](https://api.sejm.gov.pl/eli/acts/DU/2024/1907/text.html) · [metadane ELI i akty wykonawcze](https://api.sejm.gov.pl/eli/acts/DU/2024/1907)
- [Nowelizacja, Dz.U. 2026 poz. 646](https://api.sejm.gov.pl/eli/acts/DU/2026/646/text.pdf)
- [Rozp. MSWiA w sprawie Centralnej Ewidencji OZO, Dz.U. 2025 poz. 922](https://api.sejm.gov.pl/eli/acts/DU/2025/922/text.pdf)
- [Rozp. MSWiA w sprawie MDS, Dz.U. 2025 poz. 932](https://api.sejm.gov.pl/eli/acts/DU/2025/932/text.pdf)
- [Rozp. MSWiA w sprawie przygotowania OZO do użycia, Dz.U. 2025 poz. 933](https://api.sejm.gov.pl/eli/acts/DU/2025/933/text.pdf)
- [Rozp. MSWiA w sprawie kryteriów uznawania budowli ochronnych, Dz.U. 2025 poz. 235](https://api.sejm.gov.pl/eli/acts/DU/2025/235/text.pdf)
- [Rozp. MSWiA w sprawie warunków technicznych budowli ochronnych, Dz.U. 2025 poz. 1548](https://api.sejm.gov.pl/eli/acts/DU/2025/1548/text.pdf)

**Komunikaty i kontrole**
- [KW PSP Warszawa: „Gdzie się ukryć”, 23.12.2025](https://www.gov.pl/web/kwpsp-warszawa/gdzie-sie-ukryc--sprawdz-najblizsze-punkty-schronienia-ps)
- [MSWiA: nowe narzędzie, 22.12.2025](https://www.gov.pl/web/mswia/nowe-narzedzie-pomoze-znalezc-punkty-schronienia)
- [MSWiA: list intencyjny Cell Broadcast, 14.10.2026](https://www.gov.pl/web/mswia/minister-marcin-kierwinski-podpisal-list-intencyjny-ws-systemu-ostrzegania-ludnosci-cywilnej-cell-broadcast)
- [NIK: „W schronie się nie schronisz”, P/23/061](https://www.nik.gov.pl/najnowsze-informacje-o-wynikach-kontroli/budowle-ochronne-miejsca-ukrycia.html)
- [xyz.pl za PAP, 29.09.2026](https://xyz.pl/?p=255280) (źródło wtórne)
- [warszawa19115.pl: Miejsca doraźnego schronienia](https://warszawa19115.pl/en/-/miejsca-dora%C5%BAnego-schronienia)

**OSM i licencje**
- [OSM Wiki: shelter_type=bomb_shelter](https://wiki.openstreetmap.org/wiki/Tag:shelter_type=bomb_shelter) · [taginfo API](https://taginfo.openstreetmap.org/api/4/tag/stats?key=shelter_type&value=bomb_shelter) · [Overpass API](https://overpass-api.de/)
- [OSMF: Licence Compatibility](https://osmfoundation.org/wiki/Licence/Licence_Compatibility) · [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/legalcode.pl)
