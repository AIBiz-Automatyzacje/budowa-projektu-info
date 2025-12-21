# Pain Radar Framework — AI-Driven Bottom-Up Agregacja Problemów

## 0. FILOZOFIA FRAMEWORKU

Pain Radar to podejście "od dołu do góry" — zamiast szukać luk, agregujemy surowe problemy i pozwalamy wzorcom wyłonić się naturalnie.

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
Łącznie: ~194 raporty JSON, ~2000-5000 problemów
```

### B. Kontekst społeczności
```
Źródło: docs/faza-2-analiza/context/community-profile.md
Wstrzykiwany do promptów filtrujących w Fazie 4
```

---

## 2. PIPELINE ANALIZY

### FAZA 1: EKSTRAKCJA I NORMALIZACJA (KOD)

#### Krok 1.1: Pobranie i spłaszczenie danych

| Parametr | Wartość |
|----------|---------|
| **INPUT** | Wszystkie rekordy z Airtable |
| **BATCH** | Wszystkie naraz |
| **METODA** | Kod (nie AI) |

**Operacje:**
```
1. Fetch all records from FB Grupy table
2. Fetch all records from Reddit table
3. For each record:
   - Parse JSON from "Raport" field
   - Extract "problemy[]" array
   - Flatten to single list
   - Add metadata:
     - source_platform: "FB" | "Reddit"
     - source_name: group/subreddit name
     - source_url: URL
     - source_member_count: if available
     - report_date: analysis timestamp
```

**OUTPUT:**
```typescript
interface RawProblem {
  id: string;                    // generated UUID
  problem: string;
  kategoria: string;
  branza: string;
  intensywnosc: number;          // 1-5
  sygnal_zakupowy: number;       // 1-5
  obecne_rozwiazanie: string;
  dlaczego_nie_dziala: string;
  cytat_kluczowy: string;
  sentyment_spolecznosci: string;

  // Metadata
  source_platform: "FB" | "Reddit";
  source_name: string;
  source_url: string;
  report_date: string;
}
```

---

#### Krok 1.2: Walidacja i czyszczenie (kod)

| Parametr | Wartość |
|----------|---------|
| **INPUT** | Lista surowych problemów |
| **BATCH** | Wszystkie naraz |
| **METODA** | Kod — reguły walidacji |

**Reguły:**
```
KEEP if:
  - problem field is not empty/null
  - length(problem) > 10 characters

FILL DEFAULTS:
  - intensywnosc: 0 if missing → mark for AI estimation
  - sygnal_zakupowy: 0 if missing → mark for AI estimation
  - kategoria: "UNKNOWN" if missing → mark for AI classification

NORMALIZE:
  - trim whitespace
  - lowercase kategoria/branza for grouping
```

**OUTPUT:** Lista oczyszczonych problemów + lista problemów do uzupełnienia przez AI

---

### FAZA 2: WZBOGACANIE DANYCH (AI-DRIVEN)

#### Krok 2.1: Uzupełnianie brakujących pól

| Parametr | Wartość |
|----------|---------|
| **INPUT** | Problemy z brakującymi polami (intensywnosc=0 lub kategoria=UNKNOWN) |
| **BATCH** | **CHUNKI PO 20-30 problemów** |
| **MODEL** | Szybki (Haiku/GPT-4o-mini) |

**PROMPT:**
```
Uzupełnij brakujące dane dla tych problemów użytkowników.

PROBLEMY DO UZUPEŁNIENIA:
{{problemy_json}}

Dla każdego problemu oceń:

1. INTENSYWNOŚĆ (1-5): Jak bardzo ten problem przeszkadza?
   1 = drobna niedogodność
   3 = znaczący problem
   5 = krytyczny bloker

2. SYGNAŁ ZAKUPOWY (1-5): Czy zapłaciliby za rozwiązanie?
   1 = raczej nie, szukają darmowego
   3 = możliwe, zależy od ceny
   5 = zdecydowanie, aktywnie szukają

3. KATEGORIA: Przypisz jedną z:
   - Automatyzacja
   - Content/Tworzenie treści
   - Marketing/Sprzedaż
   - Produktywność
   - Narzędzia/Software
   - Finanse/Rozliczenia
   - Komunikacja/Współpraca
   - Edukacja/Rozwój
   - Inna: [nazwa]

Zwróć JSON array:
[
  {
    "problem_id": "...",
    "intensywnosc": N,
    "sygnal_zakupowy": N,
    "kategoria": "...",
    "confidence": 0.0-1.0,
    "reasoning": "krótkie uzasadnienie"
  }
]
```

**OUTPUT:** Uzupełnione problemy

---

#### Krok 2.2: Normalizacja kategorii i branż

| Parametr | Wartość |
|----------|---------|
| **INPUT** | Unikalne wartości kategorii i branż z całego datasetu |
| **BATCH** | **WSZYSTKIE UNIKALNE WARTOŚCI NARAZ** (max ~100-200) |
| **MODEL** | Średni |

**PROMPT:**
```
Masz listę kategorii i branż wyekstrahowanych z danych.
Wiele z nich to synonimy lub warianty.

KATEGORIE ({{count_kat}} unikalnych):
{{kategorie_list}}

BRANŻE ({{count_branz}} unikalnych):
{{branze_list}}

Stwórz mapę normalizacji:
1. Zgrupuj synonimy pod jedną kanoniczną nazwę
2. Zachowaj maksymalnie 15-20 kategorii i 20-25 branż
3. "Inne" dla outlierów

Zwróć JSON:
{
  "kategorie_mapping": {
    "automatyzacja raportów": "Automatyzacja",
    "auto raporty": "Automatyzacja",
    "content creation": "Content/Tworzenie treści",
    ...
  },
  "branze_mapping": {
    "marketing agency": "Marketing/Agencje",
    "agencja marketingowa": "Marketing/Agencje",
    ...
  },
  "kategorie_canonical": ["Automatyzacja", "Content/Tworzenie treści", ...],
  "branze_canonical": ["Marketing/Agencje", "E-commerce", ...]
}
```

**OUTPUT:** Słownik mapowania + lista kanonicznych kategorii/branż

---

### FAZA 3: AGREGACJA I METRYKI (HYBRID)

#### Krok 3.1: Grupowanie wielopoziomowe (kod)

| Parametr | Wartość |
|----------|---------|
| **INPUT** | Wszystkie znormalizowane problemy |
| **BATCH** | Wszystkie naraz (agregacja w pamięci) |
| **METODA** | Kod — GROUP BY |

**Operacje:**
```python
# A) GROUP BY kategoria
by_kategoria = {
    "Automatyzacja": {
        "count": 234,
        "problems": [...],
        "avg_intensywnosc": 4.1,
        "avg_sygnal": 3.8,
        "platforms": {"FB": 156, "Reddit": 78},
        "branze_breakdown": {"Marketing": 89, "E-commerce": 67, ...}
    },
    ...
}

# B) GROUP BY branza
by_branza = {...}

# C) GROUP BY (kategoria, branza) — matrix
matrix = {
    ("Automatyzacja", "Marketing"): {"count": 89, ...},
    ...
}
```

**OUTPUT:** Trzy struktury agregacji

---

#### Krok 3.2: Pain Priority Score (AI-assisted)

| Parametr | Wartość |
|----------|---------|
| **INPUT** | Agregaty z kroku 3.1 (top 50 kategorii) |
| **BATCH** | **WSZYSTKIE TOP 50 NARAZ** |
| **MODEL** | Średni |

**PROMPT:**
```
Masz agregaty problemów pogrupowane po kategorii.

AGREGATY:
{{agregaty_json}}

Oceń "Pain Priority Score" dla każdej kategorii.
NIE używaj sztywnej formuły — oceń holistycznie:

CZYNNIKI DO ROZWAŻENIA:
- Częstotliwość (ile razy problem się pojawia)
- Intensywność (jak bardzo boli)
- Sygnał zakupowy (gotowość do płacenia)
- Cross-platform (czy występuje na FB i Reddit)
- Cross-branza (czy dotyka wielu branż)
- Trend (czy to rosnący problem)

Zwróć ranking z uzasadnieniem:
[
  {
    "kategoria": "...",
    "pps_score": 0-100,
    "rank": 1,
    "scoring_rationale": "Dlaczego ten score",
    "key_insight": "Najważniejsza obserwacja",
    "red_flags": ["potencjalne problemy"],
    "opportunities": ["co można z tym zrobić"]
  }
]

Posortuj od najwyższego PPS.
```

**OUTPUT:** Ranking kategorii z AI-generated insights

---

#### Krok 3.3: Wykrywanie ukrytych wzorców (AI)

| Parametr | Wartość |
|----------|---------|
| **INPUT** | Sample 200-300 problemów (losowy lub stratified) |
| **BATCH** | **WSZYSTKIE 200-300 NARAZ** |
| **MODEL** | Duży (potrzebne rozumienie kontekstu) |

**PROMPT:**
```
Przeanalizuj te {{count}} problemów użytkowników.

PROBLEMY:
{{problemy_json}}

Szukam UKRYTYCH WZORCÓW — rzeczy które:
- Nie wynikają bezpośrednio z kategorii/branży
- Łączą pozornie różne problemy
- Wskazują na głębszą potrzebę

Przykłady wzorców do szukania:
- "Problemy z czasem" (za mało czasu, deadlines, wielozadaniowość)
- "Problemy z zaufaniem" (do narzędzi, do ludzi, do procesu)
- "Problemy ze skalą" (to co działało dla 10 klientów nie działa dla 100)

Znajdź 5-10 takich wzorców:
[
  {
    "pattern_name": "...",
    "pattern_description": "...",
    "problem_ids_examples": ["id1", "id2", ...],
    "affected_count_estimate": "~X% problemów",
    "cross_category": true/false,
    "underlying_need": "Głęboka potrzeba którą ten wzorzec ujawnia",
    "solution_direction": "W jakim kierunku szukać rozwiązania"
  }
]
```

**OUTPUT:** Lista ukrytych wzorców wykraczających poza kategorie

---

### FAZA 4: FILTROWANIE POD KONTEKST SPOŁECZNOŚCI

#### Krok 4.1: Ładowanie profilu społeczności

| Parametr | Wartość |
|----------|---------|
| **INPUT** | `context/community-profile.md` |
| **BATCH** | Jednorazowo |
| **METODA** | Wczytanie pliku |

---

#### Krok 4.2: Scoring dopasowania (AI)

| Parametr | Wartość |
|----------|---------|
| **INPUT** | Top 30 kategorii + pełny community-profile |
| **BATCH** | **WSZYSTKIE 30 NARAZ** (kontekst społeczności musi być widoczny) |
| **MODEL** | Duży |

**PROMPT:**
```
Oceń dopasowanie tych kategorii problemów do naszej społeczności.

PROFIL SPOŁECZNOŚCI:
{{community_profile_content}}

KATEGORIE DO OCENY (z metrykami):
{{kategorie_json}}

Dla każdej kategorii oceń:

1. TARGET FIT (0-30 pkt)
   - Czy to problemy NASZYCH ludzi?
   - Czy branże się pokrywają?

2. CAPABILITY FIT (0-25 pkt)
   - Czy umiemy to rozwiązać naszymi kompetencjami?
   - Jaki poziom techniczny wymagany?

3. MONETIZATION FIT (0-25 pkt)
   - Czy ta grupa płaci za rozwiązania?
   - Jaki model biznesowy pasuje?

4. DISTRIBUTION FIT (0-20 pkt)
   - Czy możemy dotrzeć do tych ludzi przez naszą społeczność?
   - Czy mamy już content w tym temacie?

Zwróć:
[
  {
    "kategoria": "...",
    "community_fit_total": 0-100,
    "fit_breakdown": {
      "target": N,
      "capability": N,
      "monetization": N,
      "distribution": N
    },
    "recommended_approach": "SaaS" | "Kurs" | "Narzędzie" | "Marketplace" | "Afiliacja" | ...,
    "quick_win_potential": "HIGH" | "MEDIUM" | "LOW",
    "mvp_complexity": "no-code" | "vibe-coding" | "custom-dev",
    "blockers": ["...", "..."],
    "advantages": ["...", "..."]
  }
]
```

**OUTPUT:** Ranking kategorii pod kątem dopasowania do społeczności

---

### FAZA 5: DEEP DIVE NA TOP KATEGORIE

#### Krok 5.1: Szczegółowa analiza top 10

| Parametr | Wartość |
|----------|---------|
| **INPUT** | WSZYSTKIE problemy z top 10 kategorii (może być 500-1000) |
| **BATCH** | **PER KATEGORIA** (50-150 problemów na call) |
| **MODEL** | Duży |

**PROMPT:**
```
Zrób głęboką analizę problemów w kategorii "{{kategoria}}".

WSZYSTKIE PROBLEMY ({{count}}):
{{problemy_json}}

Przeanalizuj:

1. SUB-KATEGORIE
   - Jakie pod-typy problemów istnieją?
   - Ile problemów w każdym pod-typie?

2. PERSONAS
   - Kto ma te problemy? (typy osób/firm)
   - Czy są różne persony z różnymi wariantami problemu?

3. SEVERITY DISTRIBUTION
   - Rozkład intensywności (ile critical vs minor)
   - Które pod-typy są najbardziej palące?

4. SOLUTION LANDSCAPE
   - Co ludzie próbowali?
   - Co działa częściowo?
   - Gdzie jest kompletna pustka?

5. BUYING BEHAVIOR
   - Kto aktywnie szuka rozwiązania?
   - Jakie budżety się pojawiają?
   - Co by ich przekonało do zakupu?

6. CYTATY (wybierz 5-10 najbardziej reprezentatywnych)

Zwróć:
{
  "kategoria": "...",
  "sub_categories": [...],
  "personas": [...],
  "severity_analysis": {...},
  "solution_landscape": {...},
  "buying_behavior": {...},
  "top_quotes": [...],
  "recommended_mvp": {
    "target_subcategory": "...",
    "target_persona": "...",
    "core_value_prop": "...",
    "features_must": [...],
    "features_nice": [...],
    "pricing_suggestion": "...",
    "go_to_market": "..."
  }
}
```

**OUTPUT:** Szczegółowa analiza per kategoria + draft MVP

---

## 3. OUTPUT KOŃCOWY

### A. Struktura danych

```typescript
interface PainRadarOutput {
  meta: {
    data_analizy: string;
    total_problemow_raw: number;
    total_po_walidacji: number;
    unique_kategorie: number;
    unique_branze: number;
    community_profile_version: string;
  };

  // Główne rankingi
  rankings: {
    by_pps: CategoryRanking[];           // Pain Priority Score
    by_community_fit: CategoryRanking[]; // Dopasowanie do społeczności
    by_opportunity: CategoryRanking[];   // Combined score
  };

  // Wzorce
  hidden_patterns: Pattern[];
  cross_platform_insights: Insight[];

  // Deep dives
  detailed_analyses: DetailedCategoryAnalysis[];

  // Agregaty
  aggregations: {
    by_kategoria: Record<string, Aggregate>;
    by_branza: Record<string, Aggregate>;
    matrix: MatrixCell[];
  };

  // Normalizacja
  mappings: {
    kategorie: Record<string, string>;
    branze: Record<string, string>;
  };

  // Surowe dane
  all_problems: Problem[];
}

interface CategoryRanking {
  kategoria: string;
  rank: number;
  score: number;
  metrics: {
    count: number;
    avg_intensywnosc: number;
    avg_sygnal: number;
    platform_coverage: number;
    branza_coverage: number;
  };
  ai_insights: {
    rationale: string;
    opportunities: string[];
    red_flags: string[];
  };
  community_fit?: {
    total: number;
    breakdown: Record<string, number>;
    recommended_approach: string;
  };
}

interface DetailedCategoryAnalysis {
  kategoria: string;
  problem_count: number;
  sub_categories: SubCategory[];
  personas: Persona[];
  solution_landscape: SolutionLandscape;
  recommended_mvp: MVPRecommendation;
  top_quotes: Quote[];
}
```

### B. Pliki wyjściowe

```
output/
├── pain-radar-results.json       # Pełne wyniki
├── category-rankings.md          # Human-readable ranking
├── top-10-deep-dives/            # Folder ze szczegółami
│   ├── 01-automatyzacja.md
│   ├── 02-content.md
│   └── ...
├── hidden-patterns.md            # Ukryte wzorce
└── decision-matrix.md            # Macierz decyzyjna
```

---

## 4. KOSZTY I OPTYMALIZACJA

### Szacunkowe zużycie tokenów

| Faza | Calls | Tokens/call | Total | Model |
|------|-------|-------------|-------|-------|
| 2.1 Uzupełnianie | ~50 | ~2000 | 100K | Haiku |
| 2.2 Normalizacja | 1 | ~5000 | 5K | Sonnet |
| 3.2 PPS Score | 1 | ~10K | 10K | Sonnet |
| 3.3 Ukryte wzorce | 1 | ~30K | 30K | Opus |
| 4.2 Community fit | 1 | ~15K | 15K | Opus |
| 5.1 Deep dives | ~10 | ~20K | 200K | Opus |

**Total: ~360K tokenów** (~$5-8)

### Optymalizacje

1. **Sampling w 3.3** — zamiast wszystkich problemów, stratified sample
2. **Parallel processing** — Fazy 2.1 i 3.1 mogą iść równolegle
3. **Incremental deep dives** — najpierw top 3, potem więcej jeśli potrzeba
4. **Cache mappings** — normalizacja kategorii raz, reuse

---

## 5. RÓŻNICE VS GAP HUNTER

| Aspekt | Pain Radar | Gap Hunter |
|--------|------------|------------|
| **Podejście** | Bottom-up (od problemów) | Top-down (od luk) |
| **Focus** | Co ludzie mówią | Czego brakuje na rynku |
| **Output** | Ranking kategorii | Ranking okazji |
| **Kiedy używać** | Eksploracja, discovery | Walidacja, decyzje |
| **Koszt** | ~$5-8 | ~$10-15 |

**Rekomendacja:** Uruchom Pain Radar najpierw (eksploracja), potem Gap Hunter na top kategoriach (walidacja).

---

## 6. NASTĘPNE KROKI IMPLEMENTACJI

1. [ ] Stworzyć `community-profile.md` z realnymi danymi
2. [ ] Napisać skrypt do pobierania i parsowania raportów
3. [ ] Implementować Fazę 1 (ekstrakcja, walidacja)
4. [ ] Implementować Fazę 2 (uzupełnianie, normalizacja)
5. [ ] Implementować Fazę 3 (agregacja, scoring)
6. [ ] Testować na pełnym datasecie
7. [ ] Implementować Fazę 4-5 (filtrowanie, deep dives)
8. [ ] Zbudować dashboard do przeglądania wyników

---

*Framework v2.0 — AI-driven with batch specifications*
