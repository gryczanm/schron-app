# Raport wykonania zadań

Zestawienie zadań projektu schron-app: zadania z podzadaniami, wykonawcy, terminy, commity, dokumentacja i testy. Daty pochodzą z GitHuba (założenie zadania i merge do `main`). Stan na 28.11.2026.

## Zespół

| Login na GitHubie | Imię i nazwisko |
|---|---|
| gryczanm | Mateusz Gryczan |
| Kasia199797 | Katarzyna Milewska |
| marcelplonarepo | marcelplona |
| Damian777-programmer | Damian Przedlacki |
| norbertniemyjski-crypto | Norbert Niemyjski |
| Fmoczydlowski | Filip Moczydłowski |

Norbert Niemyjski i Filip Moczydłowski nie mieli zadań do 22.11.2026. Pierwsze zadania dostają w sprincie 23–29.11.2026.

## Do 22.11.2026

<table>
<thead>
<tr>
<th>Wykonanie zadań</th>
<th>Wykonawca</th>
<th>Raportowanie wykonania zadań</th>
<th>Terminy</th>
<th>Ładowanie wyników pracy do repozytorium</th>
<th>Dokumentacja</th>
<th>Testy</th>
</tr>
</thead>
<tbody>

<tr>
<td>
<a href="https://github.com/gryczanm/schron-app/issues/1">#1</a> <b>Spec: mapa punktów schronienia (PWA)</b>
<ul>
<li><a href="https://github.com/gryczanm/schron-app/issues/2">#2</a> <b>Punkty schronienia z CSV PSP na mapie, GitHub Pages</b></li>
<li><a href="https://github.com/gryczanm/schron-app/issues/3">#3</a> <b>Klastry barwione udziałem punktów Całodobowych</b></li>
<li><a href="https://github.com/gryczanm/schron-app/issues/4">#4</a> <b>Szczegóły punktu w panelu i przycisk „Prowadź”</b></li>
<li><a href="https://github.com/gryczanm/schron-app/issues/5">#5</a> <b>Legenda Dostępności jako filtr z licznikami</b></li>
<li><a href="https://github.com/gryczanm/schron-app/issues/6">#6</a> <b>Offline i instalacja aplikacji (PWA)</b></li>
<li><a href="https://github.com/gryczanm/schron-app/issues/7">#7</a> <b>Polskie etykiety podkładu mapy</b></li>
<li><a href="https://github.com/gryczanm/schron-app/issues/8">#8</a> <b>Układ panelu i mapy na telefonie</b> (prototyp, wchłonięty przez #2, #4, #5)</li>
<li><a href="https://github.com/gryczanm/schron-app/issues/9">#9</a> <b>Symbole Dostępności dla daltonistów</b> (prototyp, decyzja: nie)</li>
</ul>
</td>
<td>gryczanm - Mateusz Gryczan</td>
<td>
Zadania i przeglądy na GitHubie, PR-y:
<a href="https://github.com/gryczanm/schron-app/pull/11">#11</a>,
<a href="https://github.com/gryczanm/schron-app/pull/12">#12</a>,
<a href="https://github.com/gryczanm/schron-app/pull/13">#13</a>,
<a href="https://github.com/gryczanm/schron-app/pull/14">#14</a>,
<a href="https://github.com/gryczanm/schron-app/pull/16">#16</a>
</td>
<td>
<b>25.10.2026</b> – spec i podział na zadania<br>
<b>01.11.2026</b> – merge wszystkich PR-ów, aplikacja na GitHub Pages
</td>
<td>
<a href="https://github.com/gryczanm/schron-app/commit/aa51b0f">aa51b0f</a><br>
<a href="https://github.com/gryczanm/schron-app/commit/d7f35c2">d7f35c2</a><br>
<a href="https://github.com/gryczanm/schron-app/commit/ddfd0b2">ddfd0b2</a><br>
<a href="https://github.com/gryczanm/schron-app/commit/fa727d4">fa727d4</a><br>
<a href="https://github.com/gryczanm/schron-app/commit/5b5b403">5b5b403</a><br>
<a href="https://github.com/gryczanm/schron-app/commit/d8cd400">d8cd400</a><br>
<a href="https://github.com/gryczanm/schron-app/commit/a04fb37">a04fb37</a><br>
<a href="https://github.com/gryczanm/schron-app/commit/d26e9bf">d26e9bf</a><br>
<a href="https://github.com/gryczanm/schron-app/commit/ceadbe5">ceadbe5</a><br>
<a href="https://github.com/gryczanm/schron-app/commit/c271988">c271988</a><br>
<a href="https://github.com/gryczanm/schron-app/commit/87070c3">87070c3</a>
</td>
<td>
<a href="../GLOSSARY.md">Glosariusz</a><br>
<a href="adr/0001-bez-wlasnych-alarmow.md">ADR 0001: bez własnych alarmów</a><br>
<a href="adr/0002-statyczne-dane-bez-backendu.md">ADR 0002: statyczne dane bez backendu</a><br>
<a href="research/dane-o-schronach.md">Research: dane o schronach</a><br>
<a href="research/air-raid-alert-ukraina.md">Research: Air Raid Alert (Ukraina)</a><br>
<a href="research/popyt-i-luki-rynkowe.md">Research: popyt i luki rynkowe</a>
</td>
<td>
<a href="../src/dane/zbior.test.ts">Testy zbioru PSP, szczegółów, filtra i liczników</a><br>
<a href="../src/podklad.test.ts">Testy podkładu offline i polskich etykiet</a>
</td>
</tr>

<tr>
<td>
<a href="https://github.com/gryczanm/schron-app/issues/17">#17</a> <b>Materiały do strony głównej</b>
<ul>
<li><a href="https://github.com/gryczanm/schron-app/issues/18">#18</a> <b>Grafika na stronę główną</b></li>
<li><a href="https://github.com/gryczanm/schron-app/issues/19">#19</a> <b>Plik z poradami na wypadek alarmu</b></li>
</ul>
</td>
<td>Kasia199797 - Katarzyna Milewska</td>
<td>Zadania na GitHubie</td>
<td>
<b>21.11.2026</b> – założenie i wykonanie zadania
</td>
<td>
<a href="https://github.com/gryczanm/schron-app/commit/8248658">8248658</a>
</td>
<td>brak</td>
<td>
<a href="../src/dane/poradnik.test.ts">Test formatu pliku z poradami</a>
</td>
</tr>

<tr>
<td>
<a href="https://github.com/gryczanm/schron-app/issues/20">#20</a> <b>Strona główna aplikacji</b>
<ul>
<li><a href="https://github.com/gryczanm/schron-app/issues/21">#21</a> <b>Strona główna z przyciskiem „Przejdź do mapy”</b></li>
<li><a href="https://github.com/gryczanm/schron-app/issues/22">#22</a> <b>Statystyki punktów schronienia</b></li>
<li><a href="https://github.com/gryczanm/schron-app/issues/23">#23</a> <b>Sekcja „Co robić w razie alarmu”</b></li>
</ul>
</td>
<td>marcelplonarepo - marcelplona</td>
<td>Zadania na GitHubie</td>
<td>
<b>21.11.2026</b> – założenie i wykonanie zadania
</td>
<td>
<a href="https://github.com/gryczanm/schron-app/commit/f6b862e">f6b862e</a>
</td>
<td>brak</td>
<td>
<a href="../src/dane/poradnik.test.ts">Testy poradnika „Co robić w razie alarmu”</a><br>
<a href="../src/dane/zbior.test.ts">Testy statystyk zbioru</a>
</td>
</tr>

<tr>
<td>
<a href="https://github.com/gryczanm/schron-app/issues/24">#24</a> <b>Prowadzenie do punktu schronienia (działa bez internetu)</b>
<ul>
<li><a href="https://github.com/gryczanm/schron-app/issues/25">#25</a> <b>Najbliższy punkt schronienia</b> (otwarte)</li>
<li><a href="https://github.com/gryczanm/schron-app/issues/26">#26</a> <b>Mapa okolicy i trasa po ulicach bez internetu</b> (otwarte)</li>
<li><a href="https://github.com/gryczanm/schron-app/issues/27">#27</a> <b>Ekran nie gaśnie podczas Prowadzenia</b> (otwarte)</li>
<li><a href="https://github.com/gryczanm/schron-app/issues/28">#28</a> <b>Prowadzenie w innych językach</b> (otwarte)</li>
</ul>
</td>
<td>
gryczanm - Mateusz Gryczan (projekt, prototyp)<br>
Damian777-programmer - Damian Przedlacki (implementacja)
</td>
<td>
Zadanie na GitHubie, PR
<a href="https://github.com/gryczanm/schron-app/pull/29">#29</a>
</td>
<td>
<b>22.11.2026</b> – ustalenie zakresu, prototyp trzech wariantów, wybór wariantu C<br>
<b>22.11.2026</b> – merge PR-a, wdrożenie na GitHub Pages
</td>
<td>
<a href="https://github.com/gryczanm/schron-app/commit/2064168">2064168</a> (prototyp, gałąź <code>prototype/prowadzenie</code>)<br>
<a href="https://github.com/gryczanm/schron-app/commit/fafd0b8">fafd0b8</a><br>
<a href="https://github.com/gryczanm/schron-app/commit/68f1e5f">68f1e5f</a>
</td>
<td>
<a href="../GLOSSARY.md">Glosariusz: Prowadzenie</a><br>
<a href="research/popyt-i-luki-rynkowe.md">Research: luka #2</a>
</td>
<td>
<a href="../src/prowadzenie.test.ts">Testy odległości, kierunku, progu „na miejscu” i kompasu</a>
</td>
</tr>

</tbody>
</table>

Poza zakresem MVP, otwarte: <a href="https://github.com/gryczanm/schron-app/issues/10">#10</a> Wyszukiwarka miejscowości i gmin offline.

## Sprint 23–29.11.2026

Epik sprintu: <a href="https://github.com/gryczanm/schron-app/issues/35">#35</a>. Każde zadanie zmienia inne pliki, więc można je robić równolegle. W każdym issue jest opis, po co jest zadanie i screen „przed”. Wykonawca dopisuje screen „po” i link do PR-a.

<table>
<thead>
<tr>
<th>Wykonanie zadań</th>
<th>Wykonawca</th>
<th>Raportowanie wykonania zadań</th>
<th>Terminy</th>
<th>Ładowanie wyników pracy do repozytorium</th>
<th>Dokumentacja</th>
<th>Testy</th>
</tr>
</thead>
<tbody>

<tr>
<td>
<a href="https://github.com/gryczanm/schron-app/issues/31">#31</a> <b>Dodanie tłumaczeń UI aplikacji</b>
<ul>
<li><a href="https://github.com/gryczanm/schron-app/issues/32">#32</a> <b>Dodanie języka polskiego</b></li>
<li><a href="https://github.com/gryczanm/schron-app/issues/33">#33</a> <b>Dodanie języka angielskiego</b></li>
<li><a href="https://github.com/gryczanm/schron-app/issues/34">#34</a> <b>Dodanie języka niemieckiego</b></li>
</ul>
</td>
<td>Kasia199797 - Katarzyna Milewska</td>
<td>Zadania na GitHubie</td>
<td>
<b>28.11.2026</b> – założenie i wykonanie zadania
</td>
<td>
<a href="https://github.com/gryczanm/schron-app/commit/339eb18">339eb18</a>
</td>
<td>brak</td>
<td>
<a href="../src/dane/poradnik.test.ts">Testy poradnika w językach PL/EN/DE</a>
</td>
</tr>

<tr>
<td>
<a href="https://github.com/gryczanm/schron-app/issues/27">#27</a> <b>Ekran nie gaśnie podczas Prowadzenia</b>
</td>
<td>Damian777-programmer - Damian Przedlacki</td>
<td>Zadanie na GitHubie (w toku)</td>
<td>
<b>28.11.2026</b> – przydział w sprincie<br>
<b>29.11.2026</b> – termin wykonania
</td>
<td>do uzupełnienia</td>
<td><a href="screeny/sprint-23-29-11/prowadzenie-przed.png">Screen „przed”</a></td>
<td>do uzupełnienia</td>
</tr>

<tr>
<td>
<a href="https://github.com/gryczanm/schron-app/issues/36">#36</a> <b>Przycisk „Udostępnij” w panelu punktu</b>
</td>
<td>Kasia199797 - Katarzyna Milewska</td>
<td>Zadanie na GitHubie (w toku)</td>
<td>
<b>28.11.2026</b> – założenie zadania<br>
<b>29.11.2026</b> – termin wykonania
</td>
<td>do uzupełnienia</td>
<td><a href="screeny/sprint-23-29-11/panel-punktu-przed.png">Screen „przed”</a></td>
<td>do uzupełnienia</td>
</tr>

<tr>
<td>
<a href="https://github.com/gryczanm/schron-app/issues/37">#37</a> <b>Pulsujący wybrany punkt na mapie</b>
</td>
<td>norbertniemyjski-crypto - Norbert Niemyjski</td>
<td>Zadanie na GitHubie (w toku)</td>
<td>
<b>28.11.2026</b> – założenie zadania<br>
<b>29.11.2026</b> – termin wykonania
</td>
<td>do uzupełnienia</td>
<td><a href="screeny/sprint-23-29-11/panel-punktu-przed.png">Screen „przed”</a></td>
<td>do uzupełnienia</td>
</tr>

<tr>
<td>
<a href="https://github.com/gryczanm/schron-app/issues/38">#38</a> <b>Ciemny motyw</b>
</td>
<td>Fmoczydlowski - Filip Moczydłowski</td>
<td>Zadanie na GitHubie (w toku)</td>
<td>
<b>28.11.2026</b> – założenie zadania<br>
<b>29.11.2026</b> – termin wykonania
</td>
<td>do uzupełnienia</td>
<td><a href="screeny/sprint-23-29-11/ciemny-motyw-przed.png">Screen „przed”</a></td>
<td>do uzupełnienia</td>
</tr>

<tr>
<td>
<a href="https://github.com/gryczanm/schron-app/issues/39">#39</a> <b>Animowane statystyki na stronie głównej</b>
</td>
<td>marcelplonarepo - marcelplona</td>
<td>Zadanie na GitHubie (w toku)</td>
<td>
<b>28.11.2026</b> – założenie zadania<br>
<b>29.11.2026</b> – termin wykonania
</td>
<td>do uzupełnienia</td>
<td><a href="screeny/sprint-23-29-11/strona-glowna-przed.png">Screen „przed”</a></td>
<td>do uzupełnienia</td>
</tr>

<tr>
<td>
<a href="https://github.com/gryczanm/schron-app/issues/40">#40</a> <b>Raport wykonania zadań: sprint 23–29.11.2026</b>
</td>
<td>gryczanm - Mateusz Gryczan</td>
<td>Zadanie na GitHubie, PR z tym raportem</td>
<td>
<b>28.11.2026</b> – sekcja sprintu, wykonawcy z imionami, skład zespołu<br>
<b>29.11.2026</b> – uzupełnienie po zamknięciu zadań sprintu
</td>
<td>ten plik</td>
<td><a href="raport-zadan.md">Raport wykonania zadań</a></td>
<td>nie dotyczy</td>
</tr>

</tbody>
</table>
