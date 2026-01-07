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

async function callModel(modelId, prompt, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://github.com/live-research",
          "X-Title": "Pain Radar Deep Dive",
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
        throw new Error(`${response.status} - ${error}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (e) {
      if (attempt < retries) {
        console.log(`      ⟳ Retry ${attempt + 1}/${retries}...`);
        await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
      } else {
        throw e;
      }
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

function buildPrompt(kategoria, problems) {
  const problemsJson = JSON.stringify(
    problems.map((p) => ({
      id: p.id,
      problem: p.problem,
      branza: p.branza,
      intensywnosc: p.intensywnosc,
      sygnal_zakupowy: p.sygnal_zakupowy,
      obecne_rozwiazanie: p.obecne_rozwiazanie,
      dlaczego_nie_dziala: p.dlaczego_nie_dziala,
      cytat: p.cytat,
      source: p.source,
    })),
    null,
    2
  );

  return `Jesteś ekspertem od product discovery i analizy problemów użytkowników.

Zrób GŁĘBOKĄ ANALIZĘ wszystkich problemów w kategorii "${kategoria}".

## PROBLEMY DO ANALIZY (${problems.length}):

${problemsJson}

---

## TWOJE ZADANIE:

Przeanalizuj te problemy i zwróć:

### 1. SUB-KATEGORIE
Jakie pod-typy problemów istnieją w tej kategorii? Pogrupuj problemy logicznie.

### 2. PERSONAS
Kto ma te problemy? Zidentyfikuj 2-4 typy osób/firm.

### 3. SEVERITY ANALYSIS
- Ile problemów jest critical (intensywność 4-5)?
- Ile medium (3)?
- Ile minor (1-2)?
- Które sub-kategorie są najbardziej palące?

### 4. SOLUTION LANDSCAPE
- Co ludzie obecnie próbują?
- Co działa częściowo?
- Gdzie jest kompletna PUSTKA (nikt nie ma rozwiązania)?

### 5. BUYING BEHAVIOR
- Jaki % aktywnie szuka rozwiązania (sygnal_zakupowy >= 4)?
- Jakie budżety się pojawiają (jeśli są sygnały)?
- Co by ich przekonało do zakupu?

### 6. TOP CYTATY
Wybierz 5 najbardziej reprezentatywnych cytatów pokazujących ból.

### 7. REKOMENDOWANY MVP
Na podstawie analizy zaproponuj konkretny produkt MVP.

---

Zwróć TYLKO poprawny JSON (bez markdown):
{
  "kategoria": "${kategoria}",
  "problems_count": ${problems.length},
  "sub_categories": [
    {
      "name": "nazwa sub-kategorii",
      "count": liczba_problemow,
      "description": "opis tego typu problemów",
      "example_problems": ["id1", "id2"]
    }
  ],
  "personas": [
    {
      "name": "nazwa persony",
      "description": "kim są",
      "pain_points": ["główne bóle"],
      "budget_estimate": "szacowany budżet"
    }
  ],
  "severity_analysis": {
    "critical_count": liczba,
    "critical_percent": procent,
    "medium_count": liczba,
    "minor_count": liczba,
    "hottest_subcategory": "która sub-kategoria najbardziej pali"
  },
  "solution_landscape": {
    "current_solutions": ["co ludzie próbują"],
    "partial_solutions": ["co działa częściowo"],
    "gaps": ["gdzie kompletna pustka - NAJWAŻNIEJSZE"]
  },
  "buying_behavior": {
    "active_seekers_percent": procent,
    "budget_signals": ["sygnały budżetowe"],
    "purchase_triggers": ["co by ich przekonało"]
  },
  "top_quotes": [
    {
      "quote": "cytat",
      "problem_id": "id",
      "why_representative": "dlaczego wybrałeś ten cytat"
    }
  ],
  "recommended_mvp": {
    "name": "nazwa produktu",
    "target_subcategory": "na którą sub-kategorię celować",
    "target_persona": "dla której persony",
    "core_value_prop": "główna obietnica wartości",
    "features_must": ["funkcje must-have"],
    "features_nice": ["funkcje nice-to-have"],
    "pricing_suggestion": "sugerowany model cenowy",
    "go_to_market": "jak dotrzeć do klientów",
    "risk_factors": ["główne ryzyka"]
  },
  "key_insight": "najważniejszy wniosek z całej analizy (1-2 zdania)"
}`;
}

async function analyzeCategory(kategoria, problems, categoryIndex, totalCategories) {
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📂 [${categoryIndex}/${totalCategories}] Kategoria: ${kategoria} (${problems.length} problemów)`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

  const prompt = buildPrompt(kategoria, problems);
  const results = [];

  for (const model of MODELS) {
    const startTime = Date.now();
    console.log(`   ⏳ ${model.name}...`);

    try {
      const responseText = await callModel(model.id, prompt);
      const parsed = parseJSON(responseText);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

      console.log(`   ✅ ${model.name} (${elapsed}s) - ${parsed.sub_categories?.length || 0} sub-kat, ${parsed.personas?.length || 0} personas`);

      results.push({
        model: model.name,
        modelId: model.id,
        analysis: parsed,
      });
    } catch (e) {
      console.log(`   ❌ ${model.name}: ${e.message.substring(0, 100)}`);
    }
  }

  return {
    kategoria,
    problems_count: problems.length,
    models_responded: results.length,
    analyses: results,
  };
}

function aggregateCategoryResults(categoryResult) {
  const { kategoria, problems_count, analyses } = categoryResult;

  if (analyses.length === 0) {
    return { kategoria, problems_count, error: "Brak wyników z modeli" };
  }

  // Zbierz wszystkie sub-kategorie
  const allSubCategories = {};
  const allPersonas = {};
  const allGaps = [];
  const allQuotes = [];
  const allMVPs = [];
  const allInsights = [];

  for (const { model, analysis } of analyses) {
    // Sub-kategorie
    for (const sub of analysis.sub_categories || []) {
      const key = sub.name.toLowerCase();
      if (!allSubCategories[key]) {
        allSubCategories[key] = { ...sub, mentioned_by: [model] };
      } else {
        allSubCategories[key].mentioned_by.push(model);
        allSubCategories[key].count = Math.max(allSubCategories[key].count, sub.count);
      }
    }

    // Personas
    for (const persona of analysis.personas || []) {
      const key = persona.name.toLowerCase();
      if (!allPersonas[key]) {
        allPersonas[key] = { ...persona, mentioned_by: [model] };
      } else {
        allPersonas[key].mentioned_by.push(model);
      }
    }

    // Gaps
    for (const gap of analysis.solution_landscape?.gaps || []) {
      allGaps.push({ gap, model });
    }

    // Quotes
    for (const quote of analysis.top_quotes || []) {
      allQuotes.push({ ...quote, selected_by: model });
    }

    // MVPs
    if (analysis.recommended_mvp) {
      allMVPs.push({ ...analysis.recommended_mvp, proposed_by: model });
    }

    // Insights
    if (analysis.key_insight) {
      allInsights.push({ insight: analysis.key_insight, model });
    }
  }

  // Sortuj sub-kategorie po consensus (ile modeli wspomniało)
  const rankedSubCategories = Object.values(allSubCategories)
    .sort((a, b) => b.mentioned_by.length - a.mentioned_by.length || b.count - a.count);

  // Sortuj personas po consensus
  const rankedPersonas = Object.values(allPersonas)
    .sort((a, b) => b.mentioned_by.length - a.mentioned_by.length);

  // Średnie severity
  const severityAnalyses = analyses.map((a) => a.analysis.severity_analysis).filter(Boolean);
  const avgCriticalPercent = severityAnalyses.length > 0
    ? Math.round(severityAnalyses.reduce((sum, s) => sum + (s.critical_percent || 0), 0) / severityAnalyses.length)
    : 0;

  // Średnie active seekers
  const buyingAnalyses = analyses.map((a) => a.analysis.buying_behavior).filter(Boolean);
  const avgActiveSeekersPercent = buyingAnalyses.length > 0
    ? Math.round(buyingAnalyses.reduce((sum, b) => sum + (b.active_seekers_percent || 0), 0) / buyingAnalyses.length)
    : 0;

  return {
    kategoria,
    problems_count,
    models_analyzed: analyses.length,
    consensus: {
      sub_categories: rankedSubCategories,
      personas: rankedPersonas,
      critical_percent: avgCriticalPercent,
      active_seekers_percent: avgActiveSeekersPercent,
    },
    solution_gaps: allGaps,
    top_quotes: allQuotes.slice(0, 10),
    mvp_proposals: allMVPs,
    key_insights: allInsights,
    raw_analyses: analyses,
  };
}

async function runDeepDive() {
  console.log("🔬 Krok 5: Deep Dive na TOP 10 kategorii\n");
  console.log("🔄 Multi-model approach: 4 modele × 10 kategorii = 40 analiz\n");

  // 1. Wczytaj dane
  const problemsRaw = await fs.readFile(
    "docs/faza-2-analiza/output/all-problems.json",
    "utf-8"
  );
  const { problems } = JSON.parse(problemsRaw);

  const communityFitRaw = await fs.readFile(
    "docs/faza-2-analiza/output/community-fit.json",
    "utf-8"
  );
  const communityFit = JSON.parse(communityFitRaw);

  // 2. Pobierz TOP 10 kategorii
  const top10Categories = communityFit.category_rankings
    .slice(0, 10)
    .map((c) => c.name);

  console.log("📋 TOP 10 kategorii do analizy:");
  top10Categories.forEach((cat, i) => {
    const count = problems.filter((p) => p.kategoria === cat).length;
    console.log(`   ${i + 1}. ${cat} (${count} problemów)`);
  });

  // 3. Analizuj każdą kategorię
  const allResults = [];
  const startTotal = Date.now();

  for (let i = 0; i < top10Categories.length; i++) {
    const kategoria = top10Categories[i];
    const categoryProblems = problems.filter((p) => p.kategoria === kategoria);

    const result = await analyzeCategory(
      kategoria,
      categoryProblems,
      i + 1,
      top10Categories.length
    );

    const aggregated = aggregateCategoryResults(result);
    allResults.push(aggregated);

    // Pokaż postęp
    const elapsed = ((Date.now() - startTotal) / 1000 / 60).toFixed(1);
    console.log(`   📊 Postęp: ${i + 1}/${top10Categories.length} kategorii (${elapsed} min)`);
  }

  // 4. Przygotuj output
  const totalElapsed = ((Date.now() - startTotal) / 1000 / 60).toFixed(1);

  const output = {
    meta: {
      generated: new Date().toISOString(),
      step: "5. Deep Dive Analysis (Multi-Model)",
      models_used: MODELS.map((m) => m.id),
      categories_analyzed: top10Categories.length,
      total_problems_analyzed: problems.filter((p) =>
        top10Categories.includes(p.kategoria)
      ).length,
      execution_time_minutes: parseFloat(totalElapsed),
    },
    summary: {
      total_sub_categories_found: allResults.reduce(
        (sum, r) => sum + (r.consensus?.sub_categories?.length || 0),
        0
      ),
      total_personas_identified: allResults.reduce(
        (sum, r) => sum + (r.consensus?.personas?.length || 0),
        0
      ),
      total_mvp_proposals: allResults.reduce(
        (sum, r) => sum + (r.mvp_proposals?.length || 0),
        0
      ),
      avg_critical_percent: Math.round(
        allResults.reduce((sum, r) => sum + (r.consensus?.critical_percent || 0), 0) /
          allResults.length
      ),
    },
    categories: allResults,
  };

  // 5. Zapisz
  await fs.writeFile(
    "docs/faza-2-analiza/output/deep-dive.json",
    JSON.stringify(output, null, 2)
  );

  console.log(`\n${"═".repeat(60)}`);
  console.log(`✅ Deep Dive zakończony!`);
  console.log(`${"═".repeat(60)}`);
  console.log(`\n📁 Wyniki zapisane do: docs/faza-2-analiza/output/deep-dive.json`);
  console.log(`⏱️  Czas wykonania: ${totalElapsed} minut`);

  // 6. Podsumowanie
  printSummary(output);
}

function printSummary(output) {
  console.log(`\n\n${"━".repeat(60)}`);
  console.log(`📊 PODSUMOWANIE DEEP DIVE`);
  console.log(`${"━".repeat(60)}\n`);

  console.log(`Przeanalizowano: ${output.meta.categories_analyzed} kategorii`);
  console.log(`Łącznie problemów: ${output.meta.total_problems_analyzed}`);
  console.log(`Sub-kategorii znalezionych: ${output.summary.total_sub_categories_found}`);
  console.log(`Person zidentyfikowanych: ${output.summary.total_personas_identified}`);
  console.log(`Propozycji MVP: ${output.summary.total_mvp_proposals}`);
  console.log(`Średni % critical: ${output.summary.avg_critical_percent}%`);

  console.log(`\n\n🏆 TOP SUB-KATEGORIE (wg consensus):\n`);

  for (const category of output.categories.slice(0, 5)) {
    console.log(`\n📂 ${category.kategoria}:`);
    const topSubs = category.consensus?.sub_categories?.slice(0, 3) || [];
    for (const sub of topSubs) {
      const consensus = sub.mentioned_by?.length || 1;
      console.log(`   • ${sub.name} (${sub.count} problemów, ${consensus}/4 modeli)`);
    }
  }

  console.log(`\n\n💡 KEY INSIGHTS (po 1 z każdej kategorii):\n`);

  for (const category of output.categories) {
    const insight = category.key_insights?.[0];
    if (insight) {
      console.log(`• [${category.kategoria}]: ${insight.insight}`);
    }
  }

  console.log(`\n\n🚀 PROPOZYCJE MVP:\n`);

  const allMVPs = output.categories
    .flatMap((c) =>
      (c.mvp_proposals || []).map((mvp) => ({
        ...mvp,
        kategoria: c.kategoria,
      }))
    )
    .slice(0, 10);

  for (const mvp of allMVPs) {
    console.log(`• ${mvp.name} [${mvp.kategoria}]`);
    console.log(`  Target: ${mvp.target_persona}`);
    console.log(`  Value: ${mvp.core_value_prop}`);
    console.log(`  By: ${mvp.proposed_by}\n`);
  }
}

runDeepDive().catch(console.error);
