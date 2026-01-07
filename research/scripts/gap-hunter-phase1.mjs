import fs from "fs/promises";
import dotenv from "dotenv";

dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

// Haiku 4.5 - szybki i tani model do klasyfikacji
const MODEL = {
  id: "anthropic/claude-haiku-4.5",
  name: "Claude Haiku 4.5",
};

// Typy luk rynkowych (z framework-gap-hunter.md)
const GAP_TYPES = [
  {
    id: "BRAK_ROZWIAZANIA",
    desc: "nie istnieje żadne narzędzie/usługa rozwiązujące ten problem",
  },
  {
    id: "ZA_DROGIE",
    desc: "rozwiązania istnieją ale są poza budżetem użytkownika",
  },
  {
    id: "ZA_TRUDNE",
    desc: "rozwiązania wymagają umiejętności których użytkownik nie ma",
  },
  {
    id: "ZA_WOLNE",
    desc: "rozwiązania zajmują zbyt dużo czasu użytkownika",
  },
  {
    id: "ZA_SLABA_JAKOSC",
    desc: "rozwiązania działają ale wyniki są niezadowalające",
  },
  {
    id: "NIEDOSTEPNE",
    desc: "rozwiązanie nie jest dostępne (region, język, nisza)",
  },
  {
    id: "BRAK_ZAUFANIA",
    desc: "użytkownik nie ufa dostępnym rozwiązaniom",
  },
  {
    id: "FRAGMENTACJA",
    desc: "trzeba używać wielu narzędzi zamiast jednego",
  },
];

const BATCH_SIZE = 100;

async function callModel(prompt) {
  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://github.com/live-research",
      "X-Title": "Gap Hunter Lite - Phase 1",
    },
    body: JSON.stringify({
      model: MODEL.id,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 16000,
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`${MODEL.name}: ${response.status} - ${error}`);
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

function buildPrompt(problems) {
  const gapTypesDesc = GAP_TYPES.map((g) => `${g.id} — ${g.desc}`).join("\n");

  const problemsSimplified = problems.map((p) => ({
    id: p.id,
    problem: p.problem,
    obecne_rozwiazanie: p.obecne_rozwiazanie,
    dlaczego_nie_dziala: p.dlaczego_nie_dziala,
  }));

  return `Sklasyfikuj typ luki rynkowej dla każdego problemu.

TYPY LUK:
${gapTypesDesc}

PROBLEMY DO SKLASYFIKOWANIA (${problems.length}):
${JSON.stringify(problemsSimplified, null, 2)}

Dla KAŻDEGO problemu określ:
1. primary_gap_type - główny typ luki (jeden z 8 typów)
2. secondary_gap_type - opcjonalny drugi typ (lub null)
3. confidence - pewność oceny 0.0-1.0
4. reasoning - krótkie uzasadnienie (1 zdanie)

Analizuj pole "dlaczego_nie_dziala" - tam jest powód problemu.

Zwróć TYLKO poprawny JSON array (bez markdown, bez \`\`\`):
[
  {
    "id": "problem_id",
    "primary_gap_type": "ZA_TRUDNE",
    "secondary_gap_type": "FRAGMENTACJA",
    "confidence": 0.85,
    "reasoning": "Użytkownik nie ma skillów do obsługi narzędzia"
  }
]

WAŻNE: Zwróć klasyfikację dla WSZYSTKICH ${problems.length} problemów!`;
}

async function classifyBatch(problems, batchNum, totalBatches) {
  console.log(
    `\n📦 Batch ${batchNum}/${totalBatches}: ${problems.length} problemów`
  );

  const prompt = buildPrompt(problems);
  const startTime = Date.now();

  console.log(`   ⏳ Wysyłam do ${MODEL.name}...`);

  const responseText = await callModel(prompt);
  const results = parseJSON(responseText);

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`   ✅ Otrzymano ${results.length} klasyfikacji (${elapsed}s)`);

  // Walidacja - sprawdź czy wszystkie ID są zwrócone
  const inputIds = new Set(problems.map((p) => p.id));
  const outputIds = new Set(results.map((r) => r.id));
  const missing = [...inputIds].filter((id) => !outputIds.has(id));

  if (missing.length > 0) {
    console.log(`   ⚠️  Brakuje ${missing.length} klasyfikacji`);
  }

  return results;
}

function summarizeResults(allResults) {
  const summary = {
    by_gap_type: {},
    by_secondary: {},
    avg_confidence: 0,
    total: allResults.length,
  };

  let totalConfidence = 0;

  for (const r of allResults) {
    // Primary gap type
    if (!summary.by_gap_type[r.primary_gap_type]) {
      summary.by_gap_type[r.primary_gap_type] = { count: 0, percent: 0 };
    }
    summary.by_gap_type[r.primary_gap_type].count++;

    // Secondary gap type
    if (r.secondary_gap_type) {
      if (!summary.by_secondary[r.secondary_gap_type]) {
        summary.by_secondary[r.secondary_gap_type] = { count: 0, percent: 0 };
      }
      summary.by_secondary[r.secondary_gap_type].count++;
    }

    totalConfidence += r.confidence || 0;
  }

  // Oblicz procenty
  for (const gap of Object.keys(summary.by_gap_type)) {
    summary.by_gap_type[gap].percent = Math.round(
      (summary.by_gap_type[gap].count / summary.total) * 1000
    ) / 10;
  }

  for (const gap of Object.keys(summary.by_secondary)) {
    summary.by_secondary[gap].percent = Math.round(
      (summary.by_secondary[gap].count / summary.total) * 1000
    ) / 10;
  }

  summary.avg_confidence = Math.round((totalConfidence / summary.total) * 100) / 100;

  return summary;
}

async function runPhase1() {
  console.log("🔍 Gap Hunter Lite - Faza 1: Klasyfikacja typów luk\n");
  console.log(`🤖 Model: ${MODEL.name}`);
  console.log(`📊 Batch size: ${BATCH_SIZE}\n`);

  // 1. Wczytaj problemy z narzędziami
  const problemsRaw = await fs.readFile(
    "docs/faza-2-analiza/output/problems-with-tools.json",
    "utf-8"
  );
  const problems = JSON.parse(problemsRaw);

  console.log(`📋 Załadowano ${problems.length} problemów z narzędziami\n`);

  // 2. Podziel na batche
  const batches = [];
  for (let i = 0; i < problems.length; i += BATCH_SIZE) {
    batches.push(problems.slice(i, i + BATCH_SIZE));
  }

  console.log(`📦 Podzielono na ${batches.length} batchy\n`);

  // 3. Przetwórz każdy batch
  const allResults = [];

  for (let i = 0; i < batches.length; i++) {
    try {
      const batchResults = await classifyBatch(batches[i], i + 1, batches.length);
      allResults.push(...batchResults);

      // Krótka przerwa między batchami
      if (i < batches.length - 1) {
        console.log("   💤 Czekam 2s przed następnym batchem...");
        await new Promise((r) => setTimeout(r, 2000));
      }
    } catch (e) {
      console.error(`\n❌ Błąd w batch ${i + 1}: ${e.message}`);
    }
  }

  console.log(`\n✅ Sklasyfikowano ${allResults.length}/${problems.length} problemów`);

  // 4. Podsumowanie
  const summary = summarizeResults(allResults);

  // 5. Utwórz output
  const output = {
    meta: {
      generated: new Date().toISOString(),
      phase: "Gap Hunter Lite - Phase 1: Gap Types Classification",
      model: MODEL.id,
      total_analyzed: allResults.length,
      total_input: problems.length,
      batch_size: BATCH_SIZE,
      batches_count: batches.length,
    },
    gap_types_reference: GAP_TYPES,
    summary: summary,
    problems: allResults,
  };

  // 6. Zapisz wyniki
  await fs.writeFile(
    "docs/faza-2-analiza/output/gap-types-analysis.json",
    JSON.stringify(output, null, 2)
  );

  console.log("\n💾 Wyniki zapisane do: docs/faza-2-analiza/output/gap-types-analysis.json\n");

  // 7. Wyświetl podsumowanie
  console.log("📊 PODSUMOWANIE TYPÓW LUK:\n");
  console.log("PRIMARY GAP TYPE:");
  console.log("─────────────────────────────────────");

  const sortedPrimary = Object.entries(summary.by_gap_type)
    .sort((a, b) => b[1].count - a[1].count);

  for (const [gap, data] of sortedPrimary) {
    const bar = "█".repeat(Math.round(data.percent / 3));
    console.log(`${gap.padEnd(20)} ${String(data.count).padStart(4)} (${data.percent.toFixed(1)}%) ${bar}`);
  }

  console.log("\nSECONDARY GAP TYPE (opcjonalny):");
  console.log("─────────────────────────────────────");

  const sortedSecondary = Object.entries(summary.by_secondary)
    .sort((a, b) => b[1].count - a[1].count);

  for (const [gap, data] of sortedSecondary) {
    console.log(`${gap.padEnd(20)} ${String(data.count).padStart(4)} (${data.percent.toFixed(1)}%)`);
  }

  console.log(`\n📈 Średnia pewność klasyfikacji: ${summary.avg_confidence}`);
  console.log("\n✅ Faza 1 zakończona!");
}

runPhase1().catch(console.error);
