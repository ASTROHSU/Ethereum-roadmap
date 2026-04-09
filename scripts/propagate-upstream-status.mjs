#!/usr/bin/env node
/**
 * Propagate upstream upgrades.ts status/date changes into roadmapNodes.ts.
 *
 * When ethereum/forkcast updates an upgrade's status (e.g. Planning → Upcoming → Live)
 * or activation date, this script syncs those changes into the local roadmapNodes.ts
 * so the visual roadmap carousel stays current.
 *
 * If a new upgrade exists in upgrades.ts but not in roadmapNodes.ts, it calls OpenAI
 * to generate Chinese content for the new entry.
 *
 * Usage:
 *   node scripts/propagate-upstream-status.mjs
 *   node scripts/propagate-upstream-status.mjs --dry-run
 */

import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { parseArgs } from 'node:util';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const { values: args } = parseArgs({
  options: {
    'dry-run': { type: 'boolean', default: false },
  },
  strict: false,
});

const DRY_RUN = args['dry-run'];

// ─── Status mapping: upstream → local ───────────────────────────────────────

const STATUS_MAP = {
  'Live': 'completed',
  'Upcoming': 'in_progress',
  'Planning': 'future',
  'Research': 'future',
};

// ─── ID mapping: upstream ID → local roadmapNodes ID ────────────────────────
// Most IDs match; these are the exceptions.
const ID_MAP = {
  'the-merge': 'merge',
  'shapella': 'shanghai',
  'previous-upgrades': null, // skip, not in carousel
};

function mapUpstreamId(upstreamId) {
  if (upstreamId in ID_MAP) return ID_MAP[upstreamId];
  return upstreamId;
}

// ─── Date formatting: English → Chinese ─────────────────────────────────────

const MONTH_MAP = {
  'Jan': '1月', 'Feb': '2月', 'Mar': '3月', 'Apr': '4月',
  'May': '5月', 'Jun': '6月', 'Jul': '7月', 'Aug': '8月',
  'Sep': '9月', 'Oct': '10月', 'Nov': '11月', 'Dec': '12月',
};

/**
 * Convert upstream activation date to Chinese format.
 * "May 7, 2025" → "2025年5月"
 * "2026" → "2026年"
 * "TBD" → "待定"
 */
/**
 * Check if a date string is specific enough to override local dates.
 * "May 7, 2025" → true (has month)
 * "2026" → false (just a year)
 * "TBD" → false
 */
function isSpecificDate(dateStr) {
  if (!dateStr || dateStr === 'TBD') return false;
  // Must have at least a month abbreviation
  return /^[A-Z][a-z]{2}\s/.test(dateStr);
}

function formatDateZh(dateStr) {
  if (!dateStr) return null;
  if (dateStr === 'TBD') return '待定';

  // "May 7, 2025" or "Sep 15, 2022"
  const match = dateStr.match(/^(\w{3})\s+\d{1,2},?\s+(\d{4})$/);
  if (match) {
    const monthZh = MONTH_MAP[match[1]];
    return monthZh ? `${match[2]}年${monthZh}` : null;
  }

  // Just a year like "2026"
  const yearMatch = dateStr.match(/^(\d{4})$/);
  if (yearMatch) return `${yearMatch[1]}年`;

  return null;
}

// ─── Parse upgrades.ts ──────────────────────────────────────────────────────

function parseUpgrades(filePath) {
  const text = readFileSync(filePath, 'utf-8');

  // Extract the networkUpgrades array
  // Handle TS type annotation: `export const networkUpgrades: Type[] = [`
  const marker = 'export const networkUpgrades';
  const start = text.indexOf(marker);
  if (start === -1) throw new Error('Cannot find networkUpgrades in upgrades.ts');

  // Find the `=` sign first, then the opening `[` after it
  const eqSign = text.indexOf('=', start);
  if (eqSign === -1) throw new Error('Cannot find = after networkUpgrades');
  const arrayStart = text.indexOf('[', eqSign);
  let depth = 0;
  let i = arrayStart;
  for (; i < text.length; i++) {
    if (text[i] === '[') depth++;
    if (text[i] === ']') depth--;
    if (depth === 0) break;
  }

  const literal = text.slice(arrayStart, i + 1);
  try {
    return new Function('return ' + literal)();
  } catch (e) {
    throw new Error('Failed to parse networkUpgrades: ' + e.message);
  }
}

// ─── Parse roadmapNodes.ts ──────────────────────────────────────────────────

function extractExport(fileText, exportName) {
  const marker = `export const ${exportName} = `;
  const start = fileText.indexOf(marker);
  if (start === -1) return null;

  const literalStart = start + marker.length;
  let depth = 0;
  let inString = false;
  let stringChar = '';
  let escaped = false;
  let i = literalStart;

  for (; i < fileText.length; i++) {
    const ch = fileText[i];
    if (escaped) { escaped = false; continue; }
    if (ch === '\\' && inString) { escaped = true; continue; }
    if (inString) { if (ch === stringChar) inString = false; continue; }
    if (ch === '\'' || ch === '"' || ch === '`') { inString = true; stringChar = ch; continue; }
    if (ch === '[' || ch === '{') depth++;
    if (ch === ']' || ch === '}') depth--;
    if (depth === 0 && i > literalStart) {
      const literalEnd = i + 1;
      const literal = fileText.slice(literalStart, literalEnd);
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

// ─── Serialization (matching project style) ─────────────────────────────────

function serialize(value, depth = 0) {
  const indent = '    '.repeat(depth);
  const innerIndent = '    '.repeat(depth + 1);

  if (value === null || value === undefined) return 'null';
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (typeof value === 'string') {
    const escaped = value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    return `'${escaped}'`;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    const allStrings = value.every(v => typeof v === 'string');
    if (allStrings && value.length <= 4) {
      const items = value.map(v => serialize(v));
      const oneLine = `[${items.join(', ')}]`;
      if (oneLine.length < 100) return oneLine;
    }
    const items = value.map(v => innerIndent + serialize(v, depth + 1));
    return `[\n${items.join(',\n')},\n${indent}]`;
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value);
    if (entries.length === 0) return '{}';
    const allSimple = entries.every(([, v]) => typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean');
    if (allSimple && entries.length <= 3) {
      const items = entries.map(([k, v]) => `${serializeKey(k)}: ${serialize(v)}`);
      const oneLine = `{ ${items.join(', ')} }`;
      if (oneLine.length < 120) return oneLine;
    }
    const items = entries.map(([k, v]) => `${innerIndent}${serializeKey(k)}: ${serialize(v, depth + 1)}`);
    return `{\n${items.join(',\n')},\n${indent}}`;
  }
  return String(value);
}

function serializeKey(key) {
  if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)) return key;
  return `'${key.replace(/'/g, "\\'")}'`;
}

// ─── OpenAI for new nodes ───────────────────────────────────────────────────

async function translateNewNode(upgrade) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn('  ⚠ OPENAI_API_KEY not set, using English fallback for new node');
    return null;
  }

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4.1-nano',
      messages: [
        {
          role: 'system',
          content: `You are translating Ethereum upgrade information to Traditional Chinese (Taiwan).
Keep technical terms in English: PoS, PoW, EIP, Gas, Blob, Rollup, L1, L2, etc.
Return valid JSON only.`,
        },
        {
          role: 'user',
          content: JSON.stringify({
            task: 'Create a roadmap node entry for the following Ethereum upgrade. Return JSON with: title (繁中, concise), description (繁中, 1-2 sentences), painPoints (array of 2-3 strings in 繁中), highlights (array of {title, desc} in 繁中, 1-2 items).',
            upgrade: {
              id: upgrade.id,
              name: upgrade.name,
              description: upgrade.description,
              tagline: upgrade.tagline,
              highlights: upgrade.highlights,
            },
          }),
        },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    }),
  });

  if (!res.ok) {
    console.error(`  OpenAI API error: ${res.status}`);
    return null;
  }

  const data = await res.json();
  return JSON.parse(data.choices[0].message.content);
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  const upgradesPath = join(ROOT, 'src/data/upgrades.ts');
  const roadmapPath = join(ROOT, 'src/data/roadmapNodes.ts');

  // Parse upstream upgrades
  let upgrades;
  try {
    upgrades = parseUpgrades(upgradesPath);
  } catch (e) {
    console.error('Failed to parse upgrades.ts:', e.message);
    process.exit(0); // Don't fail the workflow
  }

  // Parse local roadmapNodes
  const roadmapText = readFileSync(roadmapPath, 'utf-8');
  const zhExport = extractExport(roadmapText, 'roadmapNodesZh');
  const enExport = extractExport(roadmapText, 'roadmapNodesEn');

  if (!zhExport || !enExport) {
    console.error('Failed to parse roadmapNodes.ts');
    process.exit(0);
  }

  let changed = false;
  const zhNodes = [...zhExport.data];
  const enNodes = [...enExport.data];

  // Build maps for quick lookup
  const zhMap = new Map(zhNodes.map((n, i) => [n.id, i]));
  const enMap = new Map(enNodes.map((n, i) => [n.id, i]));

  for (const upgrade of upgrades) {
    const localId = mapUpstreamId(upgrade.id);
    if (localId === null) continue; // Skip (e.g. previous-upgrades)

    const newStatus = STATUS_MAP[upgrade.status];
    if (!newStatus) continue;

    // ── Update existing nodes ──
    const zhIdx = zhMap.get(localId);
    const enIdx = enMap.get(localId);

    if (zhIdx !== undefined && enIdx !== undefined) {
      // Update status if changed
      if (zhNodes[zhIdx].status !== newStatus) {
        console.log(`  ✓ ${localId}: status ${zhNodes[zhIdx].status} → ${newStatus}`);
        zhNodes[zhIdx] = { ...zhNodes[zhIdx], status: newStatus };
        enNodes[enIdx] = { ...enNodes[enIdx], status: newStatus };
        changed = true;
      }

      // Update date only if upstream has a precise date (month + year or more specific)
      // Skip vague dates like "2026" or "TBD" — local descriptions may be more informative
      if (upgrade.activationDate && isSpecificDate(upgrade.activationDate) && enNodes[enIdx].date !== upgrade.activationDate) {
        console.log(`  ✓ ${localId}: en date "${enNodes[enIdx].date}" → "${upgrade.activationDate}"`);
        enNodes[enIdx] = { ...enNodes[enIdx], date: upgrade.activationDate };

        // Also update Chinese date
        const zhDate = formatDateZh(upgrade.activationDate);
        if (zhDate && zhNodes[zhIdx].date !== zhDate) {
          console.log(`  ✓ ${localId}: zh date "${zhNodes[zhIdx].date}" → "${zhDate}"`);
          zhNodes[zhIdx] = { ...zhNodes[zhIdx], date: zhDate };
        }
        changed = true;
      }

      // Update English description/tagline if changed
      if (upgrade.description && enNodes[enIdx].description !== upgrade.description) {
        enNodes[enIdx] = { ...enNodes[enIdx], description: upgrade.description };
        changed = true;
      }
    }

    // ── Create new nodes ──
    else if (zhIdx === undefined && enIdx === undefined) {
      console.log(`  + New upgrade: ${localId} (${upgrade.name})`);

      if (DRY_RUN) {
        console.log(`    [dry-run] Would create new node`);
        continue;
      }

      // English node (from upstream data directly)
      const enNode = {
        id: localId,
        phase: upgrade.name.replace(' Upgrade', ''),
        date: upgrade.activationDate || 'TBD',
        status: newStatus,
        title: upgrade.tagline || upgrade.name,
        description: upgrade.description,
        painPoints: [],
        highlights: [],
      };

      // Chinese node (via OpenAI)
      const translated = await translateNewNode(upgrade);
      const zhNode = {
        id: localId,
        phase: enNode.phase,
        date: enNode.date, // Will be in English; manual touch-up may be needed
        status: newStatus,
        title: translated?.title || enNode.title,
        description: translated?.description || enNode.description,
        painPoints: translated?.painPoints || [],
        highlights: translated?.highlights || [],
      };

      enNodes.push(enNode);
      zhNodes.push(zhNode);
      changed = true;
    }
  }

  if (!changed) {
    console.log('No status/date changes detected between upgrades.ts and roadmapNodes.ts');
    return;
  }

  if (DRY_RUN) {
    console.log('\n[dry-run] Would update roadmapNodes.ts');
    return;
  }

  // Write back
  const zhSerialized = serialize(zhNodes, 0);
  const enSerialized = serialize(enNodes, 0);

  let newText = roadmapText;
  // Replace En first (it comes after Zh in the file), then Zh
  // to keep indices correct
  if (enExport.startIndex > zhExport.startIndex) {
    newText = newText.slice(0, enExport.startIndex) + enSerialized + newText.slice(enExport.endIndex);
    newText = newText.slice(0, zhExport.startIndex) + zhSerialized + newText.slice(zhExport.endIndex);
  } else {
    newText = newText.slice(0, zhExport.startIndex) + zhSerialized + newText.slice(zhExport.endIndex);
    // Recalculate en offset after zh replacement
    const offset = zhSerialized.length - (zhExport.endIndex - zhExport.startIndex);
    newText = newText.slice(0, enExport.startIndex + offset) + enSerialized + newText.slice(enExport.endIndex + offset);
  }

  writeFileSync(roadmapPath, newText, 'utf-8');
  console.log('\n✓ roadmapNodes.ts updated successfully.');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(0); // Don't fail the workflow
});
