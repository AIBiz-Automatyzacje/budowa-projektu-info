# Profil Społeczności — Kontekst do Analizy

> **INSTRUKCJA:** Wypełnij ten plik realnymi danymi o Twojej społeczności.
> Plik jest wstrzykiwany do promptów AI podczas filtrowania okazji.
> Im dokładniejsze dane, tym lepsze dopasowanie wyników.

---

## 1. TWARDE LICZBY

### Społeczność
```yaml
nazwa: "[NAZWA SPOŁECZNOŚCI]"
typ: "[płatna członkostwo / darmowa / hybryda]"

metryki:
  platni_czlonkowie: [LICZBA]           # np. 600
  aktywni_miesieczne: [LICZBA]          # logujący się w ciągu 30 dni
  newsletter_subscribers: [LICZBA]

social_media:
  youtube_subs: [LICZBA]
  instagram_followers: [LICZBA]
  linkedin_followers: [LICZBA]
  twitter_followers: [LICZBA]
  tiktok_followers: [LICZBA]

reach_total: [SUMA]                      # łączny zasięg
```

### Finanse (opcjonalne, ale pomocne)
```yaml
mrr: [KWOTA PLN]                         # Monthly Recurring Revenue
avg_ticket: [KWOTA PLN]                  # średnia wartość klienta
churn_rate: [%]                          # miesięczny odpływ
```

---

## 2. KIM SĄ CZŁONKOWIE

### Profile demograficzne
```yaml
persony:
  - nazwa: "[np. Solopreneur]"
    udzial: [%]                          # np. 40%
    opis: "[1-2 zdania]"
    typowe_problemy:
      - "[problem 1]"
      - "[problem 2]"
    budzet_miesiecznie: "[zakres PLN]"   # np. "500-2000 PLN"

  - nazwa: "[np. Właściciel małej agencji]"
    udzial: [%]
    opis: "[1-2 zdania]"
    typowe_problemy:
      - "[problem 1]"
    budzet_miesiecznie: "[zakres PLN]"

  - nazwa: "[np. Freelancer]"
    udzial: [%]
    opis: "[1-2 zdania]"
    typowe_problemy:
      - "[problem 1]"
    budzet_miesiecznie: "[zakres PLN]"
```

### Branże członków
```yaml
branze:
  - nazwa: "[np. Marketing/Agencje]"
    udzial: [%]
  - nazwa: "[np. E-commerce]"
    udzial: [%]
  - nazwa: "[np. Coaching/Edukacja]"
    udzial: [%]
  - nazwa: "[np. IT/Dev]"
    udzial: [%]
  - nazwa: "Inne"
    udzial: [%]
```

### Poziom techniczny
```yaml
tech_level:
  zaawansowani: [%]                      # piszą kod, znają API
  sredni: [%]                            # no-code, automatyzacje
  poczatkujacy: [%]                      # Excel, podstawy
```

---

## 3. KOMPETENCJE ZESPOŁU

### Co umiemy zbudować
```yaml
kompetencje_core:
  - "[np. No-code automation (Make, n8n)]"
  - "[np. AI integration (API OpenAI, Anthropic)]"
  - "[np. Vibe coding (Cursor, Claude Code)]"
  - "[np. Low-code apps (Bubble, FlutterFlow)]"
  - "[np. Content creation]"
  - "[np. Community building]"

kompetencje_rozwijane:
  - "[czego się uczycie]"

kompetencje_brakujace:
  - "[czego nie umiecie i nie planujecie]"
  - "[np. Custom ML models]"
  - "[np. Mobile native apps]"
  - "[np. Enterprise software]"
```

### Zasoby
```yaml
zespol:
  liczba_osob: [LICZBA]
  dostepnosc_h_tydzien: [LICZBA]         # na projekty produktowe

budzet:
  start_pln: [KWOTA]                     # ile można zainwestować w MVP
  miesiecznie_pln: [KWOTA]               # ongoing koszty

czasowe:
  czas_do_mvp_max_tygodnie: [LICZBA]     # ile max czasu na MVP
  runway_miesiace: [LICZBA]              # ile czasu na walidację
```

---

## 4. ISTNIEJĄCE AKTYWA

### Content i wiedza
```yaml
istniejacy_content:
  - temat: "[np. Automatyzacja z Make]"
    typ: "[kurs / materiały / posty]"
    zasieg: "[liczba osób która widziała]"

  - temat: "[np. AI w biznesie]"
    typ: "[...]"
    zasieg: "[...]"

tematy_authority:                        # w czym jesteście ekspertami
  - "[temat 1]"
  - "[temat 2]"
  - "[temat 3]"
```

### Dystrybucja
```yaml
kanaly_dystrybucji:
  - kanal: "[np. Newsletter]"
    zasieg: [LICZBA]
    konwersja: "[% do akcji]"

  - kanal: "[np. Społeczność Discord/Slack]"
    zasieg: [LICZBA]
    engagement: "[opis aktywności]"

  - kanal: "[np. YouTube]"
    zasieg: [LICZBA]
    typ_contentu: "[...]"
```

---

## 5. OGRANICZENIA I RED FLAGS

### Czego NIE robimy
```yaml
wykluczenia_branzowe:
  - "[np. Medycyna regulowana]"
  - "[np. Finanse (licencje)]"
  - "[np. Hazard]"

wykluczenia_techniczne:
  - "[np. Hardware]"
  - "[np. Blockchain/crypto]"
  - "[np. VR/AR]"

wykluczenia_modelowe:
  - "[np. B2B Enterprise (długie cykle sprzedaży)]"
  - "[np. Marketplace wymagające obu stron naraz]"
```

### Ryzyka do unikania
```yaml
unikamy:
  - "[np. Projektów wymagających dużego kapitału na start]"
  - "[np. Produktów z wysokim kosztem wsparcia]"
  - "[np. Rynków zdominowanych przez duże firmy]"
```

---

## 6. PREFERENCJE MONETYZACJI

### Preferowane modele
```yaml
modele_preferowane:                      # od najbardziej do najmniej
  1:
    typ: "[np. Afiliacja]"
    dlaczego: "[niskie ryzyko, szybki start]"

  2:
    typ: "[np. SaaS subscription]"
    dlaczego: "[recurring revenue]"

  3:
    typ: "[np. One-time digital product]"
    dlaczego: "[proste, skalowalne]"

modele_do_rozważenia:
  - "[np. Marketplace prowizyjny]"

modele_wykluczone:
  - "[np. Consulting 1:1]"
  - "[np. Freemium bez ścieżki do płatności]"
```

### Cele
```yaml
cele_krotkoterminowe:                    # 3-6 miesięcy
  - "[np. Walidacja 1-2 produktów]"
  - "[np. $5K MRR z nowego produktu]"

cele_dlugoterminowe:                     # 12+ miesięcy
  - "[np. Portfolio 3-5 mikro-produktów]"
  - "[np. $50K MRR łącznie]"
```

---

## 7. KONTEKST DODATKOWY (opcjonalne)

### Historia
```
[Krótka historia społeczności — skąd się wzięła, jak rosła,
kluczowe momenty, co zadziałało, co nie zadziałało]
```

### Unikalna przewaga
```
[Co wyróżnia tę społeczność? Dlaczego ludzie płacą?
Co możecie zrobić czego inni nie mogą?]
```

### Bieżące eksperymenty
```
[Nad czym aktualnie pracujecie? Jakie produkty testujecie?
Co z tego może być kontekstem dla analizy?]
```

---

## WERSJONOWANIE

```yaml
wersja: "1.0"
ostatnia_aktualizacja: "[DATA]"
autor: "[KTO WYPEŁNIŁ]"
nastepny_review: "[KIEDY ZAKTUALIZOWAĆ]"
```

---

> **WAŻNE:** Ten plik powinien być aktualizowany co 1-3 miesiące
> lub po istotnych zmianach w społeczności/zasobach.
>
> Dane są używane przez AI do filtrowania okazji —
> nieaktualne dane = złe rekomendacje.
