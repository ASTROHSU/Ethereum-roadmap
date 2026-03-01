import React, { useState } from 'react';
import { Wallet, ShieldAlert, Zap, Server, ChevronDown, ChevronUp, Clock, Code, BookOpen } from 'lucide-react';

// 模擬編輯團隊維護的 JSON 資料庫
const roadmapData = [
  {
    id: 'scale',
    title: '費用與速度',
    icon: <Zap className="w-6 h-6" />,
    problems: [
      {
        id: 'p1',
        question: 'L1 手續費還是太貴了，但我又不想頻繁跨鏈到 L2，覺得好麻煩？',
        solution: '以太坊將再次提升 L1 本身的處理能力，而不僅僅是把責任推給 L2。未來 L1 的 Gas Limit 會提高，並引入更有效率的虛擬機機制。',
        techTerms: ['L1 Gas Limit 提升', 'EOF (EVM Object Format)'],
        eta: '2025 - 2026 (The Splurge / Surge)',
        articleLink: '#'
      }
    ]
  },
  {
    id: 'ux',
    title: '帳號與操作',
    icon: <Wallet className="w-6 h-6" />,
    problems: [
      {
        id: 'p2',
        question: '記助記詞太反人類了！弄丟私鑰資產就歸零，不能像 Web2 一樣重設密碼嗎？',
        solution: '可以的。未來的以太坊帳戶將全面「智慧化」，支援社群恢復、生物辨識（如 FaceID）登入，讓你不需要再抄寫 12 個單字。',
        techTerms: ['帳戶抽象 (Account Abstraction, EIP-4337 / EIP-7702)'],
        eta: '2025 陸續普及',
        articleLink: '#'
      }
    ]
  },
  {
    id: 'privacy',
    title: '隱私與資安',
    icon: <ShieldAlert className="w-6 h-6" />,
    problems: [
      {
        id: 'p3',
        question: '只要有人知道我的錢包地址，我的餘額和買過什麼幣就全被看光？',
        solution: '未來將內建更強大的密碼學工具。當別人轉帳給你時，可以自動生成「隱形地址」，資金依然是你的，但外界無法將這筆錢與你的主帳號連在一起。',
        techTerms: ['隱形地址 (Stealth Addresses)', 'ZK-SNARKs 原生支援'],
        eta: '2026+ (The Splurge)',
        articleLink: '#'
      },
      {
        id: 'p4',
        question: '在 DEX 買幣，常常因為滑點或被 MEV 機器人「夾擊」而買貴了？',
        solution: '以太坊將在底層改變交易打包的規則，把「負責打包的人」和「負責提議的人」分開，並加密等待中的交易，讓機器人無法偷看你的交易來作惡。',
        techTerms: ['PBS (提議者與建構者分離)', '加密記憶體池 (Encrypted Mempool)'],
        eta: '2026 - 2027 (The Scourge)',
        articleLink: '#'
      }
    ]
  },
  {
    id: 'node',
    title: '節點與去中心化',
    icon: <Server className="w-6 h-6" />,
    problems: [
      {
        id: 'p5',
        question: '我想跑節點支持以太坊，但聽說需要超大硬碟和高等級電腦？',
        solution: '即將大幅瘦身！未來的技術升級會讓節點「無狀態化」，你甚至可以只用手機或智慧手錶，就能驗證以太坊區塊鏈，徹底打破硬體門檻。',
        techTerms: ['Verkle Trees', '無狀態客戶端 (Stateless Clients)'],
        eta: '2027 - 2028 (The Verge)',
        articleLink: '#'
      }
    ]
  }
];

export default function EthereumRoadmapUX() {
  const [activeTab, setActiveTab] = useState(roadmapData[0].id);
  const [expandedCard, setExpandedCard] = useState(null);

  const toggleCard = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-2 text-indigo-600 mb-2">
            <BookOpen className="w-5 h-5" />
            <span className="font-semibold tracking-wider text-sm">區塊勢・互動工具</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            以太坊升級：讀者痛點地圖
          </h1>
          <p className="text-slate-600 leading-relaxed max-w-2xl">
            別管那些艱澀的技術名詞了！選擇你目前在使用區塊鏈時遇到的困擾，
            我們幫你對應以太坊未來的升級藍圖（Strawmap），看看你的問題何時能被解決。
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Category Tabs */}
        <div className="flex overflow-x-auto space-x-2 pb-4 mb-6 scrollbar-hide">
          {roadmapData.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
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

        {/* Content Area */}
        <div className="space-y-4">
          {roadmapData
            .find((c) => c.id === activeTab)
            ?.problems.map((problem) => (
              <div
                key={problem.id}
                className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                  expandedCard === problem.id
                    ? 'border-indigo-400 shadow-lg ring-1 ring-indigo-100'
                    : 'border-slate-200 shadow-sm hover:border-indigo-200 hover:shadow-md'
                }`}
              >
                {/* Question (Clickable Header) */}
                <button
                  onClick={() => toggleCard(problem.id)}
                  className="w-full text-left px-6 py-5 flex items-start justify-between focus:outline-none"
                >
                  <div className="flex-1 pr-4">
                    <span className="inline-block px-2 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded mb-3">
                      你的痛點
                    </span>
                    <h3 className="text-lg md:text-xl font-medium text-slate-800 leading-snug">
                      {problem.question}
                    </h3>
                  </div>
                  <div className="flex-shrink-0 mt-2 text-slate-400 bg-slate-50 p-2 rounded-full">
                    {expandedCard === problem.id ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </button>

                {/* Solution (Expandable Content) */}
                <div
                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                    expandedCard === problem.id ? 'max-h-[500px] pb-6 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="border-t border-slate-100 pt-5">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="inline-block px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">
                        以太坊解法
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed mb-6">
                      {problem.solution}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <div>
                        <div className="flex items-center text-slate-500 text-sm mb-1 font-medium">
                          <Code className="w-4 h-4 mr-1.5" />
                          對應技術名詞
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {problem.techTerms.map((term, i) => (
                            <span key={i} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-sm rounded-md font-mono border border-indigo-100">
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
                        <div className="text-slate-800 font-medium mt-2">
                          {problem.eta}
                        </div>
                      </div>
                    </div>
                    
                    {/* Read More Button (Placeholder for Blocktrend articles) */}
                    <div className="mt-5 pt-4 border-t border-slate-100">
                      <a href={problem.articleLink} className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center transition-colors">
                        閱讀《區塊勢》深入解析文章 
                        <span className="ml-1 text-lg leading-none">→</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </main>
    </div>
  );
}
