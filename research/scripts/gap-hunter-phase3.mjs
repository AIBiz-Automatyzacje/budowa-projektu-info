import fs from "fs/promises";
import dotenv from "dotenv";

dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

// 4 modele do cross-walidacji
const MODELS = [
  { id: "anthropic/claude-opus-4.5", name: "Claude Opus 4.5" },
  { id: "google/gemini-3-pro-preview", name: "Gemini 3 Pro" },
  { id: "x-ai/grok-4", name: "Grok 4" },
  { id: "openai/gpt-5.2-chat", name: "GPT-5.2" },
];

// White space classifications
const WHITE_SPACE_CLASSES = {
  WHITE_SPACE: { min: 90, max: 100, desc: "Zero konkurencji, nikt tego nie robi" },
  BLUE_OCEAN: { min: 70, max: 89, desc: "Słaba konkurencja, łatwo wygrać" },
  RED_OCEAN: { min: 40, max: 69, desc: "Silna konkurencja, trzeba się wyróżnić" },
  BLOODY_OCEAN: { min: 0, max: 39, desc: "Zdominowany rynek, nie wchodź" },
};

async function callModel(modelId, prompt) {
  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://github.com/live-research",
      "X-Title": "Gap Hunter Lite - Phase 3",
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
    throw new Error(`${modelId}: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

function parseJSON(text) {
  let clean = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  return JSON.parse(clean);
}

function extractMVPs(deepDive) {
  const mvps = [];
  let mvpIndex = 0;

  for (const category of deepDive.categories) {
    // mvp_proposals jest na tym samym poziomie co consensus (nie wewnątrz)
    const proposals = category.consensus?.mvp_proposals || category.mvp_proposals;
    if (proposals) {
      for (const mvp of proposals) {
        mvps.push({
          id: `mvp_${mvpIndex++}`,
          category: category.kategoria,
          name: mvp.name,
          target_persona: mvp.target_persona,
          core_value_prop: mvp.core_value_prop,
          pricing: mvp.pricing_suggestion,
          proposed_by: mvp.proposed_by,
        });
      }
    }
  }

  return mvps;
}

function prepareCompetitorSummary(competitorMap) {
  // Top 15 competitors with key info
  return competitorMap.competitors.slice(0, 15).map((c) => ({
    name: c.name,
    mentions: c.mentions,
    top_weaknesses: c.weaknesses.slice(0, 3).map((w) => w.issue),
    displacement_potential: c.displacement_potential,
  }));
}

function prepareGapTypesSummary(gapTypes) {
  return {
    by_type: gapTypes.summary.by_gap_type,
    dominant_type: Object.entries(gapTypes.summary.by_gap_type)
      .sort((a, b) => b[1].count - a[1].count)[0][0],
    insight: "40% problemów to ZA_SLABA_JAKOSC - rozwiązania istnieją ale wyniki niezadowalające",
  };
}

function buildPrompt(mvps, competitorSummary, gapTypesSummary) {
  return `Oceń "white space score" dla każdego MVP - czyli jak pusta jest nisza rynkowa.

KLASYFIKACJA:
- WHITE_SPACE (90-100): Zero konkurencji, nikt tego nie robi
- BLUE_OCEAN (70-89): Słaba konkurencja, łatwo wygrać
- RED_OCEAN (40-69): Silna konkurencja, trzeba się wyróżnić
- BLOODY_OCEAN (0-39): Zdominowany rynek, nie wchodź

KONTEKST KONKURENCJI (top 15 narzędzi wspomnianych przez użytkowników):
${JSON.stringify(competitorSummary, null, 2)}

TYPY LUK RYNKOWYCH W DANYCH:
${JSON.stringify(gapTypesSummary, null, 2)}

40 MVP DO OCENY:
${JSON.stringify(mvps, null, 2)}

Dla KAŻDEGO z 40 MVP oceń:

1. white_space_score (0-100) - jak pusta jest nisza
   - 90-100: Nikt tego nie robi, totalna innowacja
   - 70-89: Jest kilka słabych rozwiązań, łatwo je pokonać
   - 40-69: Silna konkurencja, ale jest miejsce na wyróżnienie
   - 0-39: Rynek zdominowany przez wielkich graczy

2. classification - WHITE_SPACE | BLUE_OCEAN | RED_OCEAN | BLOODY_OCEAN

3. main_competitors - kto już to robi (max 3 nazwy, lub "BRAK" jeśli nikt)

4. gap_type_addressed - który typ luki adresuje (BRAK_ROZWIAZANIA, ZA_DROGIE, ZA_TRUDNE, ZA_WOLNE, ZA_SLABA_JAKOSC, NIEDOSTEPNE, BRAK_ZAUFANIA, FRAGMENTACJA)

5. differentiation_angle - czym się wyróżni (1 zdanie)

6. go_to_market_hint - jak dotrzeć do klientów (1 zdanie)

Zwróć TYLKO poprawny JSON array (bez markdown):
[
  {
    "mvp_id": "mvp_0",
    "mvp_name": "Nazwa MVP",
    "white_space_score": 75,
    "classification": "BLUE_OCEAN",
    "main_competitors": ["Tool1", "Tool2"],
    "gap_type_addressed": "ZA_TRUDNE",
    "differentiation_angle": "Opis wyróżnika",
    "go_to_market_hint": "Strategia dotarcia"
  }
]

WAŻNE:
- Oceń WSZYSTKIE 40 MVP
- Bądź realistyczny - większość pomysłów to RED_OCEAN
- WHITE_SPACE to rzadkość (max 2-3 MVP)
- Analizuj czy istniejące narzędzia (ChatGPT, Make, HubSpot itp.) już to robią`;
}

function getClassification(score) {
  if (score >= 90) return "WHITE_SPACE";
  if (score >= 70) return "BLUE_OCEAN";
  if (score >= 40) return "RED_OCEAN";
  return "BLOODY_OCEAN";
}

function aggregateResults(allResults, mvps) {
  const mvpScores = {};

  // Initialize
  for (const mvp of mvps) {
    mvpScores[mvp.id] = {
      mvp_id: mvp.id,
      mvp_name: mvp.name,
      category: mvp.category,
      target_persona: mvp.target_persona,
      core_value_prop: mvp.core_value_prop,
      scores: [],
      competitors: [],
      gap_types: [],
      differentiations: [],
      gtm_hints: [],
    };
  }

  // Collect scores from all models
  for (const { model, results } of allResults) {
    for (const r of results) {
      const mvpId = r.mvp_id;
      if (mvpScores[mvpId]) {
        mvpScores[mvpId].scores.push({ model, score: r.white_space_score });
        mvpScores[mvpId].competitors.push(...(r.main_competitors || []));
        mvpScores[mvpId].gap_types.push(r.gap_type_addressed);
        mvpScores[mvpId].differentiations.push({ model, text: r.differentiation_angle });
        mvpScores[mvpId].gtm_hints.push({ model, text: r.go_to_market_hint });
      }
    }
  }

  // Calculate consensus
  const rankings = Object.values(mvpScores).map((mvp) => {
    const scores = mvp.scores.map((s) => s.score);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const minScore = Math.min(...scores);
    const maxScore = Math.max(...scores);
    const spread = maxScore - minScore;

    // Consensus with spread penalty
    const consensusScore = Math.round(avgScore - spread * 0.05);

    // Most common gap type
    const gapTypeCounts = {};
    for (const gt of mvp.gap_types) {
      gapTypeCounts[gt] = (gapTypeCounts[gt] || 0) + 1;
    }
    const dominantGapType = Object.entries(gapTypeCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || "UNKNOWN";

    // Unique competitors
    const uniqueCompetitors = [...new Set(mvp.competitors)]
      .filter((c) => c && c !== "BRAK")
      .slice(0, 5);

    return {
      mvp_id: mvp.mvp_id,
      mvp_name: mvp.mvp_name,
      category: mvp.category,
      target_persona: mvp.target_persona,
      core_value_prop: mvp.core_value_prop,
      white_space_score: consensusScore,
      classification: getClassification(consensusScore),
      consensus_spread: spread,
      model_scores: mvp.scores,
      main_competitors: uniqueCompetitors,
      gap_type_addressed: dominantGapType,
      differentiations: mvp.differentiations,
      go_to_market_hints: mvp.gtm_hints,
    };
  });

  // Sort by score descending
  rankings.sort((a, b) => b.white_space_score - a.white_space_score);

  return rankings;
}

function printSummary(rankings) {
  console.log("\n" + "═".repeat(80));
  console.log("📊 WHITE SPACE SCORING - WYNIKI");
  console.log("═".repeat(80) + "\n");

  // By classification
  const byClass = {};
  for (const r of rankings) {
    byClass[r.classification] = (byClass[r.classification] || 0) + 1;
  }

  console.log("📈 ROZKŁAD KLASYFIKACJI:");
  console.log("─".repeat(40));
  for (const [cls, count] of Object.entries(byClass).sort((a, b) => b[1] - a[1])) {
    const bar = "█".repeat(count);
    console.log(`${cls.padEnd(15)} ${String(count).padStart(2)} ${bar}`);
  }

  console.log("\n🏆 TOP 10 MVP (najwyższy white space):");
  console.log("─".repeat(80));

  for (let i = 0; i < Math.min(10, rankings.length); i++) {
    const r = rankings[i];
    const emoji = r.classification === "WHITE_SPACE" ? "🟢" :
                  r.classification === "BLUE_OCEAN" ? "🔵" :
                  r.classification === "RED_OCEAN" ? "🟠" : "🔴";

    console.log(`${i + 1}. ${emoji} [${r.white_space_score}] ${r.mvp_name}`);
    console.log(`   Kategoria: ${r.category} | Spread: ±${r.consensus_spread}`);
    console.log(`   Gap: ${r.gap_type_addressed} | Konkurenci: ${r.main_competitors.join(", ") || "BRAK"}`);
    console.log("");
  }

  console.log("⚠️  BOTTOM 5 (najsilniejsza konkurencja):");
  console.log("─".repeat(80));

  for (let i = rankings.length - 1; i >= Math.max(0, rankings.length - 5); i--) {
    const r = rankings[i];
    console.log(`🔴 [${r.white_space_score}] ${r.mvp_name} - ${r.main_competitors.slice(0, 3).join(", ")}`);
  }
}

async function runPhase3() {
  console.log("🎯 Gap Hunter Lite - Faza 3: White Space Scoring\n");
  console.log("🤖 Modele: " + MODELS.map((m) => m.name).join(", "));
  console.log("");

  // 1. Load data
  console.log("📂 Ładowanie danych...");

  const deepDiveRaw = await fs.readFile(
    "docs/faza-2-analiza/output/deep-dive.json",
    "utf-8"
  );
  const deepDive = JSON.parse(deepDiveRaw);

  const competitorMapRaw = await fs.readFile(
    "docs/faza-2-analiza/output/competitor-map.json",
    "utf-8"
  );
  const competitorMap = JSON.parse(competitorMapRaw);

  const gapTypesRaw = await fs.readFile(
    "docs/faza-2-analiza/output/gap-types-analysis.json",
    "utf-8"
  );
  const gapTypes = JSON.parse(gapTypesRaw);

  // 2. Extract MVPs
  const mvps = extractMVPs(deepDive);
  console.log(`✅ Wyekstrahowano ${mvps.length} MVP z deep-dive.json`);

  // 3. Prepare summaries
  const competitorSummary = prepareCompetitorSummary(competitorMap);
  const gapTypesSummary = prepareGapTypesSummary(gapTypes);

  console.log(`✅ Przygotowano podsumowanie konkurencji (${competitorSummary.length} narzędzi)`);
  console.log(`✅ Przygotowano podsumowanie typów luk\n`);

  // 4. Build prompt
  const prompt = buildPrompt(mvps, competitorSummary, gapTypesSummary);

  // 5. Call all models in parallel
  console.log("🚀 Wysyłam do 4 modeli równolegle...\n");
  const startTime = Date.now();

  const modelPromises = MODELS.map(async (model) => {
    console.log(`   ⏳ ${model.name}...`);
    try {
      const responseText = await callModel(model.id, prompt);
      const results = parseJSON(responseText);
      console.log(`   ✅ ${model.name}: ${results.length} ocen`);
      return { model: model.name, results };
    } catch (e) {
      console.error(`   ❌ ${model.name}: ${e.message}`);
      return { model: model.name, results: [], error: e.message };
    }
  });

  const allResults = await Promise.all(modelPromises);
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n⏱️  Wszystkie modele zakończone w ${elapsed}s`);

  // Filter out failed models
  const successfulResults = allResults.filter((r) => r.results.length > 0);
  console.log(`✅ Sukces: ${successfulResults.length}/${MODELS.length} modeli`);

  if (successfulResults.length === 0) {
    console.error("❌ Żaden model nie zwrócił wyników!");
    process.exit(1);
  }

  // 6. Aggregate results
  const rankings = aggregateResults(successfulResults, mvps);

  // 7. Build output
  const output = {
    meta: {
      generated: new Date().toISOString(),
      phase: "Gap Hunter Lite - Phase 3: White Space Scoring",
      models_used: successfulResults.map((r) => r.model),
      total_mvps: mvps.length,
      execution_time_seconds: parseFloat(elapsed),
    },
    classifications: WHITE_SPACE_CLASSES,
    summary: {
      by_classification: {},
      avg_score: 0,
      avg_spread: 0,
    },
    mvps: rankings,
  };

  // Calculate summary stats
  let totalScore = 0;
  let totalSpread = 0;
  for (const r of rankings) {
    output.summary.by_classification[r.classification] =
      (output.summary.by_classification[r.classification] || 0) + 1;
    totalScore += r.white_space_score;
    totalSpread += r.consensus_spread;
  }
  output.summary.avg_score = Math.round(totalScore / rankings.length);
  output.summary.avg_spread = Math.round(totalSpread / rankings.length);

  // 8. Save
  await fs.writeFile(
    "docs/faza-2-analiza/output/white-space-scoring.json",
    JSON.stringify(output, null, 2)
  );

  console.log("\n💾 Wyniki zapisane do: docs/faza-2-analiza/output/white-space-scoring.json");

  // 9. Print summary
  printSummary(rankings);

  console.log("\n✅ Faza 3 zakończona!");
}

runPhase3().catch(console.error);
