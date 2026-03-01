import React, { useState } from 'react';
import {
  Wallet,
  ShieldAlert,
  Zap,
  Server,
  ChevronDown,
  ChevronUp,
  Clock,
  Code,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Map,
  CheckCircle2,
} from 'lucide-react';

// 以太坊官方升級階段（技術路線圖原貌，供對照與建立權威感）
const officialRoadmapPhases = [
  {
    id: 'merge',
    name: 'The Merge',
    nameZh: '合併',
    short: 'PoW → PoS，共識層與執行層合一',
    status: 'completed',
  },
  {
    id: 'surge',
    name: 'The Surge',
    nameZh: '擴容',
    short: '分片、L2、高 TPS',
    status: 'in_progress',
  },
  {
    id: 'scourge',
    name: 'The Scourge',
    nameZh: '淨化',
    short: 'MEV、流動性質押、經濟去中心化',
    status: 'future',
  },
  {
    id: 'verge',
    name: 'The Verge',
    nameZh: '邊緣',
    short: 'Verkle Trees、輕節點、無狀態',
    status: 'future',
  },
  {
    id: 'purge',
    name: 'The Purge',
    nameZh: '精簡',
    short: '歷史資料瘦身、技術債清理',
    status: 'future',
  },
  {
    id: 'splurge',
    name: 'The Splurge',
    nameZh: '雜項',
    short: '其餘改進、協調各階段',
    status: 'future',
  },
];

// 嚴重度對應文案
const getSeverityLabel = (n) => {
  if (n <= 3) return '低';
  if (n <= 6) return '中';
  return '高';
};

const getSeverityColor = (n) => {
  if (n <= 3) return 'bg-emerald-400';
  if (n <= 6) return 'bg-amber-400';
  return 'bg-rose-500';
};

// 成熟度 / 不確定性 標籤樣式
const maturityLabels = {
  Research: '研究階段',
  Draft: '草案',
  Spec: '規格',
  Testnet: '測試網',
  Mainnet: '主網',
};
const confidenceLabels = { low: '不確定性高', medium: '中等', high: '較確定' };

// 網站資料透明度：讀者可確認資料來源與更新時間
const LAST_UPDATED = '2025-03-01';
const DATA_SOURCES = [
  { label: 'Strawmap', url: 'https://strawmap.org/' },
  { label: 'Ethereum.org 路線圖', url: 'https://ethereum.org/roadmap' },
  { label: 'EIPs（例如 EIP-8141、EIP-4337）', url: 'https://eips.ethereum.org/' },
];
const RECENT_UPDATES = '帳戶抽象改寫為 EIP-8141、文案簡化，並附 Vitalik 說明連結。';

// 編輯團隊維護的 JSON 資料庫：Category → Topics → Items
const roadmapData = [
  {
    id: 'scale',
    title: '費用與速度',
    icon: <Zap className="w-6 h-6" />,
    topics: [
      {
        id: 'scale_l1',
        title: 'L1 手續費與吞吐',
        description: '主網 Gas 貴、容量有限，使用者被迫頻繁使用 L2 或忍受高成本。',
        severity: 7,
        items: [
          {
            id: 'p1',
            question: 'L1 手續費還是太貴了，但我又不想頻繁跨鏈到 L2，覺得好麻煩？',
            riskSummary:
              '高額手續費會排擠小額交易與新用戶，並讓 DeFi 操作成本不穩定，影響使用意願。',
            severity: 7,
            impact: 8,
            difficulty: 6,
            solution:
              '以太坊將再次提升 L1 本身的處理能力，而不僅僅是把責任推給 L2。未來 L1 的 Gas Limit 會提高，並引入更有效率的虛擬機機制。',
            techTerms: ['L1 Gas Limit 提升', 'EOF (EVM Object Format)'],
            eta: '2025 - 2026 (The Splurge / Surge)',
            maturity: 'Draft',
            confidence: 'medium',
            sources: [{ label: 'Strawmap', url: 'https://strawmap.org/' }],
            links: [
              { type: 'external', label: 'Ethereum.org 路線圖', url: 'https://ethereum.org/roadmap' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ux',
    title: '帳號與操作',
    icon: <Wallet className="w-6 h-6" />,
    topics: [
      {
        id: 'ux_recovery',
        title: '助記詞與帳戶恢復',
        description: '私鑰/助記詞一旦遺失，資產無法找回，門檻與心理負擔高。',
        severity: 8,
        items: [
          {
            id: 'p2',
            question: '記助記詞太反人類了！弄丟私鑰資產就歸零，不能像 Web2 一樣重設密碼嗎？',
            riskSummary:
              '遺失助記詞等於永久失去資產；無恢復機制也讓釣魚、盜竊一旦得手就無法挽回。',
            severity: 9,
            impact: 9,
            difficulty: 5,
            solution:
              '可以。之後以太坊會支援「帳戶抽象」：你不用再死背 12 個字，可以像 Web2 一樣換密碼、用多簽或找信任的人幫你恢復帳戶，甚至用其他代幣付手續費。這套升級（EIP-8141）有機會約一年內上線。',
            techTerms: [
              '帳戶抽象 (Account Abstraction)',
              'EIP-8141',
              '多簽、社群恢復、用其他代幣付 gas',
            ],
            eta: '約一年內（目標 Hegota 升級）',
            maturity: 'Draft',
            confidence: 'high',
            sources: [
              { label: 'EIP-8141', url: 'https://eips.ethereum.org/EIPS/eip-8141' },
              { label: 'EIP-4337 (ERC-4337)', url: 'https://eips.ethereum.org/EIPS/eip-4337' },
            ],
            links: [
              { type: 'external', label: 'Vitalik：帳戶抽象說明', url: 'https://x.com/VitalikButerin/status/2027774090627715377' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'privacy',
    title: '隱私與資安',
    icon: <ShieldAlert className="w-6 h-6" />,
    topics: [
      {
        id: 'privacy_asset',
        title: '資產持有隱私',
        description:
          '地址一旦被知道，資產規模與持倉結構可能被追蹤，增加被針對的風險。',
        severity: 7,
        items: [
          {
            id: 'p3',
            question: '只要有人知道我的錢包地址，我的餘額和買過什麼幣就全被看光？',
            riskSummary:
              '可能被鎖定成駭客/釣魚對象，或被社交工程攻擊；也會暴露投資策略與資產配置。',
            severity: 8,
            impact: 8,
            difficulty: 6,
            solution:
              '未來將內建更強大的密碼學工具。當別人轉帳給你時，可以自動生成「隱形地址」，資金依然是你的，但外界無法將這筆錢與你的主帳號連在一起。',
            techTerms: ['隱形地址 (Stealth Addresses)', 'ZK-SNARKs 原生支援'],
            eta: '2026+ (The Splurge)',
            maturity: 'Research',
            confidence: 'low',
            sources: [{ label: 'Strawmap', url: 'https://strawmap.org/' }],
            links: [{ type: 'external', label: 'Stealth addresses 概述', url: 'https://vitalik.eth.limo/general/2023/01/20/stealth.html' }],
          },
        ],
      },
      {
        id: 'privacy_tx',
        title: '交易隱私 / MEV',
        description:
          '交易在 mempool 可被觀察，可能被搶跑/夾擊，導致成交價格惡化或失敗。',
        severity: 8,
        items: [
          {
            id: 'p4',
            question: '在 DEX 買幣，常常因為滑點或被 MEV 機器人「夾擊」而買貴了？',
            riskSummary:
              '大額或時效敏感的交易容易被搶跑、三明治攻擊，造成實際成交價比預期差，甚至交易失敗。',
            severity: 8,
            impact: 7,
            difficulty: 7,
            solution:
              '以太坊將在底層改變交易打包的規則，把「負責打包的人」和「負責提議的人」分開，並加密等待中的交易，讓機器人無法偷看你的交易來作惡。',
            techTerms: ['PBS (提議者與建構者分離)', '加密記憶體池 (Encrypted Mempool)'],
            eta: '2026 - 2027 (The Scourge)',
            maturity: 'Research',
            confidence: 'medium',
            sources: [{ label: 'Strawmap', url: 'https://strawmap.org/' }],
            links: [],
          },
        ],
      },
    ],
  },
  {
    id: 'node',
    title: '節點與去中心化',
    icon: <Server className="w-6 h-6" />,
    topics: [
      {
        id: 'node_barrier',
        title: '節點硬體門檻',
        description: '跑節點需要大容量硬碟與較高規格電腦，一般人難以參與驗證。',
        severity: 6,
        items: [
          {
            id: 'p5',
            question: '我想跑節點支持以太坊，但聽說需要超大硬碟和高等級電腦？',
            riskSummary:
              '節點門檻高會導致驗證者集中化，降低網路去中心化與抗審查能力。',
            severity: 6,
            impact: 7,
            difficulty: 8,
            solution:
              '即將大幅瘦身！未來的技術升級會讓節點「無狀態化」，你甚至可以只用手機或智慧手錶，就能驗證以太坊區塊鏈，徹底打破硬體門檻。',
            techTerms: ['Verkle Trees', '無狀態客戶端 (Stateless Clients)'],
            eta: '2027 - 2028 (The Verge)',
            maturity: 'Research',
            confidence: 'medium',
            sources: [{ label: 'Strawmap', url: 'https://strawmap.org/' }],
            links: [],
          },
        ],
      },
    ],
  },
];

export default function EthereumRoadmapUX() {
  const [activeTab, setActiveTab] = useState(roadmapData[0].id);
  const [activeTopic, setActiveTopic] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const [sourcesOpen, setSourcesOpen] = useState({});
  const [officialRoadmapOpen, setOfficialRoadmapOpen] = useState(false);

  const activeCategory = roadmapData.find((c) => c.id === activeTab) ?? roadmapData[0];
  const effectiveTopic =
    activeTopic && activeCategory.topics.some((t) => t.id === activeTopic)
      ? activeTopic
      : activeCategory.topics[0]?.id ?? null;
  const currentTopic = activeCategory.topics.find((t) => t.id === effectiveTopic);
  const items = currentTopic?.items ?? [];

  const handleTabChange = (categoryId) => {
    setActiveTab(categoryId);
    const cat = roadmapData.find((c) => c.id === categoryId);
    setActiveTopic(cat?.topics[0]?.id ?? null);
    setExpandedCard(null);
  };

  const toggleCard = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const toggleSources = (itemId) => {
    setSourcesOpen((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            以太坊升級地圖
          </h1>
          <p className="text-slate-600 leading-relaxed max-w-2xl">
            以太坊升級到哪裡了？未來還有哪些？真的能解決我的問題嗎？選你正在煩惱的面向，對應到背後的階段與解法。
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Category Tabs */}
        <div className="flex overflow-x-auto space-x-2 pb-4 mb-6 scrollbar-hide">
          {roadmapData.map((category) => (
            <button
              key={category.id}
              onClick={() => handleTabChange(category.id)}
              className={`flex items-center space-x-2 px-5 py-3 rounded-full whitespace-nowrap transition-all ${
                activeTab === category.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {category.icon}
              <span className="font-medium">{category.title}</span>
            </button>
          ))}
        </div>

        {/* Topic Breakdown */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
            子議題
          </h2>
          <div className="flex flex-col gap-2">
            {activeCategory.topics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => {
                  setActiveTopic(topic.id);
                  setExpandedCard(null);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all flex items-center justify-between ${
                  effectiveTopic === topic.id
                    ? 'bg-indigo-50 border-indigo-300 ring-1 ring-indigo-100'
                    : 'bg-white border-slate-200 hover:border-indigo-200 hover:bg-slate-50'
                }`}
              >
                <div>
                  <span className="font-medium text-slate-800">{topic.title}</span>
                  <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">{topic.description}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded ${
                      topic.severity >= 7
                        ? 'bg-rose-100 text-rose-700'
                        : topic.severity >= 4
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    嚴重度 {topic.severity}/10
                  </span>
                  <ChevronRight
                    className={`w-5 h-5 text-slate-400 ${effectiveTopic === topic.id ? 'text-indigo-600' : ''}`}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Items (痛點卡片) */}
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                expandedCard === item.id
                  ? 'border-indigo-400 shadow-lg ring-1 ring-indigo-100'
                  : 'border-slate-200 shadow-sm hover:border-indigo-200 hover:shadow-md'
              }`}
            >
              <button
                onClick={() => toggleCard(item.id)}
                className="w-full text-left px-6 py-5 flex items-start justify-between focus:outline-none"
              >
                <div className="flex-1 pr-4">
                  <span className="inline-block px-2 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded mb-3">
                    你的痛點
                  </span>
                  <h3 className="text-lg md:text-xl font-medium text-slate-800 leading-snug">
                    {item.question}
                  </h3>
                </div>
                <div className="flex-shrink-0 mt-2 text-slate-400 bg-slate-50 p-2 rounded-full">
                  {expandedCard === item.id ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </button>

              <div
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                  expandedCard === item.id ? 'max-h-[1200px] pb-6 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="border-t border-slate-100 pt-5 space-y-5">
                  {/* 1. 嚴重度 */}
                  <div>
                    <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-2">
                      <AlertCircle className="w-4 h-4" />
                      這個問題有多嚴重
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${getSeverityColor(item.severity)}`}
                          style={{ width: `${(item.severity / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
                        {item.severity}/10 · {getSeverityLabel(item.severity)}
                      </span>
                    </div>
                  </div>

                  {/* 2. 風險說明 */}
                  <div>
                    <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-2">
                      風險在哪
                    </div>
                    <p className="text-slate-600 leading-relaxed text-sm bg-amber-50/80 border border-amber-100 rounded-lg p-3">
                      {item.riskSummary}
                    </p>
                  </div>

                  {/* 3. 以太坊解法 */}
                  <div>
                    <span className="inline-block px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded mb-2">
                      以太坊解法
                    </span>
                    <p className="text-slate-600 leading-relaxed">{item.solution}</p>
                  </div>

                  {/* 4. 技術名詞 + ETA + 成熟度/不確定性 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <div>
                      <div className="flex items-center text-slate-500 text-sm mb-1 font-medium">
                        <Code className="w-4 h-4 mr-1.5" />
                        對應技術名詞
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {item.techTerms.map((term, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-sm rounded-md font-mono border border-indigo-100"
                          >
                            {term}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center text-slate-500 text-sm mb-1 font-medium">
                        <Clock className="w-4 h-4 mr-1.5" />
                        預計實現時間 (ETA)
                      </div>
                      <div className="text-slate-800 font-medium mt-2">{item.eta}</div>
                    </div>
                  </div>

                  {/* 5. 成熟度 + 不確定性 */}
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2.5 py-1 bg-slate-100 text-slate-700 text-xs rounded-md">
                      成熟度：{maturityLabels[item.maturity] ?? item.maturity}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 bg-slate-100 text-slate-700 text-xs rounded-md">
                      {confidenceLabels[item.confidence] ?? item.confidence}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    ETA 為進度推估，非承諾時程；成熟度與不確定性供判斷可信度。
                  </p>

                  {/* 6. 連結（依 links 決定顯示） */}
                  {(item.links?.length ?? 0) > 0 && (
                    <div className="pt-4 border-t border-slate-100 space-y-2">
                      {item.links.some((l) => l.type === 'blocktrend') && (
                        <a
                          href={item.links.find((l) => l.type === 'blocktrend')?.url}
                          className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center transition-colors"
                        >
                          閱讀《區塊勢》深入解析
                          <span className="ml-1 text-lg leading-none">→</span>
                        </a>
                      )}
                      {item.links
                        .filter((l) => l.type === 'external')
                        .map((link, i) => (
                          <a
                            key={i}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-600 hover:text-slate-800 text-sm flex items-center gap-1"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            {link.label}
                          </a>
                        ))}
                    </div>
                  )}

                  {/* 7. 來源引用（可折疊） */}
                  {(item.sources?.length ?? 0) > 0 && (
                    <div className="pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => toggleSources(item.id)}
                        className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1"
                      >
                        {sourcesOpen[item.id] ? '收起' : '展開'}來源引用
                        {sourcesOpen[item.id] ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}
                      </button>
                      {sourcesOpen[item.id] && (
                        <ul className="mt-2 space-y-1 text-xs text-slate-500">
                          {item.sources.map((s, i) => (
                            <li key={i}>
                              <a
                                href={s.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-indigo-600"
                              >
                                {s.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 最近一次更新（最外層，直接可見） */}
        <footer className="mt-12 pt-6 pb-4 border-t border-slate-200">
          <div className="text-xs text-slate-500 max-w-2xl">
            <span className="font-medium text-slate-600">最近一次更新</span>
            <p className="mt-1">
              <time dateTime={LAST_UPDATED}>{LAST_UPDATED}</time>
              {' · '}
              {RECENT_UPDATES}
            </p>
            <p className="mt-1 text-slate-400">
              若你有看到更新的發展而本站尚未反映，可展開下方「參考與資料來源」對照；我們會不定期更新。
            </p>
          </div>
        </footer>

        {/* 參考：技術路線圖原貌 + 資料從哪裡來（收合，需展開才看得到） */}
        <section className="pb-8">
          <button
            type="button"
            onClick={() => setOfficialRoadmapOpen(!officialRoadmapOpen)}
            className="w-full text-left flex items-center justify-between gap-2 py-2 px-0 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <span className="text-xs">參考：技術路線圖原貌與資料來源</span>
            {officialRoadmapOpen ? (
              <ChevronUp className="w-4 h-4 flex-shrink-0" />
            ) : (
              <ChevronDown className="w-4 h-4 flex-shrink-0" />
            )}
          </button>
          {officialRoadmapOpen && (
            <div className="mt-3 pt-4 border-t border-slate-100 space-y-6 text-sm">
              <div>
                <span className="font-medium text-slate-600 text-xs">技術路線圖原貌</span>
                <p className="mt-2 text-slate-600 leading-relaxed">
                  下面六個階段是以太坊官方用來描述升級的架構。它們<strong className="text-slate-700">不是嚴格先後順序</strong>，而是<strong className="text-slate-700">並行推進</strong>的不同面向：像是一個系統的不同部分同時在演進，每次升級可能同時涉及多個階段。本頁把這張地圖轉成「從你的問題對應回去」的版本。
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
                  {officialRoadmapPhases.map((phase) => (
                    <div
                      key={phase.id}
                      className={`rounded-xl border p-4 ${
                        phase.status === 'completed'
                          ? 'bg-emerald-50/80 border-emerald-200'
                          : phase.status === 'in_progress'
                            ? 'bg-indigo-50/80 border-indigo-200'
                            : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {phase.status === 'completed' ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        ) : null}
                        <span className="font-semibold text-slate-800">
                          {phase.name}
                          <span className="text-slate-500 font-normal ml-1">({phase.nameZh})</span>
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">{phase.short}</p>
                      {phase.status === 'completed' && (
                        <span className="inline-block mt-2 text-xs font-medium text-emerald-700">已完成</span>
                      )}
                      {phase.status === 'in_progress' && (
                        <span className="inline-block mt-2 text-xs font-medium text-indigo-700">進行中</span>
                      )}
                    </div>
                  ))}
                </div>
                <a
                  href="https://ethereum.org/roadmap"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-indigo-600 hover:text-indigo-800 text-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Ethereum.org 路線圖（原始來源）
                </a>
              </div>
              <div>
                <span className="font-medium text-slate-600 text-xs">資料從哪裡來</span>
                <p className="mt-2 text-slate-600">
                  本頁內容參考以下來源整理，各痛點卡片內也有個別來源與連結可對照。
                </p>
                <ul className="mt-2 space-y-1">
                  {DATA_SOURCES.map((s, i) => (
                    <li key={i}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
                      >
                        {s.label}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
