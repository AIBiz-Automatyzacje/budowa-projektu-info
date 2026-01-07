# Framework "Low-Code Product Finder" — Multi-Model Consensus Analysis

## 0. FILOZOFIA FRAMEWORKU

Ten framework szuka okazji produktowych idealnych dla low-code developera korzystającego z narzędzi AI (Claude Code, generatory grafik, LLM API).

**Kluczowe założenia:**
- Każdy z 4 modeli AI analizuje WSZYSTKIE dane tym samym promptem
- Szukamy KONSENSUSU — im więcej modeli wskazuje tę samą okazję, tym silniejszy sygnał
- Skupiamy się na 6 prostych wzorcach produktowych
- Preferujemy rozwiązania mobile-friendly i AI-powered

---

## 1. WZORCE PRODUKTÓW

| Wzorzec | Opis | Przykład | Technologie |
|---------|------|----------|-------------|
| **Monitor & Alert** | Śledź X, powiadom gdy Y | LeadScout - nowe zlecenia | n8n/Make + scraping + SMS/push |
| **AI Generator** | Generuj X za pomocą AI | Generator postów, grafik, opisów | LLM API + DALL-E/Midjourney API |
| **AI Assistant** | Pomóż użytkownikowi z X | Asystent do pisania ofert | LLM API + prosty UI |
| **Template Pack** | Gotowe szablony do X | Pakiet promptów, szablony Notion | Gumroad + PDF/Notion |
| **Simplifier** | Uprość skomplikowany proces X | Uproszczona analiza konkurencji | LLM API + automatyzacja |
| **Aggregator** | Zbierz X z wielu źródeł w jedno | Dashboard cen, porównywarka | API + scraping + dashboard |

---

## 2. ŹRÓDŁA DANYCH

### A. Dane wejściowe
```
Źródło: docs/faza-2-analiza/output/all-problems.json
Zawiera: 4003 problemy wyekstrahowane z Airtable
Struktura każdego problemu:
  - id, problem, kategoria, branza
  - intensywnosc (1-5), sygnal_zakupowy (1-5)
  - obecne_rozwiazanie, dlaczego_nie_dziala
  - source (FB/Reddit), source_name
```

### B. Modele AI (przez OpenRouter)
```
1. Claude Opus 4 (anthropic/claude-opus-4)
2. Gemini 2.5 Pro (google/gemini-2.5-pro-preview)
3. Grok 3 (x-ai/grok-3-beta)
4. O3 Mini High (openai/o3-mini-high)
```

---

## 3. KRYTERIA OCENY (Product Fit Score)

| Kryterium | Punkty | Pytanie |
|-----------|--------|---------|
| **Problem Clarity** | 0-20 | Czy problem jest jasny i konkretny? |
| **MVP Simplicity** | 0-20 | Czy MVP można zbudować w 1-4 tygodnie? |
| **AI Leverage** | 0-20 | Czy AI (LLM, generatory grafik) daje przewagę? |
| **Mobile Fit** | 0-15 | Czy mobile app ma sens dla tego problemu? |
| **Monetization** | 0-15 | Czy ludzie zapłacą i jaki model? |
| **Competition Gap** | 0-10 | Czy jest luka na rynku? |

**Max score: 100 punktów**

### Progi decyzyjne
- **80-100**: EXCELLENT — buduj natychmiast
- **65-79**: STRONG — priorytet do walidacji
- **50-64**: GOOD — warto rozważyć
- **< 50**: WEAK — wymaga pivotu lub odrzuć

---

## 4. PIPELINE ANALIZY

### FAZA 1: FILTRACJA (kod)

**INPUT:** all-problems.json (4003 problemy)

**FILTR:**
```javascript
problem.intensywnosc >= 3 || problem.sygnal_zakupowy >= 3
```

**OUTPUT:** ~1500-2500 problemów wysokiego potencjału

---

### FAZA 2: CHUNKOWANIE (kod)

**INPUT:** Przefiltrowane problemy

**STRATEGIA:**
- Podziel na chunki po max 50 problemów
- Każdy chunk = osobne wywołanie do każdego modelu

**OUTPUT:** Array chunków

---

### FAZA 3: MULTI-MODEL ANALYSIS (AI)

**INPUT:** Jeden chunk problemów (50 problemów)

**MODELE:** Wszystkie 4, równolegle, TEN SAM PROMPT

**PROMPT:**
```
Jesteś ekspertem od znajdowania okazji produktowych dla low-code developera.

## WZORCE PRODUKTÓW (wybierz najbardziej pasujący):

1. MONITOR & ALERT - Śledź X, powiadom gdy Y
2. AI GENERATOR - Generuj X za pomocą AI (tekst, grafiki, audio)
3. AI ASSISTANT - Pomóż użytkownikowi z X (chatbot, copilot)
4. TEMPLATE PACK - Gotowe szablony do X
5. SIMPLIFIER - Uprość skomplikowany proces X
6. AGGREGATOR - Zbierz X z wielu źródeł w jedno miejsce

## KRYTERIA OCENY (dla każdej okazji):

- problem_clarity (0-20): Czy problem jest jasny?
- mvp_simplicity (0-20): MVP w 1-4 tygodnie?
- ai_leverage (0-20): Czy AI daje przewagę?
- mobile_fit (0-15): Czy mobile app ma sens?
- monetization (0-15): Czy ludzie zapłacą?
- competition_gap (0-10): Czy jest luka?

## PROBLEMY DO ANALIZY:

{{problemy_chunk}}

---

Dla każdego problemu który MA POTENCJAŁ (score >= 50):

1. Przypisz wzorzec produktu
2. Opisz konkretny produkt (nazwa + co robi)
3. Oceń wg kryteriów
4. Podaj tech stack do MVP
5. Podaj model monetyzacji
6. Oceń konkurencję

Zwróć JSON:
{
  "opportunities": [
    {
      "problem_id": "...",
      "problem_summary": "...",
      "pattern": "MONITOR_ALERT | AI_GENERATOR | AI_ASSISTANT | TEMPLATE_PACK | SIMPLIFIER | AGGREGATOR",
      "product_concept": {
        "name": "nazwa produktu",
        "description": "co robi w 1-2 zdaniach",
        "target_user": "dla kogo"
      },
      "scores": {
        "problem_clarity": 0-20,
        "mvp_simplicity": 0-20,
        "ai_leverage": 0-20,
        "mobile_fit": 0-15,
        "monetization": 0-15,
        "competition_gap": 0-10
      },
      "total_score": suma,
      "mvp_tech_stack": "np. React Native + Claude API + Supabase",
      "monetization_model": "np. 29 PLN/mies lub 99 PLN jednorazowo",
      "competition": "czy istnieje i jaka słabość",
      "why_good_fit": "dlaczego to dobra okazja"
    }
  ]
}

WAŻNE: Bądź KRYTYCZNY. Nie wszystko pasuje. Szukaj TYLKO problemów z realnym potencjałem.
```

**OUTPUT:** 4 pliki JSON (jeden per model) z listą okazji

---

### FAZA 4: CONSENSUS AGGREGATION (kod)

**INPUT:** Wyniki z 4 modeli

**ALGORYTM:**
1. Zgrupuj okazje po podobieństwie (fuzzy match na problem_summary)
2. Dla każdej okazji policz:
   - `model_count`: ile modeli ją znalazło (1-4)
   - `avg_score`: średni score
   - `consensus_bonus`: +5 punktów za każdy dodatkowy model
3. Oblicz `final_score = avg_score + consensus_bonus`
4. Sortuj malejąco po final_score

**OUTPUT:** Ranking okazji z konsensusem

---

### FAZA 5: TOP OPPORTUNITIES REPORT (kod)

**INPUT:** Ranking z Fazy 4

**OUTPUT:**
- `lowcode-opportunities.json` — pełne wyniki
- TOP 10 w konsoli z detalami

---

## 5. INTERPRETACJA WYNIKÓW

### Silny sygnał (priorytet)
- 4/4 modeli znalazło tę samą okazję
- Final score >= 80
- Wzorzec: dowolny z 6

### Dobry sygnał (warto walidować)
- 3/4 modeli
- Final score >= 65

### Słaby sygnał (do przemyślenia)
- 2/4 modeli
- Final score >= 50

### Odrzuć
- 1/4 modeli lub final_score < 50

---

## 6. NASTĘPNE KROKI PO ANALIZIE

1. **Wybierz TOP 3-5 okazji**
2. **Dla każdej przeprowadź walidację:**
   - 5-10 rozmów z potencjalnymi klientami
   - Landing page z waitlistą
   - Analiza konkurencji (głęboka)
3. **Wybierz 1 do MVP**
4. **Zbuduj MVP w 1-4 tygodnie**
