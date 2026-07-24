import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const eipDir = path.join(root, 'src/data/eips');
const devnetDir = path.join(root, 'src/data/devnets');
const syncInfo = fs.readFileSync(path.join(root, 'src/data/syncInfo.ts'), 'utf8');
const lastSyncedAt = syncInfo.match(/lastSyncedAt:\s*'([^']+)'/)?.[1] ?? null;
const revision = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root }).toString().trim();
const shortRevision = revision.slice(0, 7);
const count = (dir) => fs.readdirSync(dir).filter((file) => file.endsWith('.json')).length;
const manifest = {
  source: { name: 'ethereum/forkcast', url: 'https://github.com/ethereum/forkcast' },
  site_snapshot: { repository: 'ASTROHSU/Ethereum-roadmap', revision: shortRevision },
  observed_at: lastSyncedAt,
  validation: 'passed',
  snapshot: { eips: count(eipDir), devnets: count(devnetDir) },
  provenance: '原始協議資料由 Forkcast 同步；中文白話與讀者影響標記由本站依來源轉譯，不取代原始資料。',
};
fs.writeFileSync(path.join(root, 'src/data/source-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Generated source manifest for ${manifest.source.name} @ ${shortRevision}`);
