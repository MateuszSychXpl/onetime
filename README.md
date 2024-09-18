# XPL One-Time Text Share

XPL One-Time Text Share to prosta i bezpieczna aplikacja webowa umożliwiająca jednorazowe udostępnianie tekstu. Użytkownicy mogą stworzyć link do tekstu, który po jednokrotnym odczytaniu zostaje automatycznie usunięty.

## Funkcje

- Jednorazowe udostępnianie tekstu
- Opcjonalna ochrona PIN-em
- Automatyczne usuwanie wiadomości po odczytaniu
- Sanityzacja HTML w celu zapobiegania atakom XSS
- Proste i intuicyjne interfejsy użytkownika
- API do integracji z innymi aplikacjami

## Wymagania

- Node.js (wersja 14 lub nowsza)
- npm (zwykle dostarczany z Node.js)

## Instalacja

1. Sklonuj repozytorium:
   ```
   git clone https://github.com/MateuszSychXpl/onetime.git
   cd onetime
   ```

2. Zainstaluj zależności:
   ```
   npm install
   ```

## Uruchomienie

1. Uruchom serwer:
   ```
   npm start
   ```

2. Otwórz przeglądarkę i przejdź pod adres `http://localhost:3000`

## Używanie

1. Na stronie głównej wpisz tekst, który chcesz udostępnić.
2. Opcjonalnie dodaj PIN do zabezpieczenia wiadomości.
3. Kliknij "Generate Link" aby utworzyć link do udostępnienia.
4. Skopiuj wygenerowany link i wyślij go odbiorcy.
5. Odbiorca może otworzyć link tylko raz, aby zobaczyć wiadomość.

## API

Aplikacja udostępnia API REST do integracji z innymi aplikacjami:

### Tworzenie wiadomości

- Metoda: POST
- Endpoint: `/api/share`
- Dane wejściowe: 
  ```json
  {
    "text": "Treść wiadomości",
    "pin": "Opcjonalny PIN"
  }
  ```
- Odpowiedź:
  ```json
  {
    "id": "ID wiadomości",
    "link": "Link do odczytu wiadomości"
  }
  ```

### Odczyt wiadomości

- Metoda: GET
- Endpoint: `/api/view/:id`
- Odpowiedź dla wiadomości bez PIN-u:
  ```json
  {
    "message": "Treść wiadomości"
  }
  ```
- Odpowiedź dla wiadomości z PIN-em:
  ```json
  {
    "pinProtected": true
  }
  ```

### Odczyt wiadomości chronionej PIN-em

- Metoda: POST
- Endpoint: `/api/view/:id`
- Dane wejściowe:
  ```json
  {
    "pin": "PIN do wiadomości"
  }
  ```
- Odpowiedź:
  ```json
  {
    "message": "Treść wiadomości"
  }
  ```

## Zabezpieczenia

- Wiadomości są przechowywane w pamięci i usuwane po odczytaniu.
- Tekst jest sanityzowany, aby zapobiec atakom XSS.
- Używamy helmet.js do poprawy bezpieczeństwa HTTP.
- PIN-y są haszowane przed zapisaniem.

## Rozwój

Aby uruchomić testy:

```
npm test
```

## TODO

Lista planowanych funkcji do implementacji:

1. Wygasanie wiadomości po określonym czasie
2. Szyfrowanie end-to-end
3. Powiadomienia e-mail
4. Podgląd wiadomości przed wysłaniem
5. Obsługa formatowania tekstu (Markdown lub WYSIWYG)
6. Wsparcie dla wielu języków
7. Statystyki dla nadawcy (czy wiadomość została odczytana)
8. Załączniki
9. Generowanie QR kodów dla linków
10. Tryb ciemny
11. Możliwość anulowania/usunięcia wiadomości przez nadawcę
12. Ograniczenie liczby prób wpisania PIN-u
13. Integracja z popularnymi komunikatorami
14. ✓ Wersja API (zaimplementowane)
15. Śledzenie historii wysłanych wiadomości dla nadawcy

## Licencja

Ten projekt jest licencjonowany na podstawie licencji MIT. Zobacz plik `LICENSE` po więcej szczegółów.

## Autorzy

Mateusz Sych

## Wkład

Wkłady są mile widziane! Proszę zapoznać się z `CONTRIBUTING.md` po więcej szczegółów.