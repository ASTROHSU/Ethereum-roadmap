import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const eipsPath = path.join(__dirname, '../src/data/eips.json');
const eipsData = JSON.parse(fs.readFileSync(eipsPath, 'utf8'));

function assert(condition, message) {
  if (!condition) {
    console.error(`Assertion failed: ${message}`);
    process.exit(1);
  }
}

function latestEntries() {
  const entries = [];
  for (const eip of eipsData) {
    if (!eip.laymanDescription) continue;
    for (const fr of eip.forkRelationships ?? []) {
      for (const sh of fr.statusHistory ?? []) {
        if (!sh.date) continue;
        entries.push({
          eipNumber: eip.id,
          forkName: fr.forkName,
          status: sh.status,
          date: sh.date,
        });
      }
    }
  }

  const seen = new Set();
  return entries
    .sort((a, b) => {
      if (a.date !== b.date) return b.date.localeCompare(a.date);
      return b.eipNumber - a.eipNumber;
    })
    .filter((entry) => {
      if (seen.has(entry.eipNumber)) return false;
      seen.add(entry.eipNumber);
      return true;
    });
}

function findEip(id) {
  return eipsData.find((eip) => eip.id === id);
}

function hasStatus(id, forkName, status, date) {
  const eip = findEip(id);
  return eip?.forkRelationships?.some(
    (fr) =>
      fr.forkName === forkName &&
      fr.statusHistory?.some((entry) => entry.status === status && entry.date === date)
  );
}

assert(hasStatus(8037, 'Glamsterdam', 'Scheduled', '2026-05-07'), 'EIP-8037 should show Glamsterdam Scheduled on 2026-05-07');
assert(hasStatus(7708, 'Glamsterdam', 'Scheduled', '2026-05-07'), 'EIP-7708 should show Glamsterdam Scheduled on 2026-05-07');
assert(hasStatus(8025, 'Hegota', 'Proposed', '2026-05-14'), 'EIP-8025 should be included as a recent Hegota proposal');
assert(hasStatus(7709, 'Hegota', 'Proposed', '2026-05-07'), 'EIP-7709 should be included as a recent Hegota proposal');

const topSix = latestEntries().slice(0, 6);
assert(topSix.length === 6, 'recent EIP section should have six entries');
assert(topSix[0].eipNumber === 8025 && topSix[0].date === '2026-05-14', 'most recent entry should be EIP-8025 from 2026-05-14');
assert(topSix.every((entry) => entry.date >= '2026-05-07'), 'top six recent EIP entries should reflect May 2026 progress, not stale February data');

console.log('test-recent-eip-activity: ok');
console.table(topSix);
