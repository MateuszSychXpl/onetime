# XPL One-Time Text Share

XPL One-Time Text Share to prosta i bezpieczna aplikacja webowa umożliwiająca jednorazowe udostępnianie tekstu. Użytkownicy mogą stworzyć link do tekstu, który po jednokrotnym odczytaniu zostaje automatycznie usunięty.

## Funkcje

- Jednorazowe udostępnianie tekstu
- Opcjonalna ochrona PIN-em
- Automatyczne usuwanie wiadomości po odczytaniu
- Sanityzacja HTML w celu zapobiegania atakom XSS
- Proste i intuicyjne interfejsy użytkownika

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

## Autorzy

Mateusz Sych
