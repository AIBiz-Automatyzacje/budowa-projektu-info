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
      temperature: 0.4,
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

function aggregatePatterns(allResults) {
  // Zbierz wszystkie wzorce
  const patternMap = {};

  for (const { model, patterns } of allResults) {
    for (const p of patterns) {
      // Normalizuj nazwę wzorca (lowercase, bez spacji na końcach)
      const normalizedName = p.pattern_name.toLowerCase().trim();

      // Szukaj podobnych wzorców (fuzzy matching)
      let matchedKey = null;
      for (const existingKey of Object.keys(patternMap)) {
        // Jeśli nazwy są podobne (zawierają te same słowa kluczowe)
        const existingWords = existingKey.split(/\s+/);
        const newWords = normalizedName.split(/\s+/);
        const commonWords = existingWords.filter((w) =>
          newWords.some((nw) => nw.includes(w) || w.includes(nw))
        );
        if (commonWords.length >= 2 || existingKey.includes(normalizedName) || normalizedName.includes(existingKey)) {
          matchedKey = existingKey;
          break;
        }
      }

      const key = matchedKey || normalizedName;

      if (!patternMap[key]) {
        patternMap[key] = {
          names: [],
          descriptions: [],
          categories: [],
          percentages: [],
          examples: [],
          needs: [],
          solutions: [],
          products: [],
          models_found: [],
        };
      }

      patternMap[key].names.push({ model, name: p.pattern_name });
      patternMap[key].descriptions.push({ model, text: p.pattern_description });
      patternMap[key].categories.push(...(p.affected_categories || []));
      patternMap[key].percentages.push(parseFloat(p.affected_percentage) || 0);
      patternMap[key].examples.push(...(p.example_problems || []));
      patternMap[key].needs.push({ model, text: p.underlying_need });
      patternMap[key].solutions.push({ model, text: p.solution_direction });
      patternMap[key].products.push({ model, text: p.product_opportunity });
      patternMap[key].models_found.push(model);
    }
  }

  // Konwertuj do listy i oblicz consensus
  const patterns = Object.entries(patternMap)
    .map(([key, data]) => {
      const modelsCount = [...new Set(data.models_found)].length;
      const avgPercentage =
        data.percentages.reduce((a, b) => a + b, 0) / data.percentages.length;

      // Consensus score: więcej modeli = wyższy score
      const consensusScore = modelsCount * 25 + avgPercentage;

      // Wybierz najczęstszą nazwę
      const nameCounts = {};
      data.names.forEach((n) => {
        nameCounts[n.name] = (nameCounts[n.name] || 0) + 1;
      });
      const bestName = Object.entries(nameCounts).sort((a, b) => b[1] - a[1])[0][0];

      return {
        pattern_name: bestName,
        pattern_key: key,
        consensus_score: Math.round(consensusScore),
        models_found: [...new Set(data.models_found)],
        models_count: modelsCount,
        avg_affected_percentage: Math.round(avgPercentage) + "%",
        affected_categories: [...new Set(data.categories)].slice(0, 6),
        example_problems: [...new Set(data.examples)].slice(0, 5),
        descriptions: data.descriptions,
        underlying_needs: data.needs,
        solution_directions: data.solutions,
        product_opportunities: data.products,
      };
    })
    .sort((a, b) => b.consensus_score - a.consensus_score);

  return patterns;
}

async function detectPatterns() {
  console.log("🔍 Krok 3.3: Wykrywanie ukrytych wzorców\n");
  console.log("🔄 Multi-model approach: 4 modele przez OpenRouter\n");

  // 1. Wczytaj PPS rankings (nowe, multi-model)
  let pps;
  try {
    const ppsRaw = await fs.readFile(
      "docs/faza-2-analiza/output/pps-rankings.json",
      "utf-8"
    );
    pps = JSON.parse(ppsRaw);
  } catch (e) {
    console.error("❌ Brak pliku pps-rankings.json. Najpierw uruchom calculate-pps.mjs");
    return;
  }

  const topCategories = pps.rankings.slice(0, 10).map((r) => r.kategoria);
  console.log("📋 Top 10 kategorii:", topCategories.join(", "));

  // 2. Wczytaj WSZYSTKIE problemy
  const problemsRaw = await fs.readFile(
    "docs/faza-2-analiza/output/all-problems.json",
    "utf-8"
  );
  const data = JSON.parse(problemsRaw);
  console.log(`📊 Załadowano ${data.meta.total_problems} problemów`);

  // 3. Stratified sampling - 30 z każdej top kategorii = 300 problemów
  const sample = [];
  for (const kat of topCategories) {
    const fromKat = data.problems
      .filter((p) => p.kategoria === kat)
      .sort(() => Math.random() - 0.5)
      .slice(0, 30);
    sample.push(...fromKat);
    console.log(`   ${kat}: ${fromKat.length} problemów`);
  }

  console.log(`\n🎯 Sample: ${sample.length} problemów (stratified z top 10 kategorii)`);

  // 4. Przygotuj dane dla AI
  const sampleForAI = sample.map((p) => ({
    problem: p.problem,
    kategoria: p.kategoria,
    branza: p.branza,
    intensywnosc: p.intensywnosc,
    sygnal_zakupowy: p.sygnal_zakupowy,
    obecne_rozwiazanie: p.obecne_rozwiazanie,
    dlaczego_nie_dziala: p.dlaczego_nie_dziala,
    cytat: p.cytat?.substring(0, 150),
    source: p.source,
  }));

  // 5. Prompt dla AI
  const prompt = `Przeanalizuj te ${sampleForAI.length} problemów użytkowników z polskich grup Facebook i subredditów.

PROBLEMY (JSON):
${JSON.stringify(sampleForAI, null, 2)}

Szukam UKRYTYCH WZORCÓW — rzeczy które:
- Nie wynikają bezpośrednio z kategorii/branży
- Łączą pozornie różne problemy
- Wskazują na głębszą potrzebę
- Mogą być podstawą do budowy produktu

Przykłady wzorców do szukania:
- "Problemy z czasem" (za mało czasu, deadlines, wielozadaniowość)
- "Problemy z zaufaniem" (do narzędzi, do ludzi, do procesu)
- "Problemy ze skalą" (to co działało dla 10 klientów nie działa dla 100)
- "Problemy z wiedzą" (nie wiem jak, brak kompetencji)
- "Problemy z narzędziami" (za dużo, za mało, nie integrują się)
- "Problemy z cashflow" (płatności, faktury, budżetowanie)
- "Problemy z ludźmi" (delegowanie, znajdowanie talentów)

Znajdź 8-12 takich wzorców. Bądź konkretny i praktyczny.

Zwróć TYLKO poprawny JSON (bez markdown):
[
  {
    "pattern_name": "Krótka nazwa wzorca (max 4 słowa)",
    "pattern_description": "2-3 zdania opis wzorca",
    "affected_categories": ["kategoria1", "kategoria2"],
    "affected_percentage": "X%",
    "example_problems": ["przykład 1", "przykład 2", "przykład 3"],
    "underlying_need": "Głęboka potrzeba którą ten wzorzec ujawnia",
    "solution_direction": "W jakim kierunku szukać rozwiązania",
    "product_opportunity": "Konkretny pomysł na produkt/usługę"
  }
]`;

  // 6. Wywołaj wszystkie modele równolegle
  console.log("\n🤖 Wysyłam do 4 modeli przez OpenRouter...\n");

  const allResults = [];

  const promises = MODELS.map(async (model) => {
    const startTime = Date.now();
    console.log(`   ⏳ ${model.name}...`);

    try {
      const responseText = await callModel(model.id, prompt);
      const patterns = parseJSON(responseText);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`   ✅ ${model.name} (${elapsed}s) - ${patterns.length} wzorców`);
      return { model: model.name, modelId: model.id, patterns };
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

  // 7. Agregacja wzorców
  console.log("\n🔀 Agregacja wzorców (consensus matching)...\n");
  const patterns = aggregatePatterns(allResults);

  // 8. Utwórz output
  const output = {
    meta: {
      generated: new Date().toISOString(),
      step: "3.3 Hidden Patterns Detection (Multi-Model)",
      models_used: allResults.map((r) => r.modelId),
      models_count: allResults.length,
      sample_size: sample.length,
      total_problems: data.meta.total_problems,
      top_categories_used: topCategories,
      total_patterns_found: patterns.length,
    },
    patterns: patterns,
    raw_model_responses: allResults.map((r) => ({
      model: r.model,
      patterns_count: r.patterns.length,
    })),
  };

  // 9. Zapisz wyniki
  await fs.writeFile(
    "docs/faza-2-analiza/output/hidden-patterns.json",
    JSON.stringify(output, null, 2)
  );

  console.log("✅ Wyniki zapisane do: docs/faza-2-analiza/output/hidden-patterns.json\n");

  // 10. Wyświetl wzorce
  console.log("═".repeat(70));
  console.log("🔮 UKRYTE WZORCE (CONSENSUS Z " + allResults.length + " MODELI)");
  console.log("═".repeat(70));

  patterns.slice(0, 12).forEach((p, i) => {
    const modelsStr = p.models_found.join(", ");
    console.log(`\n${i + 1}. ${p.pattern_name.toUpperCase()}`);
    console.log(`   📊 ${p.avg_affected_percentage} problemów | Found by: ${modelsStr}`);
    console.log(`   💡 Produkt: ${p.product_opportunities[0]?.text || "N/A"}`);
  });

  // 11. Pokaż wzorce z wysokim consensus (wszystkie 4 modele)
  const highConsensus = patterns.filter((p) => p.models_count >= 3);
  if (highConsensus.length > 0) {
    console.log("\n" + "═".repeat(70));
    console.log("⭐ WZORCE Z WYSOKIM CONSENSUS (3-4 modele zgodne):");
    console.log("═".repeat(70));
    highConsensus.forEach((p) => {
      console.log(`   • ${p.pattern_name} (${p.models_count}/4 modeli)`);
    });
  }

  console.log("\n" + "═".repeat(70));
}

detectPatterns().catch(console.error);
