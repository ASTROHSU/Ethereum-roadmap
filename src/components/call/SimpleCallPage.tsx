import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, ExternalLink } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { protocolCalls, callTypeNames, type CallType } from '../../data/calls';

// ── 類別名稱中文化 ────────────────────────────────────────
const CATEGORY_ZH: Record<string, string> = {
  fork_status_and_schedule:   '升級進度與排程',
  critical_infrastructure:    '基礎設施討論',
  testing_progress:            '測試進度',
  repricing_updates:           'Gas 費調整',
  headliner_selection:         '主打 EIP 選擇',
  eip_discussion:              'EIP 討論',
  general_updates:             '綜合更新',
  security:                    '安全議題',
  research:                    '研究方向',
  client_updates:              '客戶端更新',
  network_health:              '網路健康狀態',
  devnet_updates:              '開發網路進度',
  breakout_updates:            '子工作組更新',
  miscellaneous:               '其他',
};

function categoryLabel(key: string): string {
  return CATEGORY_ZH[key] ?? key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

// ── Badge 顏色 ────────────────────────────────────────────
const CALL_BADGE: Record<CallType, string> = {
  acdc:  'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  acde:  'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300',
  acdt:  'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300',
  epbs:  'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
  bal:   'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  focil: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
  price: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300',
  tli:   'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300',
  pqts:  'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
  rpc:   'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300',
  zkevm: 'bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-700 dark:text-fuchsia-300',
  etm:   'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  awd:   'bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-300',
  pqi:   'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
};

// ── 資料型別 ──────────────────────────────────────────────
interface TldrData {
  meeting: string;
  highlights: Record<string, { timestamp: string; highlight: string }[]>;
  action_items: { timestamp: string; action: string; owner: string }[];
  decisions: { timestamp: string; decision: string }[];
  targets: { timestamp: string; target: string }[];
}

// ── 元件 ─────────────────────────────────────────────────
const SimpleCallPage = () => {
  const { '*': callPath } = useParams();
  const { resolvedTheme } = useTheme();
  const darkMode = resolvedTheme === 'dark';

  const [tldr, setTldr] = useState<TldrData | null>(null);
  const [loading, setLoading] = useState(true);

  // 找出對應的 call metadata
  const call = protocolCalls.find(c => c.path === callPath);

  // Artifact folder uses {date}_{number} format, e.g. acde/2026-03-12_232
  const artifactPath = call ? `${call.type}/${call.date}_${call.number}` : null;

  useEffect(() => {
    if (!artifactPath) return;
    setLoading(true);
    fetch(`/artifacts/${artifactPath}/tldr.json`)
      .then(r => (r.ok ? r.json() : null))
      .then(data => { setTldr(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [artifactPath]);

  const bg = darkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900';
  const cardBg = darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200';

  const formattedDate = call
    ? new Date(call.date + 'T00:00:00').toLocaleDateString('zh-TW', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : '';

  return (
    <div className={`min-h-screen ${bg}`}>
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* 返回 */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          以太坊升級地圖
        </Link>

        {/* ── 標題區 ── */}
        {call && (
          <div className={`border ${cardBg} rounded-2xl p-6 mb-6`}>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-3 ${CALL_BADGE[call.type as CallType]}`}>
                  {call.type.toUpperCase()}
                </span>
                <h1 className="text-xl font-bold tracking-tight mb-1">
                  {callTypeNames[call.type as CallType]}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  第 {call.number} 次會議
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 flex-shrink-0">
                <Calendar className="w-4 h-4" />
                {formattedDate}
              </div>
            </div>
          </div>
        )}

        {/* ── 載入中 ── */}
        {loading && (
          <div className="text-center py-12 text-slate-400">載入中…</div>
        )}

        {/* ── 無摘要 ── */}
        {!loading && !tldr && (
          <div className={`border ${cardBg} rounded-2xl p-6 text-center`}>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              這場會議尚無摘要資料。
            </p>
          </div>
        )}

        {/* ── 有摘要 ── */}
        {!loading && tldr && (
          <div className="flex flex-col gap-5">

            {/* 關鍵決議 */}
            {tldr.decisions?.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3">
                  關鍵決議
                </h2>
                <div className={`border ${cardBg} rounded-2xl divide-y divide-slate-100 dark:divide-slate-700`}>
                  {tldr.decisions.map((d, i) => (
                    <div key={i} className="px-5 py-3.5 text-sm leading-relaxed">
                      {d.decision}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 重點摘要（按類別） */}
            {Object.keys(tldr.highlights ?? {}).length > 0 && (
              <section>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3">
                  重點摘要
                </h2>
                <div className="flex flex-col gap-3">
                  {Object.entries(tldr.highlights).map(([cat, items]) => (
                    <div key={cat} className={`border ${cardBg} rounded-2xl p-5`}>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                        {categoryLabel(cat)}
                      </p>
                      <ul className="flex flex-col gap-2">
                        {items.map((item, i) => (
                          <li key={i} className="flex gap-2 text-sm leading-relaxed">
                            <span className="text-indigo-400 flex-shrink-0 mt-0.5">•</span>
                            <span>{item.highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 下一步 */}
            {((tldr.targets?.length > 0) || (tldr.action_items?.length > 0)) && (
              <section>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3">
                  下一步
                </h2>
                <div className={`border ${cardBg} rounded-2xl divide-y divide-slate-100 dark:divide-slate-700`}>
                  {tldr.targets?.map((t, i) => (
                    <div key={i} className="px-5 py-3.5 flex gap-3 text-sm leading-relaxed">
                      <span className="text-emerald-500 flex-shrink-0 font-medium">目標</span>
                      <span>{t.target}</span>
                    </div>
                  ))}
                  {tldr.action_items?.map((a, i) => (
                    <div key={i} className="px-5 py-3.5 flex gap-3 text-sm leading-relaxed">
                      <span className="text-amber-500 flex-shrink-0 font-medium">待辦</span>
                      <span>{a.action}{a.owner ? `（${a.owner}）` : ''}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>
        )}

        {/* 查看完整紀錄 */}
        {!loading && (
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">需要逐字稿、聊天記錄或影片？</p>
            <a
              href={`https://forkcast.org/calls/${callPath}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              前往 Forkcast 查看完整紀錄
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

      </div>
    </div>
  );
};

export default SimpleCallPage;
