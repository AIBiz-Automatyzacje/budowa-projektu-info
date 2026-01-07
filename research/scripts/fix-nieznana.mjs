import 'dotenv/config';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import Anthropic from '@anthropic-ai/sdk';

const mappingFile = join(process.cwd(), 'docs/faza-2-analiza/normalization-mapping-v2.json');
const mapping = JSON.parse(readFileSync(mappingFile, 'utf8'));

const client = new Anthropic();
const MODEL = 'claude-haiku-4-5-20251001';

// Find all branches mapped to Nieznana
const toNieznana = Object.entries(mapping.branze_mapping)
  .filter(([k, v]) => v === 'Nieznana')
  .map(([k]) => k);

// Exclude truly unknown values
const trulyUnknown = ['nieznana', 'Nieznana', 'brak', 'General', 'inna', 'Różne', 'Ogólna', 'unknown', 'Unknown', 'inne', 'Inne'];
const toRemap = toNieznana.filter(b => !trulyUnknown.includes(b));

console.log(`Branże zmapowane na "Nieznana": ${toNieznana.length}`);
console.log(`Faktycznie nieznane (pomijamy): ${toNieznana.length - toRemap.length}`);
console.log(`Do ponownego mapowania: ${toRemap.length}`);

async function remapBranches() {
  const prompt = `Jesteś ekspertem od kategoryzacji branż biznesowych.

ISTNIEJĄCE BRANŻE KANONICZNE (${mapping.branze_canonical.length}):
${mapping.branze_canonical.join(', ')}

BRANŻE DO ZMAPOWANIA (${toRemap.length}):
${toRemap.map(b => `"${b}"`).join('\n')}

ZADANIE:
1. Dla każdej branży zdecyduj:
   - Czy pasuje do ISTNIEJĄCEJ kanonicznej? → przypisz ją
   - Czy wymaga NOWEJ kategorii? → zaproponuj nową (ale ogranicz do max 5 nowych)
   - Czy jest zbyt specyficzna/niszowa? → przypisz "Nieznana"

2. Zwróć JSON:
{
  "new_canonical": ["NowaBranza1", "NowaBranza2"],
  "mapping": {
    "Turystyka": "Turystyka/Eventy",
    "budownictwo": "Budownictwo",
    "Sport": "Sport/Fitness",
    "NGO": "Nieznana",
    ...
  }
}

Staraj się zmapować jak najwięcej do istniejących lub nowych kategorii.
"Nieznana" tylko dla naprawdę niszowych/specyficznych.

TYLKO JSON, bez tekstu.`;

  console.log('\nWysyłam do AI...');

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
    console.error('Błąd parsowania:', e.message);
    console.log('Odpowiedź:', text);
  }
  return null;
}

async function main() {
  const result = await remapBranches();

  if (!result) {
    console.error('Nie udało się uzyskać mapowania');
    return;
  }

  console.log('\n=== WYNIK ===\n');
  console.log('Nowe kategorie kanoniczne:', result.new_canonical);
  console.log('Zmapowano branż:', Object.keys(result.mapping).length);

  // Count how many still go to Nieznana
  const stillNieznana = Object.values(result.mapping).filter(v => v === 'Nieznana').length;
  const remapped = Object.keys(result.mapping).length - stillNieznana;
  console.log(`Poprawnie zmapowanych: ${remapped}`);
  console.log(`Nadal Nieznana: ${stillNieznana}`);

  // Update mapping
  const newMapping = {
    ...mapping,
    branze_canonical: [...new Set([...mapping.branze_canonical, ...(result.new_canonical || [])])],
    branze_mapping: { ...mapping.branze_mapping, ...result.mapping }
  };

  // Save
  const outputPath = join(process.cwd(), 'docs/faza-2-analiza/normalization-mapping-v3.json');
  writeFileSync(outputPath, JSON.stringify(newMapping, null, 2));
  console.log(`\nZapisano do: ${outputPath}`);

  // Stats
  console.log('\n=== PODSUMOWANIE ===');
  console.log(`Branże kanoniczne: ${mapping.branze_canonical.length} → ${newMapping.branze_canonical.length}`);

  // Show new mappings
  console.log('\n=== PRZYKŁADOWE NOWE MAPOWANIA ===');
  const examples = Object.entries(result.mapping)
    .filter(([k, v]) => v !== 'Nieznana')
    .slice(0, 20);
  for (const [from, to] of examples) {
    console.log(`  "${from}" → ${to}`);
  }
}

main().catch(console.error);
