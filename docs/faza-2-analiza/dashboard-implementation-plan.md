# Dashboard Implementation Plan

> Single Page + Sticky Nav — wyniki research'u Akademii Automatyzacji

## Tech Stack

- **Vite** + **React 18** — build + UI
- **Tailwind CSS** — styling
- **Recharts** — wykresy
- **Lucide React** — ikony

## Dane źródłowe

```
docs/faza-2-analiza/output/
├── gap-hunter-lite-results.json   # Główny plik (merged)
├── gap-types-analysis.json        # Typy luk
├── competitor-map.json            # Konkurenci
└── aggregates.json                # Agregaty kategorii
```

---

## Plan krok po kroku

### 1. Setup projektu

```bash
npm create vite@latest dashboard -- --template react
cd dashboard
npm install recharts lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Sukces:** `npm run dev` działa na localhost:5173

---

### 2. Konfiguracja Tailwind

**tailwind.config.js:**
```js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: { extend: {} },
  plugins: [],
}
```

**src/index.css:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Sukces:** Klasy Tailwind działają

---

### 3. Kopiowanie danych

```bash
mkdir -p dashboard/src/data
cp docs/faza-2-analiza/output/gap-hunter-lite-results.json dashboard/src/data/results.json
cp docs/faza-2-analiza/output/gap-types-analysis.json dashboard/src/data/gapTypes.json
cp docs/faza-2-analiza/output/competitor-map.json dashboard/src/data/competitors.json
```

**Sukces:** JSON importowalny w React

---

### 4. Sticky Nav + Layout

**Pliki:**
- `src/components/StickyNav.jsx` — nawigacja przyklejona do góry
- `src/components/Section.jsx` — wrapper sekcji z ID

**Sukces:** Kliknięcie w nav scrolluje do sekcji

---

### 5. Sekcja Hero

**Plik:** `src/components/sections/Hero.jsx`

**Zawartość:**
- Tytuł + podtytuł "Od 4003 problemów do 7 pomysłów"
- 4 key metrics (problemy, źródła, MVP, STRONG_GO)

**Dane:** `results.json` → meta

**Sukces:** Hero z poprawnymi liczbami

---

### 6. Sekcja Faza 1

**Plik:** `src/components/sections/Phase1.jsx`

**Zawartość:**
- Źródła: 105 grup FB + 154 subredditów
- 8 segmentów badawczych
- Statystyki

**Dane:** Hardcoded z PLAN.md

**Sukces:** Widoczne źródła i statystyki

---

### 7. Sekcja Metodologia

**Plik:** `src/components/sections/Methodology.jsx`

**Zawartość:**
- Diagram: Pain Radar + Gap Hunter Lite
- Multi-model AI (4 modele)
- Combined Score wyjaśnienie

**Dane:** Hardcoded z PLAN.md

**Sukces:** Metodologia jasna, diagram czytelny

---

### 8. Wykresy

**Pliki:** `src/components/charts/`
- `FunnelChart.jsx` — 4003 → 370 → 40 → 7
- `GapTypesChart.jsx` — rozkład typów luk (pie/bar)
- `CompetitorsBar.jsx` — top 10 konkurentów
- `BubbleChart.jsx` — WS vs CF scatter (40 MVP)

**Dane:** `results.json`, `gapTypes.json`, `competitors.json`

**Sukces:** 4 interaktywne wykresy

---

### 9. TOP MVP Cards

**Plik:** `src/components/sections/TopMVP.jsx`

**Zawartość:**
- 7 kart STRONG_GO
- Każda: nazwa, score, typ luki, konkurenci, persona

**Dane:** `results.json` → top_opportunities (filter STRONG_GO)

**Sukces:** 7 kart z detalami

---

### 10. Tabela MVP

**Plik:** `src/components/sections/MVPTable.jsx`

**Zawartość:**
- Tabela 40 MVP
- Sortowanie, filtrowanie
- Kolumny: Rank, Name, WS, CF, Combined, Recommendation

**Dane:** `results.json` → all_opportunities

**Sukces:** Tabela sortowalna i filtrowalna

---

### 11. Integracja App.jsx

**Plik:** `src/App.jsx`

Złożenie wszystkich sekcji:
1. StickyNav
2. Hero
3. Phase1
4. Methodology
5. Charts
6. TopMVP
7. MVPTable

**Sukces:** Strona kompletna, nawigacja działa

---

### 12. Build & Deploy

```bash
npm run build
# Deploy na Vercel/Netlify
```

**Sukces:** Strona publiczna pod URL

---

## Checkpoints

| # | Co działa |
|---|-----------|
| CP1 (po kroku 3) | Projekt + Tailwind + dane |
| CP2 (po kroku 7) | Nav + sekcje tekstowe |
| CP3 (po kroku 8) | Wykresy |
| CP4 (po kroku 11) | Kompletna strona |
| CP5 (po kroku 12) | Opublikowane |

---

*Plan: 2026-01-06*
