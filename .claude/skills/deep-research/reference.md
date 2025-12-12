# Deep Research - Szczegolowa dokumentacja

## Pelna specyfikacja narzedzi

### SerpAPI - Zaawansowane uzycie

#### Dostepne silniki wyszukiwania

| Engine | Uzycie | Przyklad |
|--------|--------|----------|
| `google` | Ogolne wyszukiwanie | Wiekszosci zapytan |
| `google_news` | Aktualnosci | Ostatnie wydarzenia, trendy |
| `google_scholar` | Akademickie | Badania naukowe, publikacje |
| `google_images` | Obrazy | Wizualizacje, infografiki |
| `youtube` | Wideo | Tutoriale, prezentacje |

#### Przyklady wywolan

```json
// Podstawowe wyszukiwanie
{
  "params": {
    "q": "AI impact healthcare 2024",
    "engine": "google"
  },
  "mode": "complete"
}

// Wyszukiwanie newsow
{
  "params": {
    "q": "artificial intelligence regulations EU",
    "engine": "google_news"
  },
  "mode": "complete"
}

// Wyszukiwanie akademickie
{
  "params": {
    "q": "machine learning medical diagnosis",
    "engine": "google_scholar"
  },
  "mode": "complete"
}
```

#### Filtrowanie wynikow

```json
{
  "params": {
    "q": "climate change research",
    "engine": "google",
    "tbs": "qdr:y",  // ostatni rok
    "num": 20        // liczba wynikow
  },
  "mode": "compact"
}
```

### Playwright - Zaawansowane uzycie

#### Nawigacja i ekstrakcja

```
1. browser_navigate - przejdz do URL
2. browser_snapshot - pobierz strukture strony (accessibility tree)
3. browser_click - kliknij element (uzyj ref z snapshot)
4. browser_type - wpisz tekst
5. browser_take_screenshot - zrzut ekranu
```

#### Obsluga stron z JavaScript

```
Scenariusz: Strona laduje dane dynamicznie

1. mcp__playwright__browser_navigate(url)
2. mcp__playwright__browser_wait_for(time: 3)  // czekaj na zaladowanie
3. mcp__playwright__browser_snapshot()  // pobierz tresc
4. Jesli potrzeba scrollowania:
   - browser_press_key("PageDown")
   - browser_snapshot() ponownie
```

#### Interakcja z formularzami

```
1. browser_snapshot() - znajdz elementy formularza
2. browser_fill_form z fields:
   - name: "opis pola"
   - type: "textbox" | "checkbox" | "combobox"
   - ref: "ref z snapshot"
   - value: "wartosc"
```

#### Obsluga wielu zakladek

```
browser_tabs(action: "list")   - lista zakladek
browser_tabs(action: "new")    - nowa zakladka
browser_tabs(action: "select", index: 1)  - przejdz do zakladki
browser_tabs(action: "close")  - zamknij biezaca
```

## Graph of Thoughts - Implementacja szczegolowa

### Struktura stanu grafu

```json
{
  "nodes": {
    "n1": {
      "id": "n1",
      "text": "Poczatkowe pytanie badawcze",
      "score": 0,
      "type": "root",
      "depth": 0,
      "sources": [],
      "created_at": "timestamp"
    },
    "n2": {
      "id": "n2",
      "text": "Odkrycie z pierwszego wyszukiwania",
      "score": 7.5,
      "type": "generate",
      "depth": 1,
      "parent": "n1",
      "sources": ["url1", "url2"]
    }
  },
  "edges": [
    {"from": "n1", "to": "n2", "operation": "Generate"}
  ],
  "frontier": ["n2", "n3", "n4"],
  "best_score": 7.5,
  "iteration": 1
}
```

### Algorytm przechodzenia grafu

```
INICJALIZACJA:
  stworz root node z pytaniem badawczym
  frontier = [root]
  best_score = 0

PETLA GLOWNA:
  while best_score < 9.0 AND iteration < 5:

    1. SELEKCJA (wybierz z frontier):
       - posortuj frontier po score malejaco
       - wybierz top-3 wezly

    2. TRANSFORMACJA (dla kazdego wybranego):
       IF depth < 2:
         Generate(3) - stworz 3 nowe perspektywy
       ELIF score < 7:
         Refine(1) - ulepsz wezel
       ELIF multiple_good_paths:
         Aggregate(k) - polacz najlepsze

    3. OCENA:
       - ocen kazdy nowy wezel (0-10)
       - zaktualizuj best_score

    4. PRZYCINANIE:
       - KeepBestN(5) na kazdym poziomie glebokosci
       - usun slabe galezi z frontier

    5. AKTUALIZACJA:
       - dodaj nowe wezly do grafu
       - zaktualizuj frontier
       - iteration++

WYJSCIE:
  zwroc sciezke od root do najlepszego wezla
```

### Funkcje oceniania

#### Score dla pojedynczego wezla

```
score = (
  accuracy * 0.3 +      // dokladnosc twierdzen
  citation_density * 0.25 +  // gestosc cytowan
  source_quality * 0.2 +     // jakosc zrodel (A-E)
  completeness * 0.15 +      // kompletnosc odpowiedzi
  coherence * 0.1            // spojnosc narracji
)
```

#### Kryteria oceny

| Kryterium | 9-10 | 7-8 | 5-6 | 3-4 | 1-2 |
|-----------|------|-----|-----|-----|-----|
| Accuracy | Wszystko zweryfikowane | Wiekszosci | Polowa | Malo | Bledne |
| Citations | Kazde twierdzenie | Wiekszosci | Niektore | Rzadko | Brak |
| Sources | A-level | B-level | C-level | D-level | E-level |
| Complete | Pelne | Prawie | Czesciowe | Fragmenty | Minimalne |
| Coherent | Logiczny flow | Dobry | Akceptowalny | Slaby | Chaotyczny |

## Multi-Agent Orchestration

### Role agentow

#### 1. Planner Agent
```
Zadanie: Dekompozycja pytania badawczego

Input: Glowne pytanie + kontekst
Output: Lista 3-5 podtematow z priorytetami

Prompt:
"Podziel to pytanie badawcze na 3-5 niezaleznych podtematow:
[PYTANIE]

Dla kazdego podtematu okresl:
- Tytul
- Kluczowe pytania szczegolowe
- Sugerowane zrodla
- Priorytet (1-5)"
```

#### 2. Search Agent
```
Zadanie: Wyszukiwanie i ekstrakcja informacji

Input: Podtemat + zapytania
Output: Surowe odkrycia ze zrodlami

Narzedzia: mcp__serpapi__search, WebFetch, mcp__playwright__

Prompt:
"Zbadaj: [PODTEMAT]

1. Wykonaj 3-5 roznych wyszukiwan w SerpAPI
2. Dla kazdego wyniku:
   - Ocen relevantnosc (1-10)
   - Wyodrebnij kluczowe fakty
   - Zapisz cytowania
3. Zwroc strukturyzowany raport"
```

#### 3. Synthesis Agent
```
Zadanie: Laczenie odkryc w spojny narracje

Input: Odkrycia ze wszystkich Search Agents
Output: Zintegrowany raport

Prompt:
"Zsyntetyzuj te odkrycia:
[LISTA ODKRYC]

1. Zidentyfikuj wspolne tematy
2. Rozwiaz sprzecznosci
3. Stworz logiczny flow
4. Zachowaj wszystkie cytowania
5. Ocen pewnosc kazdego twierdzenia"
```

#### 4. Critic Agent
```
Zadanie: Weryfikacja i kontrola jakosci

Input: Raport syntezy
Output: Lista problemow + sugestie poprawek

Prompt:
"Zweryfikuj ten raport:
[RAPORT]

Sprawdz:
1. Czy kazde twierdzenie ma zrodlo?
2. Czy zrodla sa wiarygodne?
3. Czy sa sprzecznosci?
4. Czy sa luki w pokryciu?
5. Czy cytowania sa poprawne?

Zwroc liste problemow z sugestiami naprawy."
```

#### 5. Editor Agent
```
Zadanie: Koncowe polerowanie raportu

Input: Zweryfikowany raport + feedback
Output: Finalny, sformatowany dokument

Prompt:
"Przygotuj finalny raport:
[RAPORT + FEEDBACK]

1. Popraw bledy jezykowe
2. Ulepsz czytelnosc
3. Dodaj streszczenie wykonawcze
4. Sformatuj bibliografie
5. Stworz spis tresci"
```

### Koordynacja agentow

```
SEKWENCJA WYKONANIA:

1. [Planner] -> podtematy
   |
2. [Search x N] -> rownolegle, jeden na podtemat
   |
3. [Synthesis] -> polaczony raport
   |
4. [Critic] -> walidacja
   |
   +--> Jesli problemy: wracaj do [Search] dla brakujacych danych
   |
5. [Editor] -> finalny output
```

## Zaawansowane metodologie

### Chain-of-Density (CoD) Summarization

```
ITERACJA 1: Ekstrakcja kluczowych punktow (niska gestosc)
  "Artykul omawia wplyw AI na zatrudnienie"

ITERACJA 2: Dodanie szczegolow
  "Artykul omawia wplyw AI na zatrudnienie, wskazujac ze
   15% stanowisk moze byc zautomatyzowanych do 2030"

ITERACJA 3: Kompresja z zachowaniem informacji
  "AI zautomatyzuje 15% stanowisk do 2030 (McKinsey),
   glownie w produkcji i transporcie"

ITERACJA 4: Maksymalna gestosc
  "AI: 15% automatyzacji do 2030 (McKinsey);
   produkcja (-23%), transport (-18%), uslugi (+12%);
   re-skilling kluczowy (WEF 2024)"
```

### Chain-of-Verification (CoVe)

```
KROK 1: Wygeneruj twierdzenie
  "GPT-4 osiaga 90% dokladnosci w diagnostyce medycznej"

KROK 2: Stworz pytania weryfikacyjne
  - Jakie badanie to wykazalo?
  - Jaki byl rozmiar proby?
  - Jakie choroby badano?
  - Kto przeprowadzil badanie?

KROK 3: Wyszukaj odpowiedzi
  [uzyj SerpAPI z kazdym pytaniem]

KROK 4: Zrewiduj twierdzenie
  "GPT-4 osiaga 87.5% dokladnosci w diagnostyce
   dermatologicznej (n=1000, Stanford 2024, PMID: xxx)"
```

### ReAct Pattern

```
PETLA:

REASON: "Potrzebuje aktualnych danych o rynku AI w Polsce"
ACT: mcp__serpapi__search("rynek AI Polska 2024 raport")
OBSERVE: Znaleziono raporty McKinsey, PwC, PARP
REASON: "Powinienem sprawdzic kazde zrodlo"

ACT: WebFetch(url_mckinsey)
OBSERVE: Raport mowi o 8 mld PLN rynku
REASON: "Musze zweryfikowac te liczbe w innych zrodlach"

ACT: WebFetch(url_pwc)
OBSERVE: PwC mowi o 7.5 mld PLN
REASON: "Jest rozbieznosc, musze sprawdzic daty raportow"

...kontynuuj az do wystarczajacej pewnosci...
```

## Obsluga bledow i edge cases

### Gdy SerpAPI nie zwraca wynikow

```
1. Przeformuluj zapytanie (synonimy, inne slowa kluczowe)
2. Zmien engine (google -> google_news -> google_scholar)
3. Rozszerz zakres czasowy
4. Uzyj bardziej ogolnych terminow
```

### Gdy strona wymaga JavaScript

```
1. Sprobuj WebFetch najpierw
2. Jesli pusta tresc -> Playwright:
   a. browser_navigate
   b. browser_wait_for(time: 3-5)
   c. browser_snapshot
3. Jesli nadal pusta -> browser_take_screenshot i analizuj obraz
```

### Gdy zrodla sa sprzeczne

```
1. Ocen wiarygodnosc kazdego zrodla (A-E)
2. Sprawdz daty publikacji
3. Zidentyfikuj potencjalne konflikty interesow
4. Przedstaw obie perspektywy z wyjasnieniem
5. Wskaż która jest bardziej wiarygodna i dlaczego
```

### Gdy brakuje zrodel dla twierdzenia

```
1. NIE publikuj twierdzenia bez zrodla
2. Oznacz jako "wymaga weryfikacji"
3. Wykonaj dodatkowe wyszukiwania
4. Jesli nadal brak -> usun twierdzenie lub oznacz jako spekulatywne
```

## Optymalizacja wydajnosci

### Rownolegle wykonywanie

```
DOBRE:
- Uruchamiaj wszystkich Search Agents jednoczesnie
- Wykonuj niezalezne wyszukiwania SerpAPI rownolegle
- Przetwarzaj wiele stron Playwright w osobnych zakladkach

ZLE:
- Czekaj na wynik jednego agenta przed uruchomieniem kolejnego
- Sekwencyjne wyszukiwania dla niezaleznych podtematow
```

### Zarzadzanie kontekstem

```
1. Dziel duze raporty na mniejsze pliki
2. Zapisuj postep po kazdej fazie
3. Uzywaj TodoWrite do sledzenia zadan
4. Agreguj wyniki na koncu
```

### Cache i ponowne uzycie

```
1. Zapisuj wyniki wyszukiwan do plikow
2. Przed nowym wyszukiwaniem sprawdz czy juz nie masz danych
3. Uzywaj tych samych zrodel dla powiazanych pytan
```

## Struktura folderow - szczegolowa

```
RESEARCH/
└── [nazwa-projektu]/
    ├── README.md
    │   └── Przeglad projektu, linki do sekcji
    │
    ├── 00_executive_summary.md
    │   └── 1-2 strony, kluczowe wnioski, rekomendacje
    │
    ├── 01_full_report.md
    │   └── Pelny raport z wszystkimi sekcjami
    │
    ├── 02_methodology.md
    │   └── Opis procesu, narzedzi, ograniczen
    │
    ├── data/
    │   ├── raw_search_results.json
    │   ├── processed_findings.json
    │   └── statistics.md
    │
    ├── sources/
    │   ├── bibliography.md (pelna lista zrodel)
    │   ├── source_ratings.md (oceny A-E dla kazdego)
    │   └── screenshots/ (zrzuty waznych stron)
    │
    ├── agents/
    │   ├── planner_output.md
    │   ├── search_agent_1.md
    │   ├── search_agent_2.md
    │   ├── synthesis.md
    │   └── critic_feedback.md
    │
    └── graph/
        ├── graph_state.json (stan GoT)
        ├── iterations.md (log iteracji)
        └── best_path.md (optymalna sciezka)
```
