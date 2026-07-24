export type EvidenceKind = '已上線' | '正在測試' | '規劃方向';

export const stateObservation = {
  observedAt: '2026-07-25',
  summary: '以太坊正在把 L1 做成更能承擔資料、安全與結算的底層；大多數使用與擴容，則由安全模型各異的 L2 承接。',
  caveat: '這是依據多個來源的本站整理，不是協議承諾，也不是單一版本的永久結論。',
};

export const currentState = {
  fusaka: {
    kind: '已上線' as EvidenceKind,
    title: 'Fusaka 已把 L1 的資料供給往前推了一步',
    fact: 'Fusaka 已在 2025 年 12 月 3 日啟用，包含 PeerDAS、gas limit 增加與 BPOs。',
    meaning: '主鏈不是要把所有使用重新塞回 L1，而是在提高它承接資料與結算的能力，讓 L2 能更有效率地擴展。',
    source: { label: 'Forkcast：Fusaka', url: 'https://forkcast.org/' },
  },
  l2: {
    kind: '已上線' as EvidenceKind,
    title: '擴容已由多種 L2 共同承擔，但安全程度不同',
    fact: '觀測日的 L2BEAT Summary 列出 22 個 Rollups、7 個 Validiums & Optimiums。Rollup 會把狀態承諾與資料發布到 Ethereum；其他架構可能增加額外信任假設。',
    meaning: '「在 L2 上」不足以判斷風險。產品、資產與使用者體驗會取決於驗證方式、資料可用性與排序權由誰掌握。',
    source: { label: 'L2BEAT：Scaling Summary', url: 'https://l2beat.com/scaling/summary' },
  },
} as const;

export const activeChanges = [
  {
    kind: '正在測試' as EvidenceKind,
    id: 'EIP-7732',
    title: '把「誰建區塊」與「誰提區塊」拆開',
    short: 'ePBS 會把共識區塊與執行內容拆開，讓提議者能選擇執行內容的建構者。',
    why: '目的不是換一個名詞，而是把傳播與執行的重工作移出區塊驗證的關鍵時間路徑，為更大的交易內容與更多 blobs 騰出空間。',
    impact: '這會改變區塊建構、節點監測與質押基礎設施；對 L2 則可能帶來更多 blob 容量。一般使用者看到的可能是更高吞吐與較低成本，但不是已保證的結果。',
    status: '已排入 Glamsterdam 下一輪開發網實作；尚未等於主網啟用。',
    source: { label: 'Forkcast：EIP-7732', url: 'https://forkcast.org/' },
  },
  {
    kind: '正在測試' as EvidenceKind,
    id: 'EIP-7928',
    title: '讓協議先知道整個區塊會碰哪些狀態',
    short: 'Block-Level Access Lists 會在區塊層級明確列出狀態位置與交易後的狀態差異。',
    why: '這讓重複讀寫相同狀態的工作能被更有效率地處理，目標是減少狀態密集型應用的成本，並讓區塊處理更可預測。',
    impact: 'DeFi 與其他狀態密集型應用可能受惠；執行客戶端、gas 估算、交易模擬與基礎設施工具則必須理解新的存取與計費模式。',
    status: '已排入 Glamsterdam 下一輪開發網實作；尚未等於主網啟用。',
    source: { label: 'Forkcast：EIP-7928', url: 'https://forkcast.org/' },
  },
] as const;

export const directionMap = [
  {
    title: '把 L1 與 blobs 擴得更大',
    detail: '讓主鏈能以較低的硬體與驗證負擔承接更多資料，是 L2 擴容能否繼續下降成本的底層前提。',
  },
  {
    title: '讓驗證不必依賴更重的節點',
    detail: 'zkEVM、無狀態化與輕量節點的方向，都是在提升容量時不把參與門檻一併推高。',
  },
  {
    title: '把安全與使用體驗一起重做',
    detail: '量子安全、智慧合約錢包與更快終局性，關係到未來資產安全與產品互動，而不只是效能數字。',
  },
] as const;

export const directionSources = [
  { label: 'ethereum.org 路線圖', url: 'https://ethereum.org/roadmap/' },
  { label: 'Strawmap（草案）', url: 'https://strawmap.org/' },
] as const;
