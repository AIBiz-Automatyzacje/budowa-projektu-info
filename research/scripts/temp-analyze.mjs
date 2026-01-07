import fs from 'fs';

const data = JSON.parse(fs.readFileSync('docs/faza-2-analiza/output/all-problems.json', 'utf8'));

const toolKeywords = ["make", "zapier", "n8n", "airtable", "notion", "chatgpt", "claude", "midjourney",
  "canva", "figma", "excel", "google", "sheets", "baselinker", "allegro", "shopify", "wordpress",
  "slack", "discord", "trello", "asana", "clickup", "hubspot", "mailchimp", "stripe", "paypal",
  "capcut", "premiere", "photoshop", "cursor", "github", "copilot", "gpt", "openai", "subiekt",
  "wfmag", "comarch", "fakturownia", "ifirma", "inpost", "furgonetka", "apilo", "sellasist"];

const withRealTools = data.problems.filter(p => {
  if (!p.obecne_rozwiazanie) return false;
  const lower = p.obecne_rozwiazanie.toLowerCase();
  return toolKeywords.some(tool => lower.includes(tool));
});

// Policz wystąpienia każdego narzędzia
const toolCounts = {};
withRealTools.forEach(p => {
  const lower = p.obecne_rozwiazanie.toLowerCase();
  toolKeywords.forEach(tool => {
    if (lower.includes(tool)) {
      toolCounts[tool] = (toolCounts[tool] || 0) + 1;
    }
  });
});

// Sortuj po liczbie wystąpień
const sorted = Object.entries(toolCounts).sort((a, b) => b[1] - a[1]);

console.log("=== FAZA 2: MAPA KONKURENCJI ===");
console.log("Problemów z narzędziami:", withRealTools.length);
console.log("Unikalnych narzędzi:", sorted.length);
console.log("");
console.log("=== TOP 15 NARZĘDZI ===");
sorted.slice(0, 15).forEach(([tool, count], i) => {
  console.log((i+1) + ". " + tool + ": " + count + " wzmianek");
});
console.log("");
console.log("=== POZOSTAŁE ===");
sorted.slice(15).forEach(([tool, count]) => {
  console.log("   " + tool + ": " + count);
});

// Zapisz problemy z narzędziami do osobnego pliku
fs.writeFileSync('docs/faza-2-analiza/output/problems-with-tools.json', JSON.stringify(withRealTools, null, 2));
console.log("\n=== ZAPISANO problems-with-tools.json (" + withRealTools.length + " problemów) ===");
