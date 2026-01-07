# Projekt: Research & Analiza Rynku - Akademia Automatyzacji

## Cel

Znalezienie pomysłu na aplikację do zmonetyzowania poprzez analizę danych z grup Facebook i subredditów (data-driven approach).

## Kontekst

- **Społeczność:** Akademia Automatyzacji (~600 płacących członków)
- **Zasięgi:** 50K+ na social media
- **Dotychczasowy sukces:** piszemywirale.pl

---

## Plan działania

### Faza 1: Zbieranie danych ✅
- [x] Research grup Facebook (105 grup, 8 segmentów)
- [x] Research subredditów (154 subredditów, 8 segmentów)
- [x] Scraping + generowanie raportów AI
- **Wynik:** 4003 problemy zebrane

### Faza 2A: Pain Radar ✅
- [x] Normalizacja → 22 kategorie, 32 branże
- [x] Pain Priority Score (multi-model)
- [x] Ukryte wzorce (31 wykrytych)
- [x] Community Fit Scoring
- [x] Deep dive → 40 pomysłów MVP
> Szczegóły: [`raport-analityczny.md`](research/docs/ukonczone-etapy/faza-2-analiza/raport-analityczny.md)

### Faza 2B: Gap Hunter Lite ✅
- [x] Klasyfikacja typów luk (370 problemów)
- [x] Mapa konkurencji (TOP 10 narzędzi)
- [x] White space scoring
> Szczegóły: [`gap-hunter-lite-spec.md`](research/docs/ukonczone-etapy/faza-2-analiza/gap-hunter-lite-spec.md)

### Faza 2C: Low-Code Product Finder ✅
- [x] Analiza 1026 problemów przez 4 modele AI
- [x] 402 unikalne okazje, 17 z consensus 4/4
> Szczegóły: [`framework-lowcode-product-finder.md`](research/docs/ukonczone-etapy/faza-2-analiza/framework-lowcode-product-finder.md)

### Faza 2D: Dashboard ✅
- [x] React/Vite + Tailwind + Framer Motion
- [x] Premium UI (Glassmorphism, Clash Display)
- [x] 3 strony, 7 komponentów
- [ ] **Deploy na Vercel** ← następny krok
> Szczegóły: [`dashboard-implementation-plan.md`](research/docs/ukonczone-etapy/faza-2-analiza/dashboard-implementation-plan.md)

### Faza 3: Wybór pomysłu
- [ ] Ocena wykonalności TOP 3
- [ ] Dopasowanie do grupy docelowej
- [ ] Wybór MVP

### Faza 4: Budowa i monetyzacja
- [ ] Implementacja MVP (live coding)
- [ ] Wdrożenie modelu afiliacyjnego
- [ ] Iteracja na podstawie feedbacku

---

## TOP 3 kandydaci na MVP

| # | Score | Produkt | Wzorzec |
|---|-------|---------|---------|
| 1 | **97** | **ProductBG Pro** — AI wymiana tła produktów | AI_GENERATOR |
| 2 | **97** | **PrintifyBoost** — AI mockupy/opisy dla Printify | AI_GENERATOR |
| 3 | **97** | **ThumbGenius** — AI miniatury YouTube + A/B testy | AI_GENERATOR |

> Pełne TOP 20: [`src/data/dashboard-data.json`](src/data/dashboard-data.json)
> Executive summary: [`raport-executive.md`](research/docs/ukonczone-etapy/faza-2-analiza/raport-executive.md)

---

## Struktura projektu

```
live/
├── src/                    # 🎯 DASHBOARD (React)
│   ├── components/         # Funnel, TopGrid, ProductCard, ProductModal, Heatmap, Navigation, Footer
│   ├── pages/              # HomePage, Phase1Page, Phase2Page
│   └── data/               # dashboard-data.json (TOP 20)
│
├── research/               # 📊 DANE BADAWCZE
│   ├── scripts/            # 20 skryptów analizy
│   └── docs/ukonczone-etapy/
│       ├── faza-1-zbieranie-danych/   # Research grup FB + Reddit
│       └── faza-2-analiza/            # Pain Radar, Gap Hunter, Low-Code, Dashboard
│           ├── output/                # JSON z wynikami
│           └── raport-*.md            # Raporty
│
├── PLAN.md                 # Ten plik
└── CLAUDE.md               # Konfiguracja Airtable
```

---

## Dokumentacja szczegółowa

| Dokument | Zawartość |
|----------|-----------|
| [`raport-executive.md`](research/docs/ukonczone-etapy/faza-2-analiza/raport-executive.md) | Executive summary — TOP 5 pomysłów |
| [`raport-analityczny.md`](research/docs/ukonczone-etapy/faza-2-analiza/raport-analityczny.md) | Pełna analiza Pain Radar + Gap Hunter |
| [`dashboard-implementation-plan.md`](research/docs/ukonczone-etapy/faza-2-analiza/dashboard-implementation-plan.md) | Plan + log implementacji dashboardu |
| [`community-profile.md`](research/docs/ukonczone-etapy/faza-2-analiza/context/community-profile.md) | Profil Akademii Automatyzacji |

## Dane w Airtable

**Baza:** `appHKTIMXlnFNdCQj`
- FB Grupy: `tbl5QE6tGQs67QKeW` (105 rekordów)
- Reddit: `tbljC9rBpXF0jXsb7` (154 rekordów)

---

*Ostatnia aktualizacja: 2026-01-07*
