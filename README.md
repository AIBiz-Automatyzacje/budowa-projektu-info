# Projekt: Research & Analiza Rynku - Akademia Automatyzacji

## Cel projektu

Znalezienie pomysłu na aplikację do zmonetyzowania poprzez analizę danych z grup Facebook i subredditów. Podejście data-driven: najpierw zbieramy dane, analizujemy problemy użytkowników, potem wybieramy pomysł na produkt.

## Kontekst

- **Społeczność:** Akademia Automatyzacji (~600 płacących członków)
- **Zasięgi:** 50K+ na social media
- **Dotychczasowy sukces:** wirale.pl - aplikacja do wiralowych postów
- **Model monetyzacji:** Afiliacja jako punkt wyjścia, możliwość rozbudowy

## Plan działania

### Faza 1: Zbieranie danych
- [x] Research 139 grup Facebook (8 segmentów)
- [x] Research 163 subredditów (8 segmentów)
- [ ] Scraping danych z grup (od początku 2025)
- [ ] Scraping danych z subredditów (dłuższy okres)

### Faza 2: Analiza AI
- [ ] Analiza problemów i wyzwań użytkowników
- [ ] Mapowanie powtarzających się tematów
- [ ] Identyfikacja luk rynkowych

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
├── README.md                           # Ten plik
├── PLAYBOOK-OD-POMYSLU-DO-SCALE.md     # Kompletny playbook budowy projektu
├── facebook-groups-research/
│   ├── groups.md                       # 139 polskich grup FB (8 segmentów)
│   └── plan.md                         # Plan researchu
├── reddit-research/
│   ├── subreddits.md                   # 163 subredditów (8 segmentów)
│   └── plan.md                         # Plan researchu
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

| Źródło | Liczba | Status |
|--------|--------|--------|
| Grupy Facebook | 139 | ✅ Research gotowy, do scrapowania |
| Subreddity | 163 | ✅ Research gotowy, do scrapowania |

## Następne kroki

1. Ustalenie narzędzi do scrapowania (Apify, własne skrypty, MCP)
2. Określenie zakresu czasowego danych
3. Przygotowanie pipeline'u do analizy AI

---

*Ostatnia aktualizacja: 2025-12-12*
