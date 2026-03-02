import React, { useState, useEffect } from 'react';
import VisualRoadmap from './VisualRoadmap';
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
  CheckCircle2,
  BookOpen,
  X,
  Sun,
  Moon,
} from 'lucide-react';

import { officialRoadmapPhasesZh, officialRoadmapPhasesEn } from '../data/officialRoadmapPhases';
import { roadmapDataZh, roadmapDataEn } from '../data/roadmapData';
import { translations } from '../data/translations';

export default function EthereumRoadmapUX() {
  const [language, setLanguage] = useState('zh');
  const [activeTab, setActiveTab] = useState('scale');
  const [activeTopic, setActiveTopic] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const t = translations[language];
  const roadmapData = language === 'zh' ? roadmapDataZh : roadmapDataEn;
  const officialRoadmapPhases = language === 'zh' ? officialRoadmapPhasesZh : officialRoadmapPhasesEn;

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

  // 關閉 sidebar 時鎖定 body scroll
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-800'} font-sans relative overflow-hidden transition-colors duration-300`}>

      {/* ── Background Glows (Option C) ── */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {darkMode ? (
          <>
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px]" />
            <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-violet-600/15 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[120px]" />
          </>
        ) : (
          <>
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-300/20 rounded-full blur-[100px]" />
            <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-purple-300/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-blue-300/20 rounded-full blur-[120px]" />
          </>
        )}
      </div>

      {/* ── Sidebar Overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar Panel ── */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md z-50 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-white'} shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className={`flex items-center justify-between px-6 py-5 border-b ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
          <span className={`font-semibold text-lg ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>{t.roadmapFullView}</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className={`transition-colors p-1 rounded-full ${darkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className={`flex-1 overflow-y-auto px-6 py-6 space-y-8 text-sm ${darkMode ? 'text-slate-300' : ''}`}>
          {/* 技術路線圖原貌 */}
          <div>
            <span className={`font-semibold text-xs uppercase tracking-wider ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{t.officialRoadmapTitle}</span>
            <p className={`mt-1 text-xs italic ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>{t.officialRoadmapDesc}</p>
            <div className="grid grid-cols-1 gap-3 mt-3">
              {officialRoadmapPhases.map((phase) => (
                <div
                  key={phase.id}
                  className={`rounded-xl border p-3 ${phase.status === 'completed'
                    ? 'bg-emerald-50 border-emerald-200'
                    : phase.status === 'in_progress'
                      ? 'bg-indigo-50 border-indigo-200'
                      : 'bg-white border-slate-200'
                    }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      {phase.status === 'completed' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      ) : phase.status === 'in_progress' ? (
                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse flex-shrink-0 ml-0.5" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-slate-300 flex-shrink-0 ml-0.5" />
                      )}
                      <span className="font-semibold text-slate-800 text-sm">
                        {phase.name}
                        <span className="text-slate-500 font-normal ml-1 text-xs">({phase.nameZh})</span>
                      </span>
                    </div>
                    <span className="text-xs font-medium text-slate-500 flex-shrink-0">{phase.progress}%</span>
                  </div>
                  {/* 進度條 */}
                  <div className="ml-6 mb-2">
                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${phase.status === 'completed' ? 'bg-emerald-500'
                          : phase.status === 'in_progress' ? 'bg-indigo-500'
                            : 'bg-slate-300'
                          }`}
                        style={{ width: `${phase.progress}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 ml-6 mb-1.5 italic">{phase.short}</p>
                  <ul className="ml-6 space-y-0.5">
                    {phase.goals.map((g, i) => (
                      <li key={i} className="text-xs text-slate-600 leading-relaxed">{g}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <a
              href="https://ethereum.org/roadmap"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-3 text-indigo-600 hover:text-indigo-800 text-xs"
            >
              <ExternalLink className="w-3 h-3" />
              {t.sourceEthereumOrg}
            </a>
          </div>

          {/* 資料來源 */}
          <div>
            <span className="font-semibold text-slate-700 text-xs uppercase tracking-wider">{t.sourcesTitle}</span>
            <div className="mt-2 space-y-2">
              {t.dataSources.map((s, i) => (
                <div key={i} className="rounded-xl border border-slate-200 bg-white p-3">
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1 font-medium text-sm"
                  >
                    {s.label}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>


        </div>
      </aside>

      {/* ── Header ── */}
      <header className={`${darkMode ? 'bg-slate-900/80 border-slate-700' : 'bg-slate-50/80 border-slate-200'} backdrop-blur-md border-b sticky top-0 z-10 transition-colors duration-300`}>
        <div className="max-w-4xl mx-auto px-4 py-4 md:py-6 flex items-center justify-between gap-4">
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold mb-1 md:mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {t.siteTitle}
            </h1>

            <p className={`hidden md:block leading-relaxed max-w-2xl mt-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              {t.siteSubtitle}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Language toggle */}
            <button
              onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
              className={`px-3 py-2 text-sm font-bold rounded-xl border transition-all ${darkMode ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'}`}
              title="Toggle Language"
            >
              {language === 'zh' ? 'EN' : '中'}
            </button>
            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode(d => !d)}
              className={`p-2.5 rounded-xl border transition-all ${darkMode ? 'border-slate-700 bg-slate-800 text-amber-400 hover:bg-slate-700' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-100'}`}
              title={t.darkModeToggle}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {/* Ethereum Diamond progress button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex-shrink-0 flex flex-col items-center gap-1 group"
              title={t.roadmapFullView}
            >
              {/* Ethereum Diamond with water-fill progress */}
              {(() => {
                const progress = 42; // 主觀進度百分比
                const fillY = 100 - progress; // SVG 座標：0=頂部, 100=底部
                return (
                  <div className="relative w-14 h-14 md:w-16 md:h-16">
                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                      <defs>
                        <clipPath id="eth-diamond">
                          <path d="M50 5 L85 50 L50 95 L15 50 Z" />
                        </clipPath>
                        <linearGradient id="water-fill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="transparent" />
                          <stop offset={`${fillY}%`} stopColor="transparent" />
                          <stop offset={`${fillY}%`} stopColor="#818cf8" />
                          <stop offset="100%" stopColor="#6366f1" />
                        </linearGradient>
                        <linearGradient id="wave-sheen" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                          <stop offset="50%" stopColor="rgba(255,255,255,0.15)" />
                          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                        </linearGradient>
                      </defs>
                      <path d="M50 5 L85 50 L50 95 L15 50 Z" fill="none" stroke="#cbd5e1" strokeWidth="2"
                        className="group-hover:stroke-indigo-300 transition-colors" />
                      <g clipPath="url(#eth-diamond)">
                        <rect x="0" y="0" width="100" height="100" fill="url(#water-fill)" />
                        <rect x="0" y={fillY} width="100" height={100 - fillY} fill="url(#wave-sheen)" opacity="0.6" />
                        <path d={`M10 ${fillY} Q30 ${fillY - 3} 50 ${fillY} Q70 ${fillY + 3} 90 ${fillY}`}
                          fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"
                          className="animate-pulse" />
                      </g>
                      <g clipPath="url(#eth-diamond)" opacity="0.15">
                        <line x1="50" y1="5" x2="50" y2="95" stroke="white" strokeWidth="1" />
                        <line x1="15" y1="50" x2="85" y2="50" stroke="white" strokeWidth="0.8" />
                      </g>
                    </svg>
                  </div>
                );
              })()}
              <span className="text-xs font-bold text-indigo-600 tabular-nums">42%</span>
              <span className="text-[10px] text-slate-400 -mt-0.5 whitespace-nowrap">{t.roadmapProgress}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-4 py-5 md:py-8">
        <VisualRoadmap roadmapData={roadmapData} darkMode={darkMode} language={language} t={t} />
      </main>

      {/* ── Footer ── */}
      <footer className={`relative z-10 max-w-4xl mx-auto px-4 py-8 md:py-12 mt-8 text-center border-t transition-colors duration-300 ${darkMode ? 'border-slate-700 text-slate-500' : 'border-slate-200 text-slate-500'}`}>
        <p className="text-sm leading-relaxed mb-3">
          {t.footerText}
        </p>
        <a
          href="https://github.com/ASTROHSU/Ethereum-roadmap"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          {t.githubLink}
        </a>
      </footer>
    </div>
  );
}
