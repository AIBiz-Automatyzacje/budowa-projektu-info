# Plan: Dashboard Wizualizacyjny — TOP 20 Okazji Produktowych ✅ UKOŃCZONY

## Status: UKOŃCZONY (2026-01-07)

Dashboard zbudowany i gotowy do deploy. Pozostaje tylko wdrożenie na Vercel.

## Cel
Zbudować interaktywny dashboard pokazujący podróż od 4003 problemów do TOP 20 okazji produktowych. Dla widzów (~kilkaset osób) śledzących budowę projektu.

---

## Struktura (3 strony)

### 1. STRONA GŁÓWNA (TOP 20 + Deep Dive)
- Lejek danych (animowany)
- Grid 4×5 kafelków TOP 20
- Modal z deep dive po kliknięciu
- Heatmapa wskaźników
- Bubble chart 4D

### 2. FAZA 1: Zbieranie Danych
- Skąd dane (105 grup FB, 154 subredditów)
- 8 segmentów badawczych
- Proces scrapowania + AI raporty
- Statystyki końcowe

### 3. FAZA 2: Analiza
- Pain Radar (bottom-up)
- Gap Hunter Lite (top-down)
- Low-Code Product Finder
- Multi-model approach (4 modele)

---

## Strona Główna — Artefakty Wizualne

### 1. LEJEK (góra strony)

**Struktura wizualna:**
- SVG trapezoidalny kształt lejka (5 segmentów)
- Labele po lewej stronie, wyrównane do środka każdego segmentu
- Tylko liczby wewnątrz lejka (duże, czytelne)
- Gradient kolorów: slate → teal → cyan → amber

**Etapy lejka:**
| Etykieta | Wartość | Opis |
|----------|---------|------|
| Problemy źródłowe | 4003 | Wszystkie zebrane problemy |
| Zwalidowane | 1026 | Po filtracji (intensywność ≥3) |
| Okazje z 4 modeli AI | 417 | Wyniki analizy multi-model |
| Unikalne pomysły | 358 | Po deduplikacji |
| TOP 20 | 20 | Finalni kandydaci |

**Karty informacyjne pod lejkiem:**
- **Źródła danych:** 105 grup FB + 154 subredditów (z ikonami)
- **Analiza AI:** 4 modele (GPT-4o, Claude 3.5, Gemini 1.5, DeepSeek) + 2 frameworki (Pain Radar, Gap Hunter)

### 2. GRID TOP 20 (kafelki 4×5)
Każdy kafelek zawiera:
- Rank (#1, #2...)
- Nazwa produktu
- Score (pasek lub kropki)
- Badge wzorca (AI Generator, Simplifier, etc.)
- Kolor tła wg kategorii

### 3. MODAL (po kliknięciu kafelka)
Sekcje:
- **Header:** Nazwa + Score + Badges
- **Problem:** Cytat z danych źródłowych
- **Scores breakdown:** 6 pasków (problem_clarity, mvp_simplicity, ai_leverage, mobile_fit, monetization, competition_gap)
- **Gap Analysis:** Typ luki + konkurenci + displacement potential
- **Szansa:** Dlaczego warto + target persona + budget range
- **Rekomendacja:** Co zbudować (MVP) + tech stack + monetyzacja

### 4. HEATMAPA 2D
- **Wiersze (8):** problem_clarity, mvp_simplicity, ai_leverage, mobile_fit, monetization, competition_gap, white_space, community_fit
- **Kolumny (20):** TOP 20 produktów
- **Skala kolorów (nowa paleta):**
  - 0-20: rose (słaby)
  - 20-40: amber
  - 40-60: cyan
  - 60-80: teal-600
  - 80-100: teal-500 (świetny)
  - N/A: slate-800
- Interaktywna: hover pokazuje wartość

### 5. BUBBLE CHART 4D
- **Oś X:** MVP Simplicity (0-20)
- **Oś Y:** AI Leverage (0-20)
- **Rozmiar bańki:** Final Score (0-100)
- **Kolor bańki:** Wzorzec produktowy (nowa paleta bez fioletu)
  - teal: AI_GENERATOR
  - emerald: SIMPLIFIER
  - sky: AI_ASSISTANT
  - amber: AGGREGATOR
  - rose: MONITOR_ALERT
  - slate: TEMPLATE_PACK
- Hover: nazwa + wszystkie metryki
- Kliknięcie: otwiera modal

---

## Przygotowanie Danych

### Krok 1: Ekstrakcja i normalizacja

**Źródło A: lowcode-opportunities.json (402 rekordy)**
```javascript
{
  id: problem_id,
  name: product_concept.name,
  description: product_concept.description,
  pattern: pattern,
  scores: {
    problem_clarity: 0-20,
    mvp_simplicity: 0-20,
    ai_leverage: 0-20,
    mobile_fit: 0-15,      // UWAGA: inna skala!
    monetization: 0-15,    // UWAGA: inna skala!
    competition_gap: 0-10  // UWAGA: inna skala!
  },
  final_score: 0-100,
  model_count: 1-4,
  classification: "EXCELLENT" | "STRONG" | "GOOD",
  source: "lowcode"
}
```

**Źródło B: gap-hunter-lite-results.json (52 rekordy)**
```javascript
{
  id: mvp_id,
  name: mvp_name,
  description: core_value_prop,
  category: category,
  gap_type: gap_type_addressed,
  white_space_score: 0-100,
  community_fit_score: 0-123,  // UWAGA: inna skala!
  combined_score: 0-100,
  recommendation: "STRONG_GO" | "GO" | "CONSIDER" | "AVOID",
  competitors: main_competitors[],
  source: "gap-hunter"
}
```

### Krok 2: Unifikacja skal
```javascript
// Normalizacja do 0-100
mobile_fit_norm = (mobile_fit / 15) * 20      // 0-15 → 0-20
monetization_norm = (monetization / 15) * 20  // 0-15 → 0-20
competition_gap_norm = (competition_gap / 10) * 20  // 0-10 → 0-20
community_fit_norm = (community_fit_score / 123) * 100  // 0-123 → 0-100
```

### Krok 3: Formuła rankingu TOP 20
```javascript
UNIFIED_SCORE = (
  // Dla lowcode:
  final_score * 0.70 +
  (model_count / 4) * 30  // bonus za consensus

  // Dla gap-hunter:
  combined_score * 0.50 +
  (white_space_score / 100) * 25 +
  (community_fit_norm / 100) * 25
)

// Mapping klasyfikacji → waga
EXCELLENT / STRONG_GO = 1.0
STRONG / GO = 0.9
GOOD / CONSIDER = 0.8
AVOID = 0.5
```

### Krok 4: Deduplikacja
- Porównanie nazw (fuzzy matching)
- Jeśli duplikat → zachowaj rekord z wyższym UNIFIED_SCORE
- Merge pól: weź tech_stack z lowcode, white_space z gap-hunter

### Krok 5: Enrichment
Dla każdego TOP 20 dodaj z innych plików:
- `pps_score` z pps-rankings.json (mapowanie przez kategorię)
- `hidden_patterns` z hidden-patterns.json (top 3 pasujące)
- `personas` z deep-dive.json (top 3 personas)
- `budget_range` z deep-dive.json

### Output: dashboard-data.json
```javascript
{
  meta: {
    generated: "2026-01-06",
    total_sources: 454,
    unique_after_dedup: ~300,
    top_selected: 20
  },
  funnel: {
    problems: 4003,
    filtered: 1026,
    opportunities: 454,
    unique: 300,
    top: 20
  },
  top20: [
    {
      rank: 1,
      id: "...",
      name: "ProductBG Pro",
      tagline: "AI wymiana tła produktów e-commerce",
      pattern: "AI_GENERATOR",
      category: "E-commerce",

      // Scores (wszystkie 0-100 po normalizacji)
      unified_score: 95,
      scores_breakdown: {
        problem_clarity: 95,    // (19/20)*100
        mvp_simplicity: 75,
        ai_leverage: 100,
        mobile_fit: 67,
        monetization: 87,
        competition_gap: 70,
        white_space: null,      // brak w lowcode
        community_fit: null     // brak w lowcode
      },

      // Gap analysis
      gap_type: "ZA_WOLNE",
      competitors: ["Remove.bg", "Canva", "Photoroom"],
      displacement_potential: "MEDIUM",

      // Deep dive
      problem_quote: "Spędzam 2h dziennie na wycinaniu tła...",
      target_personas: ["E-com operator", "Fotograf produktowy"],
      budget_range: "200-500 PLN/msc",
      hidden_patterns: ["Przeciążenie czasowe", "Chaos narzędziowy"],

      // Rekomendacja
      mvp_description: "Upload 10 zdjęć → AI wymienia tła → download ZIP",
      tech_stack: "Next.js + Replicate API + Cloudinary + Stripe",
      monetization_model: "49 PLN/100 zdjęć lub 199 PLN/msc unlimited",

      // Metadata
      source: "lowcode",
      model_count: 4,
      classification: "EXCELLENT"
    },
    // ... pozostałe 19
  ]
}
```

---

## Tech Stack

| Warstwa | Technologia | Uzasadnienie |
|---------|-------------|--------------|
| Build | Vite | Szybki dev, hot reload |
| Framework | React 18 | Komponenty, state management |
| Styling | Tailwind CSS | Szybki styling, responsywność |
| Wykresy | Recharts | Heatmapa, bubble chart, funnel |
| Ikony | Lucide React | Lekkie, czytelne |
| Modal | Headless UI | Dostępność, animacje |
| Routing | React Router | 3 strony |
| Deploy | Vercel | Darmowy, szybki |

---

## Wąskie Gardła i Rozwiązania

### 1. Różne skale scoringu
**Problem:** lowcode ma 6 wymiarów (0-20, 0-15, 0-10), gap-hunter ma inne (0-100, 0-123)
**Rozwiązanie:** Skrypt normalizacyjny przed renderem. Wszystko do 0-100.

### 2. Brakujące pola między źródłami
**Problem:** lowcode nie ma white_space, gap-hunter nie ma tech_stack
**Rozwiązanie:** W heatmapie pokazuj null jako szary kolor. W modalu ukryj brakujące sekcje.

### 3. Duplikaty między źródłami
**Problem:** Ten sam produkt może być w obu plikach
**Rozwiązanie:** Fuzzy matching nazw + merge danych. Zachowaj wyższy score.

### 4. Wydajność heatmapy
**Problem:** 20 kolumn × 8 wierszy = 160 komórek z hover
**Rozwiązanie:** Virtualizacja nie potrzebna (mało danych). Proste CSS hover.

### 5. Bubble chart overlapping
**Problem:** Bańki mogą się nakładać gdy podobne wartości
**Rozwiązanie:** Recharts ma collision detection. Dodać zoom/pan dla eksploracji.

### 6. Responsywność
**Problem:** Grid 4×5 nie działa na mobile
**Rozwiązanie:**
- Desktop: 4×5
- Tablet: 2×10
- Mobile: 1×20 (lista)

### 7. Czas ładowania danych
**Problem:** Duże JSON-y (402 + 52 rekordy)
**Rozwiązanie:** Pre-procesowane dashboard-data.json z tylko TOP 20 + metadata. Lazy load pełnych danych.

---

## Kroki Implementacji

### Faza A: Przygotowanie danych (skrypt Node.js) ✅
1. [x] Napisać `scripts/prepare-dashboard-data.mjs`
2. [x] Załadować oba źródła JSON
3. [x] Znormalizować skale
4. [x] Połączyć i zdeduplikować
5. [x] Enrichment z pps, patterns, personas
6. [x] Obliczyć unified score
7. [x] Posortować i wybrać TOP 20
8. [x] Zapisać `dashboard-data.json`

### Faza B: Setup projektu ✅
9. [x] `npm create vite@latest dashboard -- --template react`
10. [x] Tailwind CSS setup
11. [x] React Router setup
12. [x] Skopiować dane do `src/data/`

### Faza C: Komponenty strony głównej ✅
13. [x] `<Funnel />` — animowany lejek
14. [x] `<TopGrid />` — siatka 4×5 kafelków
15. [x] `<ProductCard />` — pojedynczy kafelek
16. [x] `<ProductModal />` — modal ze szczegółami
17. [x] `<Heatmap />` — heatmapa 2D
18. [x] `<BubbleChart />` — bubble chart 4D

### Faza D: Podstrony ✅
19. [x] `<Phase1Page />` — Faza 1: Zbieranie danych
20. [x] `<Phase2Page />` — Faza 2: Analiza
21. [x] `<Navigation />` — nawigacja między stronami

### Faza E: Polish ✅
22. [x] ~~Responsywność (mobile/tablet)~~ — pominięte (tylko desktop)
23. [x] Animacje (Framer Motion)
24. [x] ~~SEO meta tags~~ — pominięte
25. [ ] Deploy na Vercel — **jedyny pozostały krok**

---

## Pliki do modyfikacji/utworzenia

```
live/
├── scripts/
│   └── prepare-dashboard-data.mjs    # NOWY - przygotowanie danych
├── dashboard/                         # NOWY - cały folder
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── src/
│   │   ├── data/
│   │   │   └── dashboard-data.json   # wygenerowane przez skrypt
│   │   ├── components/
│   │   │   ├── Funnel.jsx
│   │   │   ├── TopGrid.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductModal.jsx
│   │   │   ├── Heatmap.jsx
│   │   │   ├── BubbleChart.jsx
│   │   │   └── Navigation.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── Phase1Page.jsx
│   │   │   └── Phase2Page.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── index.html
└── docs/faza-2-analiza/
    └── dashboard-implementation-plan.md  # AKTUALIZACJA
```

---

## Szacowany nakład pracy

| Faza | Czas |
|------|------|
| A: Przygotowanie danych | 1-2h |
| B: Setup projektu | 30min |
| C: Komponenty główne | 3-4h |
| D: Podstrony | 2h |
| E: Polish | 1-2h |
| **RAZEM** | ~8-10h |

---

## Decyzje

- **Język:** Polski (dla społeczności AA)
- **Filtry:** Nie — prosty widok bez filtrowania
- **Export:** Nie — dane dostępne w repo
- **Sortowanie:** Po unified_score DESC

---

## Paleta Kolorów (Redesign v2)

**Założenie:** Usunięcie fioletu, spójna paleta Teal + Cyan + Amber

### Kolory główne
| Rola | Kolor | Hex | Użycie |
|------|-------|-----|--------|
| Primary | Teal | `#14B8A6` | Logo, akcenty, linki aktywne |
| Secondary | Cyan | `#06B6D4` | Gradienty, przejścia |
| Accent | Amber | `#F59E0B` | Wyróżnienia, TOP 20, CTA |
| Success | Emerald | `#10B981` | Wysokie score'y |
| Warning | Rose | `#F43F5E` | Niskie score'y |
| Neutral | Slate | `#64748B` | Tła, bordery, tekst pomocniczy |

### Kolory wzorców produktowych
| Pattern | Kolor | Hex |
|---------|-------|-----|
| AI_GENERATOR | Teal | `#14B8A6` |
| SIMPLIFIER | Emerald | `#10B981` |
| AI_ASSISTANT | Sky | `#0EA5E9` |
| AGGREGATOR | Amber | `#F59E0B` |
| MONITOR_ALERT | Rose | `#F43F5E` |
| TEMPLATE_PACK | Slate | `#64748B` |

### Gradient lejka
```
Slate-700 → Slate-600 → Teal-700 → Teal-600 → Teal-500 → Cyan-500 → Amber-500
```

---

## Redesign v3: Premium UI/UX (2026-01-07)

### Cel redesignu
Transformacja z generycznego "AI slop" do wyrafinowanego, production-grade interfejsu z charakterystyczną estetyką.

### 1. Typografia

| Rola | Font | Użycie |
|------|------|--------|
| Display | **Clash Display** (Fontshare) | Nagłówki, tytuły sekcji, ranki |
| Body | **Plus Jakarta Sans** (Google) | Tekst ogólny, opisy, labels |
| Mono | **JetBrains Mono** (Google) | Liczby, score'y, dane, kod |

```html
<!-- index.html -->
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<link href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap" rel="stylesheet">
```

### 2. Atmosfera i tło

**Wielowarstwowe tło:**
- **Gradient mesh:** Radial gradienty (teal/cyan/amber/rose) tworzące atmosferę
- **Noise overlay:** SVG feTurbulence (3% opacity, mix-blend-mode: overlay)
- **Grid pattern:** Geometryczna siatka 60×60px (3% opacity teal)
- **Background attachment:** Fixed dla efektu parallax

```css
body {
  background-image:
    radial-gradient(at 40% 20%, rgba(20, 184, 166, 0.12) 0px, transparent 50%),
    radial-gradient(at 80% 0%, rgba(14, 165, 233, 0.08) 0px, transparent 50%),
    radial-gradient(at 0% 50%, rgba(245, 158, 11, 0.06) 0px, transparent 50%),
    radial-gradient(at 100% 100%, rgba(244, 63, 94, 0.05) 0px, transparent 40%);
  background-attachment: fixed;
}
```

### 3. Glassmorphism

**Dwie klasy efektów szkła:**

```css
/* Glass podstawowy (nawigacja, tooltips) */
.glass {
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(71, 85, 105, 0.5);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.05);
}

/* Glass card (karty produktów, sekcje) */
.glass-card {
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(71, 85, 105, 0.4);
  box-shadow: 0 0 60px -20px rgba(20, 184, 166, 0.15);
}
```

### 4. Navigation

**Zmiany:**
- Glassmorphism zamiast solid bg
- Większe logo (12×12) z pulsującą ikoną Sparkles
- Animated underline dla aktywnego linku (layoutId)
- Entrance animation (slide from top)
- Font-display dla tytułu, font-mono dla tagline

### 5. ProductCard — Hero Variant

**TOP 3 produkty wyświetlane jako "hero cards":**

| Cecha | Standard Card | Hero Card |
|-------|---------------|-----------|
| Rozmiar | 1 kolumna | 1 kolumna (ale większa wysokość) |
| Border | 0.5px | Animated gradient border |
| Glow | hover only | Pulsujący (3s cycle) |
| Rank badge | 10×10 | 14×14 z ikoną (Crown/Zap/Star) |
| CTA | Text only | Gradient button |
| Tytuł | text-lg | text-2xl |
| Score | text-2xl | text-4xl |

**Ikony podium:**
- #1: Crown (korona)
- #2: Zap (błyskawica)
- #3: Star (gwiazda)

### 6. TopGrid — Sekcje

**Podział na dwie sekcje:**
1. **"Podium TOP 3"** — 3 hero cards w 3-kolumnowym gridzie
2. **"Pozostałe okazje"** — 17 standardowych kart w 5-kolumnowym gridzie

**Separator:** Gradient line z tekstem "Pozostałe okazje"

### 7. Funnel — Particles Effect

**Nowe elementy:**
- **Particles:** 20 animowanych cząsteczek płynących przez lejek
- **Icons:** Każdy etap ma ikonę (Database, Filter, Sparkles, Fingerprint, Trophy)
- **Glow filter:** SVG feGaussianBlur na ostatnim segmencie (TOP 20)
- **Highlight edges:** Subtelne białe linie na górnych krawędziach segmentów
- **Font:** JetBrains Mono dla liczb

### 8. Heatmap — Większe komórki

**Zmiany:**
- Wysokość komórek: 8→10 (h-10)
- Wartości widoczne wewnątrz komórek (font-mono)
- Emoji przy metrykach (🎯⚡🤖📱💰🎪)
- Pulse animation dla wartości ≥80
- Glass-card container z headerem
- TOP 3 wyróżnione kolorem amber w headerze

### 9. HomePage — Hero Header

**Nowy layout:**
- Badge "Analiza 4 modeli AI" z ikoną Sparkles
- Gradient text (from-white via-slate-200 to-slate-400)
- Kolorowe liczby w opisie (teal: 4003, sky: 105, amber: 154)
- Animated scroll indicator (ArrowDown)
- Sekcje z fade-in on scroll (whileInView)

### 10. Custom Scrollbar

```css
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: #0f172a; }
::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 9999px;
  border: 2px solid transparent;
  background-clip: content-box;
}
```

---

## Log Implementacji

| Data | Status | Opis |
|------|--------|------|
| 2026-01-06 | ✅ | Faza A: Skrypt prepare-dashboard-data.mjs - 402 lowcode + 15 gap-hunter → 358 unikalnych → TOP 20 |
| 2026-01-06 | ✅ | Faza B: Setup Vite + React + Tailwind + React Router |
| 2026-01-06 | ✅ | Faza C: Wszystkie 6 komponentów głównych |
| 2026-01-06 | ✅ | Faza D: 3 strony + nawigacja |
| 2026-01-06 | 🔧 | Bugfix: pattern może być tablicą lub stringiem - naprawiono getMainPattern() |
| 2026-01-06 | 🎨 | **Redesign v2:** Nowa paleta kolorów Teal + Cyan + Amber (usunięto fiolet) |
| 2026-01-06 | 🎨 | **Redesign v2:** Przeprojektowany lejek - SVG trapezoidalny, labele po lewej, tylko liczby w środku |
| 2026-01-06 | 🎨 | **Redesign v2:** Dodano karty informacyjne pod lejkiem (źródła danych + modele AI) |
| 2026-01-06 | 🎨 | **Redesign v2:** Nowe etykiety lejka: Problemy źródłowe → Zwalidowane → Okazje z 4 modeli AI → Unikalne pomysły → TOP 20 |
| 2026-01-06 | 🎨 | **Redesign v2:** Zaktualizowane kolory w: Navigation, ProductCard, ProductModal, Heatmap, BubbleChart |
| 2026-01-07 | ✨ | **Animacje Framer Motion:** Funnel (liczniki, segmenty), TopGrid (staggered), ProductCard (hover, score bar), ProductModal (AnimatePresence), Heatmap (row/cell stagger), BubbleChart (legend, chart entrance) |
| 2026-01-07 | 🎨 | **Redesign v3:** Typografia premium (Clash Display + Plus Jakarta Sans + JetBrains Mono) |
| 2026-01-07 | 🎨 | **Redesign v3:** Atmosfera tła (gradient mesh + noise overlay + grid pattern) |
| 2026-01-07 | 🎨 | **Redesign v3:** Glassmorphism (.glass + .glass-card) |
| 2026-01-07 | 🎨 | **Redesign v3:** Navigation z animated underline i entrance animation |
| 2026-01-07 | 🎨 | **Redesign v3:** Hero cards dla TOP 3 (Crown/Zap/Star icons, gradient borders) |
| 2026-01-07 | 🎨 | **Redesign v3:** TopGrid podział na "Podium TOP 3" + "Pozostałe okazje" |
| 2026-01-07 | 🎨 | **Redesign v3:** Funnel particles effect + ikony przy labelach |
| 2026-01-07 | 🎨 | **Redesign v3:** Heatmap większe komórki z wartościami + emoji icons |
| 2026-01-07 | 🎨 | **Redesign v3:** HomePage hero header z gradient text + scroll indicator |
| 2026-01-07 | 🎨 | **Redesign v3:** Custom scrollbar styling |
| 2026-01-07 | 🔧 | Bugfix: @apply font-display nie działa w Tailwind - zmieniono na czysty CSS |

---

## Aktualna struktura komponentów

```
src/
├── components/
│   ├── Funnel.jsx         # SVG lejek z particles + animated counters
│   ├── TopGrid.jsx        # Hero section (TOP 3) + Regular grid
│   ├── ProductCard.jsx    # Standard + Hero variant
│   ├── ProductModal.jsx   # Glassmorphism modal z RadarChart
│   ├── Heatmap.jsx        # Grid z wartościami + emoji icons
│   ├── Navigation.jsx     # Glassmorphism nav z animated underline
│   └── Footer.jsx         # Stopka
├── pages/
│   ├── HomePage.jsx       # Hero header + Funnel + Grid + Heatmap
│   ├── Phase1Page.jsx     # Zbieranie danych
│   └── Phase2Page.jsx     # Analiza
├── data/
│   └── dashboard-data.json # TOP 20 (wygenerowane)
├── index.css              # Custom design system (glass, animations)
├── App.jsx                # Router
└── main.jsx               # Entry point
```

---

*Plan: 2026-01-06 | Ukończony: 2026-01-07*
