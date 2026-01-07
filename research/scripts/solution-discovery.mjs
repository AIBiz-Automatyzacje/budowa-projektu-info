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
      max_tokens: 15000,
      temperature: 0.5, // Trochę więcej kreatywności
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

function aggregateSolutions(allResults) {
  // Zbierz wszystkie rozwiązania
  const allSolutions = [];

  for (const { model, results } of allResults) {
    if (!results.solutions) continue;

    for (const solution of results.solutions) {
      allSolutions.push({
        ...solution,
        proposed_by: model,
      });
    }
  }

  // Grupuj podobne rozwiązania (po nazwie lub temacie)
  const grouped = {};

  for (const sol of allSolutions) {
    // Użyj nazwy jako klucza (uproszczone grupowanie)
    const key = sol.name.toLowerCase().replace(/[^a-z0-9]/g, "");

    if (!grouped[key]) {
      grouped[key] = {
        name: sol.name,
        solutions: [],
        models: [],
        total_score: 0,
      };
    }

    grouped[key].solutions.push(sol);
    grouped[key].models.push(sol.proposed_by);
    grouped[key].total_score += sol.market_potential || 0;
  }

  // Oblicz średnie i sortuj
  const rankings = Object.values(grouped)
    .map((g) => ({
      name: g.solutions[0].name,
      description: g.solutions[0].description,
      problem_solved: g.solutions[0].problem_solved,
      target_audience: g.solutions[0].target_audience,
      business_model: g.solutions[0].business_model,
      market_potential: Math.round(g.total_score / g.solutions.length),
      differentiation: g.solutions[0].differentiation,
      mvp_scope: g.solutions[0].mvp_scope,
      risks: g.solutions[0].risks,
      proposed_by: g.models,
      models_count: g.models.length,
      all_proposals: g.solutions,
    }))
    .sort((a, b) => {
      // Sortuj najpierw po liczbie modeli, potem po potencjale
      if (b.models_count !== a.models_count) {
        return b.models_count - a.models_count;
      }
      return b.market_potential - a.market_potential;
    });

  rankings.forEach((r, i) => (r.rank = i + 1));

  return rankings;
}

async function runSolutionDiscovery() {
  console.log("💡 Krok 4b: Solution Discovery (bez kontekstu społeczności)\n");
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

  // 2. Przygotuj dane - TOP 10 kategorii i TOP 12 wzorców z przykładami problemów
  const topCategories = pps.rankings.slice(0, 10).map((r) => ({
    kategoria: r.kategoria,
    pps_score: r.consensus_pps,
    key_insights: r.insights.map((i) => i.text).slice(0, 3),
    red_flags: r.red_flags,
  }));

  const topPatterns = patterns.patterns.slice(0, 12).map((p) => ({
    pattern: p.pattern_name,
    consensus_score: p.consensus_score,
    description: p.descriptions?.[0]?.text || "",
    affected_categories: p.affected_categories,
    example_problems: p.example_problems?.slice(0, 4) || [],
    underlying_needs: p.underlying_needs?.map((n) => n.text) || [],
  }));

  console.log(
    `📋 Analizuję ${topCategories.length} kategorii i ${topPatterns.length} wzorców...\n`
  );

  // 3. Prompt dla AI - BEZ kontekstu społeczności
  const prompt = `Jesteś ekspertem od tworzenia produktów SaaS i narzędzi dla małych firm.

Przeanalizowałem 4003 problemy z polskich grup Facebook i subredditów. Oto wyniki:

## TOP KATEGORIE PROBLEMÓW (posortowane wg Pain Priority Score):

${JSON.stringify(topCategories, null, 2)}

## TOP UKRYTE WZORCE (cross-cutting patterns):

${JSON.stringify(topPatterns, null, 2)}

---

## TWOJE ZADANIE:

Na podstawie tych danych zaproponuj **8-12 konkretnych produktów/narzędzi** które rozwiązują te problemy.

Dla każdego produktu podaj:

1. **Nazwa** - chwytliwa, zrozumiała
2. **Problem** - jaki konkretny ból rozwiązuje (odwołaj się do danych)
3. **Opis** - co to robi (2-3 zdania)
4. **Target** - kto jest głównym klientem
5. **Model biznesowy** - jak zarabia (SaaS, jednorazowa, freemium, marketplace, afiliacja)
6. **Potencjał rynkowy** (1-10) - jak duży rynek, jak pilny problem
7. **Wyróżnik** - dlaczego to jest lepsze niż istniejące rozwiązania
8. **MVP** - co musi zawierać minimalna wersja
9. **Ryzyka** - 2-3 główne zagrożenia

WAŻNE:
- Myśl szeroko - nie ograniczaj się do jednej niszy
- Szukaj problemów które dotykają WIELU kategorii naraz (cross-cutting)
- Preferuj rozwiązania które można zbudować szybko (no-code, AI, proste SaaS)
- Bądź konkretny - nie "platforma do wszystkiego"

Zwróć TYLKO poprawny JSON (bez markdown):
{
  "solutions": [
    {
      "name": "Nazwa produktu",
      "problem_solved": "Jaki problem rozwiązuje",
      "description": "Co to robi",
      "target_audience": "Dla kogo",
      "business_model": "Jak zarabia",
      "market_potential": 1-10,
      "differentiation": "Dlaczego lepsze",
      "mvp_scope": "Co musi mieć MVP",
      "risks": ["ryzyko 1", "ryzyko 2"]
    }
  ],
  "meta_insights": "2-3 zdania o tym co zauważyłeś analizując te dane"
}`;

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
      const solCount = results.solutions?.length || 0;
      console.log(`   ✅ ${model.name} (${elapsed}s) - ${solCount} rozwiązań`);
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

  // 5. Zbierz wszystkie rozwiązania (bez agregacji - każde osobno)
  const allSolutions = [];
  const metaInsights = [];

  for (const { model, results } of allResults) {
    if (results.meta_insights) {
      metaInsights.push({ model, insight: results.meta_insights });
    }

    if (results.solutions) {
      for (const sol of results.solutions) {
        allSolutions.push({
          ...sol,
          proposed_by: model,
        });
      }
    }
  }

  // Sortuj po potencjale rynkowym
  allSolutions.sort((a, b) => (b.market_potential || 0) - (a.market_potential || 0));
  allSolutions.forEach((s, i) => (s.rank = i + 1));

  // 6. Grupuj podobne tematy
  const themes = {};
  for (const sol of allSolutions) {
    // Wykryj główny temat
    const name = sol.name.toLowerCase();
    let theme = "inne";

    if (name.includes("automat") || name.includes("workflow") || name.includes("bot")) {
      theme = "automatyzacja";
    } else if (name.includes("freelanc") || name.includes("zleceni") || name.includes("match")) {
      theme = "freelance/zlecenia";
    } else if (name.includes("integr") || name.includes("sync") || name.includes("connector")) {
      theme = "integracje";
    } else if (name.includes("market") || name.includes("lead") || name.includes("prospect")) {
      theme = "marketing/leady";
    } else if (name.includes("content") || name.includes("video") || name.includes("social")) {
      theme = "content";
    } else if (name.includes("analyt") || name.includes("dashboard") || name.includes("report")) {
      theme = "analityka";
    } else if (name.includes("time") || name.includes("task") || name.includes("productiv")) {
      theme = "produktywność";
    }

    if (!themes[theme]) {
      themes[theme] = [];
    }
    themes[theme].push(sol);
  }

  // 7. Output
  const output = {
    meta: {
      generated: new Date().toISOString(),
      step: "4b. Solution Discovery (bez kontekstu społeczności)",
      models_used: allResults.map((r) => r.modelId),
      models_count: allResults.length,
      total_solutions: allSolutions.length,
      input_categories: topCategories.length,
      input_patterns: topPatterns.length,
    },
    meta_insights: metaInsights,
    solutions_by_potential: allSolutions,
    solutions_by_theme: themes,
    theme_summary: Object.entries(themes)
      .map(([theme, sols]) => ({
        theme,
        count: sols.length,
        avg_potential: Math.round(
          sols.reduce((a, s) => a + (s.market_potential || 0), 0) / sols.length * 10
        ) / 10,
        top_solution: sols.sort((a, b) => (b.market_potential || 0) - (a.market_potential || 0))[0]?.name,
      }))
      .sort((a, b) => b.count - a.count),
    raw_model_responses: allResults.map((r) => ({
      model: r.model,
      solutions_count: r.results.solutions?.length || 0,
    })),
  };

  // 8. Zapisz
  await fs.writeFile(
    "docs/faza-2-analiza/output/solution-discovery.json",
    JSON.stringify(output, null, 2)
  );

  console.log("\n✅ Wyniki zapisane do: docs/faza-2-analiza/output/solution-discovery.json\n");

  // 9. Wyświetl wyniki
  printResults(allSolutions, themes, metaInsights);
}

function printResults(solutions, themes, insights) {
  console.log("💡 META INSIGHTS (co zauważyły modele):\n");
  for (const { model, insight } of insights) {
    console.log(`${model}:`);
    console.log(`   "${insight}"\n`);
  }

  console.log("\n📊 ROZWIĄZANIA WG TEMATU:\n");
  for (const [theme, sols] of Object.entries(themes).sort((a, b) => b[1].length - a[1].length)) {
    const avgPotential = Math.round(
      sols.reduce((a, s) => a + (s.market_potential || 0), 0) / sols.length * 10
    ) / 10;
    console.log(`${theme.toUpperCase()} (${sols.length} propozycji, avg potential: ${avgPotential}/10)`);
    sols.slice(0, 3).forEach((s) => {
      console.log(`   • ${s.name} [${s.market_potential}/10] - ${s.proposed_by}`);
    });
    console.log("");
  }

  console.log("\n🏆 TOP 15 ROZWIĄZAŃ wg Market Potential:\n");
  console.log(
    "Rank | Pot. | Rozwiązanie                              | Model"
  );
  console.log(
    "-----|------|------------------------------------------|----------------"
  );

  solutions.slice(0, 15).forEach((s, i) => {
    const name = s.name.padEnd(40).substring(0, 40);
    const model = s.proposed_by.substring(0, 14);
    console.log(
      `  ${String(i + 1).padStart(2)} | ${String(s.market_potential || "?").padStart(4)} | ${name} | ${model}`
    );
  });

  console.log("\n\n💎 TOP 5 SZCZEGÓŁOWO:\n");
  solutions.slice(0, 5).forEach((s, i) => {
    console.log(`${i + 1}. ${s.name} [${s.market_potential}/10] — ${s.proposed_by}`);
    console.log(`   Problem: ${s.problem_solved}`);
    console.log(`   Target: ${s.target_audience}`);
    console.log(`   Model: ${s.business_model}`);
    console.log(`   MVP: ${s.mvp_scope}`);
    console.log(`   Wyróżnik: ${s.differentiation}`);
    console.log("");
  });

  console.log("📊 Pełne wyniki w pliku JSON.");
}

runSolutionDiscovery().catch(console.error);
