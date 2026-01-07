# Skrypty analizy problemów

Pipeline do analizy problemów z grup Facebook i subredditów Reddit.

## Wymagania

- Node.js
- `npm install` (dotenv, @anthropic-ai/sdk)
- Plik `.env` z kluczami:
  - `AIRTABLE_API_KEY`
  - `ANTHROPIC_API_KEY`

---

## Pipeline główny

Skrypty uruchamiane sekwencyjnie do pełnej analizy danych.

### 1. extract-all-problems.mjs

Ekstrakcja wszystkich problemów z Airtable z normalizacją kategorii.

```bash
node scripts/extract-all-problems.mjs
```

- **Input:** Airtable (tabele FB Grupy i Reddit)
- **Output:** `docs/faza-2-analiza/output/all-problems.json`

### 2. calculate-pps.mjs

Obliczanie Pain Priority Score (PPS) dla kategorii problemów z użyciem AI.

```bash
node scripts/calculate-pps.mjs
```

- **Input:** `aggregates.json`
- **Output:** `docs/faza-2-analiza/output/pps-rankings.json`

### 3. detect-patterns.mjs

Wykrywanie ukrytych wzorców w danych z użyciem AI.

```bash
node scripts/detect-patterns.mjs
```

- **Input:** `all-problems.json`, `pps-rankings.json`
- **Output:** `docs/faza-2-analiza/output/hidden-patterns.json`

---

## Narzędzia pomocnicze

Skrypty jednorazowe używane podczas budowania pipeline'u.

### aggregate-problems.mjs

Agregacja problemów według kategorii i branży. Generuje statystyki cross-platform.

- **Uwaga:** Używa hardcoded paths do `.claude/tool-results/`

### ai-mapping-planner.mjs

Planowanie mapowania kategorii z użyciem Claude AI. Analizuje niemapowane kategorie i sugeruje przypisania.

- **Uwaga:** Używa hardcoded paths do `.claude/tool-results/`

### extract-categories.mjs

Ekstrakcja unikalnych kategorii i branż z raportów do pliku JSON.

### diagnose-unmapped.mjs

Diagnostyka niemapowanych kategorii - pokazuje które kategorie nie mają przypisania w mapping.

### diagnose-deep.mjs

Głęboka diagnostyka danych - szczegółowa analiza struktury i jakości danych.

### check-nieznana.mjs

Sprawdzanie ile rekordów trafia do kategorii "Nieznana" i dlaczego.

### fix-nieznana.mjs

Naprawianie mapowania dla kategorii "Nieznana" z użyciem AI do reproponowania przypisań.
