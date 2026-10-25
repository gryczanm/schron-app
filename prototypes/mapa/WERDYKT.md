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
