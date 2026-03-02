import React from 'react';
import { CheckCircle2, CircleDashed, Circle, ArrowRight } from 'lucide-react';

const roadmapNodes = [
  {
    id: 'dencun',
    phase: 'Dencun 升級',
    date: '2024年3月',
    status: 'completed',
    title: 'L2 手續費大降',
    description: '引入 Blob 空間，讓 Rollup 費用降低數十倍，解決跨鏈前的昂貴手續費痛點。',
    painPoints: ['L1 手續費太貴']
  },
  {
    id: 'pectra',
    phase: 'Pectra 升級',
    date: '2025年5月',
    status: 'completed',
    title: '無 ETH 也能付 Gas',
    description: 'EIP-7702 上線，帳戶抽象成真，解決新手入門與私鑰綁定的恐懼。',
    painPoints: ['新手入門門檻', '助記詞與恢復', '授權風險']
  },
  {
    id: 'glamsterdam',
    phase: 'Glamsterdam',
    date: '預計 2026 上半年',
    status: 'in_progress',
    title: '防夾擊與 L1 降費',
    description: '將打包與提議者分離，減少交易被搶跑的風險；進一步優化區塊容量。',
    painPoints: ['交易被夾擊', 'MEV 搶跑']
  },
  {
    id: 'hegota',
    phase: 'Hegotá 及未來',
    date: '預計 2026 下半年+',
    status: 'future',
    title: '輕量節點與無縫跨鏈',
    description: '手機也能跑節點驗證；跨鏈地址統一、隱私保護機制落地。',
    painPoints: ['節點硬體門檻', 'L2 碎片化', '資產隱私']
  }
];

export default function VisualRoadmap() {
  return (
    <div className="bg-slate-900 rounded-3xl p-6 md:p-10 mb-8 border border-slate-800 shadow-2xl relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-50%] left-[-10%] w-[300px] h-[300px] bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-50%] right-[-10%] w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative z-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            📍 解決痛點的旅程
          </h2>
          <p className="text-slate-400 text-sm">
            以太坊的升級不是單點爆破，而是持續針對使用者的摩擦點進行的長線作戰。目前我們走到這：
          </p>
        </div>

        {/* Timeline Map */}
        <div className="relative">
          {/* Main Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-[45px] left-[5%] right-[5%] h-1 bg-gradient-to-r from-emerald-500/50 via-indigo-500 to-slate-800 rounded-full" />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4 relative">
            {roadmapNodes.map((node, idx) => (
              <div key={node.id} className="relative flex md:flex-col items-start md:items-center gap-4 md:gap-0">
                {/* Node Dot */}
                <div className={`relative z-10 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border-4 border-slate-900 md:mb-5 shrink-0 ${
                  node.status === 'completed' ? 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]' :
                  node.status === 'in_progress' ? 'bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.6)] animate-pulse' :
                  'bg-slate-700'
                }`}>
                  {node.status === 'completed' ? <CheckCircle2 className="w-5 h-5 text-slate-900" /> :
                   node.status === 'in_progress' ? <CircleDashed className="w-5 h-5 text-white animate-spin-slow" /> :
                   <Circle className="w-4 h-4 text-slate-400" />}
                </div>

                {/* Mobile Connector Line */}
                {idx !== roadmapNodes.length - 1 && (
                  <div className="md:hidden absolute left-5 top-10 bottom-[-24px] w-0.5 bg-gradient-to-b from-emerald-500/50 to-slate-700" />
                )}

                {/* Content */}
                <div className="md:text-center mt-1 md:mt-0 pb-6 md:pb-0 w-full">
                  <div className="inline-block px-2.5 py-1 rounded bg-slate-800/80 text-xs font-medium text-slate-300 mb-2 border border-slate-700/50">
                    {node.date}
                  </div>
                  <h3 className={`text-lg font-bold mb-1 ${
                    node.status === 'completed' ? 'text-emerald-400' :
                    node.status === 'in_progress' ? 'text-indigo-400' :
                    'text-slate-400'
                  }`}>
                    {node.phase}
                  </h3>
                  <div className="text-white font-medium text-sm mb-2">{node.title}</div>
                  <p className="text-slate-400 text-xs leading-relaxed mb-3 md:px-2">
                    {node.description}
                  </p>
                  
                  {/* Target Pain Points */}
                  <div className="flex flex-wrap gap-1.5 md:justify-center">
                    {node.painPoints.map((pp, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 bg-rose-500/10 text-rose-300 border border-rose-500/20 rounded-full">
                        {pp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
