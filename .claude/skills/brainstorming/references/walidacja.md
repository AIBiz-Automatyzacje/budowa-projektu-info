# Techniki walidacji pomysłów

---

## First Principles - Myślenie od podstaw

### Cel
Rozbić problem na fundamentalne prawdy i zbudować rozwiązanie od zera, bez dziedziczenia założeń.

### Kiedy stosować
- Pomysł opiera się na "tak się zawsze robiło"
- Kopiujesz istniejące rozwiązanie bez zastanowienia
- Czujesz, że są sztuczne ograniczenia

### Proces
1. **Identyfikacja założeń** - "Co zakładamy, że musi być prawdą?"
2. **Kwestionowanie** - "Czy to fundamentalna prawda, czy konwencja?"
3. **Szukanie fundamentów** - "Co jest niepodważalnie prawdziwe?"
4. **Budowanie od podstaw** - "Jak rozwiązać mając tylko fundamenty?"

### Rozróżnienie
- **Fundamentalna prawda** = prawa fizyki, logiki (nie da się zmienić)
- **Konwencja** = "tak się robi", normy (da się zmienić)

### Template
```
POMYSŁ: [...]

ZAŁOŻENIA:
1. [założenie]
2. [założenie]
3. [założenie]

KWESTIONOWANIE:
Założenie 1: [...]
→ Fundamentalna prawda czy konwencja? [...]
→ Dlaczego? [...]

FUNDAMENTY (co naprawdę potrzebne):
1. [fundamentalna potrzeba]
2. [fundamentalna potrzeba]
3. [fundamentalna potrzeba]

NOWE PODEJŚCIE (od fundamentów):
[jak spełnić potrzeby bez konwencji?]
```

### Przykład
```
Pomysł: Praca wymaga biura

Założenia:
- Praca = biuro 9-17
- Manager musi widzieć zespół

Kwestionowanie:
"Biuro konieczne?" → Konwencja (nie fundamentalna prawda)

Fundamenty:
- Komunikacja, współpraca, skupienie, koordynacja

Nowe podejście:
Remote-first + async + sync when needed
```

---

## Pre-mortem - Prospektywna autopsja

### Cel
Zidentyfikować przyczyny porażki ZANIM się wydarzy.

### Kiedy stosować
- Przed nieodwracalną decyzją
- Gdy stawka jest wysoka
- Gdy zespół jest zbyt optymistyczny

### Proces
1. **Założenie porażki** - "Jest rok później. Projekt DEFINITYWNIE się nie udał."
2. **Generowanie przyczyn** - "Co poszło nie tak?" (bez oceniania, 10-20 przyczyn)
3. **Priorytetyzacja** - Prawdopodobieństwo (1-5) × Wpływ (1-5) = Ryzyko
4. **Plan zapobiegania** - Dla top 3-5 ryzyk: jak zapobiec + mitygować

### Kategorie przyczyn
- Ludzie (kompetencje, odejścia, konflikty)
- Zasoby (budżet, czas, narzędzia)
- Rynek (konkurencja, klienci, timing)
- Wykonanie (scope creep, quality, communication)
- Zewnętrzne (recesja, partner, regulacje)

### Template
```
PROJEKT: [...]

ZAŁOŻENIE PORAŻKI:
"Jest [data za rok]. Projekt kompletnie się nie udał. [scenariusz porażki]"

PRZYCZYNY (każda kategoria):
LUDZIE: [...]
ZASOBY: [...]
RYNEK: [...]
WYKONANIE: [...]
ZEWNĘTRZNE: [...]

PRIORYTETYZACJA:
| Przyczyna | P (1-5) | I (1-5) | Ryzyko |
|-----------|---------|---------|--------|
| [...]     | X       | Y       | X×Y    |

TOP 5 RYZYK (≥12):

RYZYKO #1: [...]
Zapobieganie: [jak zmniejszyć P]
- [ ] [akcja] - [owner] - [deadline]
Mitygacja: [jak zmniejszyć I gdy się stanie]
- [ ] [akcja]
```

---

## Test Windy (Elevator Pitch)

### Cel
Wymusić klarowność poprzez ekstremalną syntezę - 30 sekund.

### Kiedy stosować
- Pomysł trudny do wyjaśnienia
- Gubisz się w szczegółach
- Nie wiesz co najważniejsze

### Proces
1. **30 sekund** - Wyjaśnij osobie, która nic nie wie
2. **Analiza luk** - Co pominąłeś? Co niejasne?
3. **WHAT-WHO-WHY** - CO to jest, DLA KOGO, DLACZEGO ważne
4. **Test na laiku** - Czy zrozumieliby i zapamiętali?

### Format pitcha
```
[DLA KOGO] którzy mają [PROBLEM],
[NAZWA] to [KATEGORIA]
która [KLUCZOWA KORZYŚĆ].
W przeciwieństwie do [ALTERNATYWA],
my [UNIKALNA WARTOŚĆ].
```

### Template
```
POMYSŁ: [...]

PITCH (30 sekund):
[napisz pitch]

ANALIZA:
- CO pominąłem? [...]
- CO było niejasne? [...]

STRUCTURE CHECK:
- CO to jest? [jedna zdanie]
- DLA KOGO? [konkretna grupa]
- DLACZEGO ważne? [problem rozwiązuje]

CZERWONE FLAGI:
□ Potrzebuję >30s
□ Zaczynam od kontekstu/tła
□ Używam "i" wielokrotnie
```

---

## Odwrócenie (Inversion)

### Cel
Spojrzeć na problem z przeciwnej strony - odkryć nieoczywiste rozwiązania.

### Kiedy stosować
- Utknęliśmy w myśleniu
- Wszystkie pomysły podobne
- Problem nierozwiązywalny

### Proces
1. **Odwróć cel** - Zamiast "jak osiągnąć X" → "jak zagwarantować NIE-X?"
2. **Anty-rozwiązania** - Co zrobić dla przeciwieństwa celu?
3. **Odwróć anty** - Jak uniknąć każdego anty-rozwiązania?
4. **Synteza** - Które najłatwiejsze i najskuteczniejsze?

### Template
```
CEL: [co chcesz osiągnąć]

ODWRÓCENIE: Jak zagwarantować PRZECIWIEŃSTWO?
[opisz przeciwieństwo celu]

ANTY-ROZWIĄZANIA (jak osiągnąć przeciwieństwo):
1. [anty-rozwiązanie]
2. [anty-rozwiązanie]
3. [anty-rozwiązanie]
4. [anty-rozwiązanie]

ROZWIĄZANIA (odwrócenie każdego):
1. [anty 1] → [jak uniknąć?] → [rozwiązanie]
2. [anty 2] → [jak uniknąć?] → [rozwiązanie]
3. [anty 3] → [jak uniknąć?] → [rozwiązanie]

TOP 3 ROZWIĄZANIA: [...]
```

### Przykład
```
Cel: Zwiększyć produktywność

Odwrócenie: Jak być MAKSYMALNIE nieproduktywnym?
- Ciągłe powiadomienia
- Spotkania bez agendy
- Multitasking
- Brak priorytetów

Rozwiązania (odwrócenie):
- Blokuj powiadomienia → Focus blocks
- Agenda przed spotkaniem → Clear objectives
- Single-tasking → Deep work sessions
- Jasne priorytety → Daily top 3
```

### Warianty
- **Czasowe**: "Co gdybym miał 10x więcej/mniej czasu?"
- **Zasobowe**: "Co gdybym miał nieograniczony/zerowy budżet?"
- **Skalowe**: "Co dla 1 osoby? Co dla 1M osób?"

---

## Stress Test - Test obciążeniowy

### Cel
Sprawdzić czy pomysł przetrwa w niesprzyjających warunkach.

### Kiedy stosować
- Pomysł działa w idealnych warunkach
- Niepewność co do skalowalności
- Szukasz punktu złamania

### Proces
1. **Zmienne** - Co może się zmienić? (skala, zasoby, warunki)
2. **Ekstrema** - Co jeśli 10x większe/mniejsze?
3. **Punkt złamania** - Kiedy przestaje działać?
4. **Wzmocnienie/pivot** - Jak przesunąć punkt lub zmienić?

### Scenariusze do przetestowania
- **Skala**: "100x więcej użytkowników jutro?"
- **Zasoby**: "Budżet spada 80%?"
- **Czas**: "Deadline skróci się o połowę?"
- **Konkurencja**: "Google/Amazon wchodzi w rynek?"
- **Regulacje**: "To zostanie zakazane/wymagane prawnie?"

### Template
```
POMYSŁ: [...]

ZMIENNA: [np. liczba użytkowników]
Obecnie: [X]
10x więcej: [10X] → Co się stanie? [...]
10x mniej: [X/10] → Co się stanie? [...]
Punkt złamania: [przy jakiej wartości załamuje się?]
Plan: [wzmocnienie lub pivot]

[Powtórz dla każdej zmiennej: skala, zasoby, czas, konkurencja, regulacje]

WNIOSKI:
- Najbardziej wrażliwe na: [...]
- Punkt złamania: [...]
- Konieczne wzmocnienie: [...]
```

---

## Matryca Decyzyjna

### Cel
Ustrukturyzować porównanie wielu opcji według istotnych kryteriów.

### Kiedy stosować
- 2-5 opcji do wyboru
- Różne opcje lepsze w różnych aspektach
- Decyzja subiektywna i trudna

### Proces
1. **Opcje** - Lista 2-5 podejść
2. **Kryteria** - Co ważne? (3-7 kryteriów)
3. **Wagi** - Które ważniejsze? (suma = 100%)
4. **Ocena** - Każdą opcję 1-5 dla każdego kryterium
5. **Obliczenie** - Suma (ocena × waga)
6. **Weryfikacja** - Czy zgadza się z intuicją?

### Template
```
OPCJE:
A: [...]
B: [...]
C: [...]

KRYTERIA (suma = 100%):
1. [kryterium] - [waga]%
2. [kryterium] - [waga]%
3. [kryterium] - [waga]%

TABELA:

| Kryterium (waga) | A | B | C |
|------------------|---|---|---|
| [X] (30%)        | 4 | 2 | 5 |
| [Y] (25%)        | 3 | 5 | 2 |
| [Z] (25%)        | 4 | 3 | 4 |
| [W] (20%)        | 2 | 4 | 3 |
|------------------|---|---|---|
| WYNIK            |3.X|3.X|3.X|

REKOMENDACJA: Opcja [X]
DLACZEGO: [...]
RYZYKA: [...]

WERYFIKACJA INTUICJI:
□ Wynik zgadza się z przeczuciem?
□ Jeśli nie - sprawdź wagi/oceny
```

### Przykład kryteriów
- Koszt, Czas, Ryzyko, Skalowalność, Prostota
- Team expertise, Maintenance, User experience
- ROI, Time to market, Strategic fit

---

## Zasady ogólne dla walidacji

**Faza 1: Wstępna (zawsze)**
- Test Windy + First Principles

**Faza 2: Głęboka (ważne decyzje)**
- Pre-mortem + Stress Test

**Faza 3: Wybór (alternatywy)**
- Matryca Decyzyjna + Odwrócenie (gdy utknęliśmy)

**Zasady:**
- Używaj 2-3 technik, nie wszystkich
- Zacznij od szybkich → głębsze
- Dokumentuj wnioski
- Zakończ decyzją + next steps