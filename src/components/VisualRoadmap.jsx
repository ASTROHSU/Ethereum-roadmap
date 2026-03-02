import React, { useRef, useState, useEffect } from 'react';
import {
  CheckCircle2, CircleDashed, Circle, ChevronRight, ChevronLeft,
  ChevronDown, ChevronUp, X, ExternalLink, AlertCircle, Clock, Code
} from 'lucide-react';

const roadmapNodes = [
  {
    id: "frontier", phase: "Frontier", date: "2015年7月", status: "completed",
    title: "創世發佈", description: "以太坊主網正式發佈，當時僅限開發者使用，尚無圖形介面。",
    painPoints: [],
    highlights: [
      { title: '以太坊誕生', desc: '主網正式上線，但僅能透過命令列操作，普通使用者幾乎無法使用。這個階段的重點是驗證「智慧合約平台」的概念是否可行。' }
    ]
  },
  {
    id: "homestead", phase: "Homestead", date: "2016年3月", status: "completed",
    title: "第一個穩定版本", description: "移除早期的安全性免責聲明，以太坊正式宣告進入穩定可用階段。",
    painPoints: [],
    highlights: [
      { title: '穩定性宣告', desc: '官方移除了「這是實驗性軟體」的免責聲明，正式進入生產環境。同年 DAO 被駭事件也促使社群更重視智慧合約安全審計。' }
    ]
  },
  {
    id: "byzantium", phase: "Byzantium", date: "2017年10月", status: "completed",
    title: "ZK 技術埋伏筆", description: "加入了 ZK 密碼學所需的底層運算元件；開始控制通膨。",
    painPoints: [],
    highlights: [
      { title: '隱私技術基礎建立', desc: '加入 ZK-SNARK 所需的預編譯合約（EIP-196、EIP-197），為日後的隱私交易與 ZK Rollup 鋪路。' },
      { title: '通膨開始控制', desc: '區塊獎勵從 5 ETH 降至 3 ETH，首次展現社群對 ETH 經濟模型的主動管理。' }
    ]
  },
  {
    id: "constantinople", phase: "Constantinople", date: "2019年2月", status: "completed",
    title: "效率與經濟模型調整", description: "區塊獎勵從 3 ETH 減至 2 ETH、Gas 優化。",
    painPoints: [],
    highlights: [
      { title: 'Gas 成本初步下降', desc: '引入更便宜的位元操作指令（EIP-1052、EIP-1283），但整體鏈上操作費用依然偏高。' },
      { title: 'ETH 發行量再降', desc: '區塊獎勵從 3 ETH 降至 2 ETH，持續壓低通膨，為後來的「超音速貨幣」敘事埋下伏筆。' }
    ]
  },
  {
    id: "istanbul", phase: "Istanbul", date: "2019年12月", status: "completed",
    title: "為 L2 鋪路", description: "降低 Rollup 相關操作的 Gas 費用，大幅降低未來 L2 的運作成本。",
    painPoints: [],
    highlights: [
      { title: 'L2 擴容的起點', desc: 'EIP-2028 大幅降低 calldata 費用，讓未來的 Rollup 方案（Optimism、Arbitrum 等）可以用更低成本在 L1 上提交資料。' },
      { title: '跨鏈互通基礎', desc: '加入 ChainID 操作碼（EIP-1344），讓智慧合約能辨識自己在哪條鏈上，為日後的多鏈生態打下基礎。' }
    ]
  },
  {
    id: "muir-glacier", phase: "Muir Glacier", date: "2020年1月", status: "completed",
    title: "難度炸彈延遲", description: "再次延遲難度炸彈，讓 PoW 挖礦能維持到 The Merge。",
    painPoints: [],
    highlights: [
      { title: '維持網路穩定', desc: '難度炸彈會讓出塊時間越來越長，甚至導致網路癱瘓。延遲它確保了在轉向 PoS 之前，網路能持續正常運作。' }
    ]
  },
  {
    id: "berlin", phase: "Berlin", date: "2021年4月", status: "completed",
    title: "Gas 效率調整", description: "降低讀取儲存資料的操作費用，修復安全漏洞。",
    painPoints: [],
    highlights: [
      { title: 'Gas 計費更合理', desc: 'EIP-2929 讓首次存取新地址的 Gas 較高（防 DoS），但後續存取同一地址變便宜。整體讓合約互動費用更可預期。' },
      { title: '交易類型擴展', desc: 'EIP-2718 引入統一的交易類型封裝，讓未來新增交易功能（如 EIP-1559）更容易，而不需要硬分叉。' }
    ]
  },
  {
    id: "london", phase: "London (EIP-1559)", date: "2021年8月", status: "completed",
    title: "Gas 機制改革", description: "引入基礎費 + 小費，開始銷毀部分 ETH，費用可預期。",
    painPoints: ["L1 手續費與吞吐"],
    highlights: [
      { title: 'Gas 費用終於可預期', desc: '告別了「盲目競價」的舊機制。EIP-1559 讓每個區塊有明確的基礎費，你只需決定小費多寡。錢包可以自動估算費用，大幅降低了「Gas 設太低導致交易卡住」的焦慮。' },
      { title: 'ETH 開始通縮', desc: '每筆交易的基礎費會被銷毀，而非付給礦工。在交易量高時，銷毀的 ETH 甚至可能超過新發行量，讓 ETH 成為「通縮貨幣」。' }
    ]
  },
  {
    id: "merge", phase: "The Merge", date: "2022年9月", status: "completed",
    title: "共識層合併", description: "將挖礦切換為質押，以太坊能耗降低 99.95%。",
    painPoints: ["質押集中化"],
    highlights: [
      { title: '告別挖礦，轉向質押', desc: '以太坊從 PoW（工作量證明）無縫切換至 PoS（權益證明），能源消耗瞬間降低 99.95%。這是加密貨幣史上最大規模的共識機制遷移，過程中零停機。' },
      { title: 'ETH 發行量大降 90%', desc: '不再需要支付高額挖礦獎勵，ETH 新增發行量從每天約 13,000 ETH 降至約 1,600 ETH。搭配 EIP-1559 的銷毀機制，ETH 正式進入「淨通縮」時代。' }
    ]
  },
  {
    id: "shanghai", phase: "Shanghai", date: "2023年4月", status: "completed",
    title: "開放質押提款", description: "質押者終於能提回 ETH，PoS 證明實際可行。",
    painPoints: ["質押集中化"],
    highlights: [
      { title: '質押的 ETH 終於能提出來了', desc: '自 2020 年 12 月信標鏈上線以來，質押者的 ETH 被鎖了整整 2.5 年。Shanghai 升級讓提款成為可能，證明 PoS 不是「進得去出不來」的陷阱，大幅提升市場對質押的信心。' },
      { title: '質押參與率飆升', desc: '提款功能上線後，更多人願意參與質押（因為知道可以退出），驗證者數量從 56 萬增至超過 100 萬，網路安全性大幅提升。' }
    ]
  },
  {
    id: "dencun", phase: "Dencun", date: "2024年3月", status: "completed",
    title: "L2 手續費大降", description: "引入 Blob 空間讓 Rollup 費用降低數十倍。",
    painPoints: ["L1 手續費與吞吐", "L2 碎片化與跨鏈麻煩"]
  },
  {
    id: "pectra", phase: "Pectra", date: "2025年5月", status: "completed",
    title: "無 ETH 也能付 Gas", description: "帳戶抽象（EIP-7702）上線主網。",
    painPoints: ["新手入門門檻", "助記詞與帳戶恢復", "智慧合約授權風險"]
  },
  {
    id: "glamsterdam", phase: "Glamsterdam", date: "預計 2026 上半年", status: "in_progress",
    title: "防夾擊與 L1 降費", description: "將打包與提議者分離，減少被搶跑風險。",
    painPoints: ["交易隱私 / MEV"]
  },
  {
    id: "hegota", phase: "Hegotá", date: "預計 2026 下半年+", status: "future",
    title: "輕量節點與無縫跨鏈", description: "無縫跨鏈體驗、私有隱形地址、降低節點硬碟門檻。",
    painPoints: ["節點硬體門檻", "質押集中化", "資產持有隱私"]
  }
];

const maturityLabels = {
  Research: '研究階段', Draft: '草案', Spec: '規格', Testnet: '測試網', Mainnet: '主網已上線',
};
const getSeverityLabel = (n) => { if (n <= 3) return '低'; if (n <= 6) return '中'; return '高'; };
const getSeverityColor = (n) => { if (n <= 3) return 'bg-emerald-400'; if (n <= 6) return 'bg-amber-400'; return 'bg-rose-500'; };

export default function VisualRoadmap({ roadmapData = [], darkMode = false }) {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const pectraIndex = roadmapNodes.findIndex(n => n.id === 'pectra');
      const nodeWidth = window.innerWidth > 768 ? 312 : 292;
      const scrollTarget = pectraIndex * nodeWidth;
      setTimeout(() => {
        scrollContainerRef.current.scrollTo({ left: scrollTarget, behavior: 'smooth' });
      }, 300);
    }
  }, []);

  const scroll = (dir) => {
    if (scrollContainerRef.current) {
      const amount = window.innerWidth > 768 ? 600 : 300;
      scrollContainerRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
    }
  };

  const handleNodeClick = (node) => {
    if (selectedNode?.id === node.id) {
      setSelectedNode(null);
      setExpandedCard(null);
    } else {
      setSelectedNode(node);
      setExpandedCard(null);
    }
  };

  const getMatchedItems = (painPointTitles) => {
    const matched = [];
    for (const category of roadmapData) {
      for (const topic of category.topics) {
        if (painPointTitles.includes(topic.title)) {
          matched.push(...topic.items.map(item => ({ ...item, topicTitle: topic.title })));
        }
      }
    }
    return matched;
  };

  const hasContent = (node) => {
    return (node.painPoints && node.painPoints.length > 0) || (node.highlights && node.highlights.length > 0);
  };

  return (
    <div>
      {/* Timeline Card */}
      <div className={`rounded-3xl p-6 md:p-10 mb-0 border shadow-sm relative overflow-hidden transition-colors duration-300 ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>

        {/* 滾動按鈕 */}
        <div className="flex justify-end mb-4">
          <div className="hidden md:flex items-center gap-2">
            <button onClick={() => scroll('left')} disabled={!canScrollLeft}
              className={`p-2 rounded-full border transition-all shadow-sm disabled:opacity-30 disabled:cursor-not-allowed ${darkMode ? 'border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white' : 'border-slate-200 bg-white text-slate-400 hover:bg-slate-50 hover:text-slate-700'}`}>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => scroll('right')} disabled={!canScrollRight}
              className={`p-2 rounded-full border transition-all shadow-sm disabled:opacity-30 disabled:cursor-not-allowed ${darkMode ? 'border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white' : 'border-slate-200 bg-white text-slate-400 hover:bg-slate-50 hover:text-slate-700'}`}>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Timeline Scrollable Container */}
        <div className="relative">
          <div ref={scrollContainerRef} onScroll={checkScroll}
            className="flex overflow-x-auto pb-8 pt-4 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {/* Connector Line */}
            <div className={`hidden md:block absolute top-[64px] left-[5%] right-0 w-[4400px] h-1 rounded-full z-0 ${darkMode ? 'bg-gradient-to-r from-emerald-500/40 via-indigo-500/40 to-slate-700/40' : 'bg-gradient-to-r from-emerald-300/60 via-indigo-300/60 to-slate-200/60'}`} />

            <div className="flex gap-4 md:gap-8 relative z-10 w-max px-4">
              {roadmapNodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                const clickable = hasContent(node);
                return (
                  <div key={node.id}
                    onClick={() => clickable && handleNodeClick(node)}
                    className={`relative flex flex-col items-start md:items-center w-[260px] md:w-[280px] snap-start group shrink-0 transition-all duration-200 ${clickable ? 'cursor-pointer' : ''} ${isSelected ? 'scale-[1.03]' : ''}`}>

                    {/* Node Dot */}
                    <div className={`relative z-20 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border-4 md:mb-5 shrink-0 transition-transform duration-300 group-hover:scale-110 ${darkMode ? 'border-slate-900' : 'border-white'} ${node.status === 'completed' ? 'bg-emerald-500 shadow-[0_0_16px_rgba(16,185,129,0.3)] group-hover:shadow-[0_0_24px_rgba(16,185,129,0.5)]' :
                      node.status === 'in_progress' ? 'bg-indigo-500 shadow-[0_0_16px_rgba(99,102,241,0.4)] animate-pulse group-hover:shadow-[0_0_24px_rgba(99,102,241,0.6)]' :
                        'bg-slate-400 group-hover:bg-slate-500 shadow-sm'
                      } ${isSelected ? `ring-2 ring-offset-2 ${darkMode ? 'ring-offset-slate-900' : 'ring-offset-white'} ring-indigo-400` : ''}`}>
                      {node.status === 'completed' ? <CheckCircle2 className="w-5 h-5 text-white" /> :
                        node.status === 'in_progress' ? <CircleDashed className="w-5 h-5 text-white animate-spin-slow" /> :
                          <Circle className="w-4 h-4 text-white group-hover:text-slate-100 transition-colors" />}
                    </div>

                    {/* Content */}
                    <div className={`mt-3 md:mt-0 text-left md:text-center w-full transition-all duration-300 transform group-hover:-translate-y-1 p-4 md:p-3 rounded-2xl border ${isSelected
                      ? darkMode ? 'bg-indigo-900/40 border-indigo-500/50 shadow-md' : 'bg-indigo-50 border-indigo-200 shadow-md'
                      : darkMode ? 'bg-slate-800/70 border-slate-700 md:bg-transparent md:border-none shadow-md md:shadow-none' : 'bg-white md:bg-transparent border-slate-100 md:border-none shadow-sm md:shadow-none'
                      }`}>
                      <div className={`inline-block px-2.5 py-1 rounded text-[11px] font-bold mb-2 border tracking-wider ${isSelected
                        ? darkMode ? 'bg-indigo-800 text-indigo-300 border-indigo-600' : 'bg-indigo-100 text-indigo-600 border-indigo-200'
                        : darkMode ? 'bg-slate-700 text-slate-400 border-slate-600 group-hover:border-slate-500' : 'bg-slate-50 text-slate-400 border-slate-200 group-hover:border-slate-300'
                        }`}>
                        {node.date}
                      </div>
                      <h3 className={`text-lg font-bold mb-1 transition-colors ${node.status === 'completed' ? 'text-emerald-500 group-hover:text-emerald-400' :
                        node.status === 'in_progress' ? 'text-indigo-400 group-hover:text-indigo-300' :
                          'text-slate-500 group-hover:text-slate-400'
                        }`}>
                        {node.phase}
                      </h3>
                      <div className={`font-bold text-sm mb-2 ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{node.title}</div>
                      <p className={`text-xs leading-relaxed mb-4 md:px-2 transition-colors ${darkMode ? 'text-slate-400 group-hover:text-slate-300' : 'text-slate-500 group-hover:text-slate-600'}`}>
                        {node.description}
                      </p>

                      {/* Pain Point Tags */}
                      {node.painPoints && node.painPoints.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 md:justify-center mt-auto border-t border-slate-100 pt-3 md:border-none md:pt-0">
                          {node.painPoints.map((pp, i) => (
                            <span key={i} className={`text-[10px] px-2 py-0.5 rounded-full font-medium transition-colors ${isSelected ? 'bg-indigo-100 text-indigo-600 border border-indigo-200' : 'bg-rose-50 text-rose-500 border border-rose-200 group-hover:bg-rose-100'
                              }`}>
                              {pp}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Clickable hint */}
                      {clickable && (
                        <span className={`block w-full text-center text-[10px] mt-2 font-medium ${isSelected ? 'text-indigo-500' : 'text-slate-400 group-hover:text-slate-500'}`}>
                          {isSelected ? '▲ 收起' : '▼ 點擊查看'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Scroll Gradients */}
          <div className={`pointer-events-none absolute top-0 right-0 h-full w-24 bg-gradient-to-l ${darkMode ? 'from-slate-900/90' : 'from-white'} to-transparent z-20`} />
          <div className={`pointer-events-none absolute top-0 left-0 h-full w-12 bg-gradient-to-r ${darkMode ? 'from-slate-900/90' : 'from-white'} to-transparent z-20`} />
        </div>
      </div>

      {/* Expandable Detail Panel */}
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${selectedNode ? 'max-h-[5000px] opacity-100 mt-6' : 'max-h-0 opacity-0 mt-0'}`}>
        {selectedNode && (
          <div className={`rounded-2xl border shadow-lg p-6 md:p-8 transition-colors duration-300 ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className={`text-xs font-bold uppercase tracking-widest ${selectedNode.status === 'completed' ? 'text-emerald-600' :
                  selectedNode.status === 'in_progress' ? 'text-indigo-600' : 'text-slate-500'
                  }`}>{selectedNode.date}</span>
                <h3 className="text-xl md:text-2xl font-bold text-slate-800 mt-1">
                  {selectedNode.phase}：{selectedNode.title}
                </h3>
                <p className="text-slate-500 text-sm mt-1">{selectedNode.description}</p>
              </div>
              <button onClick={() => { setSelectedNode(null); setExpandedCard(null); }}
                className={`p-2 rounded-full transition-colors shrink-0 ${darkMode ? 'hover:bg-slate-700 text-slate-400 hover:text-slate-200' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-700'}`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Highlights (for earlier upgrades without full roadmapData) */}
            {selectedNode.highlights && selectedNode.highlights.length > 0 && (
              <div className="space-y-4 mb-6">
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  這次升級的重點
                </h4>
                {selectedNode.highlights.map((h, i) => (
                  <div key={i} className={`rounded-xl border p-5 ${darkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200'}`}>
                    <h5 className={`font-bold mb-2 ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>{h.title}</h5>
                    <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{h.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Full Pain Point Cards (for Dencun+) */}
            {selectedNode.painPoints && selectedNode.painPoints.length > 0 && (() => {
              const matchedItems = getMatchedItems(selectedNode.painPoints);
              if (matchedItems.length === 0) return null;
              return (
                <>
                  <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                    這次升級解決的痛點
                  </h4>
                  <div className="space-y-4">
                    {matchedItems.map((item) => (
                      <div key={item.id} className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${expandedCard === item.id ? 'border-indigo-400 shadow-lg ring-1 ring-indigo-100' : 'border-slate-200 shadow-sm hover:border-indigo-200 hover:shadow-md'
                        }`}>
                        <button onClick={() => setExpandedCard(expandedCard === item.id ? null : item.id)}
                          className="w-full text-left px-6 py-5 flex items-start justify-between focus:outline-none">
                          <div className="flex-1 pr-4">
                            <span className="inline-block px-2 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded mb-3">{item.topicTitle}</span>
                            <h3 className="text-lg md:text-xl font-medium text-slate-800 leading-snug">{item.question}</h3>
                          </div>
                          <div className="flex-shrink-0 mt-2 text-slate-400 bg-slate-50 p-2 rounded-full">
                            {expandedCard === item.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                          </div>
                        </button>

                        <div className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${expandedCard === item.id ? 'max-h-[1800px] pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                          <div className="border-t border-slate-100 pt-5 space-y-5">
                            {item.breakingNews && (
                              <div className="rounded-xl bg-amber-50 border border-amber-300 px-4 py-3.5">
                                <div className="flex items-center gap-2 mb-1.5">
                                  <span className="text-amber-600 font-bold text-sm">⚡ 路線圖重大轉向</span>
                                  <span className="text-xs text-amber-500">{item.breakingNews.date}</span>
                                </div>
                                <p className="text-sm text-amber-900 leading-relaxed mb-2.5">{item.breakingNews.summary}</p>
                                <div className="flex flex-wrap gap-2">
                                  {item.breakingNews.links.map((l, i) => (
                                    <a key={i} href={l.url} target="_blank" rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors border border-amber-200">
                                      {l.label} <ExternalLink className="w-3 h-3" />
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 rounded-xl p-4 border border-slate-100 mb-4">
                              <div>
                                <div className="flex items-center justify-between text-slate-500 text-sm font-medium mb-3">
                                  <div className="flex items-center gap-1.5"><AlertCircle className="w-4 h-4" /> 問題嚴重程度</div>
                                  <span className="text-slate-700 font-bold">{item.severity}/10 · {getSeverityLabel(item.severity)}</span>
                                </div>
                                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                  <div className={`h-full rounded-full transition-all ${getSeverityColor(item.severity)}`} style={{ width: `${(item.severity / 10) * 100}%` }} />
                                </div>
                              </div>
                              <div>
                                <div className="flex items-center justify-between text-slate-500 text-sm font-medium mb-3">
                                  <div className="flex items-center gap-1.5">
                                    {item.maturity === 'Mainnet' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Clock className="w-4 h-4" />}
                                    解決方案成熟度
                                  </div>
                                  <span className={`font-bold text-xs px-2 py-0.5 rounded-full ${item.maturity === 'Mainnet' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>
                                    {item.maturity === 'Mainnet' ? '✅ 主網已上線' : (maturityLabels[item.maturity] ?? item.maturity)}
                                  </span>
                                </div>
                                <div className="flex gap-1 h-2">
                                  {['Research', 'Draft', 'Spec', 'Testnet', 'Mainnet'].map((stage, idx) => {
                                    const currentIdx = ['Research', 'Draft', 'Spec', 'Testnet', 'Mainnet'].indexOf(item.maturity);
                                    const isPassed = idx <= currentIdx;
                                    let bgClass = isPassed ? (item.maturity === 'Mainnet' ? 'bg-emerald-400' : 'bg-indigo-400') : 'bg-slate-200';
                                    return <div title={maturityLabels[stage]} key={stage} className={`flex-1 rounded-full transition-all ${bgClass} ${isPassed ? 'opacity-100' : 'opacity-40'}`} />;
                                  })}
                                </div>
                              </div>
                            </div>

                            <div>
                              <div className="text-slate-500 text-sm font-medium mb-2">風險在哪</div>
                              <p className="text-slate-600 leading-relaxed text-sm bg-amber-50/80 border border-amber-100 rounded-lg p-3">{item.riskSummary}</p>
                            </div>

                            <div className="mt-5">
                              <span className="inline-block px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded mb-2">以太坊解法</span>
                              <p className="text-slate-600 leading-relaxed">{item.solution}</p>
                              {(item.termExplainers?.length ?? 0) > 0 && (
                                <div className="mt-3 space-y-1.5">
                                  <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">名詞速解</p>
                                  {item.termExplainers.map((te, i) => (
                                    <div key={i} className="flex items-start gap-2 text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                                      <span className="font-semibold text-indigo-700 whitespace-nowrap flex-shrink-0">{te.term}</span>
                                      <span className="text-slate-500 leading-relaxed">{te.explanation}</span>
                                      {te.url && <a href={te.url} target="_blank" rel="noopener noreferrer" className="ml-auto flex-shrink-0 text-indigo-500 hover:text-indigo-700"><ExternalLink className="w-3 h-3" /></a>}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 rounded-xl p-4 border border-slate-100">
                              <div>
                                <div className="flex items-center text-slate-500 text-sm mb-1 font-medium"><Code className="w-4 h-4 mr-1.5" /> 對應技術名詞</div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {item.techTerms.map((term, i) => <span key={i} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-sm rounded-md font-mono border border-indigo-100">{term}</span>)}
                                </div>
                              </div>
                              <div>
                                <div className="flex items-center text-slate-500 text-sm mb-1 font-medium"><Clock className="w-4 h-4 mr-1.5" /> 預計實現時間 (ETA)</div>
                                <div className="text-slate-800 font-medium mt-2 text-sm leading-relaxed">{item.eta}</div>
                              </div>
                            </div>

                            {(item.links?.filter(l => l.type === 'tool').length > 0) && (
                              <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">相關推薦工具</span>
                                <div className="flex flex-wrap gap-2">
                                  {item.links.filter(l => l.type === 'tool').map((link, i) => (
                                    <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm font-medium rounded-lg transition-colors border border-indigo-100 shadow-sm">
                                      <ExternalLink className="w-3.5 h-3.5" /> {link.label}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
