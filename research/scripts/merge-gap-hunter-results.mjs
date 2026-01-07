import fs from "fs/promises";

async function mergeResults() {
  console.log("🔗 Merge Gap Hunter Lite Results\n");

  // 1. Load all data
  console.log("📂 Ładowanie danych...");

  const gapTypes = JSON.parse(
    await fs.readFile("docs/faza-2-analiza/output/gap-types-analysis.json", "utf-8")
  );

  const competitorMap = JSON.parse(
    await fs.readFile("docs/faza-2-analiza/output/competitor-map.json", "utf-8")
  );

  const whiteSpace = JSON.parse(
    await fs.readFile("docs/faza-2-analiza/output/white-space-scoring.json", "utf-8")
  );

  const communityFit = JSON.parse(
    await fs.readFile("docs/faza-2-analiza/output/community-fit.json", "utf-8")
  );

  console.log("✅ Załadowano wszystkie dane\n");

  // 2. Build category → community fit score map
  const categoryFitScores = {};
  for (const cat of communityFit.category_rankings) {
    categoryFitScores[cat.name] = cat.consensus_score;
  }
  console.log("📊 Category fit scores:", Object.keys(categoryFitScores).length);

  // 3. Calculate combined score for each MVP
  const topOpportunities = whiteSpace.mvps
    .filter((mvp) => mvp.white_space_score > 0) // Filter out invalid entries
    .map((mvp) => {
      const communityFitScore = categoryFitScores[mvp.category] || 50;

      // Combined score: 50% white space + 50% community fit (normalized to 100)
      const normalizedCommunityFit = (communityFitScore / 123) * 100;
      const combinedScore = Math.round(
        mvp.white_space_score * 0.5 + normalizedCommunityFit * 0.5
      );

      // Determine recommendation
      let recommendation;
      if (combinedScore >= 75 && mvp.white_space_score >= 70) {
        recommendation = "STRONG_GO";
      } else if (combinedScore >= 60 && mvp.white_space_score >= 50) {
        recommendation = "GO";
      } else if (combinedScore >= 45) {
        recommendation = "CONSIDER";
      } else {
        recommendation = "AVOID";
      }

      return {
        mvp_id: mvp.mvp_id,
        mvp_name: mvp.mvp_name,
        category: mvp.category,
        target_persona: mvp.target_persona,
        core_value_prop: mvp.core_value_prop,
        white_space_score: mvp.white_space_score,
        white_space_class: mvp.classification,
        community_fit_score: communityFitScore,
        combined_score: combinedScore,
        gap_type_addressed: mvp.gap_type_addressed,
        main_competitors: mvp.main_competitors,
        consensus_spread: mvp.consensus_spread,
        recommendation: recommendation,
      };
    })
    .sort((a, b) => b.combined_score - a.combined_score);

  // 4. Build summary stats
  const recommendations = { STRONG_GO: 0, GO: 0, CONSIDER: 0, AVOID: 0 };
  for (const opp of topOpportunities) {
    recommendations[opp.recommendation]++;
  }

  // 5. Prepare gap types summary
  const gapTypesSummary = {
    dominant_type: "ZA_SLABA_JAKOSC",
    dominant_percent: 40,
    distribution: gapTypes.summary.by_gap_type,
    insight: "40% problemów to 'za słaba jakość' - rozwiązania istnieją ale wyniki niezadowalające. Ogromna szansa na lepsze, wyspecjalizowane narzędzia.",
  };

  // 6. Prepare competitor summary
  const competitorSummary = {
    total_mapped: competitorMap.competitors.length,
    top_5: competitorMap.competitors.slice(0, 5).map((c) => ({
      name: c.name,
      mentions: c.mentions,
      displacement_potential: c.displacement_potential,
    })),
    weakness_patterns: competitorMap.weakness_patterns.slice(0, 5).map((p) => ({
      pattern: p.pattern,
      frequency: p.frequency,
      opportunity: p.opportunity,
    })),
    top_displacement: competitorMap.top_displacement_opportunities.slice(0, 3),
  };

  // 7. Build final output
  const output = {
    meta: {
      generated: new Date().toISOString(),
      phase: "Gap Hunter Lite - Final Merged Results",
      sources: [
        "gap-types-analysis.json (Phase 1)",
        "competitor-map.json (Phase 2)",
        "white-space-scoring.json (Phase 3)",
        "community-fit.json (Pain Radar)",
      ],
      total_problems_analyzed: 370,
      total_mvps_scored: topOpportunities.length,
    },
    executive_summary: {
      key_finding: "Największa szansa: nisza 'ratunkowa' dla porzuconych projektów IT (DevRescue) - łączy wysoką lukę zaufania z pustym rynkiem.",
      recommendations_distribution: recommendations,
      top_gap_type: gapTypesSummary.dominant_type,
      top_gap_percent: gapTypesSummary.dominant_percent,
      avg_white_space_score: Math.round(
        topOpportunities.reduce((a, b) => a + b.white_space_score, 0) / topOpportunities.length
      ),
    },
    gap_types: gapTypesSummary,
    competitor_landscape: competitorSummary,
    top_opportunities: topOpportunities.slice(0, 15),
    all_opportunities: topOpportunities,
  };

  // 8. Save
  await fs.writeFile(
    "docs/faza-2-analiza/output/gap-hunter-lite-results.json",
    JSON.stringify(output, null, 2)
  );

  console.log("💾 Zapisano: docs/faza-2-analiza/output/gap-hunter-lite-results.json\n");

  // 9. Print summary
  console.log("═".repeat(70));
  console.log("📊 GAP HUNTER LITE - WYNIKI KOŃCOWE");
  console.log("═".repeat(70) + "\n");

  console.log("📈 ROZKŁAD REKOMENDACJI:");
  console.log("─".repeat(40));
  console.log(`🟢 STRONG_GO:  ${recommendations.STRONG_GO} MVP`);
  console.log(`🔵 GO:         ${recommendations.GO} MVP`);
  console.log(`🟡 CONSIDER:   ${recommendations.CONSIDER} MVP`);
  console.log(`🔴 AVOID:      ${recommendations.AVOID} MVP`);

  console.log("\n🏆 TOP 10 OPPORTUNITIES (Combined Score):");
  console.log("─".repeat(70));

  for (let i = 0; i < Math.min(10, topOpportunities.length); i++) {
    const opp = topOpportunities[i];
    const emoji =
      opp.recommendation === "STRONG_GO" ? "🟢" :
      opp.recommendation === "GO" ? "🔵" :
      opp.recommendation === "CONSIDER" ? "🟡" : "🔴";

    console.log(`${i + 1}. ${emoji} [${opp.combined_score}] ${opp.mvp_name}`);
    console.log(`   WS: ${opp.white_space_score} | CF: ${opp.community_fit_score} | Gap: ${opp.gap_type_addressed}`);
    console.log(`   ${opp.recommendation} | Konkurenci: ${opp.main_competitors.slice(0, 3).join(", ") || "BRAK"}`);
    console.log("");
  }

  console.log("✅ Merge zakończony!");
}

mergeResults().catch(console.error);
