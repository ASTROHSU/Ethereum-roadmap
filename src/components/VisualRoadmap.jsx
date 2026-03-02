import React, { useRef, useState, useEffect } from 'react';
import {
  CheckCircle2, CircleDashed, Circle, ChevronRight, ChevronLeft,
  ChevronDown, ChevronUp, X, ExternalLink, AlertCircle, Clock, Code
} from 'lucide-react';

const roadmapNodes = [
  { id: "frontier", phase: "Frontier", date: "2015年7月", status: "completed", title: "創世發佈", description: "以太坊主網正式發佈，當時僅限開發者使用，尚無圖形介面。", painPoints: [] },
  { id: "homestead", phase: "Homestead", date: "2016年3月", status: "completed", title: "第一個穩定版本", description: "移除早期的安全性免責聲明，以太坊正式宣告進入穩定可用階段。", painPoints: [] },
  { id: "byzantium", phase: "Byzantium", date: "2017年10月", status: "completed", title: "ZK 技術埋伏筆", description: "加入了 ZK 密碼學所需的底層運算元件；開始控制通膨。", painPoints: [] },
  { id: "constantinople", phase: "Constantinople", date: "2019年2月", status: "completed", title: "效率與經濟模型調整", description: "區塊獎勵從 3 ETH 減至 2 ETH、Gas 優化。", painPoints: [] },
  { id: "istanbul", phase: "Istanbul", date: "2019年12月", status: "completed", title: "為 L2 鋪路", description: "降低 Rollup 相關操作的 Gas 費用，大幅降低未來 L2 的運作成本。", painPoints: [] },
  { id: "muir-glacier", phase: "Muir Glacier", date: "2020年1月", status: "completed", title: "難度炸彈延遲", description: "再次延遲難度炸彈，讓 PoW 挖礦能維持到 The Merge。", painPoints: [] },
  { id: "berlin", phase: "Berlin", date: "2021年4月", status: "completed", title: "Gas 效率調整", description: "降低讀取儲存資料的操作費用，修復安全漏洞。", painPoints: [] },
  { id: "london", phase: "London (EIP-1559)", date: "2021年8月", status: "completed", title: "Gas 機制改革", description: "引入基礎費 + 小費，開始銷毀部分 ETH，費用可預期。", painPoints: [] },
  { id: "merge", phase: "The Merge", date: "2022年9月", status: "completed", title: "共識層合併", description: "將挖礦切換為質押，以太坊能耗降低 99.95%。", painPoints: [] },
  { id: "shanghai", phase: "Shanghai", date: "2023年4月", status: "completed", title: "開放質押提款", description: "質押者終於能提回 ETH，PoS 證明實際可行。", painPoints: [] },
  { id: "dencun", phase: "Dencun", date: "2024年3月", status: "completed", title: "L2 手續費大降", description: "引入 Blob 空間讓 Rollup 費用降低數十倍。", painPoints: ["L1 手續費與吞吐", "L2 碎片化與跨鏈麻煩"] },
  { id: "pectra", phase: "Pectra", date: "2025年5月", status: "completed", title: "無 ETH 也能付 Gas", description: "帳戶抽象（EIP-7702）上線主網。", painPoints: ["新手入門門檻", "助記詞與帳戶恢復", "智慧合約授權風險"] },
  { id: "glamsterdam", phase: "Glamsterdam", date: "預計 2026 上半年", status: "in_progress", title: "防夾擊與 L1 降費", description: "將打包與提議者分離，減少被搶跑風險。", painPoints: ["交易隱私 / MEV"] },
  { id: "hegota", phase: "Hegotá", date: "預計 2026 下半年+", status: "future", title: "輕量節點與無縫跨鏈", description: "無縫跨鏈體驗、私有隱形地址、降低節點硬碟門檻。", painPoints: ["節點硬體門檻", "質押集中化", "資產持有隱私"] }
];

const maturityLabels = {
  Research: '研究階段', Draft: '草案', Spec: '規格', Testnet: '測試網', Mainnet: '主網已上線',
};
const getSeverityLabel = (n) => { if (n <= 3) return '低'; if (n <= 6) return '中'; return '高'; };
const getSeverityColor = (n) => { if (n <= 3) return 'bg-emerald-400'; if (n <= 6) return 'bg-amber-400'; return 'bg-rose-500'; };

export default function VisualRoadmap({ roadmapData = [] }) {
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

  return (
    <div>
      <div className="bg-slate-900 rounded-3xl p-6 md:p-10 mb-0 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-[-50%] left-[-10%] w-[300px] h-[300px] bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[-50%] right-[-10%] w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                📍 解決痛點的旅程
              </h2>
              <p className="text-slate-400 text-sm max-w-2xl">
                以太坊的升級不是單點爆破，而是持續針對使用者的摩擦點進行的長線作戰。點擊有標籤的節點，查看它解決了哪些痛點。
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <button onClick={() => scroll('left')} disabled={!canScrollLeft}
                className="p-2 rounded-full border border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={() => scroll('right')} disabled={!canScrollRight}
                className="p-2 rounded-full border border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="relative">
            <div ref={scrollContainerRef} onScroll={checkScroll}
              className="flex overflow-x-auto pb-8 pt-4 snap-x snap-mandatory scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <div className="hidden md:block absolute top-[64px] left-[5%] right-0 w-[4200px] h-1 bg-gradient-to-r from-emerald-500/50 via-indigo-500/50 to-slate-800/50 rounded-full z-0" />

              <div className="flex gap-4 md:gap-8 relative z-10 w-max px-4">
                {roadmapNodes.map((node) => {
                  const isSelected = selectedNode?.id === node.id;
                  const hasPainPoints = node.painPoints && node.painPoints.length > 0;
                  return (
                    <div key={node.id}
                      onClick={() => hasPainPoints && handleNodeClick(node)}
                      className={`relative flex flex-col items-start md:items-center w-[260px] md:w-[280px] snap-start group shrink-0 transition-all duration-200 ${hasPainPoints ? 'cursor-pointer' : ''} ${isSelected ? 'scale-[1.03]' : ''}`}>

                      <div className={`relative z-20 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border-4 border-slate-900 md:mb-5 shrink-0 transition-transform duration-300 group-hover:scale-110 ${node.status === 'completed' ? 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)] group-hover:shadow-[0_0_30px_rgba(16,185,129,0.8)]' :
                          node.status === 'in_progress' ? 'bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.6)] animate-pulse group-hover:shadow-[0_0_30px_rgba(99,102,241,1)]' :
                            'bg-slate-700 group-hover:bg-slate-600 shadow-sm'
                        } ${isSelected ? 'ring-2 ring-offset-2 ring-offset-slate-900 ring-indigo-400' : ''}`}>
                        {node.status === 'completed' ? <CheckCircle2 className="w-5 h-5 text-slate-900" /> :
                          node.status === 'in_progress' ? <CircleDashed className="w-5 h-5 text-white animate-spin-slow" /> :
                            <Circle className="w-4 h-4 text-slate-400 group-hover:text-slate-300 transition-colors" />}
                      </div>

                      <div className={`mt-3 md:mt-0 text-left md:text-center w-full transition-all duration-300 transform group-hover:-translate-y-1 p-4 md:p-3 rounded-2xl border ${isSelected ? 'bg-slate-800 border-indigo-500/50 shadow-lg' : 'bg-slate-800/50 md:bg-transparent border-slate-700 md:border-none shadow-sm md:shadow-none'
                        }`}>
                        <div className="inline-block px-2.5 py-1 rounded bg-slate-800/80 text-[11px] font-bold text-slate-400 mb-2 border border-slate-700/50 group-hover:border-slate-600 transition-colors tracking-wider">
                          {node.date}
                        </div>
                        <h3 className={`text-lg font-bold mb-1 transition-colors ${node.status === 'completed' ? 'text-emerald-400 group-hover:text-emerald-300' :
                            node.status === 'in_progress' ? 'text-indigo-400 group-hover:text-indigo-300' :
                              'text-slate-400 group-hover:text-slate-300'
                          }`}>
                          {node.phase}
                        </h3>
                        <div className="text-white font-bold text-sm mb-2">{node.title}</div>
                        <p className="text-slate-400 text-xs leading-relaxed mb-4 md:px-2 group-hover:text-slate-300 transition-colors">
                          {node.description}
                        </p>

                        {hasPainPoints && (
                          <div className="flex flex-wrap gap-1.5 md:justify-center mt-auto border-t border-slate-700 pt-3 md:border-none md:pt-0">
                            {node.painPoints.map((pp, i) => (
                              <span key={i} className={`text-[10px] px-2 py-0.5 rounded-full font-medium transition-colors ${isSelected ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-rose-500/10 text-rose-300 border border-rose-500/20 group-hover:bg-rose-500/20 group-hover:border-rose-500/30'
                                }`}>
                                {pp}
                              </span>
                            ))}
                            <span className={`w-full text-center text-[10px] mt-1 font-medium ${isSelected ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-400'}`}>
                              {isSelected ? '▲ 收起詳情' : '▼ 點擊查看解法'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pointer-events-none absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-slate-900/90 to-transparent z-20" />
            <div className="pointer-events-none absolute top-0 left-0 h-full w-12 bg-gradient-to-r from-slate-900/90 to-transparent z-20" />
          </div>
        </div>
      </div>

      {/* Expandable Pain Point Panel */}
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${selectedNode ? 'max-h-[5000px] opacity-100 mt-6' : 'max-h-0 opacity-0 mt-0'}`}>
        {selectedNode && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 md:p-8">
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
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>

            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              這次升級解決的痛點
            </h4>

            <div className="space-y-4">
              {getMatchedItems(selectedNode.painPoints).map((item) => (
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
          </div>
        )}
      </div>
    </div>
  );
}
