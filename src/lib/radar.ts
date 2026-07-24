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
  stakeholderImpacts?: Record<string, { description: string }>;
};

export const sourceManifest = manifest;
export const primaryUpgrade = {
  slug: 'glamsterdam',
  name: 'Glamsterdam',
  phase: '規格收斂與測試方向形成中',
  short: '它正在決定下一輪以太坊升級的技術邊界；現在看見的是規格、會議與測試網訊號，而非事後公告。',
  whyNow: '當討論進入客戶端實作與 devnet，焦點會從「要不要」轉為「如何適配」。',
  watch: '觀察已收斂的 EIP 是否進入實作，以及 Glamsterdam devnet 的下一輪測試。',
  source: 'https://github.com/ethereum/forkcast',
};

export const audienceGuides = [
  { slug: 'users', label: '一般使用者', eyebrow: '交易、帳戶與安全', summary: '你不必追每個 EIP，但值得提早知道哪些變化會進入錢包與交易流程。', lateCost: '等功能成為預設，你只會看到介面改變，卻不知道安全與選擇是如何被決定的。' },
  { slug: 'wallets-apps', label: '錢包與應用', eyebrow: '整合與相容性', summary: '規格尚在收斂時最適合預研；進入客戶端實作後，整合窗口會快速縮小。', lateCost: '等到主網排程公布才開始理解，通常已不是設計選擇，而是交付壓力。' },
  { slug: 'l2-infra', label: 'L2 與基礎設施', eyebrow: '成本、資料與吞吐', summary: '升級會改變資料可用性、節點假設與相容性；不一定立即行動，但需要持續追蹤。', lateCost: '協議假設一旦固定，基礎設施的調整成本會從研究轉為遷移。' },
  { slug: 'validators-builders', label: '驗證者與開發者', eyebrow: '客戶端與維運', summary: '從 devnet 到實作，是節點與工具鏈最早出現可操作訊號的階段。', lateCost: '錯過測試窗口，會讓準備從可選擇的驗證變成被迫的維運。' },
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
    title: '計算操作的 Gas 成本檢驗',
    summary: '以實測資料檢驗 EVM 計算操作的資源成本；目前結論是在目標吞吐量下，沒有必須立刻重訂的 compute gas 成本。',
    statusNote: '它正在提供升級決策需要的資訊，不代表已被採納。',
  },
  8282: {
    title: '建構者的執行請求角色',
    summary: '在 ePBS 架構中加入質押建構者角色，讓建構者的加入與離開沿用驗證者合約，釐清客戶端與區塊建構的分工。',
    statusNote: '仍在考慮中；它會影響未來區塊建構與驗證流程的設計。',
  },
  7975: {
    title: '部分區塊收據清單',
    summary: '當每個區塊處理更多交易，收據資料可能無法一次透過網路訊息傳遞；將它分段同步可降低節點同步失敗。',
    statusNote: '仍在考慮中；它關乎節點在更高吞吐量下的同步可靠性。',
  },
};

export function signalBrief(signal: { id: number; title: string; description?: string; laymanDescription?: string; latest?: StatusEntry }) {
  const translation = signalTranslations[signal.id];
  return translation ?? {
    title: signal.title.replace(/^EIP-\d+:\s*/, ''),
    summary: signal.laymanDescription || signal.description || '此訊號尚待本站完成中文轉譯。',
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
