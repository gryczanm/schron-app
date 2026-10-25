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
