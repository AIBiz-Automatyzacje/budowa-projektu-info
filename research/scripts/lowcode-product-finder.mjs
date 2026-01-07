import fs from "fs/promises";
import dotenv from "dotenv";

dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

// 4 modele do cross-walidacji (zaktualizowane ID z frameworku)
const MODELS = [
  { id: "anthropic/claude-opus-4", name: "Claude Opus 4" },
  { id: "google/gemini-2.5-pro-preview", name: "Gemini 2.5 Pro" },
  { id: "x-ai/grok-3-beta", name: "Grok 3" },
  { id: "openai/o3-mini-high", name: "O3 Mini High" },
];

const CHUNK_SIZE = 50;
const OUTPUT_DIR = "./docs/faza-2-analiza/output";

// Wzorce produktowe
const PATTERNS = [
  "MONITOR_ALERT",
  "AI_GENERATOR",
  "AI_ASSISTANT",
  "TEMPLATE_PACK",
  "SIMPLIFIER",
  "AGGREGATOR",
];

async function callModel(modelId, prompt, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://github.com/live-research",
          "X-Title": "Low-Code Product Finder",
        },
        body: JSON.stringify({
          model: modelId,
          messages: [{ role: "user", content: prompt }],
          max_tokens: 16000,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`${response.status} - ${error}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error(`  [${modelId}] Attempt ${attempt}/${retries} failed:`, error.message);
      if (attempt === retries) throw error;
      await sleep(2000 * attempt); // Exponential backoff
    }
  }
}

function parseJSON(text) {
  let clean = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  return JSON.parse(clean);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildPrompt(problems) {
  const problemsFormatted = problems.map((p, i) => ({
    id: p.id,
    problem: p.problem,
    kategoria: p.kategoria,
    branza: p.branza,
    intensywnosc: p.intensywnosc,
    sygnal_zakupowy: p.sygnal_zakupowy,
    obecne_rozwiazanie: p.obecne_rozwiazanie,
    dlaczego_nie_dziala: p.dlaczego_nie_dziala,
  }));

  return `Jesteś ekspertem od znajdowania okazji produktowych dla low-code developera.

## WZORCE PRODUKTÓW (wybierz najbardziej pasujący):

1. MONITOR_ALERT - Śledź X, powiadom gdy Y (np. nowe zlecenia, zmiany cen)
2. AI_GENERATOR - Generuj X za pomocą AI (tekst, grafiki, audio, video)
3. AI_ASSISTANT - Pomóż użytkownikowi z X (chatbot, copilot, advisor)
4. TEMPLATE_PACK - Gotowe szablony do X (prompty, Notion, Excel, workflow)
5. SIMPLIFIER - Uprość skomplikowany proces X (wizard, auto-fill)
6. AGGREGATOR - Zbierz X z wielu źródeł w jedno miejsce (dashboard, porównywarka)

## KRYTERIA OCENY (dla każdej okazji):

- problem_clarity (0-20): Czy problem jest jasny i konkretny?
- mvp_simplicity (0-20): Czy MVP można zbudować w 1-4 tygodnie?
- ai_leverage (0-20): Czy AI (LLM, generatory grafik) daje przewagę?
- mobile_fit (0-15): Czy mobile app ma sens dla tego problemu?
- monetization (0-15): Czy ludzie zapłacą i jaki model?
- competition_gap (0-10): Czy jest luka na rynku?

Max: 100 punktów

## PROBLEMY DO ANALIZY:

${JSON.stringify(problemsFormatted, null, 2)}

---

ZADANIE: Dla każdego problemu który MA POTENCJAŁ PRODUKTOWY (score >= 50):

1. Przypisz wzorzec produktu (jeden z 6)
2. Opisz konkretny produkt (nazwa + co robi)
3. Oceń wg 6 kryteriów
4. Podaj tech stack do MVP
5. Podaj model monetyzacji
6. Oceń konkurencję

Zwróć TYLKO poprawny JSON (bez markdown):
{
  "opportunities": [
    {
      "problem_id": "...",
      "problem_summary": "krótkie podsumowanie problemu",
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
      "total_score": suma (0-100),
      "mvp_tech_stack": "np. React Native + Claude API + Supabase",
      "monetization_model": "np. 29 PLN/mies lub 99 PLN jednorazowo",
      "competition": "czy istnieje i jaka słabość",
      "why_good_fit": "dlaczego to dobra okazja dla low-code dev"
    }
  ]
}

WAŻNE:
- Bądź KRYTYCZNY. Nie wszystko pasuje. Szukaj TYLKO problemów z realnym potencjałem.
- Jeśli problem nie pasuje do żadnego wzorca lub score < 50, POMIŃ go.
- Zwracaj TYLKO JSON, bez komentarzy.`;
}

async function processChunk(chunkIndex, problems, totalChunks) {
  console.log(`\n[Chunk ${chunkIndex + 1}/${totalChunks}] Przetwarzam ${problems.length} problemów...`);

  const prompt = buildPrompt(problems);
  const results = [];

  // Wywołaj wszystkie modele równolegle
  const modelPromises = MODELS.map(async (model) => {
    console.log(`  → ${model.name}...`);
    try {
      const response = await callModel(model.id, prompt);
      const parsed = parseJSON(response);
      console.log(`  ✓ ${model.name}: ${parsed.opportunities?.length || 0} okazji`);
      return {
        model: model.name,
        model_id: model.id,
        opportunities: parsed.opportunities || [],
      };
    } catch (error) {
      console.error(`  ✗ ${model.name}: ${error.message}`);
      return {
        model: model.name,
        model_id: model.id,
        opportunities: [],
        error: error.message,
      };
    }
  });

  const modelResults = await Promise.all(modelPromises);
  return modelResults;
}

function aggregateResults(allChunkResults) {
  console.log("\n=== AGREGACJA WYNIKÓW ===\n");

  // Zbierz wszystkie okazje z wszystkich modeli
  const allOpportunities = [];

  for (const chunkResults of allChunkResults) {
    for (const modelResult of chunkResults) {
      for (const opp of modelResult.opportunities) {
        allOpportunities.push({
          ...opp,
          found_by: modelResult.model,
        });
      }
    }
  }

  console.log(`Total okazji (przed agregacją): ${allOpportunities.length}`);

  // Grupuj po problem_id
  const byProblem = {};
  for (const opp of allOpportunities) {
    const key = opp.problem_id;
    if (!byProblem[key]) {
      byProblem[key] = [];
    }
    byProblem[key].push(opp);
  }

  // Oblicz consensus dla każdego problemu
  const aggregated = [];

  for (const [problemId, opps] of Object.entries(byProblem)) {
    const modelCount = new Set(opps.map((o) => o.found_by)).size;
    const avgScore = opps.reduce((sum, o) => sum + (o.total_score || 0), 0) / opps.length;
    const consensusBonus = (modelCount - 1) * 5; // +5 za każdy dodatkowy model
    const finalScore = Math.round(avgScore + consensusBonus);

    // Wybierz najlepszą wersję produktu (najwyższy score)
    const bestOpp = opps.reduce((best, curr) =>
      (curr.total_score || 0) > (best.total_score || 0) ? curr : best
    );

    // Zbierz wszystkie patterns
    const patterns = [...new Set(opps.map((o) => o.pattern))];

    // Zbierz modele które znalazły
    const foundByModels = [...new Set(opps.map((o) => o.found_by))];

    aggregated.push({
      problem_id: problemId,
      problem_summary: bestOpp.problem_summary,
      pattern: patterns.length === 1 ? patterns[0] : patterns,
      product_concept: bestOpp.product_concept,
      scores: bestOpp.scores,
      avg_score: Math.round(avgScore),
      model_count: modelCount,
      consensus_bonus: consensusBonus,
      final_score: finalScore,
      found_by_models: foundByModels,
      mvp_tech_stack: bestOpp.mvp_tech_stack,
      monetization_model: bestOpp.monetization_model,
      competition: bestOpp.competition,
      why_good_fit: bestOpp.why_good_fit,
    });
  }

  // Sortuj po final_score
  aggregated.sort((a, b) => b.final_score - a.final_score);

  console.log(`Unikalne okazje (po agregacji): ${aggregated.length}`);
  console.log(`4/4 modeli zgodnych: ${aggregated.filter((a) => a.model_count === 4).length}`);
  console.log(`3/4 modeli zgodnych: ${aggregated.filter((a) => a.model_count === 3).length}`);
  console.log(`2/4 modeli zgodnych: ${aggregated.filter((a) => a.model_count === 2).length}`);
  console.log(`1/4 model: ${aggregated.filter((a) => a.model_count === 1).length}`);

  return aggregated;
}

function classifyOpportunity(finalScore, modelCount) {
  if (finalScore >= 80 && modelCount >= 3) return "EXCELLENT";
  if (finalScore >= 65 && modelCount >= 2) return "STRONG";
  if (finalScore >= 50) return "GOOD";
  return "WEAK";
}

async function main() {
  console.log("=== LOW-CODE PRODUCT FINDER ===\n");
  console.log("Modele:", MODELS.map((m) => m.name).join(", "));

  // 1. Wczytaj dane
  const data = JSON.parse(
    await fs.readFile("./docs/faza-2-analiza/output/all-problems.json", "utf-8")
  );
  console.log(`\nWczytano ${data.problems.length} problemów`);

  // 2. Filtruj (ścisły filtr)
  const filtered = data.problems.filter(
    (p) => p.intensywnosc >= 3 && p.sygnal_zakupowy >= 3
  );
  console.log(`Po filtrze (int>=3 AND syg>=3): ${filtered.length} problemów`);

  // 3. Podziel na chunki
  const chunks = [];
  for (let i = 0; i < filtered.length; i += CHUNK_SIZE) {
    chunks.push(filtered.slice(i, i + CHUNK_SIZE));
  }
  console.log(`Chunków: ${chunks.length} (po ${CHUNK_SIZE} problemów)`);
  console.log(`Wywołań API: ${chunks.length * MODELS.length}`);

  // 4. Przetwarzaj chunki
  const allChunkResults = [];
  const startTime = Date.now();

  for (let i = 0; i < chunks.length; i++) {
    const chunkResults = await processChunk(i, chunks[i], chunks.length);
    allChunkResults.push(chunkResults);

    // Zapisz częściowe wyniki po każdym chunku
    await fs.writeFile(
      `${OUTPUT_DIR}/lowcode-partial-chunk-${i}.json`,
      JSON.stringify(chunkResults, null, 2)
    );

    // Pauza między chunkami żeby nie przekroczyć rate limitów
    if (i < chunks.length - 1) {
      console.log("  (pauza 3s...)");
      await sleep(3000);
    }
  }

  const elapsed = Math.round((Date.now() - startTime) / 1000);
  console.log(`\nCzas przetwarzania: ${elapsed}s`);

  // 5. Agreguj wyniki
  const aggregated = aggregateResults(allChunkResults);

  // 6. Dodaj klasyfikację
  const classified = aggregated.map((opp) => ({
    ...opp,
    classification: classifyOpportunity(opp.final_score, opp.model_count),
  }));

  // 7. Statystyki po wzorcach
  const byPattern = {};
  for (const opp of classified) {
    const pattern = Array.isArray(opp.pattern) ? opp.pattern[0] : opp.pattern;
    if (!byPattern[pattern]) byPattern[pattern] = [];
    byPattern[pattern].push(opp);
  }

  console.log("\n=== ROZKŁAD PO WZORCACH ===");
  for (const [pattern, opps] of Object.entries(byPattern)) {
    console.log(`${pattern}: ${opps.length} (avg score: ${Math.round(opps.reduce((s, o) => s + o.final_score, 0) / opps.length)})`);
  }

  // 8. Zapisz wyniki
  const output = {
    meta: {
      generated: new Date().toISOString(),
      input_problems: data.problems.length,
      filtered_problems: filtered.length,
      chunks: chunks.length,
      models: MODELS.map((m) => m.name),
      processing_time_seconds: elapsed,
    },
    summary: {
      total_opportunities: classified.length,
      excellent: classified.filter((o) => o.classification === "EXCELLENT").length,
      strong: classified.filter((o) => o.classification === "STRONG").length,
      good: classified.filter((o) => o.classification === "GOOD").length,
      weak: classified.filter((o) => o.classification === "WEAK").length,
      by_pattern: Object.fromEntries(
        Object.entries(byPattern).map(([p, opps]) => [p, opps.length])
      ),
      by_model_consensus: {
        "4_models": classified.filter((o) => o.model_count === 4).length,
        "3_models": classified.filter((o) => o.model_count === 3).length,
        "2_models": classified.filter((o) => o.model_count === 2).length,
        "1_model": classified.filter((o) => o.model_count === 1).length,
      },
    },
    opportunities: classified,
  };

  await fs.writeFile(
    `${OUTPUT_DIR}/lowcode-opportunities.json`,
    JSON.stringify(output, null, 2)
  );

  // 9. Wyświetl TOP 10
  console.log("\n=== TOP 10 OKAZJI ===\n");
  for (let i = 0; i < Math.min(10, classified.length); i++) {
    const opp = classified[i];
    console.log(`${i + 1}. [${opp.classification}] ${opp.product_concept?.name || "?"}`);
    console.log(`   Score: ${opp.final_score} (avg: ${opp.avg_score} + bonus: ${opp.consensus_bonus})`);
    console.log(`   Pattern: ${opp.pattern}`);
    console.log(`   Models: ${opp.model_count}/4 (${opp.found_by_models.join(", ")})`);
    console.log(`   ${opp.product_concept?.description || ""}`);
    console.log();
  }

  console.log(`\n✅ Zapisano: ${OUTPUT_DIR}/lowcode-opportunities.json`);

  // Usuń pliki częściowe
  for (let i = 0; i < chunks.length; i++) {
    try {
      await fs.unlink(`${OUTPUT_DIR}/lowcode-partial-chunk-${i}.json`);
    } catch {}
  }
  console.log("🧹 Usunięto pliki częściowe");
}

main().catch(console.error);
