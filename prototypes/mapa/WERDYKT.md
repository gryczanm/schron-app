# Werdykt prototypu mapy (2026-10-25)

**Pytanie:** jak ma wyglądać i działać mapa punktów schronienia: kolory, klastry, legenda/filtr, szczegóły punktu, „Prowadź”.

**Wybrany: wariant D** (`?variant=D`, commit b0cba7c):
- panel boczny: legenda Dostępności jako filtr z licznikami punktów w aktualnym widoku, pod nią szczegóły klikniętego punktu z przyciskiem „Prowadź”;
- kolory punktów (z rundy 1, wariant A): zielony = Całodobowa, pomarańczowy = Określone godziny, szary = Na żądanie; zwykłe kropki bez symboli;
- podkład OpenFreeMap Liberty, klastry barwione udziałem punktów Całodobowych (z rundy 1, wariant C);
- stopka: atrybucja KG PSP CC BY 4.0, data stanu danych, zastrzeżenie „nie jest schronem”.

**Odrzucone:** B (mapa ciepła + dolny arkusz) – w ogóle nie podobał się; E (pływająca legenda + dymek) – D wygrał.

**Otwarte, nieocenione w prototypie:** układ D na wąskim ekranie (panel nad mapą), polskie etykiety podkładu (Liberty pokazuje angielskie), symbole 24 / G / ? dla osób słabo rozróżniających kolory.

**Fakty z prototypu:** zwarty plik danych 87 724 punktów = 8,7 MB, 2,2 MB po gzip.

# Werdykt rundy 3: układ na telefonie (2026-10-25, #8)

**Pytanie:** jak zmieścić panel D (legenda-filtr, szczegóły punktu, stopka) razem z mapą na wąskim ekranie.

**Wybrany: wariant H** (`?variant=H`): na telefonie (do 700 px) mapa zajmuje cały ekran;
- legenda-filtr to trzy pływające przyciski u góry (kolor, liczba punktów w widoku, nazwa Dostępności), z prawej zostaje miejsce na przyciski mapy;
- karta punktu (jak w D, z „Prowadź” i „Zamknij”) wyjeżdża od dołu po dotknięciu punktu;
- przycisk „i” pod filtrem otwiera dolny arkusz z objaśnieniem filtra i klastrów oraz stopką (atrybucja KG PSP, data stanu, zastrzeżenie);
- na szerokim ekranie bez zmian: układ D.

**Odrzucone:** D na telefonie (panel nad mapą), F (podział 60/40), G (dolny arkusz z uchwytem), I (szuflada + pasek punktu).

**Znalezione przy okazji:** zwinięta atrybucja MapLibre 4.7 (`compact: true`) startuje rozwinięta i zasłania mapę, dopóki użytkownik jej nie przesunie. Trzeba zdjąć klasę `maplibregl-compact-show` zaraz po dodaniu kontrolki. Atrybucja stoi w prawym dolnym rogu, bo górę zajmuje filtr.

# Werdykt rundy 4: H na każdej szerokości, wybrany punkt i panel (2026-10-25, grillowanie)

Zastępuje „na szerokim ekranie bez zmian: układ D” z rundy 3. Stan w prototypie: `?variant=H`, commit 8aef94c.

**Układ (każda szerokość):**
- H jest jedynym układem. Panel boczny D znika także na komputerze.
- Filtr (trzy przyciski Dostępności) i „i” w lewym górnym rogu, najwyżej ok. 384 px szerokości, żeby mieścił się nad panelem bocznym.
- Dwa „i” zostają: nasze (objaśnienia, stopka) w lewym górnym rogu, atrybucja OSM w prawym dolnym. Naszego nie zmieniamy na „?”, bo „?” jest kandydatem na symbol „Na żądanie” w #9.

**Wybrany punkt:**
- Większy punkt w kolorze Dostępności z grubą ciemną obwódką (#0f172a), osobna warstwa nad klastrami, widoczna też po oddaleniu mapy.
- Mapa płynnie przesuwa się tak, żeby punkt był na środku widocznej części (nad panelem dolnym albo obok bocznego), bez zmiany przybliżenia.
- Wyłączenie w filtrze Dostępności wybranego punktu zamyka panel i odznacza punkt.

**Panel (jak w Google Maps):**
- Telefon (do 700 px): panel dolny na całą szerokość z uchwytem i dwiema wysokościami.
  - Podgląd: adres, Dostępność z opisem, „Prowadź”. Opis jest w podglądzie celowo: przy „Na żądanie” ostrzeżenie o niegwarantowanym dostępie nie może się chować za przeciągnięciem.
  - Rozwinięcie: dodatkowo gmina, a w przyszłości kolejne funkcje przy punkcie. Użytkownik chce mieć tu miejsce na rozbudowę. Wysokość dopasowana do treści, najwyżej ok. 85% ekranu.
  - Gesty: przeciągnięcie w górę rozwija, w dół zwija; przeciągnięcie w dół z podglądu zamyka panel; dotknięcie uchwytu przełącza wysokość.
- Komputer (od 700 px): panel boczny po lewej na całą wysokość, 400 px, z treścią pod filtrem. Jeden stan: od razu widać wszystko, co na telefonie jest w rozwinięciu.
- „i” otwiera objaśnienia i stopkę w tym samym panelu. Otwarcie „i” odznacza punkt, a wybór punktu zamyka „i”.
- Zamykanie: „×”, klik w puste miejsce mapy, Esc. Klik w inny punkt podmienia treść panelu.

**Pułapki do wdrożenia:**
- Zwinięta atrybucja MapLibre 4.7 rozwija się sama, gdy styl dostarczy pierwsze atrybucje. Zwinięcie zaraz po `addControl` nic nie daje. Trzeba zdjąć `maplibregl-compact-show` przy pierwszym `styledata`/`sourcedata`, po którym kontrolka ma klasę `maplibregl-compact`.
- Kontrolki MapLibre mają `z-index: 2`. Panele muszą leżeć nad nimi.
- Przesunięcie mapy rób przez `easeTo({ offset })`, nie `padding`, bo `padding` zostaje w mapie i przesuwa późniejsze przybliżenia klastrów.

**Zmiany w issues (do naniesienia, gdy zadziała GitHub):**
- #8: tytuł i zakres zmieniają się na „Układ H na każdej szerokości z panelem dolnym/bocznym”. Kryterium „układ desktopowy bez zmian” odpada. Dopisać wszystko z tej sekcji poza szczegółami karty punktu.
- #4: szczegóły punktu w panelu dolnym (podgląd i rozwinięcie) albo bocznym, zamiast w panelu bocznym D. Dopisać zaznaczenie punktu, przesunięcie mapy i sposoby zamykania. Opisy Dostępności bez zmian.
- #2: zamiast „szkieletu panelu wariantu D z tytułem i stopką” jest pełnoekranowa mapa z miejscem na pływający filtr i „i”. Stopka trafia pod „i”.
- #5: legenda-filtr to pływające przyciski w lewym górnym rogu (kolor, liczba w widoku, nazwa), a nie lista w panelu. Liczniki i działanie filtra bez zmian.
