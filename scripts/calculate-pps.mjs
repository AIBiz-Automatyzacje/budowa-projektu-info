import fs from "fs/promises";
import dotenv from "dotenv";

dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const MODELS = [
  { id: "anthropic/claude-opus-4.5", name: "Claude Opus 4.5" },
  { id: "google/gemini-3-pro-preview", name: "Gemini 3 Pro" },
  { id: "x-ai/grok-4", name: "Grok 4" },
  { id: "openai/gpt-5.2-chat", name: "GPT-5.2" },
];

async function callModel(modelId, prompt) {
  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://github.com/live-research",
      "X-Title": "Pain Radar Research",
    },
    body: JSON.stringify({
      model: modelId,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 8000,
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
  // Usuń markdown jeśli jest
  let clean = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  return JSON.parse(clean);
}

function aggregateResults(allResults) {
  // Zbierz wszystkie kategorie
  const categoryScores = {};

  for (const { model, results } of allResults) {
    for (const r of results) {
      const kat = r.kategoria;
      if (!categoryScores[kat]) {
        categoryScores[kat] = {
          kategoria: kat,
          scores: [],
          rationales: [],
          insights: [],
          red_flags: [],
          opportunities: [],
        };
      }
      categoryScores[kat].scores.push({ model, score: r.pps_score });
      categoryScores[kat].rationales.push({ model, text: r.scoring_rationale });
      categoryScores[kat].insights.push({ model, text: r.key_insight });
      if (r.red_flags) categoryScores[kat].red_flags.push(...r.red_flags);
      if (r.opportunities)
        categoryScores[kat].opportunities.push(...r.opportunities);
    }
  }

  // Oblicz consensus score dla każdej kategorii
  const rankings = Object.values(categoryScores)
    .map((cat) => {
      const scores = cat.scores.map((s) => s.score);
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      const minScore = Math.min(...scores);
      const maxScore = Math.max(...scores);
      const spread = maxScore - minScore;

      // Consensus score: średnia ważona, z penalty za duży spread
      const consensusScore = Math.round(avgScore - spread * 0.1);

      return {
        kategoria: cat.kategoria,
        consensus_pps: consensusScore,
        model_scores: cat.scores,
        score_spread: spread,
        avg_score: Math.round(avgScore * 10) / 10,
        insights: cat.insights,
        rationales: cat.rationales,
        red_flags: [...new Set(cat.red_flags)].slice(0, 4),
        opportunities: [...new Set(cat.opportunities)].slice(0, 4),
      };
    })
    .sort((a, b) => b.consensus_pps - a.consensus_pps);

  // Dodaj rankingi
  rankings.forEach((r, i) => (r.rank = i + 1));

  return rankings;
}

async function calculatePPS() {
  console.log("📊 Krok 3.2: Obliczanie Pain Priority Score (PPS)\n");
  console.log("🔄 Multi-model approach: 4 modele przez OpenRouter\n");

  // 1. Wczytaj aggregaty
  const aggregatesRaw = await fs.readFile(
    "docs/faza-2-analiza/output/aggregates.json",
    "utf-8"
  );
  const aggregates = JSON.parse(aggregatesRaw);

  // 2. Przygotuj dane dla AI (tylko kategorie z count > 10)
  const kategorieData = aggregates.by_kategoria
    .filter((k) => k.count >= 10)
    .map((k) => ({
      kategoria: k.kategoria,
      count: k.count,
      avg_intensywnosc: k.avg_intensywnosc,
      avg_sygnal_zakupowy: k.avg_sygnal_zakupowy,
      cross_platform: k.cross_platform,
      platform_coverage: k.platform_coverage,
      branze_count: k.branze_count,
      platforms: k.platforms,
    }));

  console.log(`📋 Analizuję ${kategorieData.length} kategorii...\n`);

  // 3. Prompt dla AI
  const prompt = `Masz agregaty problemów pogrupowane po kategorii z polskich grup Facebook i subredditów.

AGREGATY (${kategorieData.length} kategorii):
${JSON.stringify(kategorieData, null, 2)}

GLOBALNE METRYKI:
- Średnia intensywność całego datasetu: ${aggregates.global_metrics.avg_intensywnosc}
- Średni sygnał zakupowy całego datasetu: ${aggregates.global_metrics.avg_sygnal_zakupowy}
- Łączna liczba problemów: ${aggregates.meta.total_problems}

Oceń "Pain Priority Score" (PPS) dla każdej kategorii.
NIE używaj sztywnej formuły — oceń HOLISTYCZNIE.

CZYNNIKI DO ROZWAŻENIA (w kolejności ważności):
1. **Sygnał zakupowy** (NAJWAŻNIEJSZY) - czy ludzie są gotowi płacić? avg_sygnal_zakupowy > 2.5 to dobry znak
2. **Intensywność** - jak bardzo boli? avg_intensywnosc > 3.0 to poważny problem
3. **Częstotliwość** - ile razy się pojawia? Więcej = bardziej uniwersalny problem
4. **Cross-platform** - czy występuje na FB i Reddit? platform_coverage > 0.5 = walidacja z dwóch źródeł
5. **Cross-branża** - czy dotyka wielu branż? branze_count > 15 = uniwersalny problem

KLUCZOWE PYTANIA:
- Czy za rozwiązanie tego problemu ludzie ZAPŁACĄ?
- Czy problem jest na tyle bolesny, że aktywnie szukają rozwiązania?
- Czy problem dotyczy wystarczająco dużej grupy?

Zwróć TYLKO poprawny JSON (bez markdown, bez \`\`\`):
[
  {
    "kategoria": "nazwa kategorii",
    "pps_score": 0-100,
    "rank": 1,
    "scoring_rationale": "2-3 zdania dlaczego ten score",
    "key_insight": "Najważniejsza obserwacja - co konkretnie boli ludzi",
    "red_flags": ["max 2 potencjalne problemy/ryzyka"],
    "opportunities": ["max 2 konkretne szanse biznesowe"]
  }
]

Posortuj od najwyższego PPS. Bądź krytyczny - nie wszystkie kategorie zasługują na wysoki score.`;

  // 4. Wywołaj wszystkie modele równolegle
  console.log("🤖 Wysyłam do 4 modeli przez OpenRouter...\n");

  const allResults = [];

  const promises = MODELS.map(async (model) => {
    const startTime = Date.now();
    console.log(`   ⏳ ${model.name}...`);

    try {
      const responseText = await callModel(model.id, prompt);
      const results = parseJSON(responseText);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`   ✅ ${model.name} (${elapsed}s) - ${results.length} kategorii`);
      return { model: model.name, modelId: model.id, results };
    } catch (e) {
      console.log(`   ❌ ${model.name}: ${e.message}`);
      return null;
    }
  });

  const responses = await Promise.all(promises);

  for (const r of responses) {
    if (r) allResults.push(r);
  }

  if (allResults.length === 0) {
    console.error("\n❌ Żaden model nie zwrócił wyników!");
    return;
  }

  console.log(`\n📊 Otrzymano wyniki z ${allResults.length}/${MODELS.length} modeli`);

  // 5. Agregacja wyników
  console.log("\n🔀 Agregacja wyników (consensus scoring)...\n");
  const rankings = aggregateResults(allResults);

  // 6. Utwórz pełny output
  const output = {
    meta: {
      generated: new Date().toISOString(),
      step: "3.2 Pain Priority Score (Multi-Model)",
      models_used: allResults.map((r) => r.modelId),
      models_count: allResults.length,
      total_categories: rankings.length,
      source: "aggregates.json",
    },
    global_metrics: aggregates.global_metrics,
    rankings: rankings,
    raw_model_responses: allResults.map((r) => ({
      model: r.model,
      categories_count: r.results.length,
    })),
  };

  // 7. Zapisz wyniki
  await fs.mkdir("docs/faza-2-analiza/output", { recursive: true });
  await fs.writeFile(
    "docs/faza-2-analiza/output/pps-rankings.json",
    JSON.stringify(output, null, 2)
  );

  console.log("✅ Wyniki zapisane do: docs/faza-2-analiza/output/pps-rankings.json\n");

  // 8. Wyświetl TOP 10
  console.log("🏆 TOP 10 kategorii wg Pain Priority Score (CONSENSUS):\n");
  console.log(
    "Rank | PPS | Spread | Kategoria                  | Models Agree"
  );
  console.log(
    "-----|-----|--------|----------------------------|-------------"
  );

  rankings.slice(0, 10).forEach((r, i) => {
    const kategoria = r.kategoria.padEnd(26).substring(0, 26);
    const modelsAgree = r.score_spread <= 15 ? "✓ high" : "~ mixed";
    console.log(
      `  ${String(i + 1).padStart(2)} | ${String(r.consensus_pps).padStart(3)} |   ${String(r.score_spread).padStart(3)}  | ${kategoria} | ${modelsAgree}`
    );
  });

  // 9. Wyświetl score'y per model dla TOP 5
  console.log("\n📈 Szczegółowe score'y TOP 5 (per model):\n");
  rankings.slice(0, 5).forEach((r) => {
    console.log(`${r.kategoria}:`);
    r.model_scores.forEach((s) => {
      console.log(`   ${s.model.padEnd(16)}: ${s.score}`);
    });
    console.log("");
  });

  console.log("📊 Pełne wyniki w pliku JSON.");
}

calculatePPS().catch(console.error);
