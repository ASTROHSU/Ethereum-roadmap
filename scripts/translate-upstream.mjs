#!/usr/bin/env node
/**
 * Translate upstream English content to Traditional Chinese (Taiwan).
 *
 * Reads bilingual data files (roadmapNodes, officialRoadmapPhases, translations),
 * detects new or changed English entries, and uses OpenAI API to translate them
 * into Traditional Chinese with simplified, accessible language.
 *
 * Usage:
 *   node scripts/translate-upstream.mjs --all
 *   node scripts/translate-upstream.mjs --files src/data/roadmapNodes.ts
 *   node scripts/translate-upstream.mjs --all --dry-run
 *   node scripts/translate-upstream.mjs --all --model gpt-4o-mini
 *
 * Requires: OPENAI_API_KEY environment variable
 */

import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { parseArgs } from 'node:util';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const DEFAULT_MODEL = 'gpt-4.1-nano';

const MODEL_PRICING = {
  'gpt-4o':      [2.5, 10.0],   // $/M tokens [input, output]
  'gpt-4o-mini': [0.15, 0.6],
  'gpt-4.1':     [2.0, 8.0],
  'gpt-4.1-mini':[0.4, 1.6],
  'gpt-4.1-nano':[0.1, 0.4],
};

// ─── CLI ────────────────────────────────────────────────────────────────────

const { values: args } = parseArgs({
  options: {
    files:    { type: 'string', default: '' },
    all:      { type: 'boolean', default: false },
    'dry-run':{ type: 'boolean', default: false },
    model:    { type: 'string', default: DEFAULT_MODEL },
  },
  strict: false,
});

const DRY_RUN = args['dry-run'];
const MODEL   = args.model;

const TRANSLATABLE_FILES = [
  'src/data/roadmapNodes.ts',
  'src/data/officialRoadmapPhases.ts',
  'src/data/translations.ts',
];

function getTargetFiles() {
  if (args.all) return TRANSLATABLE_FILES;
  if (args.files) return args.files.split(/[,\s]+/).filter(Boolean);
  return [];
}

// ─── OpenAI API ─────────────────────────────────────────────────────────────

let totalInputTokens = 0;
let totalOutputTokens = 0;

async function callOpenAI(systemPrompt, userMessage) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY is not set');

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userMessage },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`OpenAI API error ${res.status}: ${body}`);
  }

  const data = await res.json();
  const usage = data.usage || {};
  totalInputTokens  += usage.prompt_tokens || 0;
  totalOutputTokens += usage.completion_tokens || 0;

  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('Empty response from OpenAI');
  return JSON.parse(content);
}

// ─── TS file parsing ────────────────────────────────────────────────────────

/**
 * Extract a JS literal from `export const NAME = <literal>;`
 * Returns { data, startIndex, endIndex } for replacement.
 */
function extractExport(fileText, exportName) {
  const marker = `export const ${exportName} = `;
  const start = fileText.indexOf(marker);
  if (start === -1) return null;

  const literalStart = start + marker.length;
  const openChar = fileText[literalStart];
  const closeChar = openChar === '[' ? ']' : '}';

  // Walk through to find the matching close bracket, respecting nesting and strings
  let depth = 0;
  let inString = false;
  let stringChar = '';
  let escaped = false;
  let i = literalStart;

  for (; i < fileText.length; i++) {
    const ch = fileText[i];
    if (escaped) { escaped = false; continue; }
    if (ch === '\\' && inString) { escaped = true; continue; }

    if (inString) {
      if (ch === stringChar) inString = false;
      continue;
    }

    if (ch === '\'' || ch === '"' || ch === '`') {
      inString = true;
      stringChar = ch;
      continue;
    }

    if (ch === openChar || ch === '{' || ch === '[') depth++;
    if (ch === closeChar || ch === '}' || ch === ']') {
      if (ch === closeChar || ch === '}' || ch === ']') depth--;
    }

    if (depth === 0 && i > literalStart) {
      // Include the closing character
      const literalEnd = i + 1;
      const literal = fileText.slice(literalStart, literalEnd);
      // Evaluate the literal safely
      try {
        const data = new Function('return ' + literal)();
        return { data, startIndex: literalStart, endIndex: literalEnd };
      } catch (e) {
        console.error(`  Failed to parse ${exportName}:`, e.message);
        return null;
      }
    }
  }

  return null;
}

// ─── Serialization ──────────────────────────────────────────────────────────

/**
 * Serialize a JS value back to TS-like literal, matching the project's style:
 * 4-space indent, single quotes, trailing commas.
 */
function serialize(value, depth = 0) {
  const indent = '    '.repeat(depth);
  const innerIndent = '    '.repeat(depth + 1);

  if (value === null || value === undefined) return 'null';
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);

  if (typeof value === 'string') {
    // Use single quotes, escape internal single quotes
    const escaped = value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    return `'${escaped}'`;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    // Check if it's an array of simple strings
    const allStrings = value.every(v => typeof v === 'string');
    if (allStrings && value.length <= 4) {
      const items = value.map(v => serialize(v));
      const oneLine = `[${items.join(', ')}]`;
      if (oneLine.length < 100) return oneLine;
    }
    const items = value.map(v => {
      if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
        return innerIndent + serialize(v, depth + 1);
      }
      return innerIndent + serialize(v, depth + 1);
    });
    return `[\n${items.join(',\n')},\n${indent}]`;
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value);
    if (entries.length === 0) return '{}';

    // Check if all values are simple (for compact objects like { title, desc })
    const allSimple = entries.every(([, v]) => typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean');
    if (allSimple && entries.length <= 3) {
      const items = entries.map(([k, v]) => `${serializeKey(k)}: ${serialize(v)}`);
      const oneLine = `{ ${items.join(', ')} }`;
      if (oneLine.length < 120) return oneLine;
    }

    const items = entries.map(([k, v]) => {
      return `${innerIndent}${serializeKey(k)}: ${serialize(v, depth + 1)}`;
    });
    return `{\n${items.join(',\n')},\n${indent}}`;
  }

  return String(value);
}

function serializeKey(key) {
  // Use unquoted key if it's a valid JS identifier
  if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)) return key;
  return `'${key.replace(/'/g, "\\'")}'`;
}

// ─── Translation prompts ────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a professional translator specializing in Ethereum / blockchain technology.
Translate English content to Traditional Chinese (繁體中文), using Taiwan-standard expressions (台灣用語).

Guidelines:
- Keep commonly used technical terms in English: PoS, PoW, EIP, Gas, Blob, Rollup, L1, L2, DeFi, MEV, ZK, DVT, SNARK, ePBS, FOCIL, PeerDAS, DApp, OpCode, Verkle, Danksharding, EVM
- Simplify technical content to be accessible to non-technical readers, while maintaining accuracy
- Preserve emoji prefixes exactly as-is (✅, 🔄, 📋, ⚡, ▲, ▼)
- Do NOT translate: id, date, status, progress, name (phase names like "The Merge"), URLs
- Return valid JSON only, no markdown fences or extra text
- Match the tone and style of existing Chinese content: concise, informative, slightly conversational`;

// ─── File handlers ──────────────────────────────────────────────────────────

async function handleRoadmapNodes(filePath) {
  console.log('Processing roadmapNodes.ts ...');
  const fileText = readFileSync(filePath, 'utf-8');

  const zhExport = extractExport(fileText, 'roadmapNodesZh');
  const enExport = extractExport(fileText, 'roadmapNodesEn');
  if (!zhExport || !enExport) {
    console.error('  Could not parse roadmapNodes exports');
    return false;
  }

  const zhMap = new Map(zhExport.data.map(n => [n.id, n]));
  const toTranslate = [];

  for (const enNode of enExport.data) {
    const zhNode = zhMap.get(enNode.id);
    if (!zhNode) {
      // New node not in Zh array
      toTranslate.push(enNode);
    }
    // We could also detect text changes, but for upstream sync,
    // new entries are the main concern
  }

  if (toTranslate.length === 0) {
    console.log('  No new roadmap nodes to translate.');
    return false;
  }

  console.log(`  Found ${toTranslate.length} new node(s) to translate.`);
  if (DRY_RUN) {
    console.log('  [dry-run] Would translate:', toTranslate.map(n => n.id).join(', '));
    return false;
  }

  const userMessage = JSON.stringify({
    task: 'Translate each roadmap node to Traditional Chinese. Return a JSON object with key "nodes" containing an array of translated nodes. Each node must have the same id. Translate: title, description, painPoints, highlights (title + desc). Keep phase, date, status as-is.',
    nodes: toTranslate,
  });

  const result = await callOpenAI(SYSTEM_PROMPT, userMessage);
  const translated = result.nodes || result;

  if (!Array.isArray(translated) || translated.length === 0) {
    console.error('  Invalid translation result');
    return false;
  }

  // Merge: append new translated nodes to Zh array
  const updatedZh = [...zhExport.data];
  for (const tNode of translated) {
    const existing = updatedZh.findIndex(n => n.id === tNode.id);
    if (existing >= 0) {
      updatedZh[existing] = { ...updatedZh[existing], ...tNode };
    } else {
      // Insert at the same position as in En array
      const enIdx = enExport.data.findIndex(n => n.id === tNode.id);
      if (enIdx >= 0 && enIdx <= updatedZh.length) {
        updatedZh.splice(enIdx, 0, tNode);
      } else {
        updatedZh.push(tNode);
      }
    }
  }

  // Write back
  const serialized = serialize(updatedZh, 0);
  const newFileText = fileText.slice(0, zhExport.startIndex) + serialized + fileText.slice(zhExport.endIndex);
  writeFileSync(filePath, newFileText, 'utf-8');
  console.log(`  Updated ${translated.length} node(s) in roadmapNodesZh.`);
  return true;
}

async function handleOfficialRoadmapPhases(filePath) {
  console.log('Processing officialRoadmapPhases.ts ...');
  const fileText = readFileSync(filePath, 'utf-8');

  const zhExport = extractExport(fileText, 'officialRoadmapPhasesZh');
  const enExport = extractExport(fileText, 'officialRoadmapPhasesEn');
  if (!zhExport || !enExport) {
    console.error('  Could not parse officialRoadmapPhases exports');
    return false;
  }

  const zhMap = new Map(zhExport.data.map(p => [p.id, p]));
  const toTranslate = [];

  for (const enPhase of enExport.data) {
    const zhPhase = zhMap.get(enPhase.id);
    if (!zhPhase) {
      toTranslate.push(enPhase);
    } else {
      // Check if goals changed (most likely upstream change)
      const enGoals = JSON.stringify(enPhase.goals);
      const zhGoals = JSON.stringify(zhPhase.goals);
      if (enPhase.goals.length !== zhPhase.goals.length) {
        toTranslate.push(enPhase);
      }
    }
  }

  if (toTranslate.length === 0) {
    console.log('  No changes to translate in officialRoadmapPhases.');
    return false;
  }

  console.log(`  Found ${toTranslate.length} phase(s) to translate.`);
  if (DRY_RUN) {
    console.log('  [dry-run] Would translate:', toTranslate.map(p => p.id).join(', '));
    return false;
  }

  const userMessage = JSON.stringify({
    task: 'Translate each roadmap phase to Traditional Chinese. Return a JSON object with key "phases" containing an array of translated phases. Each phase must have the same id, name, status, progress. Translate: nameZh (a short Chinese name for the phase, e.g. "合併" for Merge), short, goals[]. Preserve emoji prefixes in goals.',
    phases: toTranslate,
  });

  const result = await callOpenAI(SYSTEM_PROMPT, userMessage);
  const translated = result.phases || result;

  if (!Array.isArray(translated) || translated.length === 0) {
    console.error('  Invalid translation result');
    return false;
  }

  const updatedZh = [...zhExport.data];
  for (const tPhase of translated) {
    const idx = updatedZh.findIndex(p => p.id === tPhase.id);
    if (idx >= 0) {
      updatedZh[idx] = { ...updatedZh[idx], ...tPhase };
    } else {
      updatedZh.push(tPhase);
    }
  }

  const serialized = serialize(updatedZh, 0);
  const newFileText = fileText.slice(0, zhExport.startIndex) + serialized + fileText.slice(zhExport.endIndex);
  writeFileSync(filePath, newFileText, 'utf-8');
  console.log(`  Updated ${translated.length} phase(s) in officialRoadmapPhasesZh.`);
  return true;
}

async function handleTranslations(filePath) {
  console.log('Processing translations.ts ...');
  const fileText = readFileSync(filePath, 'utf-8');

  const exportResult = extractExport(fileText, 'translations');
  if (!exportResult) {
    console.error('  Could not parse translations export');
    return false;
  }

  const { zh, en } = exportResult.data;
  if (!zh || !en) {
    console.error('  translations object missing zh or en');
    return false;
  }

  // Find keys in en that are missing in zh (flat comparison only)
  const newKeys = {};
  for (const [key, value] of Object.entries(en)) {
    if (!(key in zh)) {
      newKeys[key] = value;
    }
  }

  if (Object.keys(newKeys).length === 0) {
    console.log('  No new translation keys found.');
    return false;
  }

  console.log(`  Found ${Object.keys(newKeys).length} new key(s) to translate.`);
  if (DRY_RUN) {
    console.log('  [dry-run] Would translate keys:', Object.keys(newKeys).join(', '));
    return false;
  }

  const userMessage = JSON.stringify({
    task: 'Translate each UI label/string to Traditional Chinese. Return a JSON object with key "translated" containing an object mapping the same keys to their Chinese translations. For nested objects (like severityLabels), translate each value. For arrays of objects (like dataSources), translate label and desc, keep url as-is.',
    entries: newKeys,
  });

  const result = await callOpenAI(SYSTEM_PROMPT, userMessage);
  const translated = result.translated || result;

  if (typeof translated !== 'object') {
    console.error('  Invalid translation result');
    return false;
  }

  // Merge new keys into zh
  const updatedData = { ...exportResult.data, zh: { ...zh, ...translated } };
  const serialized = serialize(updatedData, 0);
  const newFileText = fileText.slice(0, exportResult.startIndex) + serialized + fileText.slice(exportResult.endIndex);
  writeFileSync(filePath, newFileText, 'utf-8');
  console.log(`  Added ${Object.keys(translated).length} new key(s) to translations.zh.`);
  return true;
}

// ─── Main ───────────────────────────────────────────────────────────────────

const FILE_HANDLERS = {
  'src/data/roadmapNodes.ts':          handleRoadmapNodes,
  'src/data/officialRoadmapPhases.ts': handleOfficialRoadmapPhases,
  'src/data/translations.ts':          handleTranslations,
};

async function main() {
  const files = getTargetFiles();

  if (files.length === 0) {
    console.log('No files specified. Use --all or --files <path1,path2,...>');
    return;
  }

  if (!process.env.OPENAI_API_KEY && !DRY_RUN) {
    console.warn('⚠️  OPENAI_API_KEY not set. Skipping translation.');
    return;
  }

  console.log(`Model: ${MODEL} | Dry-run: ${DRY_RUN}`);
  console.log(`Files: ${files.join(', ')}\n`);

  let anyChanged = false;
  for (const file of files) {
    const basename = file.replace(/^\.\//, '');
    const handler = FILE_HANDLERS[basename];
    if (!handler) {
      console.log(`Skipping ${file} (no handler)`);
      continue;
    }

    const fullPath = join(ROOT, basename);
    try {
      const changed = await handler(fullPath);
      if (changed) anyChanged = true;
    } catch (err) {
      console.error(`Error processing ${file}:`, err.message);
      // Continue with other files
    }
    console.log();
  }

  // Cost summary
  if (totalInputTokens > 0 || totalOutputTokens > 0) {
    const [inPrice, outPrice] = MODEL_PRICING[MODEL] || [0, 0];
    const cost = (totalInputTokens / 1e6) * inPrice + (totalOutputTokens / 1e6) * outPrice;
    console.log('─── Cost Summary ───');
    console.log(`Input:  ${totalInputTokens.toLocaleString()} tokens`);
    console.log(`Output: ${totalOutputTokens.toLocaleString()} tokens`);
    console.log(`Cost:   ~$${cost.toFixed(4)} (${MODEL})`);
  }

  if (anyChanged) {
    console.log('\n✓ Translation complete. Files updated.');
  } else {
    console.log('\n• No changes needed.');
  }
}

main().catch(err => {
  console.error('Fatal:', err);
  // Exit 0 so the workflow doesn't fail — the merge is already done
  process.exit(0);
});
