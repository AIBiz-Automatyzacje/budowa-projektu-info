import { readFileSync } from 'fs';
import { join } from 'path';

const TOOL_RESULTS_DIR = '/Users/kacper_trzepiecinski/.claude/projects/-Users-kacper-trzepiecinski-Documents-kodowanie-live/f6cdd0ae-ecce-4f90-9d2c-1d756350eeb1/tool-results';

const fbFile = join(TOOL_RESULTS_DIR, 'mcp-airtable-list_records-1767567200731.txt');
const redditFile = join(TOOL_RESULTS_DIR, 'mcp-airtable-list_records-1767567200782.txt');
const mappingFile = join(process.cwd(), 'docs/faza-2-analiza/normalization-mapping.json');

const mapping = JSON.parse(readFileSync(mappingFile, 'utf8'));
const kategorieMap = mapping.kategorie_mapping;

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

console.log(`Łącznie problemów: ${allProblems.length}\n`);

// Analyze kategoria values
const kategoriaAnalysis = {
  null_or_undefined: 0,
  empty_string: 0,
  mapped_to_canonical: 0,
  not_in_mapping: 0
};

const notMappedExamples = {};

for (const p of allProblems) {
  const kat = p.kategoria;

  if (kat === null || kat === undefined) {
    kategoriaAnalysis.null_or_undefined++;
  } else if (kat === '' || kat.trim() === '') {
    kategoriaAnalysis.empty_string++;
  } else if (kategorieMap[kat] || kategorieMap[kat.trim()]) {
    kategoriaAnalysis.mapped_to_canonical++;
  } else {
    kategoriaAnalysis.not_in_mapping++;
    notMappedExamples[kat] = (notMappedExamples[kat] || 0) + 1;
  }
}

console.log('=== ANALIZA KATEGORII ===');
console.log(`null/undefined: ${kategoriaAnalysis.null_or_undefined}`);
console.log(`pusty string: ${kategoriaAnalysis.empty_string}`);
console.log(`mapowane na canonical: ${kategoriaAnalysis.mapped_to_canonical}`);
console.log(`NIE w mapowaniu: ${kategoriaAnalysis.not_in_mapping}`);
console.log(`SUMA: ${Object.values(kategoriaAnalysis).reduce((a,b) => a+b, 0)}`);

console.log('\n\n=== SPRAWDZENIE MAPOWANIA ===');
console.log('Czy "Inne" jest w mapping jako klucz?', 'Inne' in kategorieMap);
console.log('Wartości w mapping które mapują do siebie:');

const selfMapped = Object.entries(kategorieMap).filter(([k, v]) => k === v);
console.log(selfMapped.map(([k]) => k).join(', '));

console.log('\n\n=== TOP 30 NIEMAPOWANYCH (z countami) ===');
const sorted = Object.entries(notMappedExamples).sort((a,b) => b[1] - a[1]);
for (const [kat, count] of sorted.slice(0, 30)) {
  console.log(`${count.toString().padStart(4)} | "${kat}"`);
}
