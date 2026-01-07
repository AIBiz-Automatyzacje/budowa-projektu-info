import fs from "fs/promises";
import dotenv from "dotenv";

dotenv.config();

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const BASE_ID = "appHKTIMXlnFNdCQj";

if (!AIRTABLE_API_KEY) {
  console.error("❌ Brak AIRTABLE_API_KEY w .env");
  process.exit(1);
}

async function fetchAllRecords(tableId, tableName) {
  let allRecords = [];
  let offset = null;
  let page = 1;

  do {
    const url = new URL(`https://api.airtable.com/v0/${BASE_ID}/${tableId}`);
    url.searchParams.set("pageSize", "100");
    if (offset) url.searchParams.set("offset", offset);

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
    });

    if (!response.ok) {
      console.error(`❌ Błąd API: ${response.status} ${response.statusText}`);
      const text = await response.text();
      console.error(text);
      process.exit(1);
    }

    const data = await response.json();
    allRecords = allRecords.concat(data.records || []);
    offset = data.offset;

    console.log(`   ${tableName}: strona ${page}, pobrano ${allRecords.length} rekordów...`);
    page++;
  } while (offset);

  return allRecords;
}

async function extractAllProblems() {
  console.log("📥 Ekstrakcja WSZYSTKICH problemów z Airtable\n");

  // 1. Wczytaj normalizację kategorii
  const mappingRaw = await fs.readFile(
    "docs/faza-2-analiza/normalization-mapping-v3.json",
    "utf-8"
  );
  const mapping = JSON.parse(mappingRaw);

  // 2. Pobierz WSZYSTKIE rekordy
  console.log("🔄 Pobieram rekordy (wszystkie strony)...\n");

  const fbRecords = await fetchAllRecords("tbl5QE6tGQs67QKeW", "FB Grupy");
  const redditRecords = await fetchAllRecords("tbljC9rBpXF0jXsb7", "Reddit");

  console.log(`\n✅ Pobrano: FB=${fbRecords.length}, Reddit=${redditRecords.length}`);

  // 3. Ekstrakcja problemów
  const allProblems = [];
  let fbProblems = 0;
  let redditProblems = 0;

  for (const record of fbRecords) {
    if (!record.fields.Raport) continue;
    try {
      const report = JSON.parse(record.fields.Raport);
      for (const p of report.problemy || []) {
        const normalizedKat =
          mapping.kategorie_mapping[p.kategoria?.toLowerCase()] ||
          mapping.kategorie_mapping[p.kategoria] ||
          "Inne";

        const normalizedBranza =
          mapping.branze_mapping[p.branza?.toLowerCase()] ||
          mapping.branze_mapping[p.branza] ||
          "Nieznana";

        allProblems.push({
          id: p.id || `fb_${allProblems.length}`,
          problem: p.problem,
          kategoria_raw: p.kategoria,
          kategoria: normalizedKat,
          branza_raw: p.branza,
          branza: normalizedBranza,
          intensywnosc: p.intensywnosc || 0,
          sygnal_zakupowy: p.sygnal_zakupowy || 0,
          obecne_rozwiazanie: p.obecne_rozwiazanie,
          dlaczego_nie_dziala: p.dlaczego_nie_dziala,
          cytat: p.cytat,
          source: "FB",
          source_name: record.fields.Nazwa,
        });
        fbProblems++;
      }
    } catch (e) {
      // skip invalid JSON
    }
  }

  for (const record of redditRecords) {
    if (!record.fields.Raport) continue;
    try {
      const report = JSON.parse(record.fields.Raport);
      for (const p of report.problemy || []) {
        const normalizedKat =
          mapping.kategorie_mapping[p.kategoria?.toLowerCase()] ||
          mapping.kategorie_mapping[p.kategoria] ||
          "Inne";

        const normalizedBranza =
          mapping.branze_mapping[p.branza?.toLowerCase()] ||
          mapping.branze_mapping[p.branza] ||
          "Nieznana";

        allProblems.push({
          id: p.id || `reddit_${allProblems.length}`,
          problem: p.problem,
          kategoria_raw: p.kategoria,
          kategoria: normalizedKat,
          branza_raw: p.branza,
          branza: normalizedBranza,
          intensywnosc: p.intensywnosc || 0,
          sygnal_zakupowy: p.sygnal_zakupowy || 0,
          obecne_rozwiazanie: p.obecne_rozwiazanie,
          dlaczego_nie_dziala: p.dlaczego_nie_dziala,
          cytat: p.cytat,
          source: "Reddit",
          source_name: record.fields.Subreddit,
        });
        redditProblems++;
      }
    } catch (e) {
      // skip invalid JSON
    }
  }

  // 4. Zapisz do pliku
  const output = {
    meta: {
      generated: new Date().toISOString(),
      total_problems: allProblems.length,
      fb_problems: fbProblems,
      reddit_problems: redditProblems,
      fb_records: fbRecords.length,
      reddit_records: redditRecords.length,
    },
    problems: allProblems,
  };

  await fs.writeFile(
    "docs/faza-2-analiza/all-problems.json",
    JSON.stringify(output, null, 2)
  );

  console.log(`\n📊 PODSUMOWANIE:`);
  console.log(`   FB Grupy: ${fbRecords.length} rekordów → ${fbProblems} problemów`);
  console.log(`   Reddit: ${redditRecords.length} rekordów → ${redditProblems} problemów`);
  console.log(`   ŁĄCZNIE: ${allProblems.length} problemów`);
  console.log(`\n✅ Zapisano do: docs/faza-2-analiza/all-problems.json`);
}

extractAllProblems().catch(console.error);
