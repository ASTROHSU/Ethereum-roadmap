import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.join(__dirname, '..');
const EIPS_DIR = path.join(REPO_ROOT, 'src/data/eips');

const DEFAULT_UPSTREAM_REF = 'upstream/main';
const DEFAULT_RECENT_CUTOFF = '2026-01-01';

const TOP_LEVEL_KEYS = [
  'id',
  'title',
  'status',
  'description',
  'author',
  'type',
  'category',
  'createdDate',
  'discussionLink',
  'reviewer',
  'layer',
  'collection',
  'laymanDescription',
  'northStars',
  'benefits',
  'tradeoffs',
  'forkRelationships',
  'northStarAlignment',
  'stakeholderImpacts',
];

// For existing curated local EIPs, sync Forkcast-maintained roadmap fields while
// preserving the local JSON order and any fields that the ethereum/EIPs metadata
// validator owns. This keeps daily sync commits focused and reviewable.
const EXISTING_EIP_SYNC_KEYS = [
  'discussionLink',
  'reviewer',
  'layer',
  'collection',
  'laymanDescription',
  'northStars',
  'benefits',
  'tradeoffs',
  'forkRelationships',
  'northStarAlignment',
  'stakeholderImpacts',
];

const FORK_RELATIONSHIP_KEYS = [
  'forkName',
  'statusHistory',
  'isHeadliner',
  'wasHeadlinerCandidate',
  'champions',
  'presentationHistory',
];
const STATUS_HISTORY_KEYS = ['status', 'call', 'date', 'timestamp'];
const CHAMPION_KEYS = ['name', 'discord', 'telegram', 'email'];
const PRESENTATION_HISTORY_KEYS = ['type', 'call', 'link', 'date', 'timestamp'];

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    upstreamRef: DEFAULT_UPSTREAM_REF,
    recentCutoff: DEFAULT_RECENT_CUTOFF,
    dryRun: false,
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--upstream') {
      options.upstreamRef = args[++i];
    } else if (arg === '--recent-cutoff') {
      options.recentCutoff = args[++i];
    } else if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

function printHelp() {
  console.log(`Forkcast EIP roadmap sync\n\nUsage:\n  node scripts/sync-forkcast-eips.mjs [options]\n\nOptions:\n  --upstream <ref>        Git ref to read upstream EIP JSON from (default: upstream/main)\n  --recent-cutoff <date>  Include new upstream EIPs with laymanDescription and activity on/after this date (default: 2026-01-01)\n  --dry-run              Report changes without writing files\n`);
}

function git(args) {
  return execFileSync('git', args, {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

function pick(obj, keys) {
  const out = {};
  for (const key of keys) {
    if (obj[key] !== undefined) out[key] = obj[key];
  }
  return out;
}

function sanitizeStatusHistoryEntry(entry) {
  const sanitized = pick(entry, STATUS_HISTORY_KEYS);
  if (!('call' in sanitized)) sanitized.call = null;
  if (!('date' in sanitized)) sanitized.date = null;
  return sanitized;
}

function sanitizeChampion(champion) {
  return pick(champion, CHAMPION_KEYS);
}

function sanitizePresentationHistoryEntry(entry) {
  return pick(entry, PRESENTATION_HISTORY_KEYS);
}

function sanitizeForkRelationship(fr) {
  const sanitized = pick(fr, FORK_RELATIONSHIP_KEYS);
  sanitized.statusHistory = Array.isArray(fr.statusHistory)
    ? fr.statusHistory.map(sanitizeStatusHistoryEntry)
    : [];

  if (Array.isArray(fr.champions)) {
    sanitized.champions = fr.champions.map(sanitizeChampion);
  }

  if (Array.isArray(fr.presentationHistory)) {
    sanitized.presentationHistory = fr.presentationHistory.map(sanitizePresentationHistoryEntry);
  }

  return sanitized;
}

function sanitizeEip(eip) {
  const sanitized = pick(eip, TOP_LEVEL_KEYS);
  sanitized.forkRelationships = Array.isArray(eip.forkRelationships)
    ? eip.forkRelationships.map(sanitizeForkRelationship)
    : [];

  // Local schema requires these keys even when upstream omits them for very old EIPs.
  if (!('discussionLink' in sanitized)) sanitized.discussionLink = '';
  if (!('tradeoffs' in sanitized)) sanitized.tradeoffs = null;

  return sanitized;
}

function mergeExistingLocalEip(localEip, upstreamEip) {
  const sanitizedUpstream = sanitizeEip(upstreamEip);
  const updated = { ...localEip };

  for (const key of EXISTING_EIP_SYNC_KEYS) {
    if (sanitizedUpstream[key] !== undefined) {
      updated[key] = sanitizedUpstream[key];
    }
  }

  if (!('discussionLink' in updated)) updated.discussionLink = '';
  if (!('tradeoffs' in updated)) updated.tradeoffs = null;
  if (!Array.isArray(updated.forkRelationships)) updated.forkRelationships = [];

  return updated;
}

function latestActivityDate(eip) {
  const dates = [];
  for (const fr of eip.forkRelationships ?? []) {
    for (const sh of fr.statusHistory ?? []) {
      if (sh.date) dates.push(sh.date);
    }
    for (const ph of fr.presentationHistory ?? []) {
      if (ph.date) dates.push(ph.date);
    }
  }
  return dates.sort().at(-1) ?? null;
}

function localEipIds() {
  return new Set(
    fs
      .readdirSync(EIPS_DIR)
      .filter((file) => file.endsWith('.json'))
      .map((file) => Number.parseInt(file.replace(/\.json$/, ''), 10))
      .filter(Number.isFinite)
  );
}

function upstreamEipPaths(upstreamRef) {
  return git(['ls-tree', '--name-only', '-r', upstreamRef, '--', 'src/data/eips'])
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.endsWith('.json'));
}

function readUpstreamJson(upstreamRef, filePath) {
  return JSON.parse(git(['show', `${upstreamRef}:${filePath}`]));
}

function shouldIncludeNewEip(eip, recentCutoff) {
  if (!eip.laymanDescription) return false;
  const latest = latestActivityDate(eip);
  return latest !== null && latest >= recentCutoff;
}

function syncForkcastEips() {
  const options = parseArgs();
  const localIds = localEipIds();
  const changed = [];
  const added = [];

  for (const upstreamPath of upstreamEipPaths(options.upstreamRef)) {
    const upstreamEip = readUpstreamJson(options.upstreamRef, upstreamPath);
    const id = upstreamEip.id;
    const isExistingLocal = localIds.has(id);
    const isRecentNewEip = !isExistingLocal && shouldIncludeNewEip(upstreamEip, options.recentCutoff);

    if (!isExistingLocal && !isRecentNewEip) continue;

    const outputPath = path.join(EIPS_DIR, `${id}.json`);
    const previousContent = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, 'utf8') : null;
    const nextEip = isExistingLocal
      ? mergeExistingLocalEip(JSON.parse(previousContent), upstreamEip)
      : sanitizeEip(upstreamEip);
    const nextContent = `${JSON.stringify(nextEip, null, 2)}\n`;

    if (previousContent === nextContent) continue;

    if (!options.dryRun) {
      fs.writeFileSync(outputPath, nextContent);
    }

    changed.push(path.relative(REPO_ROOT, outputPath));
    if (previousContent === null) added.push(id);
  }

  if (changed.length === 0) {
    console.log('No Forkcast EIP roadmap changes detected');
  } else {
    console.log(`Updated ${changed.length} Forkcast EIP file(s)`);
    if (added.length > 0) console.log(`Added recent EIPs: ${added.sort((a, b) => a - b).join(', ')}`);
    for (const file of changed) console.log(file);
  }
}

syncForkcastEips();
