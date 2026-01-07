import 'dotenv/config';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import Anthropic from '@anthropic-ai/sdk';

const TOOL_RESULTS_DIR = '/Users/kacper_trzepiecinski/.claude/projects/-Users-kacper-trzepiecinski-Documents-kodowanie-live/f6cdd0ae-ecce-4f90-9d2c-1d756350eeb1/tool-results';

const fbFile = join(TOOL_RESULTS_DIR, 'mcp-airtable-list_records-1767567200731.txt');
const redditFile = join(TOOL_RESULTS_DIR, 'mcp-airtable-list_records-1767567200782.txt');
const mappingFile = join(process.cwd(), 'docs/faza-2-analiza/normalization-mapping.json');

const mapping = JSON.parse(readFileSync(mappingFile, 'utf8'));
const kategorieMap = mapping.kategorie_mapping;
const branzeMap = mapping.branze_mapping;

// ============================================
// KROK 1: Zebranie danych
// ============================================

function extractProblems(filePath) {
  const data = JSON.parse(readFileSync(filePath, 'utf8'));
  const problems = [];

  for (const record of data.records) {
    const raport = record.fields.Raport;
    if (!raport || raport === 'Pusto' || raport.startsWith('Mniej')) continue;

    try {
      const parsed = JSON.parse(raport);
      if (parsed.problemy && Array.isArray(parsed.problemy)) {
        for (const problem of parsed.problemy) {
          problems.push({
            kategoria: problem.kategoria,
            branza: problem.branza
          });
        }
      }
    } catch (e) {}
  }
  return problems;
}

console.log('Zbieranie danych...');
const allProblems = [
  ...extractProblems(fbFile),
  ...extractProblems(redditFile)
];

// Collect unmapped with counts
const unmappedKat = {};
const unmappedBranza = {};

for (const p of allProblems) {
  const kat = p.kategoria || '';
  const branza = p.branza || '';

  if (kat && !kategorieMap[kat] && !kategorieMap[kat.trim()]) {
    unmappedKat[kat] = (unmappedKat[kat] || 0) + 1;
  }

  if (branza && !branzeMap[branza] && !branzeMap[branza.trim()]) {
    unmappedBranza[branza] = (unmappedBranza[branza] || 0) + 1;
  }
}

const sortedKat = Object.entries(unmappedKat).sort((a, b) => b[1] - a[1]);
const sortedBranza = Object.entries(unmappedBranza).sort((a, b) => b[1] - a[1]);

console.log(`Niemapowanych kategorii: ${sortedKat.length}`);
console.log(`Niemapowanych branż: ${sortedBranza.length}`);

// ============================================
// KROK 2: AI Planning
// ============================================

const client = new Anthropic();
const MODEL = 'claude-haiku-4-5-20251001';

async function planMapping(type, canonical, unmapped) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`PLANOWANIE MAPOWANIA: ${type.toUpperCase()}`);
  console.log('='.repeat(60));

  const prompt = `Jesteś ekspertem od kategoryzacji danych biznesowych.

KONTEKST:
Analizujemy problemy użytkowników z grup Facebook i Reddit (polskie społeczności tech/biznes).
Mamy ${unmapped.length} niemapowanych ${type === 'kategorie' ? 'kategorii' : 'branż'} które trzeba zmapować.

ISTNIEJĄCE KANONICZNE ${type.toUpperCase()} (${canonical.length}):
${canonical.map((c, i) => `${i + 1}. ${c}`).join('\n')}

NIEMAPOWANE ${type.toUpperCase()} (top 100 po liczbie wystąpień):
${unmapped.slice(0, 100).map(([name, count]) => `- "${name}" (${count}x)`).join('\n')}

${unmapped.length > 100 ? `\n... i ${unmapped.length - 100} więcej z pojedynczymi wystąpieniami` : ''}

ZADANIE:
1. Przeanalizuj niemapowane wartości
2. Zaproponuj PLAN MAPOWANIA:
   - Które z istniejących kanonicznych kategorii pokrywają niemapowane?
   - Czy potrzebne są NOWE kategorie kanoniczne? Jakie?
   - Które kategorie można POŁĄCZYĆ?
   - Które są zbyt specyficzne i powinny trafić do "Inne"/${type === 'branze' ? '"Nieznana"' : '"Inne"'}?

3. Zwróć JSON:
{
  "analysis": "Krótka analiza sytuacji (2-3 zdania)",
  "new_canonical": ["nazwa1", "nazwa2"],  // Nowe proponowane kategorie kanoniczne (max 5)
  "mapping_strategy": [
    {
      "canonical": "Nazwa kanoniczna",
      "patterns": ["wzorzec1", "wzorzec2"],  // Jakie wzorce nazw mapować
      "examples": ["przykład1", "przykład2"]  // Konkretne przykłady z niemapowanych
    }
  ],
  "to_other": ["lista wartości które powinny iść do Inne/Nieznana"]
}

Odpowiedz TYLKO JSON, bez dodatkowego tekstu.`;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }]
  });

  const text = response.content[0].text;

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error('Błąd parsowania JSON:', e.message);
    console.log('Surowa odpowiedź:', text);
  }

  return null;
}

async function generateMapping(type, canonical, unmapped, plan) {
  console.log(`\nGenerowanie mapowania dla ${type}...`);

  // Add new canonical if any
  const allCanonical = [...canonical, ...(plan.new_canonical || [])];

  // Process in chunks (Haiku has smaller context)
  const CHUNK_SIZE = 200;
  const allMappings = {};

  for (let i = 0; i < unmapped.length; i += CHUNK_SIZE) {
    const chunk = unmapped.slice(i, i + CHUNK_SIZE);
    console.log(`  Chunk ${Math.floor(i / CHUNK_SIZE) + 1}/${Math.ceil(unmapped.length / CHUNK_SIZE)} (${chunk.length} wartości)`);

    const prompt = `Zmapuj te ${type === 'kategorie' ? 'kategorie' : 'branże'} na kategorie kanoniczne.

KATEGORIE KANONICZNE:
${allCanonical.join(', ')}

WARTOŚCI DO ZMAPOWANIA:
${chunk.map(([name]) => `"${name}"`).join('\n')}

Dla KAŻDEJ wartości przypisz jedną kategorię kanoniczną.
Jeśli nie pasuje — użyj "${type === 'kategorie' ? 'Inne' : 'Nieznana'}".

Zwróć JSON object:
{
  "wartość1": "KategoriaKanoniczna",
  "wartość2": "KategoriaKanoniczna"
}

TYLKO JSON, bez tekstu.`;

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }]
    });

    const text = response.content[0].text;

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const chunkMapping = JSON.parse(jsonMatch[0]);
        Object.assign(allMappings, chunkMapping);
      }
    } catch (e) {
      console.error(`  Błąd w chunk ${i / CHUNK_SIZE}:`, e.message);
    }
  }

  return allMappings;
}

// ============================================
// MAIN
// ============================================

async function main() {
  console.log(`\nUżywam modelu: ${MODEL}\n`);

  // Plan kategorie
  const katPlan = await planMapping('kategorie', mapping.kategorie_canonical, sortedKat);
  console.log('\nPLAN KATEGORII:');
  console.log(JSON.stringify(katPlan, null, 2));

  // Plan branże
  const branzaPlan = await planMapping('branze', mapping.branze_canonical, sortedBranza);
  console.log('\nPLAN BRANŻ:');
  console.log(JSON.stringify(branzaPlan, null, 2));

  // Save plans for review
  const plansPath = join(process.cwd(), 'docs/faza-2-analiza/mapping-plans.json');
  writeFileSync(plansPath, JSON.stringify({ kategorie: katPlan, branze: branzaPlan }, null, 2));
  console.log(`\nPlany zapisane do: ${plansPath}`);

  if (!process.argv.includes('--generate')) {
    console.log('\n' + '='.repeat(60));
    console.log('Przejrzyj plany w mapping-plans.json');
    console.log('Uruchom z flagą --generate aby wygenerować pełne mapowanie');
    console.log('='.repeat(60));
    return;
  }

  // Generate full mapping
  console.log('\n' + '='.repeat(60));
  console.log('GENEROWANIE PEŁNEGO MAPOWANIA');
  console.log('='.repeat(60));

  const katMapping = await generateMapping('kategorie', mapping.kategorie_canonical, sortedKat, katPlan);
  const branzaMapping = await generateMapping('branze', mapping.branze_canonical, sortedBranza, branzaPlan);

  console.log(`\nZmapowano kategorii: ${Object.keys(katMapping).length}`);
  console.log(`Zmapowano branż: ${Object.keys(branzaMapping).length}`);

  // Merge with existing mapping
  const newMapping = {
    meta: {
      ...mapping.meta,
      updated: new Date().toISOString().split('T')[0],
      ai_mapped_kategorie: Object.keys(katMapping).length,
      ai_mapped_branze: Object.keys(branzaMapping).length
    },
    kategorie_canonical: [...new Set([...mapping.kategorie_canonical, ...(katPlan.new_canonical || [])])],
    branze_canonical: [...new Set([...mapping.branze_canonical, ...(branzaPlan.new_canonical || [])])],
    kategorie_mapping: { ...mapping.kategorie_mapping, ...katMapping },
    branze_mapping: { ...mapping.branze_mapping, ...branzaMapping }
  };

  // Save as v2
  const v2Path = join(process.cwd(), 'docs/faza-2-analiza/normalization-mapping-v2.json');
  writeFileSync(v2Path, JSON.stringify(newMapping, null, 2));
  console.log(`\nNowe mapowanie zapisane do: ${v2Path}`);

  // Stats
  console.log('\n' + '='.repeat(60));
  console.log('PODSUMOWANIE');
  console.log('='.repeat(60));
  console.log(`Kategorie kanoniczne: ${mapping.kategorie_canonical.length} → ${newMapping.kategorie_canonical.length}`);
  console.log(`Branże kanoniczne: ${mapping.branze_canonical.length} → ${newMapping.branze_canonical.length}`);
  console.log(`Mapowania kategorii: ${Object.keys(mapping.kategorie_mapping).length} → ${Object.keys(newMapping.kategorie_mapping).length}`);
  console.log(`Mapowania branż: ${Object.keys(mapping.branze_mapping).length} → ${Object.keys(newMapping.branze_mapping).length}`);
}

main().catch(console.error);
