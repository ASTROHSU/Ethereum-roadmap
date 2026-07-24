export type EvidenceLayer = '原始資料' | '跨來源整理' | '第三方解讀';

export const sourceMap = {
  forkcast: {
    name: 'Forkcast',
    url: 'https://forkcast.org',
    layer: '原始資料' as EvidenceLayer,
    role: '下一個升級正在走到哪裡',
    use: '提案狀態、開發網與近期分叉的進度。',
    limit: '它主要說明近期進度，不代表長期路線已定案。',
  },
  strawmap: {
    name: 'Strawmap',
    url: 'https://strawmap.org',
    layer: '原始資料' as EvidenceLayer,
    role: '未來幾年的 L1 方向與依賴關係',
    use: '理解分叉如何串連，以及長期想解決什麼。',
    limit: '這是草案路線圖；方向可參考，日期不可視為承諾。',
  },
  l2beat: {
    name: 'L2BEAT',
    url: 'https://l2beat.com/scaling/summary',
    layer: '原始資料' as EvidenceLayer,
    role: '今天的 L2 體系實際怎麼運作',
    use: '安全階段、驗證方式、資料可用性與生態現況。',
    limit: '它描述現況與風險，不預測未來協議時程。',
  },
  galaxy: {
    name: 'Galaxy 研究',
    url: 'https://www.galaxy.com/insights/research/ethereum-strawmap-roadmap-l1-scaling-analysis',
    layer: '第三方解讀' as EvidenceLayer,
    role: '理解 Strawmap 的外部脈絡',
    use: '提供研究觀點與可討論的取捨。',
    limit: '不是協議時程或現況的權威來源。',
  },
} as const;
