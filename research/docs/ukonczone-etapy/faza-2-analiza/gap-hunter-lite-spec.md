# Gap Hunter Lite — Specyfikacja Techniczna

> Uzupełnienie Pain Radar o analizę luk rynkowych i mapę konkurencji.
> Data utworzenia: 2026-01-06

---

## 1. Kontekst

### Pain Radar (ukończony) dał nam:
- 4003 problemy przeanalizowane
- 40 pomysłów MVP (`deep-dive.json`)
- Community fit scoring
- Hidden patterns

### Gap Hunter Lite doda:
- **Typy luk** — DLACZEGO ludzie nie mają rozwiązania
- **Mapa konkurencji** — CO próbowali i DLACZEGO nie działa
- **White space** — KTÓRE nisze są puste

---

## 2. Dane wejściowe

### Plik: `output/problems-with-tools.json`
- **370 problemów** gdzie `obecne_rozwiazanie` zawiera konkretne narzędzie
- Pola: `problem`, `obecne_rozwiazanie`, `dlaczego_nie_dziala`, `kategoria`, `branza`

### Top 10 narzędzi w danych

| # | Narzędzie | Wzmianki |
|---|-----------|----------|
| 1 | ChatGPT/GPT | 223 |
| 2 | Google | 66 |
| 3 | Claude | 24 |
| 4 | Excel | 16 |
| 5 | Cursor | 15 |
| 6 | Allegro | 13 |
| 7 | Make | 13 |
| 8 | Shopify | 12 |
| 9 | n8n | 12 |
| 10 | GitHub | 11 |

---

## 3. Faza 1: Klasyfikacja typów luk

### Cel
Dla każdego z 370 problemów określić typ luki rynkowej.

### Typy luk (z framework-gap-hunter.md)

```
BRAK_ROZWIAZANIA  — nie istnieje żadne narzędzie/usługa
ZA_DROGIE         — rozwiązania istnieją ale są poza budżetem
ZA_TRUDNE         — rozwiązania wymagają umiejętności których użytkownik nie ma
ZA_WOLNE          — rozwiązania zajmują zbyt dużo czasu
ZA_SLABA_JAKOSC   — rozwiązania działają ale wyniki są niezadowalające
NIEDOSTEPNE       — rozwiązanie nie jest dostępne (region, język, nisza)
BRAK_ZAUFANIA     — użytkownik nie ufa dostępnym rozwiązaniom
FRAGMENTACJA      — trzeba używać wielu narzędzi zamiast jednego
```

### UWAGA: Weryfikacja typów
Przed właściwą analizą należy zweryfikować czy te 8 typów pokrywa rzeczywistość naszych danych.
Jeśli nie — dostosować listę.

### Metoda wykonania
- **Skrypt:** `scripts/gap-hunter-phase1.mjs`
- **Model:** Haiku 4.5 (`anthropic/claude-3-5-haiku-20241022`)
- **Wywołania:** 4 (po ~100 problemów)
- **API:** OpenRouter

### Prompt (draft)

```
Przeanalizuj te problemy użytkowników i sklasyfikuj typ luki rynkowej.

PROBLEMY:
{{problems_json}}

TYPY LUK:
1. BRAK_ROZWIAZANIA — nie istnieje żadne narzędzie
2. ZA_DROGIE — jest ale za drogo
3. ZA_TRUDNE — jest ale wymaga skillów
4. ZA_WOLNE — jest ale zajmuje za dużo czasu
5. ZA_SLABA_JAKOSC — jest ale wyniki słabe
6. NIEDOSTEPNE — niedostępne w regionie/języku
7. BRAK_ZAUFANIA — użytkownik nie ufa
8. FRAGMENTACJA — trzeba używać wielu narzędzi

Dla każdego problemu zwróć:
{
  "problem_id": "...",
  "primary_gap_type": "ZA_TRUDNE",
  "secondary_gap_type": "FRAGMENTACJA" | null,
  "confidence": 0.85,
  "reasoning": "Krótkie uzasadnienie"
}

Zwróć JSON array.
```

### Output
Plik: `output/gap-types-analysis.json`

```json
{
  "meta": {
    "total_analyzed": 370,
    "model": "haiku-4.5",
    "date": "2026-01-06"
  },
  "problems": [
    {
      "problem_id": "...",
      "primary_gap_type": "ZA_TRUDNE",
      "secondary_gap_type": "FRAGMENTACJA",
      "confidence": 0.85,
      "reasoning": "..."
    }
  ],
  "summary": {
    "by_gap_type": {
      "ZA_TRUDNE": { "count": 120, "percent": 32.4 },
      "FRAGMENTACJA": { "count": 89, "percent": 24.1 }
    }
  }
}
```

### Status: [x] DONE (2026-01-06)

**Wyniki:**
- Sklasyfikowano: 370/370 problemów
- Model: `anthropic/claude-haiku-4.5`
- Średnia pewność: 0.85
- Dominujący typ: ZA_SLABA_JAKOSC (40%)

---

## 4. Faza 2: Mapa konkurencji

### Cel
Dla każdego narzędzia zebrać słabości i ocenić displacement potential.

### Metoda wykonania
- **Wykonawca:** Claude (sub-agenci przez Task tool)
- **Problemów:** 370
- **Na agenta:** 10 problemów
- **Agentów:** 37
- **Równolegle:** 10
- **Rund:** 4

### Schemat wykonania

```
Runda 1: 10 agentów → problemy 1-100
Runda 2: 10 agentów → problemy 101-200
Runda 3: 10 agentów → problemy 201-300
Runda 4: 7 agentów  → problemy 301-370
```

### Prompt dla sub-agenta

```
Przeanalizuj te 10 problemów. Dla każdego:
1. Wyciągnij nazwy narzędzi z pola "obecne_rozwiazanie"
2. Wyciągnij słabości z pola "dlaczego_nie_dziala"
3. Oceń severity słabości (HIGH/MEDIUM/LOW)

PROBLEMY:
{{problems_json}}

Zwróć JSON:
[
  {
    "problem_id": "...",
    "tools": ["ChatGPT", "Excel"],
    "weaknesses": [
      {"tool": "ChatGPT", "weakness": "halucynacje", "severity": "HIGH"},
      {"tool": "Excel", "weakness": "brak automatyzacji", "severity": "MEDIUM"}
    ]
  }
]
```

### Agregacja wyników
Po zebraniu wszystkich wyników z sub-agentów:
1. Grupuj słabości per narzędzie
2. Policz częstotliwość każdej słabości
3. Oceń displacement potential

### Output
Plik: `output/competitor-map.json`

```json
{
  "meta": {
    "total_problems": 370,
    "unique_tools": 36,
    "date": "2026-01-06"
  },
  "competitors": [
    {
      "name": "ChatGPT",
      "mentions": 223,
      "weaknesses": [
        {"issue": "Halucynacje/błędne dane", "count": 45, "severity": "HIGH"},
        {"issue": "Brak dostępu do internetu", "count": 23, "severity": "MEDIUM"},
        {"issue": "Limity tokenów", "count": 18, "severity": "MEDIUM"}
      ],
      "displacement_potential": "MEDIUM",
      "displacement_angle": "Specjalizacja w konkretnej domenie"
    }
  ]
}
```

### Status: [x] DONE (2026-01-06)

**Postęp:** 370/370 problemów (100%)
- [x] Runda 1: problemy 0-99 ✅
- [x] Runda 2: problemy 100-199 ✅
- [x] Runda 3: problemy 200-299 ✅
- [x] Runda 4: problemy 300-369 ✅

**Wyniki zapisane w:** `output/competitor-map.json`

**TOP 10 konkurentów (370 problemów):**

| # | Narzędzie | Wzmianki | Główne słabości | Displacement |
|---|-----------|----------|-----------------|--------------|
| 1 | ChatGPT/GPT | 95 | Halucynacje, limity, cenzura, slop | MEDIUM |
| 2 | Cursor | 32 | Ignoruje instrukcje, koszty, destrukcyjne | LOW |
| 3 | Make | 28 | Koszty $5k/rok, brak modułów | MEDIUM |
| 4 | Claude | 26 | Limity PRO, halucynacje | LOW |
| 5 | Shopify | 24 | Zamrożenie środków, ograniczenia | LOW |
| 6 | HubSpot | 22 | Zbyt skomplikowany dla JDG | HIGH |
| 7 | n8n | 18 | UI skomplikowane, ciche awarie | MEDIUM |
| 8 | Midjourney | 16 | Brak spójności, wolne | MEDIUM |
| 9 | MS Copilot | 15 | Halucynacje enterprise | HIGH |
| 10 | Google Ads | 14 | Słaby ROI, PMax spam | LOW |

**5 głównych wzorców słabości:**
1. **Halucynacje AI** (25%) — ChatGPT/Claude/Copilot generują błędne dane
2. **Limity i koszty** (20%) — blokują skalowanie
3. **Fragmentacja** (15%) — brak integracji
4. **Zbyt skomplikowane UI** (12%) — overkill dla małych firm
5. **Vibe Coding Trap** (10%) — kod AI nie działa w produkcji

---

## 5. Faza 3: White Space Scoring ← **NASTĘPNY**

### Cel
Dla każdego z 40 MVP określić czy celuje w pustą niszę.

### Klasyfikacja

```
WHITE_SPACE (90-100)  — zero konkurencji, nikt tego nie robi
BLUE_OCEAN (70-89)    — słaba konkurencja, łatwo wygrać
RED_OCEAN (40-69)     — silna konkurencja, trzeba się wyróżnić
BLOODY_OCEAN (<40)    — zdominowany rynek, nie wchodź
```

### Metoda wykonania
- **Skrypt:** `scripts/gap-hunter-phase3.mjs`
- **Model:** Multi-model (4 modele przez OpenRouter)
- **Wywołania:** 1 (wszystkie 40 MVP naraz)

### Input
- 40 MVP z `deep-dive.json`
- Wyniki z Fazy 1 (gap types)
- Wyniki z Fazy 2 (competitor map)

### Prompt (draft)

```
Oceń "white space score" dla każdego MVP.

MVP DO OCENY:
{{mvps_json}}

MAPA KONKURENCJI:
{{competitor_map}}

TYPY LUK W DANYCH:
{{gap_types_summary}}

Dla każdego MVP oceń:
1. White space score (0-100)
2. Klasyfikacja: WHITE_SPACE | BLUE_OCEAN | RED_OCEAN | BLOODY_OCEAN
3. Główni konkurenci
4. Typ luki który adresuje
5. Kąt różnicowania

Zwróć JSON array.
```

### Output
Plik: `output/white-space-scoring.json`

```json
{
  "meta": {
    "total_mvps": 40,
    "models_used": ["claude-opus-4.5", "gemini-3-pro", "grok-4", "gpt-5.2"],
    "date": "2026-01-06"
  },
  "mvps": [
    {
      "mvp_id": "automation-guardian",
      "mvp_name": "Automation Guardian",
      "white_space_score": 85,
      "classification": "BLUE_OCEAN",
      "consensus_spread": 8,
      "main_competitors": ["Zapier logs", "Make history"],
      "gap_type_addressed": "FRAGMENTACJA",
      "differentiation_angle": "Proactive alerts + one-click recovery",
      "go_to_market": "Targetuj użytkowników Make/n8n którzy mieli awarie"
    }
  ]
}
```

### Status: [x] DONE (2026-01-06)

**Wyniki:**
- 4 modele: Claude Opus 4.5, Gemini 3 Pro, Grok 4, GPT-5.2
- Czas wykonania: 106s
- BLUE_OCEAN: 11 MVP, RED_OCEAN: 25 MVP, BLOODY_OCEAN: 4 MVP
- Top 1: DevRescue (score 87) - Platforma ratunkowa dla porzuconych projektów IT

---

## 6. Merge i Output końcowy

### Status: [x] DONE (2026-01-06)

**Skrypt:** `scripts/merge-gap-hunter-results.mjs`

**Wyniki:**
- 7 STRONG_GO, 16 GO, 13 CONSIDER, 1 AVOID
- Top 1: TrustSignal (score 82) - AI Search & Reputation Optimizer
- Combined Score = 50% White Space + 50% Community Fit

### Plik: `output/gap-hunter-lite-results.json`

Połączenie wszystkich wyników:
- Gap types analysis
- Competitor map
- White space scoring
- Community fit (z Pain Radar)

### Struktura

```json
{
  "meta": {
    "generated": "2026-01-06",
    "pain_radar_mvps": 40,
    "problems_analyzed": 370,
    "competitors_mapped": 36
  },
  "gap_types": { /* z fazy 1 */ },
  "competitor_map": { /* z fazy 2 */ },
  "white_space": { /* z fazy 3 */ },
  "top_opportunities": [
    {
      "mvp_id": "...",
      "mvp_name": "...",
      "pain_radar_score": 114,
      "white_space_score": 85,
      "combined_score": 97,
      "gap_type": "FRAGMENTACJA",
      "main_competitors": ["..."],
      "recommendation": "STRONG_GO"
    }
  ]
}
```

---

## 7. Szacowane koszty

| Faza | Wywołania | Tokeny | Koszt |
|------|-----------|--------|-------|
| 1. Typy luk | 4 | ~80K | ~$0.50 |
| 2. Konkurencja | 37 agentów | ~200K | ~$2.00 |
| 3. White space | 4 (multi-model) | ~100K | ~$1.50 |
| **TOTAL** | - | ~380K | **~$4.00** |

---

## 8. Jak wznowić pracę

1. Otwórz `PLAN.md` — sprawdź które fazy są [x] DONE
2. Przeczytaj ten plik dla szczegółów
3. Kontynuuj od pierwszej niezakończonej fazy
4. Wyniki zapisuj w `docs/faza-2-analiza/output/`

---

## 9. Pliki do utworzenia

### Skrypty
- [x] `scripts/gap-hunter-phase1.mjs` — klasyfikacja typów luk (Haiku) ✅
- [ ] `scripts/gap-hunter-phase3.mjs` — white space scoring (multi-model)

### Output
- [x] `output/gap-types-analysis.json` ✅
- [x] `output/competitor-map.json` ✅
- [ ] `output/white-space-scoring.json`
- [ ] `output/gap-hunter-lite-results.json`

---

*Specyfikacja v1.2 — 2026-01-06 (Fazy 1-2 ukończone)*
