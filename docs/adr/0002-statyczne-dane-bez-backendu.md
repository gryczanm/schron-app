# Punkty schronienia jako statyczny plik w PWA, bez bazy i backendu

PWA musi pokazywać wszystkie punkty schronienia także bez sieci i nie może paść pod skokiem ruchu, gdy wyją syreny. Dlatego dane PSP zamieniamy na statyczny plik dołączony do aplikacji i serwowany z CDN, a nie trzymamy w bazie za API. Przeglądarka nie pobierze CSV bezpośrednio od PSP, bo `gdziesieukryc.pl` nie wysyła nagłówków CORS i ustawia `cross-origin-resource-policy: same-origin`. Plik powstaje więc po naszej stronie. Dane wyświetlamy tak, jak publikuje je PSP, bez poprawiania błędów.

## Considered Options

- **Postgres z publicznym API**: odrzucony. Offline i tak wymaga pobrania całego zbioru do klienta, a serwer jest pojedynczym punktem awarii akurat w chwili alarmu.
- **Postgres jako źródło danych ze statycznym eksportem**: odrzucony jako zbędny przy obecnym zakresie (samo wyświetlanie, bez aktualizacji ani zgłoszeń).
