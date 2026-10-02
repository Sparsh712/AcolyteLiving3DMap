#!/usr/bin/env node
/**
 * Fetch raw house data from the Acolyte API and write "All Data" JSON files.
 *
 * Examples:
 *   npx tsx scripts/fetch-city-houses.ts --pairs='[["aberdeen","uk"],["bath","uk"]]'
 *   npx tsx scripts/fetch-city-houses.ts --pair=aberdeen,uk --pair=birmingham,us
 *   npx tsx scripts/fetch-city-houses.ts --input=./scripts/city-pairs.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

const BASE_URL = 'https://api.dev.acolyteliving.com/api/houses/get-houses-by-city-all';

type CityPair = [string, string];

interface FetchResult {
  pair: CityPair;
  outPath: string | null;
  status: 'ok' | 'skipped' | 'error';
  message: string;
}

interface SnippetOutput {
  filePath: string;
  content: string;
}

function getArgs() {
  const args = process.argv.slice(2);
  const pairs: CityPair[] = [];
  let pairsJson: string | undefined;
  let inputPath: string | undefined;
  let outDir = path.join(ROOT, 'full json');
  let overwrite = false;
  let concurrency = 3;

  for (const arg of args) {
    if (arg.startsWith('--pairs=')) {
      pairsJson = arg.slice('--pairs='.length);
      continue;
    }
    if (arg.startsWith('--pair=')) {
      const raw = arg.slice('--pair='.length);
      const parts = raw.split(',').map((p) => p.trim()).filter(Boolean);
      if (parts.length === 2) {
        pairs.push([parts[0], parts[1]]);
      }
      continue;
    }
    if (arg.startsWith('--input=')) {
      inputPath = arg.slice('--input='.length);
      continue;
    }
    if (arg.startsWith('--outDir=')) {
      outDir = arg.slice('--outDir='.length);
      continue;
    }
    if (arg === '--overwrite') {
      overwrite = true;
      continue;
    }
    if (arg.startsWith('--concurrency=')) {
      const val = parseInt(arg.slice('--concurrency='.length), 10);
      if (Number.isFinite(val) && val > 0) concurrency = val;
      continue;
    }
  }

  return { pairs, pairsJson, inputPath, outDir, overwrite, concurrency };
}

function normalizePair(pair: CityPair): CityPair {
  const city = String(pair[0] ?? '').trim().toLowerCase();
  const country = String(pair[1] ?? '').trim().toLowerCase();
  return [city, country];
}

function titleCase(value: string): string {
  return value
    .split(/[-_\s]+/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function formatCountry(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length <= 2) return trimmed.toUpperCase();
  return titleCase(trimmed);
}

function safeFilePart(value: string): string {
  return value.replace(/[\\/:*?"<>|]/g, '-').replace(/\s+/g, ' ').trim();
}

function buildOutputName(city: string, country: string): string {
  const cityName = safeFilePart(titleCase(city));
  const countryName = safeFilePart(formatCountry(country));
  return `${cityName} ${countryName} All Data.json`;
}

function buildSnippetText(pairs: CityPair[]): string {
  const cityConfigs = pairs.map(([city, country]) => {
    const name = `${titleCase(city)} ${formatCountry(country)}`;
    const inputFile = buildOutputName(city, country);
    return `{
  name: '${name}',
  country: '${country}',
  city: '${city}',
  inputFile: 'full json/${inputFile}',
  outputProperties: 'properties.json',
},`;
  });

  const citySources = pairs.map(([city, country]) => {
    return `  { country: '${country}', city: '${city}', legacySlug: '${city}' },`;
  });

  return `${cityConfigs.join('\n\n')}


${citySources.join('\n')}
`;
}

function writeSnippetFile(outDir: string, pairs: CityPair[]): SnippetOutput {
  const filePath = path.join(outDir, 'city-snippets.txt');
  const content = buildSnippetText(pairs);
  fs.writeFileSync(filePath, content, 'utf-8');
  return { filePath, content };
}

function loadPairsFromJson(raw: string): CityPair[] {
  const parsed = JSON.parse(raw) as unknown;
  if (!Array.isArray(parsed)) return [];
  const result: CityPair[] = [];
  for (const entry of parsed) {
    if (Array.isArray(entry) && entry.length >= 2) {
      result.push([String(entry[0]), String(entry[1])]);
    }
  }
  return result;
}

async function fetchCity(city: string, country: string): Promise<any> {
  const url = `${BASE_URL}?city_unique_name=${encodeURIComponent(city)}&country_unique_name=${encodeURIComponent(country)}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'User-Agent': 'AcolyteLiving3DMap/1.0',
    },
    signal: AbortSignal.timeout(60_000),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} ${res.statusText}: ${text.slice(0, 200)}`);
  }

  return await res.json();
}

async function runWithConcurrency<T, R>(
  items: T[],
  limit: number,
  worker: (item: T, idx: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;

  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const idx = cursor++;
      results[idx] = await worker(items[idx], idx);
    }
  });

  await Promise.all(runners);
  return results;
}

async function main() {
  const { pairs, pairsJson, inputPath, outDir, overwrite, concurrency } = getArgs();
  const allPairs: CityPair[] = [...pairs];

  if (pairsJson) {
    try {
      allPairs.push(...loadPairsFromJson(pairsJson));
    } catch (e) {
      console.error('Failed to parse --pairs JSON:', e);
      process.exit(1);
    }
  }

  if (inputPath) {
    try {
      const raw = fs.readFileSync(inputPath, 'utf-8');
      allPairs.push(...loadPairsFromJson(raw));
    } catch (e) {
      console.error(`Failed to read --input file (${inputPath}):`, e);
      process.exit(1);
    }
  }

  const normalized = allPairs
    .map(normalizePair)
    .filter((p) => p[0] && p[1]);

  if (normalized.length === 0) {
    console.error('No valid city/country pairs provided.');
    console.error('Use --pairs, --pair, or --input to provide at least one pair.');
    process.exit(1);
  }

  const uniqueKey = new Set<string>();
  const uniquePairs = normalized.filter((p) => {
    const key = `${p[0]}::${p[1]}`;
    if (uniqueKey.has(key)) return false;
    uniqueKey.add(key);
    return true;
  });

  fs.mkdirSync(outDir, { recursive: true });

  console.log(`Fetching ${uniquePairs.length} city/country pairs...`);

  const results = await runWithConcurrency(uniquePairs, concurrency, async (pair) => {
    const [city, country] = pair;
    const fileName = buildOutputName(city, country);
    const outPath = path.join(outDir, fileName);

    if (!overwrite && fs.existsSync(outPath)) {
      return {
        pair,
        outPath,
        status: 'skipped',
        message: `File exists (use --overwrite): ${fileName}`,
      } as FetchResult;
    }

    try {
      const data = await fetchCity(city, country);
      fs.writeFileSync(outPath, JSON.stringify(data, null, 2), 'utf-8');

      const count = data?.counts?.houses;
      const countLabel = Number.isFinite(count) ? `houses: ${count}` : 'houses: n/a';
      return {
        pair,
        outPath,
        status: 'ok',
        message: `Written ${fileName} (${countLabel})`,
      } as FetchResult;
    } catch (e: any) {
      return {
        pair,
        outPath: null,
        status: 'error',
        message: e?.message ?? 'Unknown error',
      } as FetchResult;
    }
  });

  const ok = results.filter((r) => r.status === 'ok');
  const skipped = results.filter((r) => r.status === 'skipped');
  const failed = results.filter((r) => r.status === 'error');

  for (const r of results) {
    const tag = r.status.toUpperCase();
    const label = `${r.pair[0]}, ${r.pair[1]}`;
    console.log(`[${tag}] ${label} - ${r.message}`);
  }

  const snippetOutput = writeSnippetFile(outDir, uniquePairs);
  console.log(`Snippets written to ${snippetOutput.filePath}`);

  console.log(`Done. ok=${ok.length}, skipped=${skipped.length}, failed=${failed.length}.`);
  if (failed.length > 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
