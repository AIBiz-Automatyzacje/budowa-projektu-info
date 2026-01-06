import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const TOOL_RESULTS_DIR = '/Users/kacper_trzepiecinski/.claude/projects/-Users-kacper-trzepiecinski-Documents-kodowanie-live/f6cdd0ae-ecce-4f90-9d2c-1d756350eeb1/tool-results';

// File paths
const fbFile = join(TOOL_RESULTS_DIR, 'mcp-airtable-list_records-1767567200731.txt');
const redditFile = join(TOOL_RESULTS_DIR, 'mcp-airtable-list_records-1767567200782.txt');
const mappingFile = join(process.cwd(), 'docs/faza-2-analiza/normalization-mapping-v3.json');

// Load normalization mapping
const mapping = JSON.parse(readFileSync(mappingFile, 'utf8'));
const kategorieMap = mapping.kategorie_mapping;
const branzeMap = mapping.branze_mapping;

function normalizeKategoria(kat) {
  if (!kat) return 'Inne';
  return kategorieMap[kat] || kategorieMap[kat.trim()] || 'Inne';
}

function normalizeBranza(branza) {
  if (!branza) return 'Nieznana';
  return branzeMap[branza] || branzeMap[branza.trim()] || 'Nieznana';
}

function extractProblemsFromRecords(filePath, platform) {
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
            id: `${platform}_${record.id}_${problems.length}`,
            problem: problem.problem,
            kategoria_raw: problem.kategoria,
            branza_raw: problem.branza,
            kategoria: normalizeKategoria(problem.kategoria),
            branza: normalizeBranza(problem.branza),
            intensywnosc: problem.intensywnosc || 0,
            sygnal_zakupowy: problem.sygnal_zakupowy || 0,
            obecne_rozwiazanie: problem.obecne_rozwiazanie || '',
            dlaczego_nie_dziala: problem.dlaczego_nie_dziala || '',
            cytat_kluczowy: problem.cytat_kluczowy || '',
            sentyment_spolecznosci: problem.sentyment_spolecznosci || '',
            platform,
            source_name: record.fields.Nazwa || record.fields.Subreddit || 'unknown',
            source_url: record.fields.URL || ''
          });
        }
      }
    } catch (e) {
      // Skip invalid JSON
    }
  }

  return problems;
}

// Extract all problems
console.log('Ekstrahowanie problemów...');
const fbProblems = extractProblemsFromRecords(fbFile, 'FB');
const redditProblems = extractProblemsFromRecords(redditFile, 'Reddit');
const allProblems = [...fbProblems, ...redditProblems];

console.log(`FB: ${fbProblems.length}, Reddit: ${redditProblems.length}, Łącznie: ${allProblems.length}`);

// ============================================
// AGREGACJA KROK 3.1
// ============================================

// A) GROUP BY kategoria
const byKategoria = {};

for (const p of allProblems) {
  const kat = p.kategoria;

  if (!byKategoria[kat]) {
    byKategoria[kat] = {
      count: 0,
      problems: [],
      sum_intensywnosc: 0,
      sum_sygnal: 0,
      platforms: { FB: 0, Reddit: 0 },
      branze_breakdown: {}
    };
  }

  const bucket = byKategoria[kat];
  bucket.count++;
  bucket.problems.push(p.id);
  bucket.sum_intensywnosc += p.intensywnosc;
  bucket.sum_sygnal += p.sygnal_zakupowy;
  bucket.platforms[p.platform]++;

  const branza = p.branza;
  bucket.branze_breakdown[branza] = (bucket.branze_breakdown[branza] || 0) + 1;
}

// Calculate averages and finalize
const kategoriaAggregates = Object.entries(byKategoria).map(([kategoria, data]) => ({
  kategoria,
  count: data.count,
  avg_intensywnosc: Math.round((data.sum_intensywnosc / data.count) * 100) / 100,
  avg_sygnal_zakupowy: Math.round((data.sum_sygnal / data.count) * 100) / 100,
  platforms: data.platforms,
  cross_platform: data.platforms.FB > 0 && data.platforms.Reddit > 0,
  platform_coverage: Math.round((Math.min(data.platforms.FB, data.platforms.Reddit) / Math.max(data.platforms.FB, data.platforms.Reddit)) * 100) / 100 || 0,
  branze_breakdown: data.branze_breakdown,
  branze_count: Object.keys(data.branze_breakdown).length,
  problem_ids: data.problems
})).sort((a, b) => b.count - a.count);

// B) GROUP BY branża
const byBranza = {};

for (const p of allProblems) {
  const branza = p.branza;

  if (!byBranza[branza]) {
    byBranza[branza] = {
      count: 0,
      problems: [],
      sum_intensywnosc: 0,
      sum_sygnal: 0,
      platforms: { FB: 0, Reddit: 0 },
      kategorie_breakdown: {}
    };
  }

  const bucket = byBranza[branza];
  bucket.count++;
  bucket.problems.push(p.id);
  bucket.sum_intensywnosc += p.intensywnosc;
  bucket.sum_sygnal += p.sygnal_zakupowy;
  bucket.platforms[p.platform]++;

  const kat = p.kategoria;
  bucket.kategorie_breakdown[kat] = (bucket.kategorie_breakdown[kat] || 0) + 1;
}

const branzaAggregates = Object.entries(byBranza).map(([branza, data]) => ({
  branza,
  count: data.count,
  avg_intensywnosc: Math.round((data.sum_intensywnosc / data.count) * 100) / 100,
  avg_sygnal_zakupowy: Math.round((data.sum_sygnal / data.count) * 100) / 100,
  platforms: data.platforms,
  cross_platform: data.platforms.FB > 0 && data.platforms.Reddit > 0,
  kategorie_breakdown: data.kategorie_breakdown,
  kategorie_count: Object.keys(data.kategorie_breakdown).length,
  problem_ids: data.problems
})).sort((a, b) => b.count - a.count);

// C) Matrix: kategoria × branża
const matrix = {};

for (const p of allProblems) {
  const key = `${p.kategoria}|${p.branza}`;

  if (!matrix[key]) {
    matrix[key] = {
      kategoria: p.kategoria,
      branza: p.branza,
      count: 0,
      sum_intensywnosc: 0,
      sum_sygnal: 0,
      platforms: { FB: 0, Reddit: 0 }
    };
  }

  matrix[key].count++;
  matrix[key].sum_intensywnosc += p.intensywnosc;
  matrix[key].sum_sygnal += p.sygnal_zakupowy;
  matrix[key].platforms[p.platform]++;
}

const matrixAggregates = Object.values(matrix).map(cell => ({
  kategoria: cell.kategoria,
  branza: cell.branza,
  count: cell.count,
  avg_intensywnosc: Math.round((cell.sum_intensywnosc / cell.count) * 100) / 100,
  avg_sygnal_zakupowy: Math.round((cell.sum_sygnal / cell.count) * 100) / 100,
  platforms: cell.platforms,
  cross_platform: cell.platforms.FB > 0 && cell.platforms.Reddit > 0
})).sort((a, b) => b.count - a.count);

// ============================================
// OUTPUT
// ============================================

const output = {
  meta: {
    generated: new Date().toISOString(),
    total_problems: allProblems.length,
    fb_problems: fbProblems.length,
    reddit_problems: redditProblems.length,
    unique_kategorie: kategoriaAggregates.length,
    unique_branze: branzaAggregates.length,
    matrix_cells: matrixAggregates.length
  },

  // Global metrics
  global_metrics: {
    avg_intensywnosc: Math.round((allProblems.reduce((s, p) => s + p.intensywnosc, 0) / allProblems.length) * 100) / 100,
    avg_sygnal_zakupowy: Math.round((allProblems.reduce((s, p) => s + p.sygnal_zakupowy, 0) / allProblems.length) * 100) / 100
  },

  // Aggregates (without problem_ids for readability)
  by_kategoria: kategoriaAggregates.map(({ problem_ids, ...rest }) => rest),
  by_branza: branzaAggregates.map(({ problem_ids, ...rest }) => rest),
  matrix: matrixAggregates.slice(0, 100), // Top 100 combinations

  // Full data for PPS calculation (Krok 3.2)
  full_kategoria_data: kategoriaAggregates
};

// Save results
const outputPath = join(process.cwd(), 'docs/faza-2-analiza/aggregates.json');
writeFileSync(outputPath, JSON.stringify(output, null, 2));
console.log(`\nZapisano do: ${outputPath}`);

// Print summary
console.log('\n========================================');
console.log('AGREGACJA KROK 3.1 - PODSUMOWANIE');
console.log('========================================\n');

console.log('TOP 10 KATEGORII (po liczbie problemów):');
console.log('─'.repeat(80));
console.log('Kategoria'.padEnd(30) + 'Count'.padStart(7) + 'Avg Int'.padStart(10) + 'Avg Syg'.padStart(10) + 'FB'.padStart(7) + 'Reddit'.padStart(8) + 'Cross?'.padStart(8));
console.log('─'.repeat(80));

for (const k of kategoriaAggregates.slice(0, 10)) {
  console.log(
    k.kategoria.padEnd(30) +
    k.count.toString().padStart(7) +
    k.avg_intensywnosc.toFixed(2).padStart(10) +
    k.avg_sygnal_zakupowy.toFixed(2).padStart(10) +
    k.platforms.FB.toString().padStart(7) +
    k.platforms.Reddit.toString().padStart(8) +
    (k.cross_platform ? '✓' : '✗').padStart(8)
  );
}

console.log('\n\nTOP 10 BRANŻ (po liczbie problemów):');
console.log('─'.repeat(80));
console.log('Branża'.padEnd(30) + 'Count'.padStart(7) + 'Avg Int'.padStart(10) + 'Avg Syg'.padStart(10) + 'FB'.padStart(7) + 'Reddit'.padStart(8) + 'Cross?'.padStart(8));
console.log('─'.repeat(80));

for (const b of branzaAggregates.slice(0, 10)) {
  console.log(
    b.branza.padEnd(30) +
    b.count.toString().padStart(7) +
    b.avg_intensywnosc.toFixed(2).padStart(10) +
    b.avg_sygnal_zakupowy.toFixed(2).padStart(10) +
    b.platforms.FB.toString().padStart(7) +
    b.platforms.Reddit.toString().padStart(8) +
    (b.cross_platform ? '✓' : '✗').padStart(8)
  );
}

console.log('\n\nTOP 15 KOMBINACJI (kategoria × branża):');
console.log('─'.repeat(90));

for (const m of matrixAggregates.slice(0, 15)) {
  console.log(
    `${m.kategoria} × ${m.branza}`.padEnd(50) +
    `count: ${m.count}`.padStart(12) +
    `avg_int: ${m.avg_intensywnosc.toFixed(2)}`.padStart(15) +
    `avg_syg: ${m.avg_sygnal_zakupowy.toFixed(2)}`.padStart(15)
  );
}

console.log('\n✅ Agregacja zakończona. Gotowe do kroku 3.2 (PPS Score)');
