#!/usr/bin/env node
/**
 * prepare-dashboard-data.mjs
 *
 * Skrypt przygotowujący dane do dashboardu wizualizacyjnego TOP 20.
 * Łączy dane z lowcode-opportunities i gap-hunter-lite-results.
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_DIR = join(__dirname, '../docs/faza-2-analiza/output');
const OUTPUT_DIR = join(__dirname, '../dashboard/src/data');

// ============================================
// 1. LOAD DATA
// ============================================

function loadJSON(filename) {
  const path = join(DATA_DIR, filename);
  console.log(`📂 Loading ${filename}...`);
  return JSON.parse(readFileSync(path, 'utf-8'));
}

const lowcodeData = loadJSON('lowcode-opportunities.json');
const gapHunterData = loadJSON('gap-hunter-lite-results.json');
const ppsData = loadJSON('pps-rankings.json');
const hiddenPatterns = loadJSON('hidden-patterns.json');
const deepDive = loadJSON('deep-dive.json');

console.log(`\n✅ Loaded ${lowcodeData.opportunities.length} lowcode opportunities`);
console.log(`✅ Loaded ${gapHunterData.top_opportunities.length} gap-hunter MVPs`);

// ============================================
// 2. NORMALIZE SCALES
// ============================================

/**
 * Normalizuje wartość z dowolnej skali do 0-100
 */
function normalize(value, maxScale) {
  if (value == null) return null;
  return Math.round((value / maxScale) * 100);
}

/**
 * Normalizuje scores z lowcode (różne skale → 0-100)
 */
function normalizeLowcodeScores(scores) {
  return {
    problem_clarity: normalize(scores.problem_clarity, 20),
    mvp_simplicity: normalize(scores.mvp_simplicity, 20),
    ai_leverage: normalize(scores.ai_leverage, 20),
    mobile_fit: normalize(scores.mobile_fit, 15),
    monetization: normalize(scores.monetization, 15),
    competition_gap: normalize(scores.competition_gap, 10),
    white_space: null,
    community_fit: null
  };
}

/**
 * Normalizuje scores z gap-hunter
 */
function normalizeGapHunterScores(opp) {
  return {
    problem_clarity: null,
    mvp_simplicity: null,
    ai_leverage: null,
    mobile_fit: null,
    monetization: null,
    competition_gap: null,
    white_space: opp.white_space_score, // już 0-100
    community_fit: normalize(opp.community_fit_score, 123) // 0-123 → 0-100
  };
}

// ============================================
// 3. UNIFIED SCORE CALCULATION
// ============================================

/**
 * Oblicza unified score dla lowcode opportunity
 */
function calcLowcodeUnifiedScore(opp) {
  // final_score * 0.70 + (model_count / 4) * 30
  const baseScore = opp.final_score * 0.70;
  const consensusBonus = (opp.model_count / 4) * 30;
  return Math.round(baseScore + consensusBonus);
}

/**
 * Oblicza unified score dla gap-hunter MVP
 */
function calcGapHunterUnifiedScore(opp) {
  // combined_score * 0.50 + (white_space_score / 100) * 25 + (community_fit_norm / 100) * 25
  const baseScore = opp.combined_score * 0.50;
  const whiteSpaceBonus = (opp.white_space_score / 100) * 25;
  const communityFitNorm = normalize(opp.community_fit_score, 123);
  const communityBonus = (communityFitNorm / 100) * 25;
  return Math.round(baseScore + whiteSpaceBonus + communityBonus);
}

/**
 * Mapowanie klasyfikacji → waga
 */
function getClassificationWeight(classification) {
  const weights = {
    'EXCELLENT': 1.0,
    'STRONG_GO': 1.0,
    'STRONG': 0.9,
    'GO': 0.9,
    'GOOD': 0.8,
    'CONSIDER': 0.8,
    'AVOID': 0.5
  };
  return weights[classification] || 0.7;
}

// ============================================
// 4. ENRICHMENT HELPERS
// ============================================

/**
 * Znajduje PPS score dla kategorii
 */
function findPPSScore(category) {
  if (!category || typeof category !== 'string') return null;
  const ranking = ppsData.rankings.find(r =>
    r.kategoria.toLowerCase().includes(category.toLowerCase()) ||
    category.toLowerCase().includes(r.kategoria.toLowerCase())
  );
  return ranking ? ranking.consensus_pps : null;
}

/**
 * Znajduje top 3 ukryte wzorce dla kategorii
 */
function findHiddenPatterns(category) {
  if (!category || typeof category !== 'string') return null;
  const patterns = hiddenPatterns.patterns
    .filter(p => p.affected_categories?.some(c =>
      typeof c === 'string' &&
      (c.toLowerCase().includes(category.toLowerCase()) ||
       category.toLowerCase().includes(c.toLowerCase()))
    ))
    .slice(0, 3)
    .map(p => p.pattern_name);
  return patterns.length > 0 ? patterns : null;
}

/**
 * Znajduje personas dla kategorii z deep-dive
 */
function findPersonas(category) {
  if (!category || typeof category !== 'string') return null;
  const cat = deepDive.categories?.find(c =>
    c.kategoria?.toLowerCase().includes(category.toLowerCase()) ||
    category.toLowerCase().includes(c.kategoria?.toLowerCase() || '')
  );

  if (!cat?.consensus?.personas) return null;

  return cat.consensus.personas
    .slice(0, 3)
    .map(p => p.name);
}

/**
 * Mapuje pattern na kategorię display
 */
function patternToCategory(pattern) {
  const mapping = {
    'AI_GENERATOR': 'AI/Generatory',
    'AI_ASSISTANT': 'AI/Asystenci',
    'SIMPLIFIER': 'Upraszczacze',
    'AGGREGATOR': 'Agregatory',
    'MONITOR_ALERT': 'Monitory/Alerty',
    'TEMPLATE_PACK': 'Szablony'
  };
  return mapping[pattern] || pattern;
}

// ============================================
// 5. TRANSFORM DATA
// ============================================

/**
 * Transformuje lowcode opportunity do unified format
 */
function transformLowcode(opp) {
  const scores = normalizeLowcodeScores(opp.scores);
  const unifiedScore = calcLowcodeUnifiedScore(opp);
  const weight = getClassificationWeight(opp.classification);
  const category = patternToCategory(opp.pattern);

  return {
    id: opp.problem_id,
    name: opp.product_concept.name,
    tagline: opp.product_concept.description,
    pattern: opp.pattern,
    category: category,

    unified_score: Math.round(unifiedScore * weight),
    scores_breakdown: scores,

    gap_type: null,
    competitors: opp.competition ? [opp.competition] : [],
    displacement_potential: null,

    problem_quote: opp.problem_summary,
    target_personas: [opp.product_concept.target_user],
    budget_range: null,
    hidden_patterns: findHiddenPatterns(category),

    mvp_description: opp.why_good_fit,
    tech_stack: opp.mvp_tech_stack,
    monetization_model: opp.monetization_model,

    source: 'lowcode',
    model_count: opp.model_count,
    classification: opp.classification,
    pps_score: findPPSScore(category)
  };
}

/**
 * Transformuje gap-hunter MVP do unified format
 */
function transformGapHunter(opp) {
  const scores = normalizeGapHunterScores(opp);
  const unifiedScore = calcGapHunterUnifiedScore(opp);
  const weight = getClassificationWeight(opp.recommendation);

  return {
    id: opp.mvp_id,
    name: opp.mvp_name,
    tagline: opp.core_value_prop,
    pattern: null,
    category: opp.category,

    unified_score: Math.round(unifiedScore * weight),
    scores_breakdown: scores,

    gap_type: opp.gap_type_addressed,
    competitors: opp.main_competitors || [],
    displacement_potential: opp.white_space_class,

    problem_quote: opp.core_value_prop,
    target_personas: [opp.target_persona],
    budget_range: null,
    hidden_patterns: findHiddenPatterns(opp.category),

    mvp_description: opp.core_value_prop,
    tech_stack: null,
    monetization_model: null,

    source: 'gap-hunter',
    model_count: null,
    classification: opp.recommendation,
    pps_score: findPPSScore(opp.category)
  };
}

// ============================================
// 6. DEDUPLICATE
// ============================================

/**
 * Proste fuzzy matching nazw (Levenshtein similarity)
 */
function similarity(s1, s2) {
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;

  if (longer.length === 0) return 1.0;

  const editDistance = (a, b) => {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[b.length][a.length];
  };

  return (longer.length - editDistance(longer.toLowerCase(), shorter.toLowerCase())) / longer.length;
}

/**
 * Deduplikuje listę okazji
 */
function deduplicate(opportunities) {
  const unique = [];
  const SIMILARITY_THRESHOLD = 0.6;

  for (const opp of opportunities) {
    const duplicate = unique.find(u =>
      similarity(u.name, opp.name) > SIMILARITY_THRESHOLD ||
      (u.tagline && opp.tagline && similarity(u.tagline, opp.tagline) > SIMILARITY_THRESHOLD)
    );

    if (duplicate) {
      // Zachowaj rekord z wyższym score, ale merge pola
      if (opp.unified_score > duplicate.unified_score) {
        // Merge: zachowaj tech_stack z lowcode, white_space z gap-hunter
        const mergedTechStack = duplicate.tech_stack || opp.tech_stack;
        const mergedWhiteSpace = duplicate.scores_breakdown?.white_space || opp.scores_breakdown?.white_space;

        Object.assign(duplicate, opp);
        duplicate.tech_stack = mergedTechStack;
        if (duplicate.scores_breakdown) {
          duplicate.scores_breakdown.white_space = mergedWhiteSpace;
        }
      } else {
        // Merge pola z niższego score do wyższego
        if (!duplicate.tech_stack && opp.tech_stack) {
          duplicate.tech_stack = opp.tech_stack;
        }
        if (!duplicate.scores_breakdown?.white_space && opp.scores_breakdown?.white_space) {
          duplicate.scores_breakdown.white_space = opp.scores_breakdown.white_space;
        }
      }
    } else {
      unique.push({ ...opp });
    }
  }

  return unique;
}

// ============================================
// 7. MAIN PIPELINE
// ============================================

console.log('\n🔄 Transforming lowcode opportunities...');
const transformedLowcode = lowcodeData.opportunities.map(transformLowcode);
console.log(`   Transformed ${transformedLowcode.length} records`);

console.log('🔄 Transforming gap-hunter MVPs...');
const transformedGapHunter = gapHunterData.top_opportunities.map(transformGapHunter);
console.log(`   Transformed ${transformedGapHunter.length} records`);

console.log('🔄 Combining and deduplicating...');
const combined = [...transformedLowcode, ...transformedGapHunter];
const deduplicated = deduplicate(combined);
console.log(`   Combined: ${combined.length} → Unique: ${deduplicated.length}`);

console.log('🔄 Sorting by unified score...');
const sorted = deduplicated.sort((a, b) => b.unified_score - a.unified_score);

console.log('🔄 Selecting TOP 20...');
const top20 = sorted.slice(0, 20).map((opp, index) => ({
  rank: index + 1,
  ...opp
}));

// ============================================
// 8. BUILD OUTPUT
// ============================================

const output = {
  meta: {
    generated: new Date().toISOString(),
    total_sources: lowcodeData.opportunities.length + gapHunterData.top_opportunities.length,
    unique_after_dedup: deduplicated.length,
    top_selected: 20
  },
  funnel: {
    problems: 4003,
    filtered: 1026,
    opportunities: lowcodeData.opportunities.length + gapHunterData.top_opportunities.length,
    unique: deduplicated.length,
    top: 20
  },
  top20: top20
};

// ============================================
// 9. SAVE OUTPUT
// ============================================

import { mkdirSync, existsSync } from 'fs';

// Ensure output directory exists
if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`📁 Created directory: ${OUTPUT_DIR}`);
}

const outputPath = join(OUTPUT_DIR, 'dashboard-data.json');
writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');
console.log(`\n✅ Saved to: ${outputPath}`);

// ============================================
// 10. SUMMARY
// ============================================

console.log('\n📊 TOP 20 Summary:');
console.log('─'.repeat(60));
top20.forEach(opp => {
  const source = opp.source === 'lowcode' ? '🔵' : '🟢';
  console.log(`${opp.rank.toString().padStart(2)}. ${source} ${opp.name.substring(0, 35).padEnd(35)} Score: ${opp.unified_score}`);
});
console.log('─'.repeat(60));
console.log('🔵 = lowcode, 🟢 = gap-hunter');

// Count by source
const lowcodeCount = top20.filter(o => o.source === 'lowcode').length;
const gapHunterCount = top20.filter(o => o.source === 'gap-hunter').length;
console.log(`\nDistribution: ${lowcodeCount} lowcode, ${gapHunterCount} gap-hunter`);

// Count by pattern (lowcode only)
const byPattern = {};
top20.filter(o => o.pattern).forEach(o => {
  byPattern[o.pattern] = (byPattern[o.pattern] || 0) + 1;
});
console.log('\nBy pattern:', byPattern);
