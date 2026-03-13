import { useState } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import ThemeToggle from './ui/ThemeToggle';
import { CheckCircle2, X, ExternalLink } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

// Our consumer-focused data and components
import ConsumerUpgradeCarousel from './ConsumerUpgradeCarousel';
import ConsumerEIPSection from './ConsumerEIPSection';
import RecentProtocolCalls from './RecentProtocolCalls';
import { officialRoadmapPhasesZh, officialRoadmapPhasesEn } from '../data/officialRoadmapPhases';
import { translations } from '../data/translations';
import { syncInfo } from '../data/syncInfo';

const HomePage = () => {
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { resolvedTheme } = useTheme();

  const darkMode = resolvedTheme === 'dark';
  const t = translations[language];
  const officialRoadmapPhases = language === 'zh' ? officialRoadmapPhasesZh : officialRoadmapPhasesEn;

  const { trackLinkClick } = useAnalytics();
  const handleExternalLinkClick = (_linkType: string, _url: string) => { trackLinkClick(_linkType, _url); };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 relative overflow-hidden transition-colors duration-300">

      {/* ── Sidebar Overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar Panel ── */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md z-50 ${darkMode ? "bg-slate-900 text-slate-100" : "bg-white"} shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div
          className={`flex items-center justify-between px-6 py-5 border-b ${darkMode ? "border-slate-700" : "border-slate-200"}`}
        >
          <span
            className={`font-semibold text-lg ${darkMode ? "text-slate-100" : "text-slate-800"}`}
          >
            {t.roadmapFullView}
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className={`transition-colors p-1 rounded-full ${darkMode ? "text-slate-400 hover:text-slate-200 hover:bg-slate-700" : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div
          className={`flex-1 overflow-y-auto px-6 py-6 space-y-8 text-sm ${darkMode ? "text-slate-300" : ""}`}
        >
          {/* 技術路線圖原貌 */}
          <div>
            <span
              className={`font-semibold text-xs uppercase tracking-wider ${darkMode ? "text-slate-300" : "text-slate-700"}`}
            >
              {t.officialRoadmapTitle}
            </span>
            <p
              className={`mt-1 text-xs italic ${darkMode ? "text-slate-400" : "text-slate-400"}`}
            >
              {t.officialRoadmapDesc}
            </p>
            <div className="grid grid-cols-1 gap-3 mt-3">
              {officialRoadmapPhases.map((phase) => (
                <div
                  key={phase.id}
                  className={`rounded-xl border p-3 ${phase.status === "completed"
                    ? "bg-emerald-50 border-emerald-200"
                    : phase.status === "in_progress"
                      ? "bg-indigo-50 border-indigo-200"
                      : "bg-white border-slate-200"
                    }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      {phase.status === "completed" ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      ) : phase.status === "in_progress" ? (
                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse flex-shrink-0 ml-0.5" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-slate-300 flex-shrink-0 ml-0.5" />
                      )}
                      <span className="font-semibold text-slate-800 text-sm">
                        {phase.name}
                        <span className="text-slate-500 font-normal ml-1 text-xs">
                          ({phase.nameZh})
                        </span>
                      </span>
                    </div>
                    <span className="text-xs font-medium text-slate-500 flex-shrink-0">
                      {phase.progress}%
                    </span>
                  </div>
                  {/* 進度條 */}
                  <div className="ml-6 mb-2">
                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${phase.status === "completed"
                          ? "bg-emerald-500"
                          : phase.status === "in_progress"
                            ? "bg-indigo-500"
                            : "bg-slate-300"
                          }`}
                        style={{ width: `${phase.progress}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 ml-6 mb-1.5 italic">
                    {phase.short}
                  </p>
                  <ul className="ml-6 space-y-0.5">
                    {phase.goals.map((g, i) => (
                      <li
                        key={i}
                        className="text-xs text-slate-600 leading-relaxed"
                      >
                        {g}
                      </li>
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
            <span className="font-semibold text-slate-700 text-xs uppercase tracking-wider">
              {t.sourcesTitle}
            </span>
            <div className="mt-2 space-y-2">
              {t.dataSources.map((s, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-200 bg-white p-3 text-slate-800"
                >
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1 font-medium text-sm"
                  >
                    {s.label}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      <div className="max-w-5xl mx-auto px-6 py-6 border-b border-slate-200 dark:border-slate-800 mb-8">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <div className="min-w-0 text-left">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              {t.siteTitle}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed mt-0.5">
              {t.siteSubtitle}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              {language === 'zh'
                ? `資料更新至：${new Date(syncInfo.lastSyncedAt).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })}`
                : `Content as of: ${new Date(syncInfo.lastSyncedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}`
              }
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Language toggle */}
            <button
              onClick={() => setLanguage(language === "zh" ? "en" : "zh")}
              className={`px-3 py-2 text-sm font-bold rounded-xl border transition-all ${darkMode ? "border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"}`}
              title="Toggle Language"
            >
              {language === "zh" ? "EN" : "中"}
            </button>
            <ThemeToggle />

            {/* Ethereum Diamond progress button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex-shrink-0 flex flex-col items-center gap-1 group bg-transparent border-0 cursor-pointer outline-none ml-2"
              title={t.roadmapFullView}
            >
              {/* Ethereum Diamond with water-fill progress */}
              {(() => {
                const progress = 42; // 主觀進度百分比
                const fillY = 100 - progress; // SVG 座標：0=頂部, 100=底部
                return (
                  <div className="relative w-12 h-12 md:w-14 md:h-14 hover:scale-105 transition-transform">
                    <svg
                      viewBox="0 0 100 100"
                      className="w-full h-full drop-shadow-md"
                    >
                      <defs>
                        <clipPath id="eth-diamond">
                          <path d="M50 5 L85 50 L50 95 L15 50 Z" />
                        </clipPath>
                        <linearGradient
                          id="water-fill"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop offset="0%" stopColor="transparent" />
                          <stop offset={`${fillY}%`} stopColor="transparent" />
                          <stop offset={`${fillY}%`} stopColor="#818cf8" />
                          <stop offset="100%" stopColor="#6366f1" />
                        </linearGradient>
                        <linearGradient
                          id="wave-sheen"
                          x1="0"
                          y1="0"
                          x2="1"
                          y2="0"
                        >
                          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                          <stop
                            offset="50%"
                            stopColor="rgba(255,255,255,0.15)"
                          />
                          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M50 5 L85 50 L50 95 L15 50 Z"
                        fill="none"
                        stroke={darkMode ? "#475569" : "#cbd5e1"}
                        strokeWidth="2"
                        className="group-hover:stroke-indigo-400 transition-colors"
                      />
                      <g clipPath="url(#eth-diamond)">
                        <rect
                          x="0"
                          y="0"
                          width="100"
                          height="100"
                          fill="url(#water-fill)"
                        />
                        <rect
                          x="0"
                          y={fillY}
                          width="100"
                          height={100 - fillY}
                          fill="url(#wave-sheen)"
                          opacity="0.6"
                        />
                        <path
                          d={`M10 ${fillY} Q30 ${fillY - 3} 50 ${fillY} Q70 ${fillY + 3} 90 ${fillY}`}
                          fill="none"
                          stroke="rgba(255,255,255,0.4)"
                          strokeWidth="1.5"
                          className="animate-pulse"
                        />
                      </g>
                      <g clipPath="url(#eth-diamond)" opacity="0.15">
                        <line
                          x1="50"
                          y1="5"
                          x2="50"
                          y2="95"
                          stroke="white"
                          strokeWidth="1"
                        />
                        <line
                          x1="15"
                          y1="50"
                          x2="85"
                          y2="50"
                          stroke="white"
                          strokeWidth="0.8"
                        />
                      </g>
                    </svg>
                  </div>
                );
              })()}
              <span className="text-[10px] uppercase font-bold text-indigo-500 tabular-nums -mt-2 bg-indigo-50 dark:bg-indigo-900/40 rounded-full px-2">
                42%
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mb-12 px-6">

        {/* Consumer-focused Upgrade Carousel with Pain Points + History */}
        <ConsumerUpgradeCarousel language={language} darkMode={darkMode} />

        {/* Consumer-friendly Recently Updated EIPs */}
        <ConsumerEIPSection language={language} darkMode={darkMode} />

        {/* Recent Protocol Calls */}
        <RecentProtocolCalls language={language} darkMode={darkMode} />

        {/* Footer */}
        <div className="mt-20 border-t border-slate-200 dark:border-slate-800 pt-10 pb-8 text-center text-sm">

          {/* Forkcast attribution */}
          <div className={`mb-8 pb-8 border-b ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-3 uppercase tracking-widest font-semibold">
              {language === 'zh' ? '本站架構參考並修改自' : 'Built on top of'}
            </p>
            <a
              href="https://forkcast.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 group"
            >
              <img
                src="/forkcast-logo.svg"
                alt="Forkcast"
                className="h-8 w-auto opacity-70 group-hover:opacity-100 transition-opacity dark:invert"
              />
              <span className="text-base font-semibold text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                forkcast.org
              </span>
            </a>
          </div>

          {/* EF Protocol Support */}
          <div className="mb-6">
            <div className="w-14 h-14 mx-auto mb-3 flex items-center justify-center">
              <img
                src="/blobby-gradient-red.svg"
                alt="Ethereum Foundation Protocol Support team logo"
                className="w-14 h-14 hover:invert dark:invert dark:hover:invert-0 transition-all duration-500"
              />
            </div>
            <p className="text-xs italic text-slate-400 dark:text-slate-500">An experiment by</p>
            <p className="text-sm font-light text-slate-600 dark:text-slate-400">EF Protocol Support</p>
          </div>

          {/* Social links */}
          <div className="flex items-center justify-center gap-5 mt-4">
            <a
              href="https://ps.ethereum.foundation"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleExternalLinkClick('team_website', 'https://ps.ethereum.foundation')}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              aria-label="EF Protocol Support website"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.6 9h16.8M3.6 15h16.8" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3a15.3 15.3 0 014 9 15.3 15.3 0 01-4 9 15.3 15.3 0 01-4-9 15.3 15.3 0 014-9z" />
              </svg>
            </a>
            <a
              href="https://github.com/ethereum/forkcast"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleExternalLinkClick('source_code', 'https://github.com/ethereum/forkcast')}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              aria-label="View source code on GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <a
              href="https://x.com/EFProtocol"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleExternalLinkClick('twitter', 'https://x.com/EFProtocol')}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              aria-label="EF Protocol Support on X"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;