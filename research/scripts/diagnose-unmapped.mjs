import { readFileSync } from 'fs';
import { join } from 'path';

const TOOL_RESULTS_DIR = '/Users/kacper_trzepiecinski/.claude/projects/-Users-kacper-trzepiecinski-Documents-kodowanie-live/f6cdd0ae-ecce-4f90-9d2c-1d756350eeb1/tool-results';

const fbFile = join(TOOL_RESULTS_DIR, 'mcp-airtable-list_records-1767567200731.txt');
const redditFile = join(TOOL_RESULTS_DIR, 'mcp-airtable-list_records-1767567200782.txt');
const mappingFile = join(process.cwd(), 'docs/faza-2-analiza/normalization-mapping.json');

const mapping = JSON.parse(readFileSync(mappingFile, 'utf8'));
const kategorieMap = mapping.kategorie_mapping;
const branzeMap = mapping.branze_mapping;

function extractProblems(filePath, platform) {
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
            branza: problem.branza,
            platform
          });
        }
      }
    } catch (e) {}
  }
  return problems;
}

const allProblems = [
  ...extractProblems(fbFile, 'FB'),
  ...extractProblems(redditFile, 'Reddit')
];

// Find unmapped categories
const unmappedKategorie = {};
const unmappedBranze = {};

for (const p of allProblems) {
  const kat = p.kategoria || '';
  const branza = p.branza || '';

  // Check kategoria
  if (!kategorieMap[kat] && !kategorieMap[kat.trim()]) {
    unmappedKategorie[kat] = (unmappedKategorie[kat] || 0) + 1;
  }

  // Check branza
  if (!branzeMap[branza] && !branzeMap[branza.trim()]) {
    unmappedBranze[branza] = (unmappedBranze[branza] || 0) + 1;
  }
}

// Sort by count
const sortedKat = Object.entries(unmappedKategorie).sort((a, b) => b[1] - a[1]);
const sortedBranza = Object.entries(unmappedBranze).sort((a, b) => b[1] - a[1]);

console.log('=== NIEMAPOWANE KATEGORIE (TOP 50) ===\n');
console.log('Count | Kategoria');
console.log('─'.repeat(60));
let totalUnmappedKat = 0;
for (const [kat, count] of sortedKat.slice(0, 50)) {
  console.log(`${count.toString().padStart(5)} | "${kat}"`);
  totalUnmappedKat += count;
}
console.log('─'.repeat(60));
console.log(`Łącznie niemapowanych kategorii: ${sortedKat.length} (${totalUnmappedKat} problemów)`);

console.log('\n\n=== NIEMAPOWANE BRANŻE (TOP 50) ===\n');
console.log('Count | Branża');
console.log('─'.repeat(60));
let totalUnmappedBranza = 0;
for (const [branza, count] of sortedBranza.slice(0, 50)) {
  console.log(`${count.toString().padStart(5)} | "${branza}"`);
  totalUnmappedBranza += count;
}
console.log('─'.repeat(60));
console.log(`Łącznie niemapowanych branż: ${sortedBranza.length} (${totalUnmappedBranza} problemów)`);

// Export for AI mapping
const exportData = {
  unmapped_kategorie: sortedKat,
  unmapped_branze: sortedBranza
};

console.log('\n\n=== EKSPORT DO MAPOWANIA ===');
console.log(JSON.stringify(exportData, null, 2));
