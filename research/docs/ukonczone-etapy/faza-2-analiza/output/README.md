# Output fazy 2 - Analiza problemów

Wyniki pipeline'u analizy problemów zebranych z:
- 105 grup Facebook
- 154 subredditów Reddit

## Statystyki

- **Łączna liczba problemów:** 4003
- **Źródła:** Facebook (2090), Reddit (1913)

## Pliki

| Plik | Opis | Rozmiar |
|------|------|---------|
| `all-problems.json` | Wszystkie wyekstrahowane problemy z normalizacją kategorii i branż | ~2.5 MB |
| `aggregates.json` | Agregaty wg kategorii i branży ze statystykami cross-platform | ~250 KB |
| `extracted-categories.json` | Surowe kategorie przed normalizacją | ~187 KB |
| `normalization-mapping-v3.json` | Aktualne mapowanie kategorii i branż | ~170 KB |
| `mapping-plans.json` | Plany mapowania wygenerowane przez AI | ~16 KB |
| `pps-rankings.json` | Ranking Pain Priority Score dla kategorii | ~14 KB |
| `hidden-patterns.json` | Wykryte ukryte wzorce w danych | ~10 KB |

## Struktura danych

### all-problems.json

```json
{
  "meta": {
    "total_problems": 4003,
    "sources": { "facebook": 2090, "reddit": 1913 }
  },
  "problems": [
    {
      "id": "...",
      "problem": "Opis problemu...",
      "kategoria": "Znormalizowana kategoria",
      "branza": "Znormalizowana branża",
      "intensywnosc": 1-5,
      "sygnal_zakupowy": 1-5,
      "platform": "FB|Reddit"
    }
  ]
}
```

### pps-rankings.json

Ranking kategorii według Pain Priority Score (PPS) - holistyczna ocena uwzględniająca:
- Sygnał zakupowy (najważniejszy)
- Intensywność problemu
- Częstotliwość występowania
- Cross-platform validation
