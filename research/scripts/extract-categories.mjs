import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const TOOL_RESULTS_DIR = '/Users/kacper_trzepiecinski/.claude/projects/-Users-kacper-trzepiecinski-Documents-kodowanie-live/f6cdd0ae-ecce-4f90-9d2c-1d756350eeb1/tool-results';

// File paths (FULL DATA - 105 FB, 154 Reddit)
const fbFile = join(TOOL_RESULTS_DIR, 'mcp-airtable-list_records-1767567200731.txt');
const redditFile = join(TOOL_RESULTS_DIR, 'mcp-airtable-list_records-1767567200782.txt');

function extractProblemsFromRecords(filePath, sourceName) {
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
            ...problem,
            source: sourceName,
            source_name: record.fields.Nazwa || record.fields.Subreddit || 'unknown'
          });
        }
      }
    } catch (e) {
      // Skip invalid JSON
    }
  }

  return problems;
}

// Extract problems
console.log('Extracting problems from Reddit...');
const redditProblems = extractProblemsFromRecords(redditFile, 'Reddit');
console.log(`Found ${redditProblems.length} problems from Reddit`);

console.log('Extracting problems from FB...');
const fbProblems = extractProblemsFromRecords(fbFile, 'FB');
console.log(`Found ${fbProblems.length} problems from FB`);

const allProblems = [...redditProblems, ...fbProblems];
console.log(`\nTotal problems: ${allProblems.length}`);

// Count categories
const kategorieCount = {};
const branzeCount = {};

for (const p of allProblems) {
  const kat = p.kategoria || 'UNKNOWN';
  const branza = p.branza || 'nieznana';

  kategorieCount[kat] = (kategorieCount[kat] || 0) + 1;
  branzeCount[branza] = (branzeCount[branza] || 0) + 1;
}

// Sort by count
const sortedKategorie = Object.entries(kategorieCount)
  .sort((a, b) => b[1] - a[1]);

const sortedBranze = Object.entries(branzeCount)
  .sort((a, b) => b[1] - a[1]);

console.log('\n=== KATEGORIE (TOP 50) ===');
for (const [kat, count] of sortedKategorie.slice(0, 50)) {
  console.log(`${count.toString().padStart(4)} | ${kat}`);
}

console.log('\n=== BRANŻE (TOP 50) ===');
for (const [branza, count] of sortedBranze.slice(0, 50)) {
  console.log(`${count.toString().padStart(4)} | ${branza}`);
}

// Save to file for normalization
const output = {
  stats: {
    total_problems: allProblems.length,
    reddit_problems: redditProblems.length,
    fb_problems: fbProblems.length,
    unique_kategorie: sortedKategorie.length,
    unique_branze: sortedBranze.length
  },
  kategorie: sortedKategorie,
  branze: sortedBranze
};

const outputPath = join(process.cwd(), 'docs/faza-2-analiza/extracted-categories.json');
writeFileSync(outputPath, JSON.stringify(output, null, 2));
console.log(`\nSaved to: ${outputPath}`);
