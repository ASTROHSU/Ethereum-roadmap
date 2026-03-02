import React, { useRef, useState, useEffect } from 'react';
import { CheckCircle2, CircleDashed, Circle, ChevronRight, ChevronLeft } from 'lucide-react';

const roadmapNodes = [
  {
    "id": "frontier",
    "phase": "Frontier",
    "date": "2015年7月",
    "status": "completed",
    "title": "創世發佈",
    "description": "以太坊主網正式發佈，當時僅限開發者使用，尚無圖形介面。",
    "painPoints": []
  },
  {
    "id": "homestead",
    "phase": "Homestead",
    "date": "2016年3月",
    "status": "completed",
    "title": "第一個穩定版本",
    "description": "移除早期的安全性免責聲明，以太坊正式宣告進入穩定可用階段。",
    "painPoints": []
  },
  {
    "id": "byzantium",
    "phase": "Byzantium",
    "date": "2017年10月",
    "status": "completed",
    "title": "ZK 技術埋伏筆",
    "description": "加入了 ZK 密碼學所需的底層運算元件；開始控制通膨。",
    "painPoints": []
  },
  {
    "id": "constantinople",
    "phase": "Constantinople",
    "date": "2019年2月",
    "status": "completed",
    "title": "效率與經濟模型調整",
    "description": "區塊獎勵從 3 ETH 減至 2 ETH、Gas 優化。",
    "painPoints": []
  },
  {
    "id": "istanbul",
    "phase": "Istanbul",
    "date": "2019年12月",
    "status": "completed",
    "title": "為 L2 鋪路",
    "description": "降低 Rollup 相關操作的 Gas 費用，大幅降低未來 L2 的運作成本。",
    "painPoints": []
  },
  {
    "id": "muir-glacier",
    "phase": "Muir Glacier",
    "date": "2020年1月",
    "status": "completed",
    "title": "難度炸彈延遲",
    "description": "再次延遲難度炸彈，讓 PoW 挖礦能維持到 The Merge。",
    "painPoints": []
  },
  {
    "id": "berlin",
    "phase": "Berlin",
    "date": "2021年4月",
    "status": "completed",
    "title": "Gas 效率調整",
    "description": "降低讀取儲存資料的操作費用，修復安全漏洞。",
    "painPoints": []
  },
  {
    "id": "london",
    "phase": "London (EIP-1559)",
    "date": "2021年8月",
    "status": "completed",
    "title": "Gas 機制改革",
    "description": "引入基礎費 + 小費，開始銷毀部分 ETH，費用可預期。",
    "painPoints": []
  },
  {
    "id": "merge",
    "phase": "The Merge",
    "date": "2022年9月",
    "status": "completed",
    "title": "共識層合併",
    "description": "將挖礦切換為質押，以太坊能耗降低 99.95%。",
    "painPoints": []
  },
  {
    "id": "shanghai",
    "phase": "Shanghai",
    "date": "2023年4月",
    "status": "completed",
    "title": "開放質押提款",
    "description": "質押者終於能提回 ETH，PoS 證明實際可行。",
    "painPoints": []
  },
  {
    "id": "dencun",
    "phase": "Dencun",
    "date": "2024年3月",
    "status": "completed",
    "title": "L2 手續費大降",
    "description": "引入 Blob 空間讓 Rollup 費用降低數十倍。",
    "painPoints": [
      "L1 手續費太貴"
    ]
  },
  {
    "id": "pectra",
    "phase": "Pectra",
    "date": "2025年5月",
    "status": "completed",
    "title": "無 ETH 也能付 Gas",
    "description": "帳戶抽象（EIP-7702）上線主網。",
    "painPoints": [
      "新手入門門檻",
      "助記詞與恢復",
      "授權風險"
    ]
  },
  {
    "id": "glamsterdam",
    "phase": "Glamsterdam",
    "date": "預計 2026 上半年",
    "status": "in_progress",
    "title": "防夾擊與 L1 降費",
    "description": "將打包與提議者分離，減少被搶跑風險。",
    "painPoints": [
      "交易被夾擊",
      "MEV 搶跑"
    ]
  },
  {
    "id": "hegota",
    "phase": "Hegotá",
    "date": "預計 2026 下半年+",
    "status": "future",
    "title": "輕量節點與無縫跨鏈",
    "description": "無縫跨鏈體驗、私有隱形地址、降低節點硬碟門檻。",
    "painPoints": [
      "節點硬體門檻",
      "L2 碎片化",
      "資產隱私"
    ]
  }
];

export default function VisualRoadmap() {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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

  // 初始滾動到比較後面的節點 (Dencun附近)
  useEffect(() => {
    if (scrollContainerRef.current) {
      // 大約滾動到 Pectra 節點的相對位置
      setTimeout(() => {
        scrollContainerRef.current.scrollTo({ left: 2400, behavior: 'smooth' });
      }, 300);
    }
  }, []);

  const scroll = (dir) => {
    if (scrollContainerRef.current) {
      const amount = window.innerWidth > 768 ? 600 : 300;
      scrollContainerRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-slate-900 rounded-3xl p-6 md:p-10 mb-8 border border-slate-800 shadow-2xl relative overflow-hidden">
      {/* Background soft glows - dark theme */}
      <div className="absolute top-[-50%] left-[-10%] w-[300px] h-[300px] bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-50%] right-[-10%] w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative z-10">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              📍 解決痛點的旅程
            </h2>
            <p className="text-slate-400 text-sm max-w-2xl">
              以太坊的升級不是單點爆破，而是持續針對使用者的摩擦點進行的長線作戰。拖曳或滾動時間軸查看完整歷史與未來。
            </p>
          </div>

          {/* 滾動按鈕 (Desktop) */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="p-2 rounded-full border border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="p-2 rounded-full border border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Timeline Scrollable Container */}
        <div className="relative">
          <div
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="flex overflow-x-auto pb-8 pt-4 snap-x snap-mandatory scrollbar-hide"
            style={{
              scrollbarWidth: 'none', /* Firefox */
              msOverflowStyle: 'none'  /* Internet Explorer 10+ */
            }}
          >
            {/* Main Connector Line (Desktop width needs to be long enough) */}
            <div className="hidden md:block absolute top-[64px] left-[5%] right-0 w-[4200px] h-1 bg-gradient-to-r from-emerald-500/50 via-indigo-500/50 to-slate-800/50 rounded-full z-0" />

            <div className="flex gap-4 md:gap-8 relative z-10 w-max px-4">
              {roadmapNodes.map((node, idx) => (
                <div key={node.id} className="relative flex flex-col items-start md:items-center w-[260px] md:w-[280px] snap-start group shrink-0">

                  {/* Node Dot with Hover Glow - Dark Theme */}
                  <div className={`relative z-20 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border-4 border-slate-900 md:mb-5 shrink-0 transition-transform duration-300 group-hover:scale-110 ${node.status === 'completed' ? 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)] group-hover:shadow-[0_0_30px_rgba(16,185,129,0.8)]' :
                      node.status === 'in_progress' ? 'bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.6)] animate-pulse group-hover:shadow-[0_0_30px_rgba(99,102,241,1)]' :
                        'bg-slate-700 group-hover:bg-slate-600 shadow-sm'
                    }`}>
                    {node.status === 'completed' ? <CheckCircle2 className="w-5 h-5 text-slate-900" /> :
                      node.status === 'in_progress' ? <CircleDashed className="w-5 h-5 text-white animate-spin-slow" /> :
                        <Circle className="w-4 h-4 text-slate-400 group-hover:text-slate-300 transition-colors" />}
                  </div>

                  {/* Content with Hover Lift - Dark Theme */}
                  <div className="mt-3 md:mt-0 text-left md:text-center w-full transition-all duration-300 transform group-hover:-translate-y-1 bg-slate-800/50 md:bg-transparent p-4 md:p-0 rounded-2xl md:rounded-none border border-slate-700 md:border-none shadow-sm md:shadow-none">
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

                    {/* Target Pain Points */}
                    {node.painPoints && node.painPoints.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 md:justify-center mt-auto border-t border-slate-700 pt-3 md:border-none md:pt-0">
                        {node.painPoints.map((pp, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 bg-rose-500/10 text-rose-300 border border-rose-500/20 rounded-full transition-colors group-hover:bg-rose-500/20 group-hover:border-rose-500/30 font-medium">
                            {pp}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll hints (Gradients) */}
          <div className="pointer-events-none absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-slate-900/90 to-transparent z-20" />
          <div className="pointer-events-none absolute top-0 left-0 h-full w-12 bg-gradient-to-r from-slate-900/90 to-transparent z-20" />
        </div>
      </div>
    </div>
  );
}
