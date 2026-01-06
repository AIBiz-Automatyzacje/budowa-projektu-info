# Projekt: Research & Analiza Rynku - Akademia Automatyzacji

## Cel projektu

Znalezienie pomysłu na aplikację do zmonetyzowania poprzez analizę danych z grup Facebook i subredditów. Podejście data-driven: najpierw zbieramy dane, analizujemy problemy użytkowników, potem wybieramy pomysł na produkt.

## Kontekst

- **Społeczność:** Akademia Automatyzacji (~600 płacących członków)
- **Zasięgi:** 50K+ na social media
- **Dotychczasowy sukces:** piszemywirale.pl - aplikacja do wiralowych postów

---

## Plan działania

### Faza 1: Zbieranie danych ✅
- [x] Research grup Facebook (8 segmentów)
- [x] Research subredditów (8 segmentów)
- [x] Scraping danych z grup Facebook
- [x] Scraping danych z subredditów
- [x] Generowanie raportów AI

### Faza 2A: Pain Radar (bottom-up) ✅ UKOŃCZONY
- [x] Zaprojektowanie frameworków analizy
- [x] Zdefiniowanie profilu społeczności AA (`docs/faza-2-analiza/context/community-profile.md`)
- [x] Ekstrakcja danych z raportów (4003 problemy)
- [x] **Krok 1-2:** Normalizacja kategorii i branż
- [x] **Krok 3.1:** Agregacja i grupowanie
- [x] **Krok 3.2:** Pain Priority Score (PPS) — multi-model
- [x] **Krok 3.3:** Wykrywanie ukrytych wzorców — multi-model
- [x] **Krok 4:** Community Fit Scoring — multi-model
- [x] **Krok 5:** Deep dive na top 10 kategorii — multi-model → **40 pomysłów MVP**
- [x] **Krok 6:** Solution Discovery — multi-model

### Faza 2B: Gap Hunter Lite (top-down) ✅ UKOŃCZONY
> Szczegóły: `docs/faza-2-analiza/gap-hunter-lite-spec.md`

- [x] **Faza 1:** Klasyfikacja typów luk (370 problemów → Haiku 4.5, 4 wywołania) ✅
- [x] **Faza 2:** Mapa konkurencji (370 problemów → sub-agenci, 4 rundy) ✅
- [x] **Faza 3:** White space scoring (40 MVP → 4 modele, 106s) ✅
- [x] **Merge:** `gap-hunter-lite-results.json` ✅

### Faza 2C: Dashboard
- [ ] Budowa dashboardu wizualizacyjnego (po Gap Hunter Lite)

### Faza 3: Wybór pomysłu
- [ ] Ocena pomysłów pod kątem wykonalności
- [ ] Dopasowanie do grupy docelowej
- [ ] Wybór MVP

### Faza 4: Budowa i monetyzacja
- [ ] Implementacja MVP (live coding)
- [ ] Wdrożenie modelu afiliacyjnego
- [ ] Iteracja na podstawie feedbacku

---

## Multi-Model AI Approach

Wszystkie analizy AI w tym projekcie używają **4 topowych modeli** przez OpenRouter API dla większej wiarygodności i cross-walidacji wyników:

| # | Dostawca | Model | ID OpenRouter |
|---|----------|-------|---------------|
| 1 | Anthropic | Claude Opus 4.5 | `anthropic/claude-opus-4.5` |
| 2 | Google | Gemini 3 Pro | `google/gemini-3-pro-preview` |
| 3 | xAI | Grok 4 | `x-ai/grok-4` |
| 4 | OpenAI | GPT-5.2 | `openai/gpt-5.2-chat` |

**Dlaczego multi-model?**
- Redukcja hallucynacji przez konsensus
- Różne perspektywy na te same dane
- Wyższa jakość insights niż single-model
- Walidacja wyników między modelami

---

## AKTUALNY STAN (2026-01-05)

### Wyekstrahowane dane

| Źródło | Rekordy | Z raportem | Problemy |
|--------|---------|------------|----------|
| FB Grupy | 105 | 102 | **2 090** |
| Reddit | 154 | 154 | **1 913** |
| **ŁĄCZNIE** | 259 | 256 | **4 003** |

### Normalizacja kategorii i branż ✅ DONE (v3)

**Przed:** 775 unikalnych kategorii, 546 unikalnych branż
**Po:** 22 kategorie kanoniczne, 32 branże kanoniczne

Mapowanie zapisane w: `docs/faza-2-analiza/normalization-mapping-v3.json`

**22 kategorie kanoniczne:**
1. Edukacja
2. Kariera/Rynek Pracy
3. Programowanie
4. Automatyzacja
5. Marketing
6. E-commerce
7. Zlecenia/Freelance
8. Narzędzia AI
9. Bezpieczeństwo
10. Wdrożenia/Integracje
11. DevOps/Infrastruktura
12. Logistyka
13. Finanse/Księgowość
14. Strategia/Biznes
15. Monetyzacja
16. Content/Tworzenie treści
17. Prawo/Regulacje
18. Obsługa Klienta/CRM
19. Zarządzanie Projektami
20. HR/Rekrutacja
21. Analityka/BI
22. Inne

**32 branże kanoniczne:**
IT/Software, E-commerce, Edukacja, Marketing/Agencje, SaaS, Automatyzacja,
Content/Social Media, Gaming/Gamedev, Finanse/Fintech, Data/Analityka,
Cyberbezpieczeństwo, Startup, Beauty/Wellness, Media/Video, Handel/Logistyka,
Muzyka, Hardware/Embedded, Usługi B2B, Web Dev, Praca zdalna, Food/Gastronomia,
AI/Machine Learning, Fashion/Retail, Real Estate, Renewable Energy, Healthcare/Wellness,
Sport/Fitness, Budownictwo, Turystyka/Eventy, Motoryzacja, Nauka/Badania, Nieznana

### Agregacja Krok 3.1 ✅ DONE

Wyniki zapisane w: `docs/faza-2-analiza/aggregates.json`

**TOP 10 kategorii:**
| Kategoria | Count | Avg Int. | Avg Sygnał | Cross-platform |
|-----------|-------|----------|------------|----------------|
| Kariera/Rynek Pracy | 523 | 2.49 | 1.27 | ✓ |
| Edukacja | 493 | 2.24 | 2.31 | ✓ |
| Marketing | 336 | 3.36 | 2.63 | ✓ |
| Programowanie | 308 | 3.06 | 2.32 | ✓ |
| Strategia/Biznes | 216 | 3.29 | 2.47 | ✓ |
| Finanse/Księgowość | 215 | 3.47 | 2.48 | ✓ |
| Narzędzia AI | 215 | 2.71 | 2.09 | ✓ |
| Content/Tworzenie treści | 204 | 2.93 | 2.58 | ✓ |
| DevOps/Infrastruktura | 196 | 3.47 | 2.41 | ✓ |
| Prawo/Regulacje | 126 | 3.97 | 2.10 | ✓ |

**TOP 5 branż:**
| Branża | Count | Avg Int. | Avg Sygnał |
|--------|-------|----------|------------|
| IT/Software | 914 | 2.79 | 1.90 |
| E-commerce | 381 | 3.53 | 2.58 |
| Edukacja | 242 | 2.54 | 2.37 |
| Marketing/Agencje | 187 | 3.51 | 2.55 |
| Usługi B2B | 182 | 3.58 | 2.61 |

---

### Pain Priority Score (PPS) ✅ DONE (multi-model)

Wyniki zapisane w: `docs/faza-2-analiza/output/pps-rankings.json`

**4 modele:** Claude Opus 4.5, Gemini 3 Pro, Grok 4, GPT-5.2

**TOP 10 kategorii wg consensus PPS:**
| Rank | PPS | Spread | Kategoria | Key Insight |
|------|-----|--------|-----------|-------------|
| 1 | 87 | 4 | Zlecenia/Freelance | Desperacko szukają zleceń, najwyższy sygnał zakupowy |
| 2 | 87 | 12 | Automatyzacja | Wiedzą że powinni, nie wiedzą JAK |
| 3 | 82 | 12 | Marketing | Przepalają budżety, nie wiedzą co działa |
| 4 | 78 | 10 | Wdrożenia/Integracje | Systemy nie gadają ze sobą |
| 5 | 78 | 8 | E-commerce | Operacyjny chaos, walka z konwersją |
| 6 | 77 | 11 | Content/Tworzenie treści | Presja na publikację, brak czasu |
| 7 | 75 | 13 | Strategia/Biznes | Samotność decyzyjna, brak mapy |
| 8 | 74 | 14 | Finanse/Księgowość | Strach przed błędami i karami |
| 9 | 69 | 17 | Zarządzanie Projektami | Chaos komunikacyjny |
| 10 | 68 | 20 | Analityka/BI | Dane bez actionable insights |

**Kluczowe wnioski:**
- Spread ≤15 = wysoki consensus między modelami
- Zlecenia/Freelance ma najniższy spread (4) = wszystkie modele zgodne
- Kariera/Rynek Pracy: największy count (523) ale najniższy PPS (36) = dużo narzekania, zero płacenia

---

### Ukryte Wzorce (Krok 3.3) ✅ DONE (multi-model)

Wyniki zapisane w: `docs/faza-2-analiza/output/hidden-patterns.json`

**4 modele:** Claude Opus 4.5, Gemini 3 Pro, Grok 4, GPT-5.2
**Sample:** 300 problemów (stratified z top 10 kategorii)
**Wykryte wzorce:** 31

**TOP wzorce z najwyższym consensus:**
| # | Wzorzec | Modele | % | Szansa produktowa |
|---|---------|--------|---|-------------------|
| 1 | Luka founder-technik | Claude, GPT | 24% | Co-founder Speed Dating z paid trial |
| 2 | Deficyt zaufania | GPT | 48% | Platforma z wbudowanym QA i KPI |
| 3 | Przeciążenie czasowe | GPT | 46% | Done-for-you automation dla MŚP |
| 4 | Chaos narzędziowy | GPT | 42% | Hub operacyjny spinający narzędzia |
| 5 | Wypalenie prospectingowe | Claude, Grok | 16% | Reverse Job Board dla freelancerów |
| 6 | Kryzys zaufania do agencji | Gemini, Grok | 16% | Agency Auditor - automatyczny audyt |
| 7 | Fragmentacja narzędzi | Claude, Grok | 15% | Workflow hub dla solopreneurów |
| 8 | Strach przed ekspozycją | Claude, Grok | 14% | Faceless Brand Accelerator |

**Kluczowe wnioski:**
- Wzorce cross-cutting dotykają WIELU kategorii naraz
- Brak czasu + przeciążenie = #1 ból przedsiębiorców
- Zaufanie (do ludzi, AI, agencji) = systemowy problem
- Fragmentacja narzędzi = wszyscy mają 10 appek, nic nie działa razem

---

### Community Fit Scoring (Krok 4) ✅ DONE (multi-model)

Wyniki zapisane w: `docs/faza-2-analiza/output/community-fit.json`

**4 modele:** Claude Opus 4.5, Gemini 3 Pro, Grok 4, GPT-5.2

**Kryteria scoringowe (max 123 pkt):**
- Target Fit (0-30) — dopasowanie do branż i person AA
- Capability Fit (0-25) — czy umiemy zbudować
- Monetization Fit (0-25) — czy zapłacą i jak
- Distribution Fit (0-20) — kanały dystrybucji
- Quick Win Bonus (0-23) — dodatkowe atuty

**TOP 5 kategorii wg Community Fit:**
| Rank | Score | Kategoria | Rekomendacja |
|------|-------|-----------|--------------|
| 1 | 114/123 | **Automatyzacja** | STRONG FIT |
| 2 | 100 | Wdrożenia/Integracje | STRONG FIT |
| 3 | 99 | Marketing | STRONG FIT |
| 4 | 92 | E-commerce | STRONG FIT |
| 5 | 92 | Content/Tworzenie treści | STRONG FIT |

**TOP 5 wzorców wg Community Fit:**
| Rank | Score | Wzorzec | Rekomendacja |
|------|-------|---------|--------------|
| 1 | 111/123 | **Automatyzacja manualnych zadań** | STRONG FIT |
| 2 | 104 | Kruchość automatyzacji | STRONG FIT |
| 3 | 103 | Pułapka fragmentacji narzędzi | STRONG FIT |
| 4 | 102 | Przeciążenie czasowe | STRONG FIT |
| 5 | 99 | Chaos narzędziowy | STRONG FIT |

**Kluczowe wnioski:**
- **Automatyzacja = absolutny nr 1** — 114/123 pkt, wszystkie modele zgodne
- 7 kategorii z STRONG FIT (80+), 3 z GOOD FIT (60-79)
- 8 wzorców z STRONG FIT, 2 z GOOD FIT
- Idealne dopasowanie do DNA Akademii Automatyzacji

**Rekomendowane pomysły na produkt:**
1. **Marketplace gotowych szablonów automatyzacji** — jednorazowa płatność za sprawdzone workflow
2. **Automation Recipe Book** — biblioteka 50+ gotowych automatyzacji dla konkretnych zadań
3. **Automation Guardian** — system monitoringu automatyzacji z alertami i auto-recovery
4. **Workflow Hub dla solopreneurów** — pakiety integracji z jednym dashboardem
5. **Time Reclaim System** — pakiet automatyzacji dla powtarzalnych zadań

---

## 🚨 Gap Hunter Lite — W TRAKCIE

**Cel:** Uzupełnić Pain Radar o analizę luk rynkowych i konkurencji.

**Szczegółowa specyfikacja:** `docs/faza-2-analiza/gap-hunter-lite-spec.md`

---

### Gap Hunter Lite — Faza 1: Typy luk ✅ DONE

**Wyniki zapisane w:** `docs/faza-2-analiza/output/gap-types-analysis.json`

| Typ luki | Count | % | Interpretacja |
|----------|-------|---|---------------|
| **ZA_SLABA_JAKOSC** | 148 | 40.0% | Rozwiązania są, ale wyniki niezadowalające |
| BRAK_ROZWIAZANIA | 45 | 12.2% | Nie ma żadnego narzędzia |
| ZA_TRUDNE | 40 | 10.8% | Wymaga skillów których ludzie nie mają |
| ZA_WOLNE | 33 | 8.9% | Za dużo czasu zajmuje |
| ZA_DROGIE | 31 | 8.4% | Poza budżetem |
| BRAK_ZAUFANIA | 29 | 7.8% | Nie ufają rozwiązaniom |
| NIEDOSTEPNE | 25 | 6.8% | Niedostępne w regionie/języku |
| FRAGMENTACJA | 19 | 5.1% | Trzeba wielu narzędzi |

**Kluczowy insight:** 40% problemów to **ZA_SLABA_JAKOSC** — ludzie mają narzędzia (ChatGPT, Excel, itp.) ale wyniki ich nie satysfakcjonują. Ogromna szansa na lepsze, wyspecjalizowane rozwiązania!

**Średnia pewność klasyfikacji:** 0.85

---

### Gap Hunter Lite — Faza 2: Mapa konkurencji ✅ DONE

**Wyniki zapisane w:** `docs/faza-2-analiza/output/competitor-map.json`

**Postęp:** 370/370 problemów (100%)
- [x] Runda 1: problemy 0-99 ✅
- [x] Runda 2: problemy 100-199 ✅
- [x] Runda 3: problemy 200-299 ✅
- [x] Runda 4: problemy 300-369 ✅

**TOP 10 konkurentów (370 problemów):**

| # | Narzędzie | Wzmianki | Główne słabości | Displacement |
|---|-----------|----------|-----------------|--------------|
| 1 | **ChatGPT/GPT** | 95 | Halucynacje, limity, cenzura, slop | MEDIUM |
| 2 | **Cursor** | 32 | Ignoruje instrukcje, wysokie koszty, destrukcyjne działania | LOW |
| 3 | **Make** | 28 | Koszty $5k/rok, brak modułów, API limits | MEDIUM |
| 4 | **Claude** | 26 | Limity PRO po 2-3h, halucynacje, koszty | LOW |
| 5 | **Shopify** | 24 | Zamrożenie środków, ograniczenia Basic, brak Pixel | LOW |
| 6 | **HubSpot** | 22 | Zbyt skomplikowany dla JDG, forms bez Turnstile | HIGH |
| 7 | **n8n** | 18 | UI zbyt skomplikowane, ciche awarie | MEDIUM |
| 8 | **Midjourney** | 16 | Brak spójności postaci, wolne, filtry NSFW | MEDIUM |
| 9 | **Microsoft Copilot** | 15 | Halucynacje enterprise, brak kontekstu firmowego | HIGH |
| 10 | **Google Ads** | 14 | Słaby ROI, PMax spam, rozbieżności tracking | LOW |

**5 głównych wzorców słabości:**
1. **Halucynacje AI** (25%) — ChatGPT/Claude/Copilot generują błędne dane
2. **Limity i koszty** (20%) — blokują skalowanie (Claude PRO, Make, Cursor)
3. **Fragmentacja** (15%) — brak integracji między narzędziami
4. **Zbyt skomplikowane UI** (12%) — HubSpot/Salesforce overkill dla małych firm
5. **Vibe Coding Trap** (10%) — kod AI nie działa w produkcji

**TOP 3 szanse na displacement:**
1. **HubSpot → Prosty CRM dla solopreneurów** (score: 85)
2. **Excel → Zautomatyzowane workflow** (score: 82)
3. **MS Copilot → AI z lepszym RAG firmowym** (score: 78)

---

### Gap Hunter Lite — Faza 3: White Space Scoring ✅ DONE

**Wyniki zapisane w:** `docs/faza-2-analiza/output/white-space-scoring.json`

**4 modele:** Claude Opus 4.5, Gemini 3 Pro, Grok 4, GPT-5.2

**Rozkład klasyfikacji:**
| Klasyfikacja | Count | Opis |
|--------------|-------|------|
| BLUE_OCEAN | 11 | Słaba konkurencja, łatwo wygrać |
| RED_OCEAN | 25 | Silna konkurencja, trzeba się wyróżnić |
| BLOODY_OCEAN | 4 | Zdominowany rynek, nie wchodź |

**TOP 10 MVP wg White Space Score:**

| # | Score | MVP | Kategoria | Typ luki |
|---|-------|-----|-----------|----------|
| 1 | 87 | **DevRescue** - Platforma ratunkowa dla porzuconych projektów IT | Zlecenia/Freelance | BRAK_ZAUFANIA |
| 2 | 83 | **TrustSignal** - AI Search & Reputation Optimizer | Marketing | BRAK_ROZWIAZANIA |
| 3 | 82 | **CreatorOnCall** - Emergency Staffing dla Eventów | Zarządzanie Projektami | ZA_WOLNE |
| 4 | 81 | **ProjectRescue.dev** | Zlecenia/Freelance | BRAK_ZAUFANIA |
| 5 | 80 | **TrustCode / DevRescue** | Zlecenia/Freelance | BRAK_ZAUFANIA |
| 6 | 79 | **NativeLaunch.io** | Strategia/Biznes | ZA_SLABA_JAKOSC |
| 7 | 75 | **SyncPilot** - Stabilna synchronizacja magazynowa | Wdrożenia/Integracje | ZA_SLABA_JAKOSC |
| 8 | 75 | **AuthenticAds Marketplace** | Content/Tworzenie treści | BRAK_ZAUFANIA |
| 9 | 74 | **BaseLinker Logic Booster** | E-commerce | NIEDOSTEPNE |
| 10 | 73 | **E-com Sync Stabilizer** | Wdrożenia/Integracje | ZA_SLABA_JAKOSC |

**Kluczowe wnioski:**
- **3 z top 5** to kategoria Zlecenia/Freelance z luką BRAK_ZAUFANIA
- Duży potencjał w niszach "ratunkowych" (porzucone projekty, awaryjna pomoc)
- E-commerce integracje mają wysoki score (SyncPilot, BaseLinker Booster)

---

### Gap Hunter Lite — FINALNE WYNIKI ✅

**Plik:** `docs/faza-2-analiza/output/gap-hunter-lite-results.json`

**Combined Score = 50% White Space + 50% Community Fit (normalized)**

**Rozkład rekomendacji:**
| Rekomendacja | Count | Opis |
|--------------|-------|------|
| 🟢 STRONG_GO | 7 | Wysoki WS + wysokie CF — priorytet |
| 🔵 GO | 16 | Dobry potencjał |
| 🟡 CONSIDER | 13 | Wymaga przemyślenia |
| 🔴 AVOID | 1 | Nie wchodź |

**TOP 10 MVP (Combined Score):**

| # | Score | MVP | WS | CF | Typ luki |
|---|-------|-----|----|----|----------|
| 1 | **82** | **TrustSignal** - AI Search & Reputation Optimizer | 83 | 99 | BRAK_ROZWIAZANIA |
| 2 | **79** | **DevRescue** - Platforma ratunkowa dla porzuconych projektów IT | 87 | 88 | BRAK_ZAUFANIA |
| 3 | 78 | LeadScout.io | 64 | 114 | ZA_WOLNE |
| 4 | **77** | **SyncPilot** - Stabilna synchronizacja magazynowa | 75 | 97 | ZA_SLABA_JAKOSC |
| 5 | 76 | ProjectRescue.dev | 81 | 88 | BRAK_ZAUFANIA |
| 6 | 76 | TrustCode / DevRescue | 80 | 88 | BRAK_ZAUFANIA |
| 7 | **76** | **E-com Sync Stabilizer** (Audit & Fix Service) | 73 | 97 | ZA_SLABA_JAKOSC |
| 8 | 76 | LeadHunter.pl | 60 | 114 | ZA_TRUDNE |
| 9 | 75 | AuthenticAds Marketplace | 75 | 92 | BRAK_ZAUFANIA |
| 10 | 74 | BaseLinker Logic Booster | 74 | 92 | NIEDOSTEPNE |

**🏆 TOP 3 REKOMENDACJE:**

1. **TrustSignal** (82) — AI SEO/Reputation dla widoczności w ChatGPT/Perplexity
   - Typ luki: BRAK_ROZWIAZANIA (nikt tego nie robi!)
   - Konkurenci: Semrush, Ahrefs (nie monitorują AI search)

2. **DevRescue** (79) — Platforma ratunkowa dla porzuconych projektów IT
   - Typ luki: BRAK_ZAUFANIA (ludzie nie ufają freelancerom)
   - Konkurenci: Upwork/Useme (bez specjalizacji w ratowaniu)

3. **SyncPilot** (77) — Stabilna synchronizacja dla polskiego e-commerce
   - Typ luki: ZA_SLABA_JAKOSC (BaseLinker/Sellasist zawodzą)
   - Konkurenci: BaseLinker, Sellintegro (kruche rozwiązania)

---

## Struktura projektu

```
live/
├── PLAN.md                             # Ten plik
├── CLAUDE.md                           # Konfiguracja Airtable
├── package.json                        # Node.js dependencies
├── .env                                # API keys (ANTHROPIC_API_KEY)
├── scripts/
│   ├── extract-categories.mjs          # Ekstrakcja surowych kategorii
│   ├── aggregate-problems.mjs          # Agregacja z normalizacją ✅
│   ├── ai-mapping-planner.mjs          # AI mapowanie kategorii/branż ✅
│   ├── fix-nieznana.mjs                # Poprawka branż "Nieznana" ✅
│   ├── diagnose-unmapped.mjs           # Diagnostyka niemapowanych
│   ├── diagnose-deep.mjs               # Głęboka diagnostyka
│   ├── check-nieznana.mjs              # Sprawdzenie "Nieznana"
│   ├── calculate-pps.mjs               # Pain Priority Score ✅
│   ├── extract-all-problems.mjs        # Ekstrakcja wszystkich problemów ✅
│   ├── detect-patterns.mjs             # Wykrywanie ukrytych wzorców ✅
│   ├── gap-hunter-phase1.mjs           # Gap Hunter: klasyfikacja typów luk ✅
│   ├── gap-hunter-phase3.mjs           # Gap Hunter: white space scoring ✅
│   └── merge-gap-hunter-results.mjs    # Gap Hunter: merge wyników ✅
├── docs/
│   ├── PLAYBOOK-OD-POMYSLU-DO-SCALE.md # Playbook budowy projektu
│   ├── faza-1-zbieranie-danych/
│   │   ├── facebook-groups-research/
│   │   │   ├── groups.md               # 105 polskich grup FB
│   │   │   └── plan.md
│   │   └── reddit-research/
│   │       ├── subreddits.md           # 154 subredditów
│   │       └── plan.md
│   └── faza-2-analiza/
│       ├── framework-pain-radar.md     # Bottom-up: agregacja problemów
│       ├── framework-gap-hunter.md     # Top-down: analiza luk
│       ├── extracted-categories.json   # Surowe kategorie/branże
│       ├── normalization-mapping.json  # Mapowanie v1 (stare)
│       ├── normalization-mapping-v2.json # Mapowanie v2
│       ├── normalization-mapping-v3.json # Mapowanie v3 ✅ AKTUALNE
│       ├── mapping-plans.json          # Plany AI mapowania
│       ├── aggregates.json             # Agregaty krok 3.1 ✅
│       ├── all-problems.json           # Wszystkie 4003 problemy ✅
│       ├── output/
│       │   ├── pps-rankings.json            # Pain Priority Score ✅
│       │   ├── hidden-patterns.json         # Ukryte wzorce ✅
│       │   ├── community-fit.json           # Community Fit scoring ✅
│       │   ├── deep-dive.json               # 40 MVP proposals ✅
│       │   ├── gap-types-analysis.json      # Gap Hunter: typy luk ✅
│       │   ├── competitor-map.json          # Gap Hunter: mapa konkurencji ✅
│       │   ├── white-space-scoring.json     # Gap Hunter: white space ✅
│       │   └── gap-hunter-lite-results.json # Gap Hunter: FINALNE WYNIKI ✅
│       └── context/
│           └── community-profile.md    # Profil AA (zasoby, kompetencje)
```

## Dane w Airtable

**Baza:** `appHKTIMXlnFNdCQj`

| Tabela | ID | Pola kluczowe |
|--------|-----|---------------|
| FB Grupy | `tbl5QE6tGQs67QKeW` | Nazwa, URL, Raport (JSON) |
| Reddit | `tbljC9rBpXF0jXsb7` | Subreddit, URL, Raport (JSON) |

---

## Segmenty badawcze

1. **AI / Narzędzia AI** - ChatGPT, Claude, Midjourney, prompty
2. **No-code / Automatyzacja** - n8n, Make, Zapier, Airtable
3. **Programowanie / Vibe coding** - Cursor, AI coding, web dev
4. **Przedsiębiorcy / Startupy** - SaaS, indie hackers, solopreneurs
5. **Marketing / Growth** - SEO, PPC, growth hacking, social media
6. **Content / Twórcy** - YouTube, TikTok, podcasting
7. **Freelance / Praca zdalna** - remote work, digital nomad
8. **E-commerce** - Shopify, dropshipping, Amazon

---

*Ostatnia aktualizacja: 2026-01-06 (Gap Hunter Lite UKOŃCZONY — 7 STRONG_GO MVP, następny: Faza 2C Dashboard lub Faza 3 Wybór pomysłu)*
