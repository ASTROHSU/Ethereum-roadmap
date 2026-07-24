import eips from '../data/eips.json';
import manifest from '../data/source-manifest.json';

type StatusEntry = { status: string; call?: string | null; date?: string | null };
type ForkRelationship = { forkName: string; statusHistory?: StatusEntry[] };
type Eip = {
  id: number;
  title: string;
  description?: string;
  laymanDescription?: string;
  discussionLink?: string;
  forkRelationships?: ForkRelationship[];
};

export const sourceManifest = manifest;
export const primaryUpgrade = {
  slug: 'glamsterdam',
  name: 'Glamsterdam',
  phase: '規格形成中',
  short: '它正在決定下一輪升級會納入哪些改變。',
  whyNow: '規格一旦進入實作，能選擇的空間就會快速縮小。',
  watch: '先看哪些提案進入實作與測試。',
  source: 'https://github.com/ethereum/forkcast',
};

export const audienceGuides = [
  { slug: 'users', label: '一般使用者', eyebrow: '交易與安全', summary: '先知道未來錢包與交易體驗為何改變。', lateCost: '只看到介面改變，卻不知道安全與選擇如何被決定。' },
  { slug: 'wallets-apps', label: '錢包與應用', eyebrow: '整合與相容性', summary: '規格收斂前，是最適合預先驗證的時候。', lateCost: '等到排程公布才開始理解，往往只剩交付壓力。' },
  { slug: 'l2-infra', label: 'L2 與基礎設施', eyebrow: '成本與資料', summary: '持續追蹤資料、成本與相容性的假設。', lateCost: '協議假設固定後，調整會從研究變成遷移。' },
  { slug: 'validators-builders', label: '驗證者與開發者', eyebrow: '客戶端與維運', summary: '客戶端與測試網最早出現可操作的訊號。', lateCost: '錯過測試窗口，準備會變成被迫維運。' },
] as const;

export function eipsForFork(forkName: string) {
  return (eips as Eip[]).filter((eip) => eip.forkRelationships?.some((relationship) => relationship.forkName === forkName));
}

export function recentSignals(forkName: string, limit = 3) {
  const activeStatuses = new Set(['Proposed', 'Considered', 'Informational']);
  return eipsForFork(forkName)
    .map((eip) => {
      const relationship = eip.forkRelationships?.find((item) => item.forkName === forkName);
      const history = relationship?.statusHistory ?? [];
      return { ...eip, latest: history.at(-1), history };
    })
    .filter((eip) => eip.latest && activeStatuses.has(eip.latest.status))
    .sort((a, b) => {
      const priority = (status: string) => status === 'Informational' ? 1 : 0;
      const priorityDiff = priority(b.latest!.status) - priority(a.latest!.status);
      if (priorityDiff) return priorityDiff;
      return (b.latest?.date ?? '').localeCompare(a.latest?.date ?? '');
    })
    .slice(0, limit);
}

const signalTranslations: Record<number, { title: string; summary: string; statusNote: string }> = {
  7904: {
    title: '檢驗計算操作的成本',
    summary: '以實測資料檢驗計算操作的資源成本。',
    statusNote: '提供升級決策的參考，尚未被採納。',
  },
  8282: {
    title: '釐清區塊建構者的角色',
    summary: '釐清區塊建構與客戶端的分工。',
    statusNote: '仍在考慮中。',
  },
  7975: {
    title: '分段同步區塊收據',
    summary: '讓節點在更高吞吐量下維持同步可靠性。',
    statusNote: '仍在考慮中。',
  },
};

export function signalBrief(signal: { id: number; title: string; description?: string; laymanDescription?: string; latest?: StatusEntry }) {
  const translation = signalTranslations[signal.id];
  return translation ?? {
    title: signal.title.replace(/^EIP-\d+:\s*/, ''),
    summary: signal.laymanDescription || signal.description || '尚待完成中文轉譯。',
    statusNote: `目前狀態：${signal.latest?.status ?? '未知'}`,
  };
}

export function signalStateLabel(signal: { latest?: StatusEntry }) {
  if (signal.latest?.status === 'Informational') return '判讀參考資料';
  if (signal.latest?.status === 'Considered') return '仍在考慮中';
  return `目前狀態：${signal.latest?.status ?? '未知'}`;
}

export function taipeiTime(iso: string | null) {
  if (!iso) return '尚未取得';
  return new Intl.DateTimeFormat('zh-TW', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Taipei' }).format(new Date(iso));
}
