# Framework "Gap Hunter" — AI-Driven Analiza Luk Rynkowych

## 0. FILOZOFIA FRAMEWORKU

Ten framework wykorzystuje AI do analizy kontekstowej zamiast sztywnych algorytmów.
Każdy krok zawiera:
- **INPUT** — co wchodzi do AI
- **BATCH STRATEGY** — jak porcjujemy dane
- **PROMPT** — instrukcja dla AI
- **OUTPUT** — oczekiwany rezultat

---

## 1. ŹRÓDŁA DANYCH

### A. Raporty z researchu
```
Źródło: Airtable (baza: appHKTIMXlnFNdCQj)
- FB Grupy: tbl5QE6tGQs67QKeW (pole: Raport)
- Reddit: tbljC9rBpXF0jXsb7 (pole: Raport)
Łącznie: ~194 raporty JSON
```

### B. Kontekst społeczności
```
Źródło: docs/faza-2-analiza/context/community-profile.md
Zawiera: realne dane o zasobach, kompetencjach, grupie docelowej
```

---

## 2. PIPELINE ANALIZY

### FAZA 1: EKSTRAKCJA I NORMALIZACJA

#### Krok 1.1: Parse raportów JSON

| Parametr | Wartość |
|----------|---------|
| **INPUT** | Surowe JSON z pola `Raport` z Airtable |
| **BATCH** | Wszystkie raporty naraz (to tylko parse, nie AI) |
| **METODA** | Kod (nie AI) — ekstrakcja strukturalna |

**Operacje (kod):**
1. Pobierz wszystkie rekordy z obu tabel
2. Parse JSON z pola `Raport`
3. Wyciągnij tablicę `problemy[]` z każdego raportu
4. Dodaj metadane źródła do każdego problemu:
   - `source_platform`: "FB" | "Reddit"
   - `source_name`: nazwa grupy/subreddita
   - `source_url`: URL
   - `report_date`: data analizy

**OUTPUT:** Lista ~2000-5000 pojedynczych problemów (flat structure)

---

#### Krok 1.2: Wstępna walidacja (kod)

| Parametr | Wartość |
|----------|---------|
| **INPUT** | Lista problemów z kroku 1.1 |
| **BATCH** | Wszystkie naraz (filtrowanie) |
| **METODA** | Kod — proste reguły |

**Reguły:**
- Odrzuć jeśli `problem` jest pusty/null
- Odrzuć jeśli `intensywnosc` i `sygnal_zakupowy` oba = 0
- Zachowaj nawet jeśli brakuje niektórych pól (AI uzupełni)

**OUTPUT:** Lista oczyszczonych problemów

---

### FAZA 2: KLASYFIKACJA LUK (AI-DRIVEN)

#### Krok 2.1: Klasyfikacja typu luki

| Parametr | Wartość |
|----------|---------|
| **INPUT** | Pojedynczy problem (wszystkie jego pola) |
| **BATCH** | **PROBLEM PO PROBLEMIE** (1 na call) |
| **KONTEKST** | Definicje typów luk (patrz prompt) |
| **MODEL** | Szybki (np. GPT-4o-mini, Claude Haiku) |

**PROMPT:**
```
Przeanalizuj ten problem użytkownika i określ typ luki rynkowej.

PROBLEM:
{{problem}}

OBECNE ROZWIĄZANIE:
{{obecne_rozwiazanie}}

DLACZEGO NIE DZIAŁA:
{{dlaczego_nie_dziala}}

TYPY LUK (wybierz 1-3 najbardziej pasujące):

1. BRAK_ROZWIAZANIA — nie istnieje żadne narzędzie/usługa rozwiązująca ten problem
2. ZA_DROGIE — rozwiązania istnieją ale są poza budżetem użytkownika
3. ZA_TRUDNE — rozwiązania wymagają umiejętności których użytkownik nie ma
4. ZA_WOLNE — rozwiązania zajmują zbyt dużo czasu
5. ZA_SLABA_JAKOSC — rozwiązania działają ale wyniki są niezadowalające
6. NIEDOSTEPNE — rozwiązanie nie jest dostępne (region, język, nisza)
7. BRAK_ZAUFANIA — użytkownik nie ufa dostępnym rozwiązaniom
8. FRAGMENTACJA — trzeba używać wielu narzędzi zamiast jednego

Odpowiedz w JSON:
{
  "typy_luk": ["TYP1", "TYP2"],
  "glowny_typ": "TYP1",
  "uzasadnienie": "Krótkie wyjaśnienie dlaczego te typy",
  "pewnosc": 0.0-1.0
}
```

**OUTPUT per problem:**
```json
{
  "problem_id": "...",
  "typy_luk": ["ZA_DROGIE", "ZA_TRUDNE"],
  "glowny_typ": "ZA_DROGIE",
  "uzasadnienie": "Użytkownik wspomina o budżecie i braku umiejętności",
  "pewnosc": 0.85
}
```

**UWAGA:** Przy ~3000 problemów = ~3000 API calls. Rozważ:
- Batching 5-10 problemów w jednym prompcie (mniejsza precyzja, niższy koszt)
- Cache'owanie podobnych problemów
- Threshold pewności — poniżej 0.6 oznacz do manual review

---

#### Krok 2.2: Abstrakcja problemu (grupowanie semantyczne)

| Parametr | Wartość |
|----------|---------|
| **INPUT** | Chunk 50-100 problemów z tej samej kategorii |
| **BATCH** | **CHUNKI PO 50-100** (pogrupowane po kategorii) |
| **KONTEKST** | Lista kategorii, dotychczasowe abstrakcje |
| **MODEL** | Średni (GPT-4o, Claude Sonnet) |

**PROMPT:**
```
Masz listę {{count}} problemów z kategorii "{{kategoria}}".

Twoim zadaniem jest:
1. Zgrupować semantycznie podobne problemy
2. Dla każdej grupy stworzyć "problem abstrakcyjny" — uogólnioną wersję

PROBLEMY:
{{lista_problemow_json}}

DOTYCHCZASOWE ABSTRAKCJE (dodaj do nich lub stwórz nowe):
{{existing_abstractions}}

Dla każdej grupy zwróć:
{
  "abstrakcja": "Uogólniony opis problemu (np. 'Brak narzędzi do automatyzacji raportowania')",
  "problem_ids": ["id1", "id2", ...],
  "keywords": ["słowo1", "słowo2"],
  "cross_branze": true/false,
  "confidence": 0.0-1.0
}

Odpowiedz jako JSON array grup.
```

**OUTPUT:**
```json
[
  {
    "abstrakcja_id": "abs_001",
    "abstrakcja": "Automatyzacja zbierania danych z wielu źródeł do raportów",
    "problem_ids": ["p_123", "p_456", "p_789"],
    "keywords": ["raport", "dane", "agregacja", "automatyzacja"],
    "cross_branze": true,
    "confidence": 0.9
  }
]
```

---

### FAZA 3: CROSS-SEGMENT PATTERN MINING

#### Krok 3.1: Wykrywanie wzorców międzybranżowych

| Parametr | Wartość |
|----------|---------|
| **INPUT** | Wszystkie abstrakcje z Fazy 2 + metadane branż |
| **BATCH** | **WSZYSTKIE ABSTRAKCJE NARAZ** (max ~200-500) |
| **KONTEKST** | Lista branż, macierz abstrakcja×branża |
| **MODEL** | Duży (GPT-4, Claude Opus) — wymaga szerokiego kontekstu |

**PROMPT:**
```
Masz {{count}} abstrakcji problemów z różnych branż.

ABSTRAKCJE:
{{abstrakcje_json}}

MACIERZ WYSTĘPOWANIA (abstrakcja → branże gdzie występuje):
{{matrix}}

Znajdź:
1. UNIWERSALNE PROBLEMY — występują w 3+ branżach
2. EMERGING PATTERNS — pojawiają się w 2 branżach ale rosną
3. NICHE GEMS — wysoka intensywność w 1 branży, potencjał do transferu

Dla każdego wzorca określ:
- Które branże dotyka
- Wspólny mianownik (dlaczego ten sam problem w różnych kontekstach)
- Potencjał na rozwiązanie cross-segment

Odpowiedz jako JSON:
{
  "uniwersalne": [...],
  "emerging": [...],
  "niche_gems": [...]
}
```

**OUTPUT:**
```json
{
  "uniwersalne": [
    {
      "pattern_id": "pat_001",
      "abstrakcja": "Automatyzacja raportowania",
      "branze": ["Marketing", "E-commerce", "Freelance", "Agencje"],
      "total_wzmianek": 127,
      "avg_intensywnosc": 4.2,
      "wspolny_mianownik": "Wszyscy muszą regularnie raportować klientom/przełożonym",
      "cross_segment_potential": "WYSOKI"
    }
  ]
}
```

---

### FAZA 4: WHITE SPACE IDENTIFICATION

#### Krok 4.1: Scoring pustych przestrzeni

| Parametr | Wartość |
|----------|---------|
| **INPUT** | Problemy gdzie `obecne_rozwiazanie` = "brak" lub podobne |
| **BATCH** | **CHUNKI PO 30-50 problemów** |
| **KONTEKST** | Definicja white space, metryki |
| **MODEL** | Średni |

**PROMPT:**
```
Przeanalizuj te problemy gdzie użytkownicy NIE MAJĄ rozwiązania.

PROBLEMY BEZ ROZWIĄZANIA:
{{problemy_json}}

Dla każdego oceń "White Space Score" (0-100) na podstawie:
- Intensywność bólu (jak bardzo przeszkadza)
- Sygnał zakupowy (czy zapłaciliby za rozwiązanie)
- Częstotliwość problemu (czy to jednorazowe czy recurring)
- Sentyment społeczności (czy inni potwierdzają problem)

Zwróć:
{
  "problem_id": "...",
  "white_space_score": 0-100,
  "scoring_breakdown": {
    "bol": 0-25,
    "zakup": 0-25,
    "recurring": 0-25,
    "walidacja": 0-25
  },
  "rekomendacja": "STRONG_OPPORTUNITY" | "WORTH_EXPLORING" | "WEAK" | "SKIP",
  "uzasadnienie": "..."
}
```

---

### FAZA 5: MAPOWANIE KONKURENCJI

#### Krok 5.1: Ekstrakcja konkurentów

| Parametr | Wartość |
|----------|---------|
| **INPUT** | Problemy gdzie `obecne_rozwiazanie` != "brak" |
| **BATCH** | **PROBLEM PO PROBLEMIE** (precyzyjna ekstrakcja) |
| **MODEL** | Szybki |

**PROMPT:**
```
Z tego opisu wyciągnij nazwy narzędzi/usług/firm które użytkownik próbował:

OBECNE ROZWIĄZANIE: {{obecne_rozwiazanie}}
DLACZEGO NIE DZIAŁA: {{dlaczego_nie_dziala}}

Zwróć JSON:
{
  "competitors": [
    {
      "nazwa": "CapCut",
      "typ": "narzędzie" | "usługa" | "osoba" | "workaround",
      "slabosci_wymienione": ["płatne funkcje", "prywatność"]
    }
  ],
  "brak_konkretnego_narzedzia": true/false
}
```

#### Krok 5.2: Agregacja słabości konkurentów

| Parametr | Wartość |
|----------|---------|
| **INPUT** | Wszystkie wyekstrahowane słabości pogrupowane per konkurent |
| **BATCH** | **PER KONKURENT** (wszystkie wzmianki o jednym narzędziu) |
| **MODEL** | Średni |

**PROMPT:**
```
Masz {{count}} wzmianek o narzędziu "{{competitor_name}}".

WZMIANKI I SŁABOŚCI:
{{mentions_json}}

Zagreguj i podsumuj:
1. Główne słabości (pogrupuj podobne)
2. Częstotliwość każdej słabości
3. Displacement potential — czy to dobry target do "wyparcia"?

Zwróć:
{
  "competitor": "{{competitor_name}}",
  "total_mentions": N,
  "slabosci": [
    {
      "kategoria": "Pricing",
      "opis": "Wprowadzanie opłat za wcześniej darmowe funkcje",
      "mentions": 12,
      "avg_intensity": 4.1
    }
  ],
  "displacement_potential": "HIGH" | "MEDIUM" | "LOW",
  "displacement_rationale": "..."
}
```

---

### FAZA 6: FILTROWANIE POD KONTEKST SPOŁECZNOŚCI

#### Krok 6.1: Ładowanie kontekstu

| Parametr | Wartość |
|----------|---------|
| **INPUT** | Plik `context/community-profile.md` |
| **BATCH** | Jednorazowo na początku analizy |
| **METODA** | Wczytanie + parse |

**Kontekst jest wstrzykiwany do wszystkich promptów w tej fazie.**

---

#### Krok 6.2: Scoring dopasowania

| Parametr | Wartość |
|----------|---------|
| **INPUT** | Top 100 luk/abstrakcji + pełny community-profile |
| **BATCH** | **CHUNKI PO 10-20 luk** (potrzebny pełny kontekst społeczności) |
| **MODEL** | Duży (wymaga rozumienia kontekstu biznesowego) |

**PROMPT:**
```
Oceń dopasowanie tych luk rynkowych do naszej społeczności.

KONTEKST SPOŁECZNOŚCI:
{{community_profile_content}}

LUKI DO OCENY:
{{luki_json}}

Dla każdej luki oceń (0-100 punktów):

1. GRUPA DOCELOWA (0-30 pkt)
   - Czy osoby z tym problemem to nasi ludzie?
   - Czy branża pasuje?

2. WYKONALNOŚĆ TECHNICZNA (0-25 pkt)
   - Czy umiemy to zbudować z naszymi kompetencjami?
   - Ile czasu/zasobów potrzeba?

3. POTENCJAŁ MONETYZACJI (0-25 pkt)
   - Jaki model biznesowy?
   - Czy ta grupa płaci za rozwiązania?

4. LEVERAGE SPOŁECZNOŚCI (0-20 pkt)
   - Czy możemy wykorzystać naszą społeczność do dystrybucji?
   - Czy mamy już content/wiedzę w tym temacie?

Zwróć per luka:
{
  "luka_id": "...",
  "total_score": 0-100,
  "breakdown": {...},
  "rekomendowany_model_biznesowy": "SaaS" | "Afiliacja" | "Marketplace" | "Kurs" | ...,
  "mvp_estimate": {
    "tech_stack": ["Make", "Airtable", ...],
    "czas_tygodnie": N,
    "poziom": "no-code" | "vibe-coding" | "custom-dev"
  },
  "red_flags": ["...", "..."],
  "quick_wins": ["...", "..."]
}
```

---

## 3. OUTPUT KOŃCOWY

### A. Struktura danych (TypeScript)

```typescript
interface GapHunterOutput {
  meta: {
    data_analizy: string;
    total_problemow_raw: number;
    total_abstrakcji: number;
    total_luk_scored: number;
    community_profile_version: string;
  };

  // Ranking główny
  top_opportunities: ScoredGap[];

  // Wzorce
  cross_segment_patterns: Pattern[];
  white_spaces: WhiteSpace[];
  displacement_targets: CompetitorWeakness[];

  // Surowe dane
  all_abstractions: Abstraction[];
  all_problems: Problem[];
}

interface ScoredGap {
  id: string;
  abstrakcja: string;

  // Metryki źródłowe
  total_wzmianek: number;
  avg_intensywnosc: number;
  avg_sygnal_zakupowy: number;
  branze: string[];

  // Klasyfikacja AI
  typy_luk: string[];
  white_space_score: number;

  // Dopasowanie do społeczności
  community_fit_score: number;
  community_fit_breakdown: {
    grupa_docelowa: number;
    wykonalnosc: number;
    monetyzacja: number;
    leverage: number;
  };

  // Rekomendacje AI
  rekomendowany_model: string;
  mvp_estimate: {
    tech_stack: string[];
    czas_tygodnie: number;
    poziom: string;
  };
  red_flags: string[];
  quick_wins: string[];

  // Dowody
  sample_cytaty: string[];
  sample_problemy: Problem[];
}
```

### B. Pliki wyjściowe

```
output/
├── gap-hunter-results.json      # Pełne wyniki
├── top-20-opportunities.md      # Human-readable summary
├── competitor-map.json          # Mapa konkurencji
└── validation-queue.json        # Problemy do manual review
```

---

## 4. KOSZTY I OPTYMALIZACJA

### Szacunkowe zużycie tokenów

| Faza | Calls | Tokens/call | Total | Model |
|------|-------|-------------|-------|-------|
| 2.1 Klasyfikacja luk | ~3000 | ~500 | 1.5M | Haiku |
| 2.2 Abstrakcja | ~60 | ~3000 | 180K | Sonnet |
| 3.1 Cross-segment | 1 | ~50K | 50K | Opus |
| 4.1 White space | ~100 | ~2000 | 200K | Sonnet |
| 5.1 Konkurenci | ~2000 | ~300 | 600K | Haiku |
| 5.2 Agregacja | ~50 | ~2000 | 100K | Sonnet |
| 6.2 Scoring | ~10 | ~5000 | 50K | Opus |

**Total: ~2.7M tokenów** (~$10-15 przy obecnych cenach)

### Optymalizacje

1. **Batching 2.1** — zamiast 1 problem/call, 5-10 problemów (ryzyko: niższa precyzja)
2. **Cache abstrakcji** — podobne problemy → ta sama abstrakcja
3. **Threshold filtering** — po Fazie 2 odrzuć problemy z niską intensywnością
4. **Incremental runs** — przy nowych danych analizuj tylko delta

---

## 5. NASTĘPNE KROKI IMPLEMENTACJI

1. [ ] Stworzyć `community-profile.md` z realnymi danymi
2. [ ] Napisać skrypt do pobierania raportów z Airtable
3. [ ] Implementować Fazę 1-2 (ekstrakcja + klasyfikacja)
4. [ ] Testować na sample 100 problemów
5. [ ] Iterować prompty na podstawie jakości outputu
6. [ ] Implementować pozostałe fazy
7. [ ] Zbudować dashboard do przeglądania wyników

---

*Framework v2.0 — AI-driven with batch specifications*
