# Projekt: Research & Analiza Rynku - Akademia Automatyzacji

## Cel projektu

Znalezienie pomysłu na aplikację do zmonetyzowania poprzez analizę danych z grup Facebook i subredditów. Podejście data-driven: najpierw zbieramy dane, analizujemy problemy użytkowników, potem wybieramy pomysł na produkt.

## Kontekst

- **Społeczność:** Akademia Automatyzacji (~600 płacących członków)
- **Zasięgi:** 50K+ na social media
- **Dotychczasowy sukces:** wirale.pl - aplikacja do wiralowych postów
- **Model monetyzacji:** Afiliacja jako punkt wyjścia, możliwość rozbudowy

## Plan działania

### Faza 1: Zbieranie danych ✅
- [x] Research grup Facebook (8 segmentów)
- [x] Research subredditów (8 segmentów)
- [x] Scraping danych z grup Facebook
- [x] Scraping danych z subredditów
- [x] Generowanie raportów AI

### Faza 2: Analiza AI (w trakcie)
- [x] Zaprojektowanie frameworków analizy
  - Pain Radar (bottom-up agregacja problemów)
  - Gap Hunter (top-down analiza luk rynkowych)
- [ ] Zdefiniowanie zasobów AA (parametry filtrowania)
- [ ] Ekstrakcja i normalizacja danych z raportów
- [ ] Analiza problemów i wyzwań użytkowników
- [ ] Mapowanie powtarzających się tematów
- [ ] Identyfikacja luk rynkowych
- [ ] Budowa dashboardu wizualizacyjnego

### Faza 3: Wybór pomysłu
- [ ] Ocena pomysłów pod kątem wykonalności
- [ ] Dopasowanie do grupy docelowej
- [ ] Wybór MVP

### Faza 4: Budowa i monetyzacja
- [ ] Implementacja MVP (live coding)
- [ ] Wdrożenie modelu afiliacyjnego
- [ ] Iteracja na podstawie feedbacku

## Struktura projektu

```
live/
├── PLAN.md                             # Ten plik
├── CLAUDE.md                           # Konfiguracja projektu (Airtable)
├── PLAYBOOK-OD-POMYSLU-DO-SCALE.md     # Kompletny playbook budowy projektu
├── docs/
│   ├── faza-1-zbieranie-danych/
│   │   ├── facebook-groups-research/
│   │   │   ├── groups.md               # 105 polskich grup FB (8 segmentów)
│   │   │   ├── plan.md                 # Plan researchu FB
│   │   │   └── README.md
│   │   └── reddit-research/
│   │       ├── subreddits.md           # 154 subredditów (8 segmentów)
│   │       └── plan.md                 # Plan researchu Reddit
│   └── faza-2-analiza/
│       ├── framework-pain-radar.md     # Bottom-up: agregacja problemów
│       └── framework-gap-hunter.md     # Top-down: analiza luk rynkowych
└── RESEARCH/                           # Dodatkowe materiały badawcze
```

## Segmenty badawcze

1. **AI / Narzędzia AI** - ChatGPT, Claude, Midjourney, prompty
2. **No-code / Automatyzacja** - n8n, Make, Zapier, Airtable
3. **Programowanie / Vibe coding** - Cursor, AI coding, web dev
4. **Przedsiębiorcy / Startupy** - SaaS, indie hackers, solopreneurs
5. **Marketing / Growth** - SEO, PPC, growth hacking, social media
6. **Content / Twórcy** - YouTube, TikTok, podcasting
7. **Freelance / Praca zdalna** - remote work, digital nomad
8. **E-commerce** - Shopify, dropshipping, Amazon

## Dane źródłowe

| Źródło | Liczba | Z raportem | Bez analizy | Status |
|--------|--------|------------|-------------|--------|
| Grupy Facebook | 105 | 40 | 65* | ✅ Zakończone |
| Subreddity | 154 | 154 | 0 | ✅ Zakończone |

*65 grup FB bez analizy - powód: "Mniej niż 20 postów" lub "Pusto" (za mało danych do analizy)

## Następne kroki (Faza 2)

1. **Zdefiniować zasoby AA** — parametry filtrowania (tech, czas, budżet)
2. **Ekstrakcja danych** — wyciągnąć wszystkie problemy z 194 raportów JSON
3. **Uruchomić oba frameworki**:
   - Pain Radar → ranking TOP 20 problemów (PPS score)
   - Gap Hunter → mapa luk + słabości konkurencji
4. **Zbudować dashboard** — React app z wizualizacją wyników
5. **Wybrać shortlist** — 3-5 kandydatów do walidacji

---

*Ostatnia aktualizacja: 2025-12-21*
