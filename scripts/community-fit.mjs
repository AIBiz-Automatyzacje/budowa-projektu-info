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
      max_tokens: 12000,
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

function aggregateResults(allResults, type) {
  const itemScores = {};

  for (const { model, results } of allResults) {
    const items = type === "categories" ? results.categories : results.patterns;
    if (!items) continue;

    for (const item of items) {
      const key = item.name;
      if (!itemScores[key]) {
        itemScores[key] = {
          name: key,
          scores: [],
          breakdowns: [],
          rationales: [],
          product_ideas: [],
          quick_wins: [],
        };
      }

      itemScores[key].scores.push({
        model,
        total: item.total_score,
        target_fit: item.target_fit,
        capability_fit: item.capability_fit,
        monetization_fit: item.monetization_fit,
        distribution_fit: item.distribution_fit,
        bonus: item.quick_win_bonus || 0,
      });

      itemScores[key].rationales.push({ model, text: item.rationale });

      if (item.product_idea) {
        itemScores[key].product_ideas.push({ model, idea: item.product_idea });
      }
      if (item.quick_wins) {
        itemScores[key].quick_wins.push(...item.quick_wins);
      }
    }
  }

  const rankings = Object.values(itemScores)
    .map((item) => {
      const scores = item.scores.map((s) => s.total);
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      const minScore = Math.min(...scores);
      const maxScore = Math.max(...scores);
      const spread = maxScore - minScore;

      // Consensus score z penalty za duzy spread
      const consensusScore = Math.round(avgScore - spread * 0.05);

      // Srednie breakdown
      const avgBreakdown = {
        target_fit: Math.round(
          item.scores.reduce((a, s) => a + s.target_fit, 0) / item.scores.length
        ),
        capability_fit: Math.round(
          item.scores.reduce((a, s) => a + s.capability_fit, 0) /
            item.scores.length
        ),
        monetization_fit: Math.round(
          item.scores.reduce((a, s) => a + s.monetization_fit, 0) /
            item.scores.length
        ),
        distribution_fit: Math.round(
          item.scores.reduce((a, s) => a + s.distribution_fit, 0) /
            item.scores.length
        ),
        bonus: Math.round(
          item.scores.reduce((a, s) => a + s.bonus, 0) / item.scores.length
        ),
      };

      return {
        name: item.name,
        consensus_score: consensusScore,
        model_scores: item.scores,
        score_spread: spread,
        avg_score: Math.round(avgScore * 10) / 10,
        breakdown: avgBreakdown,
        rationales: item.rationales,
        product_ideas: item.product_ideas,
        quick_wins: [...new Set(item.quick_wins)].slice(0, 3),
        recommendation: getRecommendation(consensusScore),
      };
    })
    .sort((a, b) => b.consensus_score - a.consensus_score);

  rankings.forEach((r, i) => (r.rank = i + 1));

  return rankings;
}

function getRecommendation(score) {
  if (score >= 80) return "STRONG FIT - priorytet do walidacji";
  if (score >= 60) return "GOOD FIT - warto rozwazyc";
  if (score >= 40) return "PARTIAL FIT - wymaga pivotu";
  return "POOR FIT - odrzucic";
}

async function runCommunityFit() {
  console.log("🎯 Krok 4: Community Fit Scoring\n");
  console.log("🔄 Multi-model approach: 4 modele przez OpenRouter\n");

  // 1. Wczytaj dane
  const ppsRaw = await fs.readFile(
    "docs/faza-2-analiza/output/pps-rankings.json",
    "utf-8"
  );
  const pps = JSON.parse(ppsRaw);

  const patternsRaw = await fs.readFile(
    "docs/faza-2-analiza/output/hidden-patterns.json",
    "utf-8"
  );
  const patterns = JSON.parse(patternsRaw);

  const profileRaw = await fs.readFile(
    "docs/faza-2-analiza/context/community-profile.md",
    "utf-8"
  );

  // 2. Przygotuj dane - TOP 12 kategorii i TOP 15 wzorcow
  const topCategories = pps.rankings.slice(0, 12).map((r) => ({
    kategoria: r.kategoria,
    pps_score: r.consensus_pps,
    key_insights: r.insights.map((i) => i.text).slice(0, 2),
    opportunities: r.opportunities,
  }));

  const topPatterns = patterns.patterns.slice(0, 15).map((p) => ({
    pattern: p.pattern_name,
    consensus_score: p.consensus_score,
    affected_categories: p.affected_categories,
    product_opportunities: p.product_opportunities?.map((o) => o.text) || [],
    underlying_needs: p.underlying_needs?.map((n) => n.text) || [],
  }));

  console.log(
    `📋 Analizuję ${topCategories.length} kategorii i ${topPatterns.length} wzorców...\n`
  );

  // 3. Prompt dla AI
  const prompt = `Jesteś ekspertem od product-market fit. Analizujesz dopasowanie problemów/wzorców do konkretnej społeczności.

## PROFIL SPOŁECZNOŚCI (Akademia Automatyzacji):

${profileRaw}

---

## TOP KATEGORIE PROBLEMÓW (wg Pain Priority Score):

${JSON.stringify(topCategories, null, 2)}

---

## TOP UKRYTE WZORCE (cross-cutting patterns):

${JSON.stringify(topPatterns, null, 2)}

---

## TWOJE ZADANIE:

Oceń dopasowanie każdej kategorii i każdego wzorca do społeczności Akademii Automatyzacji.

### KRYTERIA SCORINGOWE (z profilu):

**TARGET FIT (0-30 pkt)**
- Czy problem dotyczy naszych branż? (Marketing/Agencje 30%, E-commerce 20%, Freelance/Usługi 20%, Content 15%, IT 10%)
- Czy to nasi ludzie? (SMB 35%, Freelancerzy 30%, Marketerzy 20%, Techniczni 15%)

**CAPABILITY FIT (0-25 pkt)**
- Czy umiemy to zbudować? (no-code EKSPERT, AI integration EKSPERT, vibe coding ZAAWANSOWANY)
- Czy zmieścimy się w czasie? (no-code 1-2 tyg, vibe coding 2-4 tyg, custom 4-8 tyg)
- WYKLUCZENIA: mobile native, blockchain, custom ML, enterprise, hardware

**MONETIZATION FIT (0-25 pkt)**
- Czy ta grupa płaci? (typowy budżet 500 PLN/mies, wrażliwość średnia-wysoka)
- Czy pasuje do modeli? (preferowane: afiliacja, jednorazowa płatność, freemium)
- WYKLUCZENIA: subskrypcja miesięczna (przetestowane - niski LTV), consulting 1:1

**DISTRIBUTION FIT (0-20 pkt)**
- Czy dotrzemy przez nasze kanały? (42.5K FB, 5.5K newsletter, 600 Skool płatnych)
- Czy mamy już content w tym temacie? (n8n, Make, Claude, ChatGPT, automatyzacja)

### QUICK WINS BONUS (max +23 pkt):
- +5 pkt: Możemy zbudować w no-code (Make/n8n)
- +5 pkt: Mamy już content w tym temacie
- +5 pkt: Możemy użyć jako case study dla AA
- +5 pkt: Pasuje do serii "Budowa biznesu od zera"
- +3 pkt: Integruje się z narzędziami które uczymy

---

Zwróć TYLKO poprawny JSON (bez markdown):
{
  "categories": [
    {
      "name": "nazwa kategorii",
      "target_fit": 0-30,
      "capability_fit": 0-25,
      "monetization_fit": 0-25,
      "distribution_fit": 0-20,
      "quick_win_bonus": 0-23,
      "total_score": suma,
      "rationale": "2-3 zdania dlaczego ten score",
      "product_idea": "konkretny pomysł na produkt dla AA",
      "quick_wins": ["które bonusy się kwalifikują"]
    }
  ],
  "patterns": [
    {
      "name": "nazwa wzorca",
      "target_fit": 0-30,
      "capability_fit": 0-25,
      "monetization_fit": 0-25,
      "distribution_fit": 0-20,
      "quick_win_bonus": 0-23,
      "total_score": suma,
      "rationale": "2-3 zdania dlaczego ten score",
      "product_idea": "konkretny pomysł na produkt dla AA",
      "quick_wins": ["które bonusy się kwalifikują"]
    }
  ]
}

Bądź KRYTYCZNY - nie wszystko pasuje do AA. Szukaj idealnego dopasowania.`;

  // 4. Wywołaj modele
  console.log("🤖 Wysyłam do 4 modeli przez OpenRouter...\n");

  const allResults = [];

  const promises = MODELS.map(async (model) => {
    const startTime = Date.now();
    console.log(`   ⏳ ${model.name}...`);

    try {
      const responseText = await callModel(model.id, prompt);
      const results = parseJSON(responseText);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      const catCount = results.categories?.length || 0;
      const patCount = results.patterns?.length || 0;
      console.log(
        `   ✅ ${model.name} (${elapsed}s) - ${catCount} kat, ${patCount} wzorców`
      );
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

  // 5. Agregacja
  console.log("\n🔀 Agregacja wyników (consensus scoring)...\n");

  const categoryRankings = aggregateResults(allResults, "categories");
  const patternRankings = aggregateResults(allResults, "patterns");

  // 6. Output
  const output = {
    meta: {
      generated: new Date().toISOString(),
      step: "4. Community Fit Scoring (Multi-Model)",
      models_used: allResults.map((r) => r.modelId),
      models_count: allResults.length,
      categories_analyzed: categoryRankings.length,
      patterns_analyzed: patternRankings.length,
    },
    scoring_criteria: {
      target_fit: "0-30 pkt - dopasowanie do branż i person AA",
      capability_fit: "0-25 pkt - czy umiemy zbudować",
      monetization_fit: "0-25 pkt - czy zapłacą i jak",
      distribution_fit: "0-20 pkt - kanały dystrybucji",
      quick_win_bonus: "0-23 pkt - dodatkowe atuty",
      max_total: 123,
    },
    thresholds: {
      strong_fit: "80+ (priorytet do walidacji)",
      good_fit: "60-79 (warto rozważyć)",
      partial_fit: "40-59 (wymaga pivotu)",
      poor_fit: "0-39 (odrzucić)",
    },
    category_rankings: categoryRankings,
    pattern_rankings: patternRankings,
    top_opportunities: extractTopOpportunities(
      categoryRankings,
      patternRankings
    ),
    raw_model_responses: allResults.map((r) => ({
      model: r.model,
      categories_count: r.results.categories?.length || 0,
      patterns_count: r.results.patterns?.length || 0,
    })),
  };

  // 7. Zapisz
  await fs.writeFile(
    "docs/faza-2-analiza/output/community-fit.json",
    JSON.stringify(output, null, 2)
  );

  console.log("✅ Wyniki zapisane do: docs/faza-2-analiza/output/community-fit.json\n");

  // 8. Wyświetl wyniki
  printResults(categoryRankings, patternRankings);
}

function extractTopOpportunities(categories, patterns) {
  // Połącz top kategorie i wzorce z najwyższym fit
  const allItems = [
    ...categories.map((c) => ({
      type: "category",
      name: c.name,
      score: c.consensus_score,
      product_ideas: c.product_ideas,
      breakdown: c.breakdown,
    })),
    ...patterns.map((p) => ({
      type: "pattern",
      name: p.name,
      score: p.consensus_score,
      product_ideas: p.product_ideas,
      breakdown: p.breakdown,
    })),
  ];

  return allItems
    .filter((i) => i.score >= 60)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map((i) => ({
      type: i.type,
      name: i.name,
      score: i.score,
      recommendation: getRecommendation(i.score),
      top_product_idea: i.product_ideas[0]?.idea || "brak",
      strengths: getStrengths(i.breakdown),
    }));
}

function getStrengths(breakdown) {
  const strengths = [];
  if (breakdown.target_fit >= 25) strengths.push("silny target fit");
  if (breakdown.capability_fit >= 20) strengths.push("łatwe do zbudowania");
  if (breakdown.monetization_fit >= 20) strengths.push("dobra monetyzacja");
  if (breakdown.distribution_fit >= 15) strengths.push("łatwa dystrybucja");
  if (breakdown.bonus >= 10) strengths.push("quick wins");
  return strengths;
}

function printResults(categories, patterns) {
  console.log("🏆 TOP KATEGORIE wg Community Fit Score:\n");
  console.log(
    "Rank | Score | Spread | Kategoria                  | Rekomendacja"
  );
  console.log(
    "-----|-------|--------|----------------------------|------------------"
  );

  categories.slice(0, 10).forEach((r, i) => {
    const name = r.name.padEnd(26).substring(0, 26);
    const rec =
      r.consensus_score >= 80
        ? "STRONG FIT"
        : r.consensus_score >= 60
          ? "GOOD FIT"
          : r.consensus_score >= 40
            ? "PARTIAL"
            : "POOR";
    console.log(
      `  ${String(i + 1).padStart(2)} |  ${String(r.consensus_score).padStart(3)}  |   ${String(r.score_spread).padStart(3)}  | ${name} | ${rec}`
    );
  });

  console.log("\n\n🔮 TOP WZORCE wg Community Fit Score:\n");
  console.log(
    "Rank | Score | Spread | Wzorzec                              | Rekomendacja"
  );
  console.log(
    "-----|-------|--------|--------------------------------------|------------------"
  );

  patterns.slice(0, 10).forEach((r, i) => {
    const name = r.name.padEnd(36).substring(0, 36);
    const rec =
      r.consensus_score >= 80
        ? "STRONG FIT"
        : r.consensus_score >= 60
          ? "GOOD FIT"
          : r.consensus_score >= 40
            ? "PARTIAL"
            : "POOR";
    console.log(
      `  ${String(i + 1).padStart(2)} |  ${String(r.consensus_score).padStart(3)}  |   ${String(r.score_spread).padStart(3)}  | ${name} | ${rec}`
    );
  });

  // Top 3 STRONG FIT z pomysłami na produkt
  const strongFit = [
    ...categories.filter((c) => c.consensus_score >= 80),
    ...patterns.filter((p) => p.consensus_score >= 80),
  ].sort((a, b) => b.consensus_score - a.consensus_score);

  if (strongFit.length > 0) {
    console.log("\n\n💎 STRONG FIT - Najlepsze dopasowanie do AA:\n");
    strongFit.slice(0, 5).forEach((item, i) => {
      console.log(`${i + 1}. ${item.name} (score: ${item.consensus_score})`);
      console.log(`   Breakdown: Target ${item.breakdown.target_fit}/30, Capability ${item.breakdown.capability_fit}/25, Monetization ${item.breakdown.monetization_fit}/25, Distribution ${item.breakdown.distribution_fit}/20, Bonus +${item.breakdown.bonus}`);
      if (item.product_ideas[0]) {
        console.log(`   💡 Pomysł: ${item.product_ideas[0].idea}`);
      }
      console.log("");
    });
  }

  console.log("\n📊 Pełne wyniki w pliku JSON.");
}

runCommunityFit().catch(console.error);
