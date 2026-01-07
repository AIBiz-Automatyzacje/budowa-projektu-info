import { readFileSync } from 'fs';
import { join } from 'path';

const TOOL_RESULTS_DIR = '/Users/kacper_trzepiecinski/.claude/projects/-Users-kacper-trzepiecinski-Documents-kodowanie-live/f6cdd0ae-ecce-4f90-9d2c-1d756350eeb1/tool-results';

const fbFile = join(TOOL_RESULTS_DIR, 'mcp-airtable-list_records-1767567200731.txt');
const redditFile = join(TOOL_RESULTS_DIR, 'mcp-airtable-list_records-1767567200782.txt');
const mappingFile = join(process.cwd(), 'docs/faza-2-analiza/normalization-mapping-v2.json');

const mapping = JSON.parse(readFileSync(mappingFile, 'utf8'));
const branzeMap = mapping.branze_mapping;

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
          problems.push({ branza: problem.branza });
        }
      }
    } catch (e) {}
  }
  return problems;
}

const allProblems = [...extractProblems(fbFile), ...extractProblems(redditFile)];

// Analyze what goes to Nieznana
const nieznanaCounts = {};
let nullCount = 0;
let emptyCount = 0;
let mappedToNieznana = 0;
let notInMapping = 0;

for (const p of allProblems) {
  const branza = p.branza;

  if (branza === null || branza === undefined) {
    nullCount++;
    continue;
  }

  if (branza === '' || branza.trim() === '') {
    emptyCount++;
    continue;
  }

  const mapped = branzeMap[branza] || branzeMap[branza.trim()];

  if (!mapped) {
    // Not in mapping at all
    notInMapping++;
    nieznanaCounts[branza] = (nieznanaCounts[branza] || 0) + 1;
  } else if (mapped === 'Nieznana') {
    // Explicitly mapped to Nieznana
    mappedToNieznana++;
  }
}

console.log('=== ANALIZA "NIEZNANA" ===\n');
console.log(`Null/undefined branża: ${nullCount}`);
console.log(`Pusty string branża: ${emptyCount}`);
console.log(`Jawnie zmapowane na "Nieznana": ${mappedToNieznana}`);
console.log(`NIE MA w mapowaniu (wpada do Nieznana): ${notInMapping}`);
console.log(`SUMA do Nieznana: ${nullCount + emptyCount + mappedToNieznana + notInMapping}`);

console.log('\n\n=== TOP 30 BRANŻ BEZ MAPOWANIA ===\n');
const sorted = Object.entries(nieznanaCounts).sort((a, b) => b[1] - a[1]);
for (const [branza, count] of sorted.slice(0, 30)) {
  console.log(`${count.toString().padStart(4)} | "${branza}"`);
}

console.log(`\n\nŁącznie unikalnych branż bez mapowania: ${sorted.length}`);
