#!/usr/bin/env node
/**
 * Generate plain-language Chinese one-line summaries for each call.
 *
 * Reads local tldr.json files, sends context to OpenAI, and writes
 * human-readable Traditional Chinese summaries to:
 *   src/data/call-summaries.generated.json
 *
 * Usage:
 *   node scripts/generate-call-summaries.mjs
 *   node scripts/generate-call-summaries.mjs --new-only   (skip existing)
 *   node scripts/generate-call-summaries.mjs --model gpt-4o-mini
 *
 * Requires: OPENAI_API_KEY environment variable
 */

import { readdirSync, readFileSync, existsSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parseArgs } from 'node:util';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const ARTIFACTS_DIR = join(ROOT, 'public/artifacts');
const OUTPUT_PATH = join(ROOT, 'src/data/call-summaries.generated.json');
const PROTOCOL_CALLS_PATH = join(ROOT, 'src/data/protocol-calls.generated.json');

const { values: args } = parseArgs({
  options: {
    'new-only': { type: 'boolean', default: false },
    model: { type: 'string', default: 'gpt-4.1-nano' },
  },
  strict: false,
});

const MODEL = args.model;
const API_KEY = process.env.OPENAI_API_KEY;
if (!API_KEY) {
  console.error('Error: OPENAI_API_KEY environment variable is not set.');
  process.exit(1);
}

// Call type full names (for context)
const CALL_TYPE_NAMES = {
  acdc: 'All Core Devs Consensus',
  acde: 'All Core Devs Execution',
  acdt: 'All Core Devs Testing',
  epbs: 'ePBS Breakout',
  bal:  'BAL Breakout',
  focil:'FOCIL Breakout',
  price:'Glamsterdam Repricings',
  tli:  'Trustless Log Index',
  pqts: 'Post-Quantum Transaction Signatures',
  rpc:  'RPC Standards',
  zkevm:'L1-zkEVM Breakout',
  etm:  'Encrypt The Mempool',
  awd:  'AllWalletDevs',
  pqi:  'PQ Interop',
};

async function openaiChat(prompt) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 80,
    }),
  });
  if (!res.ok) throw new Error(`OpenAI API error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.choices[0].message.content.trim();
}

function buildContext(tldr) {
  const lines = [];
  // Top 3 highlights from any category
  let count = 0;
  for (const items of Object.values(tldr.highlights ?? {})) {
    for (const item of items) {
      if (count >= 3) break;
      lines.push(`- ${item.highlight}`);
      count++;
    }
    if (count >= 3) break;
  }
  // Top 2 decisions
  for (const d of (tldr.decisions ?? []).slice(0, 2)) {
    lines.push(`- Decision: ${d.decision}`);
  }
  return lines.join('\n');
}

async function main() {
  const protocolCalls = JSON.parse(readFileSync(PROTOCOL_CALLS_PATH, 'utf-8'));

  // Load existing summaries
  const existing = existsSync(OUTPUT_PATH)
    ? JSON.parse(readFileSync(OUTPUT_PATH, 'utf-8'))
    : {};

  const toProcess = [];
  for (const call of protocolCalls) {
    if (args['new-only'] && existing[call.path]) continue;
    const artifactFolder = `${call.type}/${call.date}_${call.number}`;
    const tldrPath = join(ARTIFACTS_DIR, artifactFolder, 'tldr.json');
    if (!existsSync(tldrPath)) continue;
    toProcess.push({ call, tldrPath });
  }

  if (toProcess.length === 0) {
    console.log('Nothing to process.');
    return;
  }

  console.log(`Processing ${toProcess.length} calls with model ${MODEL}...`);

  let done = 0;
  for (const { call, tldrPath } of toProcess) {
    let tldr;
    try {
      tldr = JSON.parse(readFileSync(tldrPath, 'utf-8'));
    } catch {
      continue;
    }

    const context = buildContext(tldr);
    if (!context) continue;

    const callTypeName = CALL_TYPE_NAMES[call.type] ?? call.type.toUpperCase();
    const prompt = `你是以太坊開發進度的科普解說員，讀者是對區塊鏈有基本認識但不懂技術細節的人。

以下是一場以太坊開發者會議（${callTypeName} #${call.number}，${call.date}）的重點摘錄：
${context}

請用一句繁體中文白話（20至40字），說明這場會議最主要在討論或決定什麼。

規則：
- 直接從內容開始，不要加「這場會議」、「本次會議」等開頭語
- 遇到技術術語，用括號補充白話說明，例如：FOCIL（防止驗證者審查交易的機制）
- 升級版本代號（如 Fusaka、Glamsterdam、Hegotá）可直接保留，不需翻譯
- 說明決策的結果或影響，而非只描述「討論了什麼」
- 只輸出那一句話，不要加任何解釋或標點以外的內容`;

    try {
      const summary = await openaiChat(prompt);
      existing[call.path] = summary;
      done++;
      process.stdout.write(`\r[${done}/${toProcess.length}] ${call.path}: ${summary.slice(0, 50)}...`);
    } catch (e) {
      console.error(`\nFailed ${call.path}: ${e.message}`);
    }

    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 200));
  }

  // Sort output by key
  const sorted = Object.fromEntries(
    Object.entries(existing).sort(([a], [b]) => a.localeCompare(b))
  );

  writeFileSync(OUTPUT_PATH, JSON.stringify(sorted, null, 2));
  console.log(`\n\nDone. ${done} summaries written to ${OUTPUT_PATH}`);
}

main().catch(e => { console.error(e); process.exit(1); });
