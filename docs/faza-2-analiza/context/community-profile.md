# Profil Społeczności — Akademia Automatyzacji

> Dokument używany przez frameworki Pain Radar i Gap Hunter do filtrowania okazji pod kątem dopasowania do zasobów i możliwości AA.

---

## 1. TWARDE LICZBY

### Społeczność
```yaml
nazwa: "Akademia Automatyzacji"
typ: "hybryda (darmowe grupy + płatna społeczność Skool)"

metryki:
  platni_czlonkowie: 600
  newsletter_subscribers: 5500
  biblioteka_wideo: 200+ lekcji

grupy_facebook:
  akademia_automatyzacji: 34000
  n8n_polska: 5000
  ai_bez_kodowania: 3000
  claude_code_polska: 500
  lacznie: 42500

youtube:
  live_viewers: 400-1000

reach_total: ~50000
```

### Finanse
```yaml
cena_czlonkostwa: 2997 PLN (jednorazowo lub 3 raty)
model_sprawdzony: "jednorazowa płatność > subskrypcja"
```

---

## 2. KIM SĄ CZŁONKOWIE

### Profile demograficzne
```yaml
persony:
  - nazwa: "Przedsiębiorca SMB"
    udzial: 35%
    opis: "Właściciel małej firmy (1-20 osób) szukający automatyzacji procesów"
    typowe_problemy:
      - "Za dużo manualnej pracy, brak czasu"
      - "Nie wie od czego zacząć z automatyzacją"
      - "Płaci za narzędzia których nie wykorzystuje"
    budzet_miesiecznie: "500-2000 PLN"

  - nazwa: "Freelancer"
    udzial: 30%
    opis: "Osoba pracująca na własny rachunek, chcąca skalować bez zatrudniania"
    typowe_problemy:
      - "Zbyt dużo czasu na powtarzalne zadania"
      - "Brak systemów do obsługi klientów"
      - "Chaos w komunikacji i dokumentach"
    budzet_miesiecznie: "200-500 PLN"

  - nazwa: "Marketer / Agencja"
    udzial: 20%
    opis: "Marketer lub właściciel małej agencji szukający efektywności"
    typowe_problemy:
      - "Raportowanie dla klientów zajmuje za dużo czasu"
      - "Integracje między narzędziami nie działają"
      - "Ręczne zarządzanie kampaniami"
    budzet_miesiecznie: "500-1500 PLN"

  - nazwa: "Osoba techniczna"
    udzial: 15%
    opis: "Developer lub osoba techniczna rozwijająca umiejętności AI"
    typowe_problemy:
      - "Chce wykorzystać AI w projektach"
      - "Szuka praktycznych zastosowań nowych narzędzi"
    budzet_miesiecznie: "500-1000 PLN"
```

### Branże członków
```yaml
branze:
  - nazwa: "Marketing / Agencje"
    udzial: 30%
  - nazwa: "E-commerce"
    udzial: 20%
  - nazwa: "Freelance / Usługi"
    udzial: 20%
  - nazwa: "Content / Twórcy"
    udzial: 15%
  - nazwa: "IT / Development"
    udzial: 10%
  - nazwa: "Inne"
    udzial: 5%
```

### Poziom techniczny
```yaml
tech_level:
  zaawansowani: 20%    # piszą kod, znają API, budują własne rozwiązania
  sredni: 50%          # używają Make/n8n, kopiują szablony, modyfikują
  poczatkujacy: 30%    # szukają gotowych rozwiązań, boją się "kodu"
```

### Budżet na narzędzia
```yaml
typowy_budzet_miesiecznie: 500 PLN
wrazliwosc_cenowa: "średnia-wysoka (szukają ROI)"
gotowosc_do_placenia: "tak, jeśli oszczędza czas/pieniądze"
```

---

## 3. KOMPETENCJE ZESPOŁU

### Co umiemy zbudować
```yaml
kompetencje_core:
  - "No-code automation (Make, n8n) — EKSPERT"
  - "AI integration (Claude, Anthropic API, OpenAI) — EKSPERT"
  - "Vibe coding (Claude Code, Next.js) — ZAAWANSOWANY"
  - "Web scraping (Apify) — ZAAWANSOWANY"
  - "Web development (Next.js, TypeScript, Supabase) — ZAAWANSOWANY"
  - "Content creation & community building — EKSPERT"

kompetencje_rozwijane:
  - "Claude Code (aktualnie tworzony kurs)"
  - "Advanced AI agents"

kompetencje_brakujace:
  - "Mobile native apps"
  - "Blockchain/crypto"
  - "Custom ML models training"
  - "Enterprise software"
  - "Hardware/IoT"
```

### Zasoby
```yaml
zespol:
  - osoba: "Kacper"
    rola: "Tech, content, mentoring, twarz marki"
    dostepnosc_h_tydzien: 20
  - osoba: "Marcin"
    rola: "Marketing, strategia, operacje"
    dostepnosc_h_tydzien: 5
  lacznie_h_tydzien: 25

budzet:
  start_pln: 5000
  miesiecznie_pln: "do ustalenia po wyborze projektu"

czasowe:
  czas_do_mvp_max:
    no_code: "1-2 tygodnie"
    vibe_coding: "2-4 tygodnie"
    custom_dev: "4-8 tygodni"
```

---

## 4. ISTNIEJĄCE AKTYWA

### Content i wiedza
```yaml
istniejacy_content:
  - temat: "n8n, Make — automatyzacja workflow"
    typ: "kurs + szablony + live'y"
    poziom: "dużo materiałów"

  - temat: "Claude, ChatGPT, prompty"
    typ: "lekcje + posty + live'y"
    poziom: "dużo materiałów"

  - temat: "Claude Code"
    typ: "kurs (w budowie) + live'y"
    poziom: "aktualnie rozwijane"

  - temat: "Apify / scraping"
    typ: "lekcje"
    poziom: "średnio materiałów"

  - temat: "Automatyzacja procesów biznesowych"
    typ: "core content"
    poziom: "dużo materiałów"

tematy_authority:
  - "Automatyzacja no-code (Make, n8n)"
  - "AI w biznesie (Claude, ChatGPT)"
  - "Prompt engineering"
  - "Claude Code"
```

### Dystrybucja
```yaml
kanaly_dystrybucji:
  - kanal: "Grupy Facebook"
    zasieg: 42500
    engagement: "wysoki (dużo reakcji i komentarzy)"

  - kanal: "Newsletter (MailerLite)"
    zasieg: 5500

  - kanal: "YouTube live"
    zasieg: "400-1000 widzów na live"
    typ_contentu: "budowanie projektów na żywo"

  - kanal: "Skool (płatna)"
    zasieg: 600
    engagement: "bardzo wysoki"

  - kanal: "LinkedIn (Kacper)"
    typ: "posty osobiste, rosnący"

  - kanal: "X/Twitter (Kacper)"
    typ: "posty osobiste, rosnący"
```

---

## 5. OGRANICZENIA I RED FLAGS

### Czego NIE robimy
```yaml
wykluczenia_branzowe:
  - "Medycyna regulowana"
  - "Finanse wymagające licencji"
  - "Hazard"

wykluczenia_techniczne:
  - "Hardware / IoT"
  - "Blockchain / crypto"
  - "VR / AR"
  - "Mobile native apps"
  - "Custom ML model training"

wykluczenia_modelowe:
  - "B2B Enterprise (długie cykle sprzedaży)"
  - "Produkty wymagające dużego kapitału na start (>10K PLN)"
  - "Marketplace wymagające obu stron naraz od startu"
```

### Ryzyka do unikania
```yaml
unikamy:
  - "Projektów wymagających >8 tygodni do MVP"
  - "Produktów z wysokim kosztem wsparcia technicznego"
  - "Rynków zdominowanych przez duże firmy z network effects"
  - "Subskrypcji (sprawdzony niski LTV w AA)"
```

---

## 6. PREFERENCJE MONETYZACJI

### Aktualne programy afiliacyjne
```yaml
afiliacje_aktywne:
  - "Hosting (Hostinger)"
  - "Make"
  - "API (OpenAI/Anthropic)"
  - "Voice Engine"
```

### Preferowane modele dla nowego produktu
```yaml
modele_preferowane:
  1:
    typ: "Afiliacja"
    dlaczego: "niskie ryzyko, szybki start, pasuje do contentu"

  2:
    typ: "SaaS / Narzędzie (jednorazowa płatność)"
    dlaczego: "zgodne z DNA społeczności, przetestowany model"

  3:
    typ: "Freemium → Paid"
    dlaczego: "budowanie bazy użytkowników"

  4:
    typ: "Marketplace / Szablony"
    dlaczego: "sprzedaż gotowych automatyzacji"

modele_wykluczone:
  - "Subskrypcja miesięczna (przetestowane — niski LTV)"
  - "Consulting 1:1 (nie skaluje się)"
  - "Freemium bez ścieżki do płatności"
```

---

## 7. KONTEKST DODATKOWY

### Unikalna przewaga
```
- Największa polska społeczność AI/automatyzacji (42K+ FB)
- 600+ płacących członków = zwalidowany produkt
- Kacper jako rozpoznawalna twarz w niszy
- Praktyczne podejście (live coding, case studies)
- Transparentność (pokazywanie kosztów, czasu, wyników)
```

### Bieżące eksperymenty
```
- Seria "Budowa biznesu od zera z AI/NoCode" — publiczny case study
- Kurs Claude Code (w budowie)
- Live "Claude Code od ZERA" — 15 stycznia 2026
- Ten projekt: research → analiza → wybór pomysłu → budowa aplikacji
```

---

## 8. KRYTERIA SCORINGOWE

### Wzór obliczania Community Fit Score

```
TARGET FIT (0-30 pkt)
├── Czy problem dotyczy naszych branż? (0-15)
└── Czy to nasi ludzie (SMB, freelance, przedsiębiorcy)? (0-15)

CAPABILITY FIT (0-25 pkt)
├── Czy umiemy to zbudować? (0-15)
└── Czy zmieścimy się w czasie/budżecie? (0-10)

MONETIZATION FIT (0-25 pkt)
├── Czy ta grupa płaci za rozwiązania? (0-15)
└── Czy pasuje do naszych modeli (afiliacja/SaaS)? (0-10)

DISTRIBUTION FIT (0-20 pkt)
├── Czy możemy dotrzeć przez nasze kanały? (0-10)
└── Czy mamy już content w tym temacie? (0-10)

TOTAL: 0-100 pkt
```

### Progi decyzyjne

| Score | Rekomendacja |
|-------|--------------|
| 80-100 | **STRONG FIT** — priorytet do walidacji |
| 60-79 | **GOOD FIT** — warto rozważyć |
| 40-59 | **PARTIAL FIT** — wymaga pivotu lub niszy |
| 0-39 | **POOR FIT** — odrzucić |

### Quick Wins (bonus points)

```
+5 pkt — Możemy zbudować w no-code (Make/n8n)
+5 pkt — Mamy już content w tym temacie
+5 pkt — Możemy użyć jako case study dla AA
+5 pkt — Pasuje do aktualnej serii "Budowa biznesu od zera"
+3 pkt — Integruje się z narzędziami które już uczymy
```

---

## WERSJONOWANIE

```yaml
wersja: "1.0"
ostatnia_aktualizacja: "2026-01-04"
autor: "Kacper + Claude"
nastepny_review: "2026-04-01"
```
